import { useCallback, useEffect, useState } from "react";
import { MOCK_TRIPS } from "../mocks/trips.mock";

export default function useTrip(id) {
    const [loading, setLoading] = useState(false);
    const [trip, setTrip] = useState(null);
    const [serverError, setServerError] = useState("");

    const loadTrip = useCallback(async () => {
        setLoading(true);
        setServerError("");

        try {
            await new Promise((resolve) =>
                setTimeout(resolve, 700)
            );

            const result = MOCK_TRIPS.find(
                (item) => item.id === id
            );

            if (!result) {
                throw new Error("Trajet introuvable.");
            }

            setTrip(result);
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
        loadTrip();
    }, [loadTrip]);

    return {
        loading,
        trip,
        serverError,
        refresh: loadTrip,
    };
}