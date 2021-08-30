export interface LoginUser {
    email: string;
    password: string;
}

export interface CreateUser extends LoginUser {
    firstName: string;
    lastName: string;
    password2: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface RefreshResponse {
    accessToken: string;
}

export interface UserResponse {
    email: string;
    firstName: string;
    lastName: string;
}
