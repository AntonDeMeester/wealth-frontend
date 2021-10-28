
import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "src/store";

export interface AuthState {
    isInitialized: boolean;
    isAuthenticated: boolean;
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
};

const slice = createSlice({
    name: "stocks",
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
        dispatch(slice.actions.initialize({isAuthenticated}));
    };

export default slice;
