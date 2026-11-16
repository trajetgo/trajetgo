import { useCallback, useEffect, useState } from "react";
import service from "../services/locations.service";

export default function useLocations(cityId = null) {
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [locations, setLocations] = useState([]);
    const [serverError, setServerError] = useState("");

    const fetchLocations = useCallback(async () => {
        if (!cityId) {
            setLocations([]);
            setServerError("");
            setLoaded(false);
            return;
        }

        setLoading(true);
        setServerError("");

        try {
            const result = await service.getLocationsByCity(cityId);

            if (!result.success) {
                setLocations([]);
                setServerError(
                    result.message || "Impossible de charger les lieux."
                );
                return;
            }

            // ✅ Gère les deux formats : tableau direct OU { city, locations }
            const payload = Array.isArray(result.data)
                ? result.data
                : result.data?.locations ?? [];

            setLocations(payload);
        } catch (error) {
            setLocations([]);
            setServerError(
                error.message || "Impossible de charger les lieux."
            );
        } finally {
            setLoading(false);
            setLoaded(true);
        }
    }, [cityId]);

    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    return {
        loading,
        loaded,
        locations,
        serverError,
        refresh: fetchLocations,
    };
}