import { useCallback, useEffect, useMemo, useState } from "react";
import service from "../services/routes.service";

export default function useRoutes() {
    const [loading, setLoading] = useState(true);
    const [routes, setRoutes] = useState([]);
    const [serverError, setServerError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [sort, setSort] = useState({ key: null, direction: "asc" });
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);

    const fetchRoutes = useCallback(async () => {
        setLoading(true);
        setServerError("");

        try {
            const result = await service.getRoutes();

            if (!result.success) {
                setRoutes([]);
                setServerError(
                    result.message || "Impossible de charger les lignes."
                );
                return;
            }

            setRoutes(result.data || []);
        } catch (error) {
            setRoutes([]);
            setServerError(
                error.message || "Impossible de charger les lignes."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoutes();
    }, [fetchRoutes]);

    /* ---------- Filtrage ---------- */

    const filteredRoutes = useMemo(() => {
        let result = [...routes];

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            result = result.filter((route) => {
                const origin = route.originCity?.name?.toLowerCase() ?? "";
                const destination =
                    route.destinationCity?.name?.toLowerCase() ?? "";
                return origin.includes(q) || destination.includes(q);
            });
        }

        if (statusFilter !== "ALL") {
            const isActive = statusFilter === "ACTIVE";
            result = result.filter((route) => route.active === isActive);
        }

        return result;
    }, [routes, search, statusFilter]);

    /* ---------- Tri ---------- */

    const sortedRoutes = useMemo(() => {
        if (!sort.key) return filteredRoutes;

        return [...filteredRoutes].sort((a, b) => {
            const av = a[sort.key];
            const bv = b[sort.key];

            if (av == null) return 1;
            if (bv == null) return -1;
            if (av < bv) return sort.direction === "asc" ? -1 : 1;
            if (av > bv) return sort.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredRoutes, sort]);

    /* ---------- Pagination ---------- */

    const pagination = useMemo(() => {
        const total = sortedRoutes.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        const safePage = Math.min(page, totalPages);
        const start = (safePage - 1) * pageSize;

        return {
            page: safePage,
            pageSize,
            total,
            totalPages,
        };
    }, [sortedRoutes, page, pageSize]);

    const paginatedRoutes = useMemo(() => {
        const start = (pagination.page - 1) * pagination.pageSize;
        return sortedRoutes.slice(start, start + pagination.pageSize);
    }, [sortedRoutes, pagination]);

    /* ---------- Handlers ---------- */

    const handleSort = useCallback((key) => {
        setSort((current) => ({
            key,
            direction:
                current.key === key && current.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    }, []);

    const changePage = useCallback((nextPage) => {
        setPage(nextPage);
    }, []);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [search, statusFilter]);

    return {
        loading,
        routes,
        filteredRoutes,
        sortedRoutes,
        paginatedRoutes,

        search,
        setSearch,

        statusFilter,
        setStatusFilter,

        sort,
        handleSort,

        pagination,
        changePage,

        serverError,
        refresh: fetchRoutes,
    };
}