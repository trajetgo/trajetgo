import { useCallback, useEffect, useState } from "react";
import service from "../services/routes.service";

export default function useRoutes() {
    const [loading, setLoading] = useState(true);
    const [routes, setRoutes] = useState([]);
    const [serverError, setServerError] = useState("");

    const fetchRoutes = useCallback(async () => {
        setLoading(true);
        setServerError("");

        try {
            const result = await service.getRoutes();

            if (!result.success) {
                setRoutes([]);
                setServerError(
                    result.message ||
                    "Impossible de charger les lignes."
                );
                return;
            }

            setRoutes(result.data || []);
        } catch (error) {
            setRoutes([]);
            setServerError(
                error.message ||
                "Impossible de charger les lignes."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoutes();
    }, [fetchRoutes]);

    return {
        loading,
        routes,
        serverError,
        refresh: fetchRoutes,
    };
}