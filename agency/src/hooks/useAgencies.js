import { useCallback, useEffect, useMemo, useState } from "react";
import service from "../services/agencies.service.js";

/* ------------------------------------------------------------------ */
/* Mapping action → statut (verbe → adjectif)                          */
/* ------------------------------------------------------------------ */

const ACTION_TO_STATUS = {
    ACTIVATE: "ACTIVE",
    DEACTIVATE: "INACTIVE",
    CLOSE: "CLOSED",
};

/* Mapping inverse pour l'API */
const STATUS_TO_METHOD = {
    ACTIVE: "activateAgency",
    INACTIVE: "deactivateAgency",
    CLOSED: "closeAgency",
};

/* Accesseurs de tri (champs imbriqués) */
const SORT_ACCESSORS = {
    name: (a) => a.name ?? "",
    code: (a) => a.code ?? "",
    city: (a) => a.city?.name ?? "",
    status: (a) => a.status ?? "",
    createdAt: (a) => new Date(a.createdAt ?? 0).getTime(),
};

/* ------------------------------------------------------------------ */

export default function useAgencies() {
    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState("");
    const [agencies, setAgencies] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [sort, setSort] = useState({
        key: "createdAt",
        direction: "desc",
    });

    /* ---------- Chargement ---------- */

    const loadAgencies = useCallback(async () => {
        setLoading(true);
        setServerError("");

        try {
            const result = await service.getAgencies();

            if (!result.success) {
                setServerError(
                    result.message || "Impossible de charger les agences."
                );
                setAgencies([]);
                return;
            }

            setAgencies(result.data || []);
        } catch (error) {
            setServerError(
                error.message || "Impossible de charger les agences."
            );
            setAgencies([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAgencies();
    }, [loadAgencies]);

    /* ---------- Tri ---------- */

    const handleSort = (key) => {
        setSort((prev) => ({
            key,
            direction:
                prev.key === key && prev.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    /* ---------- Filtrage + tri ---------- */

    const filteredAgencies = useMemo(() => {
        let data = [...agencies];

        if (statusFilter !== "ALL") {
            data = data.filter((a) => a.status === statusFilter);
        }

        const term = search.trim().toLowerCase();
        if (term) {
            data = data.filter((a) =>
                [a.name, a.address, a.city?.name, a.code]
                    .filter(Boolean)
                    .some((v) => String(v).toLowerCase().includes(term))
            );
        }

        const accessor =
            SORT_ACCESSORS[sort.key] ?? ((a) => a[sort.key]);

        data.sort((a, b) => {
            const aValue = accessor(a);
            const bValue = accessor(b);

            if (aValue == null) return 1;
            if (bValue == null) return -1;

            if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
            return 0;
        });

        return data;
    }, [agencies, search, statusFilter, sort]);

    /* ---------- Mise à jour statut ---------- */

    /**
     * @param {string} id
     * @param {"ACTIVATE" | "DEACTIVATE" | "CLOSE"} action
     */
    const updateStatus = async (id, action) => {
        const nextStatus = ACTION_TO_STATUS[action];

        if (!nextStatus) {
            throw new Error(`Action inconnue : ${action}`);
        }

        const method = STATUS_TO_METHOD[nextStatus];

        try {
            const result = await service[method](id);

            if (!result.success) {
                throw new Error(
                    result.message || "Impossible de modifier le statut."
                );
            }

            // ✅ Mise à jour optimiste APRÈS succès
            setAgencies((prev) =>
                prev.map((a) =>
                    a.id === id ? { ...a, status: nextStatus } : a
                )
            );

            return result;
        } catch (error) {
            setServerError(
                error.message || "Impossible de modifier le statut."
            );
            throw error;
        }
    };

    /* ---------- Compteurs ---------- */

    const counts = useMemo(
        () => ({
            all: agencies.length,
            active: agencies.filter((a) => a.status === "ACTIVE").length,
            inactive: agencies.filter((a) => a.status === "INACTIVE").length,
            closed: agencies.filter((a) => a.status === "CLOSED").length,
        }),
        [agencies]
    );

    return {
        loading,
        serverError,
        agencies,
        filteredAgencies,
        counts,
        search,
        setSearch,
        sort,
        handleSort,
        statusFilter,
        setStatusFilter,
        updateStatus,
        refresh: loadAgencies,
    };
}