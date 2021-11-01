import { AxiosResponse } from "axios";
import { CreateUser, LoginResponse, LoginUser, RefreshResponse, UserResponse } from "../types/auth";
import apiService from "./apiService";

export const ACCESS_TOKEN = "access_token";
export const REFRESH_TOKEN = "refresh_token";

class AuthService {
    private routes = {
        login: "auth/login",
        register: "auth/user",
        refresh: "auth/refresh",
    };

    public async login(loginUser: LoginUser): Promise<boolean> {
        const response = await apiService.post<LoginResponse>(this.routes.login, loginUser);
        if (response.status !== 200) {
            return false;
        }
        this.setAccessToken(response.data.accessToken);
        this.setRefreshToken(response.data.refreshToken);
        return true;
    }

    public logout() {
        this.resetTokens();
    }

    public async register(user: CreateUser): Promise<AxiosResponse<UserResponse>> {
        return await apiService.post<UserResponse>(this.routes.register, user);
    }

    public async refreshToken(): Promise<AxiosResponse<RefreshResponse>> {
        const refreshToken = this.getRefreshToken();
        const headers = { Authorization: `Bearer ${refreshToken}` };
        const response = await apiService.post<RefreshResponse>(this.routes.refresh, {}, headers);
        if (response.status === 200) {
            this.setAccessToken(response.data.accessToken);
        } else {
            this.resetTokens();
        }
        return response;
    }

    public getAccessToken(): string | null {
        return localStorage.getItem(ACCESS_TOKEN) ?? null;
    }

    public setAccessToken(token: string) {
        if (!token) {
            return;
        }
        localStorage.setItem(ACCESS_TOKEN, token);
    }

    public resetAccessToken() {
        localStorage.removeItem(ACCESS_TOKEN);
    }

    public getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN) ?? null;
    }

    public setRefreshToken(token: string) {
        if (!token) {
            return;
        }
        localStorage.setItem(REFRESH_TOKEN, token);
    }

    public resetRefreshToken() {
        localStorage.removeItem(REFRESH_TOKEN);
    }

    public resetTokens() {
        this.resetAccessToken();
        this.resetRefreshToken();
    }

    public isLoggedIn() {
        return !!this.getAccessToken();
    }

    public async getUser(): Promise<AxiosResponse<UserResponse>> {
        return await apiService.get<UserResponse>(this.routes.register);
    }
}

export const authService = new AuthService();
export default authService;
