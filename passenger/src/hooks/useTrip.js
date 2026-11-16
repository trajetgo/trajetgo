import { useCallback, useEffect, useState } from "react";
import service from "../services/trips.service";

export default function useTrip(id) {
    const [loading, setLoading] = useState(false);
    const [trip, setTrip] = useState(null);
    const [serverError, setServerError] = useState("");

    const loadTrip = useCallback(async () => {
        setLoading(true);
        setServerError("");

        try {
           const result = await service.getTrip(id);

            if (!result.success) {
                throw new Error("Trajet introuvable.");
            }

            setTrip(result.data);
        } catch (error) {
            setServerError(
                error.message || "Impossible de charger le trajet."
            );
            setTrip(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            loadTrip();
        }
    }, [id, loadTrip]);

    return {
        loading,
        trip,
        serverError,
        refresh: loadTrip,
    };
}