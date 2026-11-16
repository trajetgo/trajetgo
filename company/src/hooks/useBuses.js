import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import service from "../services/buses.service";

export default function useBuses() {
    const [loading, setLoading] = useState(true);
    const [buses, setBuses] = useState([]);
    const [serverError, setServerError] = useState("");

    const [statusFilter, setStatusFilter] = useState("ALL");
    const [search, setSearch] = useState("");

    const [sort, setSort] = useState({
        key: "createdAt",
        direction: "desc",
    });

    // =====================================================
    // Chargement
    // =====================================================

    const fetchBuses = useCallback(async () => {
        setLoading(true);
        setServerError("");

        try {
            const result = await service.getBuses();

            if (!result.success) {
                setBuses([]);

                setServerError(
                    result.message ||
                    "Impossible de charger les bus."
                );

                return;
            }

            setBuses(result.data || []);
        } catch (error) {
            setBuses([]);

            setServerError(
                error.message ||
                "Impossible de charger les bus."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBuses();
    }, [fetchBuses]);

    // =====================================================
    // Filtres + recherche + tri
    // =====================================================

    const filteredBuses = useMemo(() => {
        let data = [...buses];

        // -------------------------------------------------
        // Filtre statut
        // -------------------------------------------------

        if (statusFilter !== "ALL") {
            data = data.filter(
                (bus) =>
                    bus.status === statusFilter
            );
        }

        // -------------------------------------------------
        // Recherche
        // -------------------------------------------------

        const term = search
            .trim()
            .toLowerCase();

        if (term) {
            data = data.filter((bus) => {
                const searchableValues = [
                    bus.id,
                    bus.name,
                    bus.registrationNumber,
                    bus.capacity,
                    bus.status,
                ];

                return searchableValues.some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(term)
                );
            });
        }

        // -------------------------------------------------
        // Tri
        // -------------------------------------------------

        data.sort((a, b) => {
            const aValue = a?.[sort.key];
            const bValue = b?.[sort.key];

            // Valeurs absentes
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

            // Dates
            if (
                sort.key === "createdAt" ||
                sort.key === "updatedAt"
            ) {
                const aDate = new Date(aValue).getTime();
                const bDate = new Date(bValue).getTime();

                if (aDate < bDate) {
                    return sort.direction === "asc"
                        ? -1
                        : 1;
                }

                if (aDate > bDate) {
                    return sort.direction === "asc"
                        ? 1
                        : -1;
                }

                return 0;
            }

            // Nombres
            if (sort.key === "capacity") {
                const aNumber = Number(aValue);
                const bNumber = Number(bValue);

                if (aNumber < bNumber) {
                    return sort.direction === "asc"
                        ? -1
                        : 1;
                }

                if (aNumber > bNumber) {
                    return sort.direction === "asc"
                        ? 1
                        : -1;
                }

                return 0;
            }

            // Texte
            const aText = String(aValue)
                .toLowerCase();

            const bText = String(bValue)
                .toLowerCase();

            if (aText < bText) {
                return sort.direction === "asc"
                    ? -1
                    : 1;
            }

            if (aText > bText) {
                return sort.direction === "asc"
                    ? 1
                    : -1;
            }

            return 0;
        });

        return data;
    }, [
        buses,
        search,
        statusFilter,
        sort
    ]);

    // =====================================================
    // Tri
    // =====================================================

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

    // =====================================================
    // Modification du statut
    // =====================================================

    const updateStatus = async (id, status) => {
        setServerError("");

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

            setBuses((previous) =>
                previous.map((bus) =>
                    bus.id === id
                        ? {
                            ...bus,
                            status,
                        }
                        : bus
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

        buses,
        filteredBuses,

        serverError,

        search,
        setSearch,

        statusFilter,
        setStatusFilter,

        sort,
        handleSort,

        updateStatus,

        refresh: fetchBuses,
    };
}