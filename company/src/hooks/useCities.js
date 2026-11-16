import { useCallback, useEffect, useState } from "react";
import service from "../services/locations.service";

export default function useCities() {
    const [loading, setLoading] = useState(true);
    const [cities, setCities] = useState([]);
    const [serverError, setServerError] = useState("");

    const fetchCities = useCallback(async () => {
        setLoading(true);
        setServerError("");

        try {
            const result = await service.getCities();

            if (!result.success) {
                setCities([]);
                setServerError(
                    result.message ||
                    "Impossible de charger les villes."
                );
                return;
            }

            setCities(result.data || []);
        } catch (error) {
            setCities([]);
            setServerError(
                error.message ||
                "Impossible de charger les villes."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCities();
    }, [fetchCities]);

    return {
        loading,
        cities,
        serverError,
        refresh: fetchCities,
    };
}