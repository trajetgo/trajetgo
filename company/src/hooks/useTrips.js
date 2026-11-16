import { useCallback, useEffect, useMemo, useState } from "react";
import service from "../services/trips.service";

export default function useTrips() {
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const [trips, setTrips] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [sort, setSort] = useState({
        key: "date",
        direction: "desc",
    });

    const fetchTrips = useCallback(async () => {
        setLoading(true);
        setServerError("");

        try {
            const result = await service.getTrips();

            if (!result.success) {
                setServerError(
                    result.message ||
                    "Impossible de charger les voyages."
                );

                setTrips([]);
                return;
            }

            setTrips(result.data || []);

        } catch (error) {
            setServerError(
                error.message ||
                "Impossible de charger les voyages."
            );

            setTrips([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrips();
    }, [fetchTrips]);

    const filteredTrips = useMemo(() => {
        let data = [...trips];

        // -------------------------------------------------
        // Filtre statut
        // -------------------------------------------------

        if (statusFilter !== "ALL") {
            data = data.filter(
                (trip) =>
                    trip.status === statusFilter
            );
        }

        // -------------------------------------------------
        // Recherche
        // -------------------------------------------------

        const term = search
            .trim()
            .toLowerCase();

        if (term) {
            data = data.filter((trip) => {
                const searchableValues = [
                    trip.id,
                    trip.departure?.city,
                    trip.arrival?.city,
                    trip.bus?.name,
                    trip.status,
                    trip.date,
                ];

                return searchableValues.some((value) =>
                    String(value || "")
                        .toLowerCase()
                        .includes(term)
                );
            });
        }

        // -------------------------------------------------
        // Tri
        // -------------------------------------------------

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
        trips,
        search,
        statusFilter,
        sort,
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

            setTrips((previous) =>
                previous.map((trip) =>
                    trip.id === id
                        ? {
                            ...trip,
                            status,
                        }
                        : trip
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

        trips,
        filteredTrips,

        serverError,

        search,
        setSearch,

        statusFilter,
        setStatusFilter,

        sort,
        handleSort,

        updateStatus,

        refresh: fetchTrips,
    };
}