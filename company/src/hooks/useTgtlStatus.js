import { useCallback, useEffect, useState } from "react";

import service from "../services/tgtl.service.js";

export default function useTgtlStatus() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState("");

    const fetchStatus = useCallback(async () => {
        setLoading(true);
        setServerError("");

        try {
            const result = await service.getStatus();
            setStatus(result.data ?? null);
        } catch (err) {
            setServerError(err.message || "Impossible de charger l'état.");
            setStatus(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    return {
        status,
        loading,
        serverError,
        refresh: fetchStatus,
    };
}