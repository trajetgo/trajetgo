import { useCallback, useEffect, useMemo, useState } from "react";
import service from "../services/routes.service";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 10;

/* Accesseurs de tri (champs imbriqués) */
const SORT_ACCESSORS = {
    originCity: (r) => (r.originCity?.name ?? "").toLowerCase(),
    destinationCity: (r) => (r.destinationCity?.name ?? "").toLowerCase(),
    distanceKm: (r) => r.distanceKm ?? 0,
    durationMin: (r) => r.durationMin ?? 0,
    price: (r) => r.price ?? 0,
    active: (r) => (r.active ? 1 : 0),
    createdAt: (r) => new Date(r.createdAt ?? 0).getTime(),
};

/* ------------------------------------------------------------------ */

export default function useRoutes() {
    const [loading, setLoading] = useState(true);
    const [routes, setRoutes] = useState([]);
    const [serverError, setServerError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | ACTIVE | INACTIVE

    const [sort, setSort] = useState({
        key: "createdAt",
        direction: "desc",
    });

    const [page, setPage] = useState(1);

    /* =========================================================
       Fetch
    ========================================================= */

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

    /* =========================================================
       Tri
    ========================================================= */

    const handleSort = (key) => {
        setSort((prev) => ({
            key,
            direction:
                prev.key === key && prev.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    /* =========================================================
       Filtrage + tri
    ========================================================= */

    const filteredRoutes = useMemo(() => {
        let data = [...routes];

        // Filtre statut
        if (statusFilter !== "ALL") {
            const isActive = statusFilter === "ACTIVE";
            data = data.filter((r) => Boolean(r.active) === isActive);
        }

        // Recherche
        const term = search.trim().toLowerCase();
        if (term) {
            data = data.filter((r) => {
                const values = [
                    r.originCity?.name,
                    r.destinationCity?.name,
                    r.originCity?.code,
                    r.destinationCity?.code,
                ];

                return values.some((v) =>
                    String(v ?? "").toLowerCase().includes(term)
                );
            });
        }

        // Tri
        const accessor =
            SORT_ACCESSORS[sort.key] ?? ((r) => r[sort.key]);

        data.sort((a, b) => {
            const aVal = accessor(a);
            const bVal = accessor(b);

            if (aVal == null) return 1;
            if (bVal == null) return -1;
            if (aVal < bVal) return sort.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sort.direction === "asc" ? 1 : -1;
            return 0;
        });

        return data;
    }, [routes, statusFilter, search, sort]);

    /* =========================================================
       Pagination
    ========================================================= */

    const totalItems = filteredRoutes.length;
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);

    const currentPage = Math.min(page, Math.max(1, totalPages));

    const paginatedRoutes = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;

        return filteredRoutes.slice(startIndex, startIndex + PAGE_SIZE);
    }, [filteredRoutes, currentPage]);

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

    useEffect(() => {
        setPage(1);
    }, [search, statusFilter, sort]);

    /* =========================================================
       Compteurs
    ========================================================= */

    const counts = useMemo(
        () => ({
            all: routes.length,
            active: routes.filter((r) => r.active).length,
            inactive: routes.filter((r) => !r.active).length,
        }),
        [routes]
    );

    /* =========================================================
       Return
    ========================================================= */

    return {
        loading,
        routes,
        filteredRoutes,
        paginatedRoutes,

        counts,

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