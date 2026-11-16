import { useEffect, useState } from "react";
import service from "../services/session.service";

export default function useSessions() {

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState("");
    const [revoking, setRevoking] = useState(false);

    const loadSessions = async () => {
        setLoading(true);
        setServerError("");

        try {
            const result = await service.getSessions();
            setSessions(result.data ?? []);
        } catch (err) {
            setServerError(err.message || "Impossible de charger les sessions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSessions();
    }, []);

    const handleRevoke = async (id) => {
        setRevoking(true);

        try {
            await service.revokeSession(id);
            setSessions((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            setServerError(err.message || "Impossible de révoquer la session.");
        } finally {
            setRevoking(false);
        }
    };

    const handleRevokeAll = async () => {
        setRevoking(true);

        try {
            await service.revokeAllSessions();
            setSessions([]);
        } catch (err) {
            setServerError(err.message || "Impossible de révoquer les sessions.");
        } finally {
            setRevoking(false);
        }
    };

    return {
        loading,
        serverError,
        revoking,
        sessions,

        handleRevoke,
        handleRevokeAll,

        refresh: loadSessions
    };
}
