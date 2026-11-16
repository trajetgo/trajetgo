import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@shared/contexts/auth.context";
import Loading from "@shared/components/Loading";

export default function GuestGuard() {

    const { isAuthenticated, loading } = useAuth();
    const { pathname } = useLocation();

    if (loading) return <Loading message="Chargement..." />

    const allowedWhenAuthenticated = [
        "/verify-phone",
    ];

    if (
        isAuthenticated &&
        !allowedWhenAuthenticated.includes(pathname)
    ) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}