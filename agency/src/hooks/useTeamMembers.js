import { useCallback, useEffect, useMemo, useState } from "react";
import service from "../services/teams.service";

export default function useTeamMembers() {
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const [teams, setTeams] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL"); // ACTIVE, INACTIVE, SUSPENDED
    const [roleFilter, setRoleFilter] = useState("ALL"); // AGENCY_AGENT, CONTROLLER, COMPANY_ADMIN

    const [sort, setSort] = useState({
        key: "createdAt",
        direction: "desc",
    });

    const fetchTeams = useCallback(async () => {
        setLoading(true);
        setServerError("");

        try {
            const result = await service.getTeams();

            if (!result.success) {
                setServerError(
                    result.message ||
                    "Impossible de charger le personnel."
                );

                setTeams([]);
                return;
            }

            setTeams(result.data?.members || []);
        } catch (error) {
            setServerError(
                error.message ||
                "Impossible de charger le personnel."
            );

            setTeams([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    const filteredTeams = useMemo(() => {
        let data = [...teams];

        if (statusFilter !== "ALL") {
            data = data.filter(
                (team) => team.status === statusFilter
            );
        }

        if (roleFilter !== "ALL") {
            data = data.filter(
                (team) => team.role === roleFilter
            );
        }

        const term = search.trim().toLowerCase();

        if (term) {
            data = data.filter((team) => {
                const searchableValues = [
                    team.id,
                    team.member?.firstName,
                    team.member?.lastName,
                    team.member?.phone,
                    team.member?.email,
                    team.role,
                    team.status
                ];

                return searchableValues.some((value) =>
                    String(value || "")
                        .toLowerCase()
                        .includes(term)
                );
            });
        }

        data.sort((a, b) => {
            const aValue = a[sort.key];
            const bValue = b[sort.key];

            if (
                aValue === null ||
                aValue === undefined
            ) {
                return 1;
            }

            if (
                bValue === null ||
                bValue === undefined
            ) {
                return -1;
            }

            if (aValue < bValue) {
                return sort.direction === "asc"
                    ? -1
                    : 1;
            }

            if (aValue > bValue) {
                return sort.direction === "asc"
                    ? 1
                    : -1;
            }

            return 0;
        });

        return data;
    }, [
        teams,
        search,
        statusFilter,
        roleFilter,
        sort
    ]);

    const handleSort = (key) => {
        setSort((previous) => ({
            key,
            direction:
                previous.key === key &&
                    previous.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    const updateStatus = async (id, status) => {
        try {
            const result =
                await service.updateStatus(
                    id,
                    status
                );

            if (!result.success) {
                throw new Error(
                    result.message ||
                    "Impossible de modifier le statut."
                );
            }

            setTeams((previous) =>
                previous.map((team) =>
                    team.id === id
                        ? {
                            ...team,
                            status,
                        }
                        : team
                )
            );

            return result;

        } catch (error) {
            setServerError(
                error.message ||
                "Impossible de modifier le statut."
            );

            throw error;
        }
    };

    const updateRole = async (id, role) => {
        try {
            const result =
                await service.updateRole(
                    id,
                    role
                );

            if (!result.success) {
                throw new Error(
                    result.message ||
                    "Impossible de modifier le rôle."
                );
            }

            setTeams((previous) =>
                previous.map((team) =>
                    team.id === id
                        ? {
                            ...team,
                            role
                        }
                        : team
                )
            );

            return result;

        } catch (error) {
            setServerError(
                error.message ||
                "Impossible de modifier le statut."
            );

            throw error;
        }
    };

    return {
        loading,

        teams,
        filteredTeams,

        serverError,

        search,
        setSearch,

        statusFilter,
        setStatusFilter,

        roleFilter,
        setRoleFilter,

        sort,
        handleSort,

        updateRole,
        updateStatus,

        refresh: fetchTeams
    };
}
