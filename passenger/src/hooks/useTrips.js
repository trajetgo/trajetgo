import { useCallback, useEffect, useMemo, useState } from "react";
import service from "../services/trips.service";

const INITIAL_FILTERS = {
    sortBy: "departureAt",
    sortOrder: "asc",
    minPrice: "",
    maxPrice: "",
};

export default function useTrips(params) {
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const [trips, setTrips] = useState([]);

    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const childrenParam = Array.isArray(params.children)
        ? params.children.join(",")
        : "";

    useEffect(() => {
        if (!params.enabled) {
            setTrips([]);
            setServerError("");
            setLoading(false);
            return;
        }

        let cancelled = false;

        const fetchTrips = async () => {
            setLoading(true);
            setServerError("");

            try {
                const result = await service.searchTrips({
                    from: params.from,
                    to: params.to,
                    date: params.date,
                    adults: params.adults,
                    children: childrenParam,
                });

                if (!cancelled) {
                    setTrips(result.data ?? []);
                }
            } catch (error) {
                if (!cancelled) {
                    setTrips([]);
                    setServerError(
                        error.message || "Impossible de récupérer les voyages."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchTrips();

        return () => {
            cancelled = true;
        };
    }, [
        params.enabled,
        params.from,
        params.to,
        params.date,
        params.adults,
        childrenParam,
    ]);

    const handleFilterChange = useCallback((key, value) => {
        if (key === "reset") {
            setFilters(INITIAL_FILTERS);
            return;
        }

        // ✅ Batch update : accepter un objet
        if (typeof key === "object") {
            setFilters((prev) => ({ ...prev, ...key }));
            return;
        }

        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    const activeFiltersCount = useMemo(() => {
        let count = 0;

        if (filters.minPrice !== "") count++;
        if (filters.maxPrice !== "") count++;

        if (
            filters.sortBy !== INITIAL_FILTERS.sortBy ||
            filters.sortOrder !== INITIAL_FILTERS.sortOrder
        ) {
            count++;
        }

        return count;
    }, [filters]);

    const filteredTrips = useMemo(() => {
        let data = [...trips];

        // filtres prix
        if (filters.minPrice !== "") {
            data = data.filter(
                (trip) => Number(trip.price) >= Number(filters.minPrice)
            );
        }

        if (filters.maxPrice !== "") {
            data = data.filter(
                (trip) => Number(trip.price) <= Number(filters.maxPrice)
            );
        }

        // tri
        data.sort((a, b) => {
            let comparison = 0;

            if (filters.sortBy === "price") {
                comparison = Number(a.price) - Number(b.price);
            } else if (filters.sortBy === "arrivalAt") {
                comparison =
                    new Date(a.arrivalAt).getTime() -
                    new Date(b.arrivalAt).getTime();
            } else if (filters.sortBy === "duration") {
                // ✅ Durée en minutes
                const aDuration =
                    a.departureAt && a.arrivalAt
                        ? new Date(a.arrivalAt).getTime() -
                        new Date(a.departureAt).getTime()
                        : 0;
                const bDuration =
                    b.departureAt && b.arrivalAt
                        ? new Date(b.arrivalAt).getTime() -
                        new Date(b.departureAt).getTime()
                        : 0;

                comparison = aDuration - bDuration;
            } else {
                comparison =
                    new Date(a.departureAt).getTime() -
                    new Date(b.departureAt).getTime();
            }

            return filters.sortOrder === "desc" ? -comparison : comparison;
        });

        return data;
    }, [trips, filters]);

    return {
        loading,
        trips,
        filteredTrips,
        filters,
        handleFilterChange,
        activeFiltersCount,
        serverError,
    };
}