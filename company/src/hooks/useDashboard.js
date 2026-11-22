import { useCallback, useEffect, useState } from "react"
import service from "../services/dashboard.service"

export default function useDashboard() {
    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState("");
    const [summary, setSummary] = useState(null);

    const fetchSummary = useCallback(async () => {
        setLoading(true);
        setServerError("");

        try {
            const result = await service.getSummary();
            setSummary(result.data ?? null);
        } catch (err) {
            setServerError(err.message || "Impossible de charger le tableau de bord.");
            setSummary(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary])

    return {
        loading,
        serverError,

        summary,

        refresh: fetchSummary,
    }
}
