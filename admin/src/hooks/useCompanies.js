import { useCallback, useEffect, useMemo, useState } from "react";
import service from "../services/companies.service.js";

/* ------------------------------------------------------------------ */
/* Mapping action → statut (verbe → adjectif)                          */
/* ------------------------------------------------------------------ */
const PAGE_SIZE = 10;

const ACTION_TO_STATUS = {
    ACTIVATE: "ACTIVE",
    DEACTIVATE: "INACTIVE",
    SUSPEND: "SUSPENDED",
};

/* Mapping inverse pour l'API */
const STATUS_TO_METHOD = {
    ACTIVE: "activateCompany",
    INACTIVE: "deactivateCompany",
    SUSPENDED: "suspendCompany",
};

/* Accesseurs de tri (champs imbriqués) */
const SORT_ACCESSORS = {
    name: (a) => a.name ?? "",
    code: (a) => a.code ?? "",
    status: (a) => a.status ?? "",
    createdAt: (a) => new Date(a.createdAt ?? 0).getTime(),
}

/* ------------------------------------------------------------------ */
export default function useCompanies() {
    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState("");
    const [companies, setCompanies] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [sort, setSort] = useState({
        key: "createdAt",
        direction: "desc",
    });

    const [page, setPage] = useState(1);

    const [viewMode, setViewMode] = useState('list') // list, grid

    /* ---------- Chargement ---------- */

    const loadCompanies = useCallback(async () => {
        setLoading(true);
        setServerError("");

        try {
            const result = await service.getCompanies();

            if (!result.success) {
                setServerError(
                    result.message || "Impossible de charger les entreprises."
                );
                setCompanies([]);
                return;
            }

            setCompanies(result.data || []);
        } catch (error) {
            setServerError(
                error.message || "Impossible de charger les entreprises."
            );
            setCompanies([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCompanies();
    }, [loadCompanies]);

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

    const filteredCompanies = useMemo(() => {
        let data = [...companies];

        if (statusFilter !== "ALL") {
            data = data.filter((a) => a.status === statusFilter);
        }

        const term = search.trim().toLowerCase();
        if (term) {
            data = data.filter((c) =>
                [c.name, c.code]
                    .filter(Boolean)
                    .some((v) => String(v).toLowerCase().includes(term))
            );
        }

        const accessor = SORT_ACCESSORS[sort.key] || ((a) => a[sort.key]);
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
    }, [companies, statusFilter, search, sort]);

    /* ---------- Pagination ---------- */

    const totalItems = filteredCompanies.length;

    const totalPages = Math.ceil(totalItems / PAGE_SIZE);

    // Empêche de rester sur une page inexistante après filtrage/suppression.
    const currentPage = Math.min(
        page,
        Math.max(1, totalPages)
    );

    const paginatedCompanies = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;

        return filteredCompanies.slice(
            startIndex,
            startIndex + PAGE_SIZE
        );
    }, [filteredCompanies, currentPage]);

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

    const changeViewMode = (mode) => {
        setViewMode(mode);
    }

    /* ---------- Mise à jour statut ---------- */

    /**
     * @param {string} id
     * @param {"ACTIVATE" | "DEACTIVATE" | "CLOSE" | "SUSPEND"} action
     */
    const updateStatus = async (id, action) => {
        const newStatus = ACTION_TO_STATUS[action];

        if (!newStatus) {
            throw new Error(`Action inconnue : ${action}`);
        }

        const method = STATUS_TO_METHOD[newStatus];

        try {
            const result = await service[method](id);

            if (!result.success) {
                throw new Error(
                    result.message || "Impossible de modifier le statut."
                );
            }

            // ✅ Mise à jour optimiste APRÈS succès
            setCompanies((prev) =>
                prev.map((c) =>
                    c.id === id ? { ...c, status: newStatus } : c
                )
            );

            return result;
        } catch (error) {
            setServerError(
                error.message || "Impossible de modifier le statut."
            );
        }
    };

    /* ---------- Compteurs ---------- */

    const counts = useMemo(
        () => ({
            all: companies.length,
            active: companies.filter((c) => c.status === "ACTIVE").length,
            inactive: companies.filter((c) => c.status === "INACTIVE").length,
            suspended: companies.filter((c) => c.status === "SUSPENDED").length,
        }),
        [companies]
    );

    return {
        loading,
        serverError,
        companies,
        filteredCompanies,
        paginatedCompanies,

        counts,

        search,
        setSearch,

        statusFilter,
        setStatusFilter,

        sort,
        handleSort,

        viewMode,
        changeViewMode,

        updateStatus,
        refresh: loadCompanies,

        // Pagination
        pagination,
        changePage,
    }
}