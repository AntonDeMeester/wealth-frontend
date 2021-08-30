import { Suspense, lazy } from "react";
import type { PartialRouteObject } from "react-router";
import AuthGuard from "./components/AuthGuard";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import GuestGuard from "./components/GuestGuard";
import LoadingScreen from "./components/LoadingScreen";

const Loadable = (Component) => (props) =>
    (
        <Suspense fallback={<LoadingScreen />}>
            <Component {...props} />
        </Suspense>
    );

// Authentication pages

const Login = Loadable(lazy(() => import("./pages/authentication/Login")));
const PasswordRecovery = Loadable(lazy(() => import("./pages/authentication/PasswordRecovery")));
const PasswordReset = Loadable(lazy(() => import("./pages/authentication/PasswordReset")));
const Register = Loadable(lazy(() => import("./pages/authentication/Register")));
const VerifyCode = Loadable(lazy(() => import("./pages/authentication/VerifyCode")));

// Dashboard pages

const Account = Loadable(lazy(() => import("./pages/dashboard/Account")));
const Overview = Loadable(lazy(() => import("./pages/dashboard/Overview")));
const Banks = Loadable(lazy(() => import("./pages/dashboard/Banks")));
const Stocks = Loadable(lazy(() => import("./pages/dashboard/Stocks")));

const routes: PartialRouteObject[] = [
    {
        path: "auth",
        children: [
            {
                path: "login",
                element: (
                    <GuestGuard>
                        <Login />
                    </GuestGuard>
                ),
            },
            {
                path: "login-unguarded",
                element: <Login />,
            },
            {
                path: "password-recovery",
                element: <PasswordRecovery />,
            },
            {
                path: "password-reset",
                element: <PasswordReset />,
            },
            {
                path: "register",
                element: (
                    <GuestGuard>
                        <Register />
                    </GuestGuard>
                ),
            },
            {
                path: "register-unguarded",
                element: <Register />,
            },
            {
                path: "verify-code",
                element: <VerifyCode />,
            },
        ],
    },
    {
        path: "*",
        element: (
            <AuthGuard>
                <DashboardLayout />
            </AuthGuard>
        ),
        children: [
            {
                path: "/",
                element: <Overview />,
            },
            {
                path: "account",
                element: <Account />,
            },
            {
                path: "banks",
                element: <Banks />,
            },
            {
                path: "stocks",
                element: <Stocks />,
            },
        ],
    },
];

export default routes;
