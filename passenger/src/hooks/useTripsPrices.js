import { useEffect, useMemo, useState } from "react";
import service from "../services/trips.service";

export default function useTripsPrices({
    from,
    to,
    date,
    range = 2,
    enabled = true,
}) {
    const [loading, setLoading] = useState(false);
    const [prices, setPrices] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!enabled || !from || !to || !date) {
            setPrices([]);
            return;
        }

        let cancelled = false;

        const fetchPrices = async () => {
            setLoading(true);
            setError("");

            try {
                const result = await service.getPricesAroundDate({
                    from,
                    to,
                    date,
                    range,
                });

                if (!cancelled) {
                    setPrices(result.data ?? []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Erreur de chargement des prix.");
                    setPrices([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchPrices();

        return () => {
            cancelled = true;
        };
    }, [from, to, date, range, enabled]);

    /* ✅ Détecter le prix minimum */
    const minPrice = useMemo(() => {
        const valid = prices
            .map((p) => p.minPrice)
            .filter((v) => v != null);

        return valid.length > 0 ? Math.min(...valid) : null;
    }, [prices]);

    return { loading, prices, minPrice, error };
}