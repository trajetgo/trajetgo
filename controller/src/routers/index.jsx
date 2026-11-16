import { useEffect, useRef } from "react";

import { useAuth } from "@shared/contexts/auth.context";
import Loading from "@shared/components/Loading";
import { AUTH_URL } from "@shared/services/api";

import ControllerRouter from "./controller.route";
import AccessDenied from "../components/AccessDenied";

const ALLOWED_ROLES = ["SUPER_ADMIN", "COMPANY_ADMIN", "AGENCY_AGENT"];

export default function AppRouter() {
    const { loading, isAuthenticated, user } = useAuth();
    const hasRedirected = useRef(false);

    const isAuthorized =
        isAuthenticated &&
        !!user &&
        ALLOWED_ROLES.includes(user.role);

    useEffect(() => {
        if (loading || isAuthenticated) return;
        if (hasRedirected.current) return;

        hasRedirected.current = true;

        if (!AUTH_URL) {
            console.error("[AppRouter] AUTH_URL is not defined");
            return;
        }

        const continueUrl = encodeURIComponent(
            window.location.href
        );

        window.location.href =
            `${AUTH_URL}/login?continue_url=${continueUrl}`;
    }, [loading, isAuthenticated]);

    if (loading || !isAuthenticated) {
        return <Loading message="Chargement..." />;
    }

    if (!isAuthorized) {
        return (
            <AccessDenied
                title="Accès refusé"
                message="Votre compte ne dispose pas des autorisations nécessaires pour accéder à la Controller App."
                homePath="/"
            />
        );
    }

    return <ControllerRouter />;
}