import { useCallback, useEffect, useMemo, useState } from "react";
import service from "../services/locations.service";

/* ------------------------------------------------------------------ */
/* Tri : accesseurs par type                                          */
/* ------------------------------------------------------------------ */

const SORT_ACCESSORS = {
    name: (item) => (item.name ?? "").toLowerCase(),
    code: (item) => (item.code ?? "").toLowerCase(),
    country: (item) => (item.country?.name ?? "").toLowerCase(),
    createdAt: (item) => new Date(item.createdAt ?? 0).getTime(),
};

/* ------------------------------------------------------------------ */

export default function useLocations(type) {
    const [loading, setLoading] = useState(Boolean(type));
    const [locations, setLocations] = useState([]);
    const [serverError, setServerError] = useState("");

    const [search, setSearch] = useState("");

    const [sort, setSort] = useState({
        key: "name",
        direction: "asc",
    });

    /* ---------------------------------------------------------------- */
    /* Fetch initial                                                    */
    /* ---------------------------------------------------------------- */

    const fetchLocations = useCallback(async () => {
        if (!type) {
            setLocations([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setServerError("");

        try {
            const result = await service.getLocationsByType(type);

            if (!result.success) {
                setLocations([]);
                setServerError(
                    result.message ||
                    "Impossible de charger les lieux."
                );
                return;
            }

            setLocations(result.data || []);
        } catch (error) {
            setLocations([]);
            setServerError(
                error.message ||
                "Impossible de charger les lieux."
            );
        } finally {
            setLoading(false);
        }
    }, [type]);

    /* ---------------------------------------------------------------- */
    /* Chargement initial                                               */
    /* ---------------------------------------------------------------- */

    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    /* ---------------------------------------------------------------- */
    /* Recherche serveur des villes                                     */
    /* ---------------------------------------------------------------- */

    useEffect(() => {
        // La recherche serveur concerne uniquement les villes
        if (type !== "city") {
            return;
        }

        const term = search.trim();

        // Pas assez de caractères
        if (term.length < 2) {
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setLoading(true);
                setServerError("");

                const result = await service.searchCities(term);

                if (!result.success) {
                    setLocations([]);
                    setServerError(
                        result.message ||
                        "Impossible de rechercher les villes."
                    );
                    return;
                }

                setLocations(result.data || []);
            } catch (error) {
                setLocations([]);
                setServerError(
                    error.message ||
                    "Impossible de rechercher les villes."
                );
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, type]);

    /* ---------------------------------------------------------------- */
    /* Tri                                                               */
    /* ---------------------------------------------------------------- */

    const handleSort = useCallback((key) => {
        setSort((prev) => ({
            key,
            direction:
                prev.key === key && prev.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    }, []);

    /* ---------------------------------------------------------------- */
    /* Filtre + tri                                                     */
    /* ---------------------------------------------------------------- */

    const filtered = useMemo(() => {
        let data = [...locations];

        /*
         * Pour les villes, la recherche est déjà effectuée
         * côté serveur.
         *
         * Pour les autres types, on conserve la recherche locale.
         */
        if (type !== "city") {
            const q = search.trim().toLowerCase();

            if (q) {
                data = data.filter((location) => {
                    const name =
                        (location.name ?? "").toLowerCase();

                    const code =
                        (location.code ?? "").toLowerCase();

                    const country =
                        (location.country?.name ?? "").toLowerCase();

                    return (
                        name.includes(q) ||
                        code.includes(q) ||
                        country.includes(q)
                    );
                });
            }
        }

        /* Tri */

        const accessor =
            SORT_ACCESSORS[sort.key] ??
            ((location) => location[sort.key]);

        data.sort((a, b) => {
            const aVal = accessor(a);
            const bVal = accessor(b);

            if (aVal == null) return 1;
            if (bVal == null) return -1;

            if (aVal < bVal) {
                return sort.direction === "asc" ? -1 : 1;
            }

            if (aVal > bVal) {
                return sort.direction === "asc" ? 1 : -1;
            }

            return 0;
        });

        return data;
    }, [locations, search, sort, type]);

    /* ---------------------------------------------------------------- */
    /* Return                                                            */
    /* ---------------------------------------------------------------- */

    return {
        loading,

        locations,
        filtered,

        search,
        setSearch,

        sort,
        handleSort,

        serverError,

        refresh: fetchLocations,
    };
}