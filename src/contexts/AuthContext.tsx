import { createContext, useEffect } from "react";
import type { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import { authService } from "../services/authService";
import { CreateUser } from "src/types/auth";
import { useDispatch, useSelector } from "src/store";
import * as authSlice from "src/slices/auth";
import { removeAllPositions, unselectPosition } from "src/slices/stocks";
import { removeAllAccounts, unselectAccount } from "src/slices/banking";

interface AuthProviderProps {
    children: ReactNode;
}

interface AuthContextValue extends authSlice.AuthState {
    platform: "JWT";
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (user: CreateUser) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
    ...authSlice.initialState,
    platform: "JWT",
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    register: () => Promise.resolve(),
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
    const { children } = props;
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    useEffect(() => {
        const initialize = async (): Promise<void> => {
            try {
                const accessToken = authService.getAccessToken();

                if (accessToken) {
                    const user = await authService.getUser();
                    dispatch(authSlice.setUser(user.data));
                    dispatch(authSlice.initialize(true));
                } else {
                    dispatch(authSlice.initialize(false));
                }
            } catch (err) {
                console.error(err);
                dispatch(authSlice.initialize(false));
            }
        };

        initialize();
    }, [dispatch]);

    const login = async (email: string, password: string): Promise<void> => {
        const loggedIn = await authService.login({ email, password });

        if (!loggedIn) {
            return;
        }
        dispatch(authSlice.login());
        const user = await authService.getUser();
        dispatch(authSlice.setUser(user.data));
    };

    const logout = async (): Promise<void> => {
        authService.logout()
        dispatch(authSlice.logout());
        dispatch(removeAllPositions());
        dispatch(unselectAccount());
        dispatch(unselectPosition());
        dispatch(removeAllAccounts());
        dispatch(authSlice.resetUser());
    };

    const register = async (user: CreateUser): Promise<void> => {
        await authService.register(user);
        dispatch(authSlice.register());
    };

    return (
        <AuthContext.Provider
            value={{
                ...authState,
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
