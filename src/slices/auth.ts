import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "src/store";
import { UserResponse } from "src/types/auth";

export interface AuthState {
    isInitialized: boolean;
    isAuthenticated: boolean;
    user: UserResponse | null;
}

type InitializeAction = {
    type: "INITIALIZE";
    payload: {
        isAuthenticated: boolean;
    };
};

export const initialState: AuthState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};

export const selectUser = (state: AuthState) => state.user

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        initialize: (state: AuthState, action: InitializeAction): AuthState => {
            const { isAuthenticated } = action.payload;

            return {
                ...state,
                isAuthenticated,
                isInitialized: true,
            };
        },
        login: (state: AuthState): AuthState => {
            return {
                ...state,
                isAuthenticated: true,
            };
        },
        logout: (state: AuthState): AuthState => ({
            ...state,
            isAuthenticated: false,
        }),
        register: (state: AuthState): AuthState => {
            return {
                ...state,
                isAuthenticated: false,
            };
        },
        setUser: (state: AuthState, action: PayloadAction<UserResponse>): AuthState => {
            return {
                ...state,
                user: action.payload,
            };
        },
        resetUser: (state: AuthState): AuthState => {
            return {
                ...state,
                user: null,
            };
        },
    },
});

export const { reducer } = slice;

export const login =
    (): AppThunk =>
    async (dispatch): Promise<void> => {
        dispatch(slice.actions.login());
    };

export const logout =
    (): AppThunk =>
    async (dispatch): Promise<void> => {
        dispatch(slice.actions.logout());
    };

export const register =
    (): AppThunk =>
    async (dispatch): Promise<void> => {
        dispatch(slice.actions.register());
    };

export const initialize =
    (isAuthenticated: boolean): AppThunk =>
    async (dispatch): Promise<void> => {
        dispatch(slice.actions.initialize({ isAuthenticated }));
    };

export const setUser =
    (user: UserResponse): AppThunk =>
    async (dispatch): Promise<void> => {
        dispatch(slice.actions.setUser(user));
    };

export const resetUser =
    (): AppThunk =>
    async (dispatch): Promise<void> => {
        dispatch(slice.actions.resetUser());
    };

export default slice;
