import { useCallback, useEffect, useMemo, useState } from "react";
import service from "../services/agencies.service";

const PAGE_SIZE = 10;

/* Action → statut */
const ACTION_TO_STATUS = {
    ACTIVATE: "ACTIVE",
    DEACTIVATE: "INACTIVE",
    CLOSE: "CLOSED",
};

/* Statut → méthode API */
const STATUS_TO_METHOD = {
    ACTIVE: "activateAgency",
    INACTIVE: "deactivateAgency",
    CLOSED: "closeAgency",
};

/* Accesseurs de tri */
const SORT_ACCESSORS = {
    name: (a) => a.name ?? "",
    code: (a) => a.code ?? "",
    city: (a) => a.city?.name ?? "",
    status: (a) => a.status ?? "",
    createdAt: (a) => new Date(a.createdAt ?? 0).getTime(),
};

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

    // Pagination
    const [page, setPage] = useState(1);

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
                    .some((value) =>
                        String(value).toLowerCase().includes(term)
                    )
            );
        }

        const accessor =
            SORT_ACCESSORS[sort.key] ?? ((a) => a[sort.key]);

        data.sort((a, b) => {
            const aValue = accessor(a);
            const bValue = accessor(b);

            if (aValue == null) return 1;
            if (bValue == null) return -1;

            if (aValue < bValue) {
                return sort.direction === "asc" ? -1 : 1;
            }

            if (aValue > bValue) {
                return sort.direction === "asc" ? 1 : -1;
            }

            return 0;
        });

        return data;
    }, [agencies, search, statusFilter, sort]);

    /* ---------- Pagination ---------- */

    const totalItems = filteredAgencies.length;

    const totalPages = Math.ceil(totalItems / PAGE_SIZE);

    // Empêche de rester sur une page inexistante après filtrage/suppression.
    const currentPage = Math.min(
        page,
        Math.max(1, totalPages)
    );

    const paginatedAgencies = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;

        return filteredAgencies.slice(
            startIndex,
            startIndex + PAGE_SIZE
        );
    }, [filteredAgencies, currentPage]);

    const pagination = useMemo(
        () => ({
            page: currentPage,
            pageSize: PAGE_SIZE,
            totalItems,
            totalPages,
            hasPreviousPage: currentPage > 1,
            hasNextPage: currentPage < totalPages,
        }),
        [currentPage, totalItems, totalPages]
    );

    const changePage = useCallback(
        (nextPage) => {
            const targetPage = Math.max(
                1,
                Math.min(nextPage, Math.max(1, totalPages))
            );

            setPage(targetPage);
        },
        [totalPages]
    );

    // Revenir à la première page lorsque les critères changent.
    useEffect(() => {
        setPage(1);
    }, [search, statusFilter, sort]);

    /* ---------- Mise à jour du statut ---------- */

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

            setAgencies((prev) =>
                prev.map((agency) =>
                    agency.id === id
                        ? { ...agency, status: nextStatus }
                        : agency
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
            active: agencies.filter(
                (a) => a.status === "ACTIVE"
            ).length,
            inactive: agencies.filter(
                (a) => a.status === "INACTIVE"
            ).length,
            closed: agencies.filter(
                (a) => a.status === "CLOSED"
            ).length,
        }),
        [agencies]
    );

    return {
        loading,
        serverError,
        agencies,
        filteredAgencies,
        paginatedAgencies,

        counts,

        search,
        setSearch,

        sort,
        handleSort,

        statusFilter,
        setStatusFilter,

        updateStatus,
        refresh: loadAgencies,

        // Pagination
        pagination,
        changePage,
    };
}