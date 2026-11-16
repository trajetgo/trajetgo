import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/auth.context";

export default function GuestGuard() {

    const { isAuthenticated, loading } = useAuth();
    const { pathname } = useLocation();

    if (loading) {
        return <div>Chargement...</div>;
    }

    const allowedWhenAuthenticated = [
        "/auth/verify-phone",
    ];

    if (
        isAuthenticated &&
        !allowedWhenAuthenticated.includes(pathname)
    ) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}