import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import store from "src/store";

import config from "../config/index";
import apiService from "./apiService";
import authService from "./authService";
import * as authSlice from "src/slices/auth"
import {removeAllPositions, unselectPosition} from "src/slices/stocks"
import { removeAllAccounts, unselectAccount } from "src/slices/banking";

const errorType = "authentication"

const isNormalWealthRequest = (request: AxiosRequestConfig) => {
    if (request.baseURL !== config.host && !request.url?.startsWith(config.host)) {
        return false;
    }
    if (request.url?.includes("auth/") || request.url?.startsWith(config.host + "auth")) {
        return false;
    }
    return true;
};

function addJwtHeader(request: AxiosRequestConfig): AxiosRequestConfig {
    const accessToken = authService.getAccessToken();
    if (!accessToken) {
        return request;
    }
    if (!isNormalWealthRequest(request)) {
        return request;
    }
    const Authorization = `Bearer ${accessToken}`;
    request.headers = {
        Authorization,
        ...(request.headers || {}),
    };
    return request;
}

async function refreshJwt(error: AxiosError): Promise<AxiosResponse> {
    const refreshToken = authService.getRefreshToken();
    if (!refreshToken) {
        return Promise.reject(error);
    }
    const originalRequest = error.config;
    if (!isNormalWealthRequest(originalRequest)) {
        return Promise.reject(error);
    }
    // @ts-ignore
    if (
        error.response?.data.errorType === errorType &&
        // @ts-ignore
        !originalRequest["_retry"]
    ) {
        // @ts-ignore
        originalRequest["_retry"] = true;
        const refreshResponse = await authService.refreshToken();
        if (
            error.response?.data.errorType === errorType
        ) {
            store.dispatch(authSlice.logout());
            store.dispatch(removeAllPositions());
            store.dispatch(unselectAccount());
            store.dispatch(unselectPosition());
            store.dispatch(removeAllAccounts());
            return Promise.reject(error)
        }
        else if (refreshResponse.status !== 200) {
            // TODO Fix logout?
            return Promise.reject(error);
        }
        delete originalRequest.headers?.Authorization;
        addJwtHeader(originalRequest);
        return axios.request(originalRequest);
    }
    return Promise.reject(error);
}

let headerInterceptor: number | null = null;
let refreshInterceptor: number | null = null;

export function addJwtHeaderInterceptor() {
    headerInterceptor = apiService.addRequestInterceptor(addJwtHeader);
}

export function addRefreshJwtInterceptor() {
    refreshInterceptor = apiService.addResponseInterceptor((response) => response, refreshJwt);
}

export function removeJwtHeaderInterceptor() {
    if (headerInterceptor) {
        apiService.removeRequestInterceptor(headerInterceptor);
    }
}

export function removeRefreshJwtInterceptor() {
    if (refreshInterceptor) {
        apiService.removeResponseInterceptor(refreshInterceptor);
    }
}
