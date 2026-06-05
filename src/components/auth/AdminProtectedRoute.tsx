import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuth } from "@/lib/authCookies";

export default function AdminProtectedRoute() {
    const auth = getAuth();
    const location = useLocation();

    if (!auth?.token) {
        return (
            <Navigate
                to="/admin/login"
                replace
                state={{ from: location }}
            />
        );
    }

    if (auth.role !== "admin") {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return <Outlet />;
}