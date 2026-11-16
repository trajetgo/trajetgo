import { useEffect, useRef } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";

import { useAuth } from "@shared/contexts/auth.context";
import Loading from "@shared/components/Loading";

import AuthRouter from "./auth.route";
import { getDefaultRedirect, resolveRedirect } from "../utils/redirect.utils";

export default function AppRouter() {
    const {
        isAuthenticated,
        loading,
        user
    } = useAuth();

    const [searchParams] = useSearchParams();
    const hasRedirected = useRef(false);

    /* ---------- Redirection post-login ---------- */

    useEffect(() => {
        if (loading) return;
        if (!isAuthenticated) return;
        if (hasRedirected.current) return;

        hasRedirected.current = true;

        const continueUrl = searchParams.get("continue_url");

        // Si continue_url fourni et valide → on l'utilise
        // Sinon → fallback selon le rôle
        const target = continueUrl
            ? resolveRedirect(continueUrl)
            : getDefaultRedirect(user);

        window.location.href = target;
    }, [loading, isAuthenticated, user, searchParams]);

    if (loading || isAuthenticated) {
        return <Loading message="Redirection..." />;
    }

    return (
        <Routes>

            <Route path="/*" element={<AuthRouter />} />

        </Routes>
    )
}