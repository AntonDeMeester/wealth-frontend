import { createContext, useEffect, useReducer } from "react";
import type { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import type { User } from "../types/user";
import { authService } from "../services/authService";
import { CreateUser } from "src/types/auth";

interface State {
    isInitialized: boolean;
    isAuthenticated: boolean;
}

interface AuthContextValue extends State {
    platform: "JWT";
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (user: CreateUser) => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

type InitializeAction = {
    type: "INITIALIZE";
    payload: {
        isAuthenticated: boolean;
    };
};

type LoginAction = {
    type: "LOGIN";
    payload: {};
};

type LogoutAction = {
    type: "LOGOUT";
};

type RegisterAction = {
    type: "REGISTER";
    payload: {};
};

type Action = InitializeAction | LoginAction | LogoutAction | RegisterAction;

const initialState: State = {
    isAuthenticated: false,
    isInitialized: false,
};

const handlers: Record<string, (state: State, action: Action) => State> = {
    INITIALIZE: (state: State, action: InitializeAction): State => {
        const { isAuthenticated } = action.payload;

        return {
            ...state,
            isAuthenticated,
            isInitialized: true,
        };
    },
    LOGIN: (state: State, action: LoginAction): State => {
        const {} = action.payload;

        return {
            ...state,
            isAuthenticated: true,
        };
    },
    LOGOUT: (state: State): State => ({
        ...state,
        isAuthenticated: false,
    }),
    REGISTER: (state: State, action: RegisterAction): State => {
        const {} = action.payload;

        return {
            ...state,
            isAuthenticated: false,
        };
    },
};

const reducer = (state: State, action: Action): State =>
    handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext<AuthContextValue>({
    ...initialState,
    platform: "JWT",
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    register: () => Promise.resolve(),
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
    const { children } = props;
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const initialize = async (): Promise<void> => {
            try {
                const accessToken = authService.getAccessToken();

                if (accessToken) {
                    dispatch({
                        type: "INITIALIZE",
                        payload: {
                            isAuthenticated: true,
                        },
                    });
                } else {
                    dispatch({
                        type: "INITIALIZE",
                        payload: {
                            isAuthenticated: false,
                        },
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: "INITIALIZE",
                    payload: {
                        isAuthenticated: false,
                    },
                });
            }
        };

        initialize();
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        const loggedIn = await authService.login({ email, password });

        if (!loggedIn) {
            return;
        }

        dispatch({
            type: "LOGIN",
            payload: {},
        });
    };

    const logout = async (): Promise<void> => {
        authService.logout();
        dispatch({ type: "LOGOUT" });
    };

    const register = async (user: CreateUser): Promise<void> => {
        authService.register(user);

        dispatch({
            type: "REGISTER",
            payload: {},
        });
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                platform: "JWT",
                login,
                logout,
                register,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthContext;
