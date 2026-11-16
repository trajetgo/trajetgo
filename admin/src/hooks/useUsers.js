import { useCallback, useEffect, useMemo, useState } from "react";
import service from "../services/users.service";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 10;

/* Accesseurs de tri */
const SORT_ACCESSORS = {
    fullName: (u) =>
        `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase(),
    firstName: (u) => (u.firstName ?? "").toLowerCase(),
    lastName: (u) => (u.lastName ?? "").toLowerCase(),
    email: (u) => (u.email ?? "").toLowerCase(),
    phone: (u) => u.phone ?? "",
    role: (u) => u.role ?? "",
    status: (u) => u.status ?? "",
    company: (u) => (u.company?.name ?? "").toLowerCase(),
    agency: (u) => (u.agency?.name ?? "").toLowerCase(),
    createdAt: (u) => new Date(u.createdAt ?? 0).getTime(),
};

/* ------------------------------------------------------------------ */

export default function useUsers() {
    /* ---------- Data ---------- */

    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState("");
    const [users, setUsers] = useState([]);

    /* ---------- Filtres ---------- */

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [roleFilter, setRoleFilter] = useState("ALL");

    const [sort, setSort] = useState({
        key: "createdAt",
        direction: "desc",
    });

    /* ---------- Pagination ---------- */

    const [page, setPage] = useState(1);

    /* =========================================================
       Chargement
    ========================================================= */

    const loadUsers = useCallback(async () => {
        setLoading(true);
        setServerError("");

        try {
            const result = await service.getUsers();

            if (!result.success) {
                setServerError(
                    result.message || "Impossible de charger le personnel."
                );
                setUsers([]);
                return;
            }

            const payload = result.data?.items ?? result.data ?? [];
            setUsers(payload);
        } catch (error) {
            setServerError(
                error.message || "Impossible de charger le personnel."
            );
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    /* =========================================================
       Tri
    ========================================================= */

    const handleSort = useCallback((key) => {
        setSort((prev) => ({
            key,
            direction:
                prev.key === key && prev.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    }, []);

    /* =========================================================
       Filtrage + tri
    ========================================================= */

    const filteredUsers = useMemo(() => {
        let data = [...users];

        /* Statut */
        if (statusFilter !== "ALL") {
            data = data.filter((u) => u.status === statusFilter);
        }

        /* Rôle */
        if (roleFilter !== "ALL") {
            data = data.filter((u) => u.role === roleFilter);
        }

        /* Recherche */
        const term = search.trim().toLowerCase();
        if (term) {
            data = data.filter((u) => {
                const values = [
                    u.firstName,
                    u.lastName,
                    u.email,
                    u.phone,
                    u.company?.name,
                    u.agency?.name,
                ];

                return values.some((v) =>
                    String(v ?? "").toLowerCase().includes(term)
                );
            });
        }

        /* Tri */
        const accessor =
            SORT_ACCESSORS[sort.key] ?? ((u) => u[sort.key]);

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
    }, [users, search, statusFilter, roleFilter, sort]);

    /* =========================================================
       Pagination
    ========================================================= */

    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);

    const currentPage = Math.min(page, Math.max(1, totalPages));

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredUsers.slice(start, start + PAGE_SIZE);
    }, [filteredUsers, currentPage]);

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
            const target = Math.max(
                1,
                Math.min(nextPage, Math.max(1, totalPages))
            );
            setPage(target);
        },
        [totalPages]
    );

    useEffect(() => {
        setPage(1);
    }, [search, statusFilter, roleFilter, sort]);

    /* =========================================================
       Update — Status
    ========================================================= */

    /**
     * @param {string} id
     * @param {"ACTIVE" | "INACTIVE" | "SUSPENDED"} status
     */
    const updateStatus = useCallback(async (id, status) => {
        try {
            const result = await service.updateStatus(id, status);

            if (!result.success) {
                throw new Error(
                    result.message || "Impossible de modifier le statut."
                );
            }

            setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, status } : u))
            );

            return result;
        } catch (error) {
            setServerError(
                error.message || "Impossible de modifier le statut."
            );
            throw error;
        }
    }, []);

    /* =========================================================
       Update — Role
    ========================================================= */

    /**
     * @param {string} id
     * @param {"COMPANY_ADMIN" | "AGENCY_AGENT" | "CONTROLLER"} role
     */
    const updateRole = useCallback(async (id, role) => {
        try {
            const result = await service.updateRole(id, role);

            if (!result.success) {
                throw new Error(
                    result.message || "Impossible de modifier le rôle."
                );
            }

            setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, role } : u))
            );

            return result;
        } catch (error) {
            setServerError(
                error.message || "Impossible de modifier le rôle."
            );
            throw error;
        }
    }, []);

    /* =========================================================
       Compteurs
    ========================================================= */

    const counts = useMemo(
        () => ({
            all: users.length,

            active: users.filter((u) => u.status === "ACTIVE").length,
            inactive: users.filter((u) => u.status === "INACTIVE").length,
            suspended: users.filter((u) => u.status === "SUSPENDED").length,
            invited: users.filter((u) => u.status === "INVITED").length,

            /* Par rôle */
            companyAdmins: users.filter((u) => u.role === "COMPANY_ADMIN").length,
            agencyAgents: users.filter((u) => u.role === "AGENCY_AGENT").length,
            controllers: users.filter((u) => u.role === "CONTROLLER").length,
        }),
        [users]
    );

    /* =========================================================
       Return
    ========================================================= */

    return {
        /* Data */
        loading,
        serverError,
        users,
        filteredUsers,
        paginatedUsers,
        counts,

        /* Filtres */
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        roleFilter,
        setRoleFilter,

        /* Tri */
        sort,
        handleSort,

        /* Pagination */
        pagination,
        changePage,

        /* Actions */
        updateStatus,
        updateRole,

        /* Refresh */
        refresh: loadUsers,
    };
}