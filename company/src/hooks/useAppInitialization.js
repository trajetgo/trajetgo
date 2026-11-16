import { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth.context";

const ALLOWED_ROLES = ["SUPER_ADMIN", "COMPANY_ADMIN"];

export default function useAppInitialization() {
    const {
        user,
        isAuthenticated,
        loading: userLoading,
    } = useAuth();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Attendre que le contexte d'authentification termine
        // la vérification de la session.
        if (userLoading) return;

        let cancelled = false;

        async function initialize() {
            try {
                if (!isAuthenticated || !user) return;

                // Vérifier les autorisations d'accès à la Company App.
                if (!ALLOWED_ROLES.includes(user.role)) return;

                // TODO : initialiser le CSRF
                // TODO : rafraîchir la session si nécessaire
                // TODO : récupérer les données utilisateur
                // TODO : charger les paramètres de l'application
            } catch (error) {
                console.error(
                    "[CompanyApp] Erreur d'initialisation :",
                    error
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        initialize();

        return () => {
            cancelled = true;
        };
    }, [userLoading, isAuthenticated, user]);

    return {
        loading: userLoading || loading,
        isAuthorized:
            isAuthenticated &&
            !!user &&
            ALLOWED_ROLES.includes(user.role),
    };
}