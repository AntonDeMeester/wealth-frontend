import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import applyCaseMiddleware from "axios-case-converter";

import config from "../config/index";

interface Headers {
    [key: string]: string;
}

interface QueryParams {
    [key: string]: string | undefined;
}

const baseUrl: string = config.host;
const axiosInstance = applyCaseMiddleware(axios.create({ baseURL: baseUrl }));

class ApiService {
    public async get<ResponseType>(
        endpoint: string,
        headers?: Headers,
        queryParams?: QueryParams
    ): Promise<AxiosResponse<ResponseType>> {
        return axiosInstance.get<ResponseType>(endpoint, {
            headers: headers,
            params: queryParams,
        });
    }

    public async post<ResponseType>(
        endpoint: string,
        data: any = {},
        headers: Headers = {}
    ): Promise<AxiosResponse<ResponseType>> {
        if (!headers["Content-Type"]) {
            headers = { ...headers, "Content-Type": "application/json" };
        }
        return axiosInstance.post<ResponseType>(endpoint, data, {
            headers: headers,
        });
    }

    public async patch<ResponseType>(
        endpoint: string,
        data: any = {},
        headers: Headers = {}
    ): Promise<AxiosResponse<ResponseType>> {
        if (!headers["Content-Type"]) {
            headers = { ...headers, "Content-Type": "application/json" };
        }
        return axiosInstance.patch<ResponseType>(endpoint, data, {
            headers: headers,
        });
    }

    public async delete<ResponseType>(
        endpoint: string,
        data: any = {},
        headers: Headers = {}
    ): Promise<AxiosResponse<ResponseType>> {
        return axiosInstance.delete<ResponseType>(endpoint);
    }

    public addRequestInterceptor(
        interceptor: (request: AxiosRequestConfig) => AxiosRequestConfig,
        errorInterceptor?: (error: AxiosError) => Promise<AxiosRequestConfig>
    ): number {
        return axiosInstance.interceptors.request.use(interceptor, errorInterceptor);
    }

    public removeRequestInterceptor(interceptorId: number) {
        axiosInstance.interceptors.request.eject(interceptorId);
    }

    public addResponseInterceptor(
        interceptor: (response: AxiosResponse) => AxiosResponse,
        errorInterceptor?: (error: AxiosError) => Promise<AxiosResponse>
    ): number {
        return axiosInstance.interceptors.response.use(interceptor, errorInterceptor);
    }

    public removeResponseInterceptor(interceptorId: number) {
        axiosInstance.interceptors.response.eject(interceptorId);
    }
}

const apiService = new ApiService();
export default apiService;
