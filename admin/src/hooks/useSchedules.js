import { useCallback, useEffect, useMemo, useState } from "react";
import service from "../services/schedules.service";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 10;

/* ------------------------------------------------------------------ */
/* Tri                                                                 */
/* ------------------------------------------------------------------ */

const SORT_ACCESSORS = {
    createdAt: (s) => new Date(s.createdAt ?? 0).getTime(),
    departureTime: (s) => s.departureTime ?? "",
    route: (s) => `${s.route?.originCity?.name ?? ""}-${s.route?.destinationCity?.name ?? ""}`,
    price: (s) => s.price ?? 0,
};

/* ------------------------------------------------------------------ */

export default function useSchedules() {
    const [loading, setLoading] = useState(true);   // ✅ true initial
    const [schedules, setSchedules] = useState([]);
    const [serverError, setServerError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [sort, setSort] = useState({
        key: "departureTime",
        direction: "asc",
    });

    const [page, setPage] = useState(1);

    /* ---------- Fetch ---------- */

    const fetchSchedules = useCallback(async () => {
        setLoading(true);
        setServerError("");

        try {
            const result = await service.getSchedules();

            if (!result.success) {
                setSchedules([]);
                setServerError(
                    result.message ||
                    "Impossible de charger les programmations."
                );
                return;
            }

            const payload = Array.isArray(result.data)
                ? result.data
                : result.data?.items ?? [];

            setSchedules(payload);
        } catch (error) {
            setSchedules([]);
            setServerError(
                error.message ||
                "Impossible de charger les programmations."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

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

    /* ---------- Filtre + tri ---------- */

    const filteredSchedules = useMemo(() => {
        let data = [...schedules];

        // Filtre statut
        if (statusFilter !== "ALL") {
            data = data.filter((s) => s.status === statusFilter);
        }

        // Recherche
        const q = search.trim().toLowerCase();
        if (q) {
            data = data.filter((s) => {
                const values = [
                    s.id,
                    s.route?.originCity?.name,
                    s.route?.destinationCity?.name,
                    s.bus?.name,
                    s.departureAgency?.name,
                    s.arrivalAgency?.name,
                    s.departureTime,
                ];

                return values.some((v) =>
                    String(v ?? "")
                        .toLowerCase()
                        .includes(q)
                );
            });
        }

        // Tri
        const accessor =
            SORT_ACCESSORS[sort.key] ?? ((s) => s[sort.key]);

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
    }, [schedules, search, statusFilter, sort]);

    /* =========================================================
           Pagination
        ========================================================= */

    const totalItems = filteredSchedules.length;
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);

    const currentPage = Math.min(page, Math.max(1, totalPages));

    const paginatedSchedules = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;

        return filteredSchedules.slice(startIndex, startIndex + PAGE_SIZE);
    }, [filteredSchedules, currentPage]);

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

    /* ---------- Compteurs ---------- */

    const counts = useMemo(
        () => ({
            all: schedules.length,
            active: schedules.filter((s) => s.status === "ACTIVE").length,
            paused: schedules.filter((s) => s.status === "PAUSED").length,
            expired: schedules.filter((s) => s.status === "EXPIRED").length,
        }),
        [schedules]
    );

    return {
        loading,
        schedules,
        filteredSchedules,
        paginatedSchedules,
        counts,
        serverError,

        search,
        setSearch,

        statusFilter,
        setStatusFilter,

        sort,
        handleSort,

        pagination,
        changePage,

        refresh: fetchSchedules,
    };
}