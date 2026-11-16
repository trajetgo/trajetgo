import { useCallback, useEffect, useMemo, useState } from "react";
import service from "../services/boarding.service";

export default function useBoardingDepartures() {
    const [departures, setDepartures] = useState([]);
    const [selectedTripId, setSelectedTripId] = useState("");
    const [boarding, setBoarding] = useState(null);

    const [loading, setLoading] = useState(true);
    const [boardingLoading, setBoardingLoading] = useState(false);
    const [scanLoading, setScanLoading] = useState(false);
    const [finishing, setFinishing] = useState(false);

    const [serverError, setServerError] = useState("");

    /* =========================================================
       Charger les départs du jour
    ========================================================= */

    const loadDepartures = useCallback(async () => {
        setLoading(true);
        setServerError("");

        try {
            const result = await service.getTodayDepartures();

            if (result.success) {
                const list = result.data ?? [];
                setDepartures(list);

                // Auto-sélection du premier départ
                if (list.length > 0 && !selectedTripId) {
                    setSelectedTripId(list[0].id);
                }
            } else {
                setServerError(
                    result.message || "Impossible de charger les départs."
                );
            }
        } catch (error) {
            setServerError(
                error.message || "Impossible de charger les départs."
            );
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* =========================================================
       Charger l'embarquement d'un voyage
    ========================================================= */

    const loadBoarding = useCallback(async (tripId) => {
        if (!tripId) {
            setBoarding(null);
            return;
        }

        setBoardingLoading(true);
        setServerError("");

        try {
            const result = await service.getBoarding(tripId);

            if (result.success) {
                setBoarding(result.data);
            } else {
                setServerError(
                    result.message || "Impossible de charger l'embarquement."
                );
            }
        } catch (error) {
            setServerError(
                error.message || "Impossible de charger l'embarquement."
            );
        } finally {
            setBoardingLoading(false);
        }
    }, []);

    /* =========================================================
       Charger l'embarquement quand le voyage change
    ========================================================= */

    useEffect(() => {
        if (selectedTripId) {
            loadBoarding(selectedTripId);
        }
    }, [selectedTripId, loadBoarding]);

    /* =========================================================
       Charger les départs au montage
    ========================================================= */

    useEffect(() => {
        loadDepartures();
    }, [loadDepartures]);

    /* =========================================================
       Sélectionner un voyage
    ========================================================= */

    const selectTrip = useCallback((tripId) => {
        setSelectedTripId(tripId);
    }, []);

    /* =========================================================
       Scanner un billet
    ========================================================= */

    const scanTicket = useCallback(
        async (qrCode) => {
            if (!selectedTripId) {
                throw new Error("Veuillez sélectionner un départ.");
            }

            setScanLoading(true);
            setServerError("");

            try {
                const result = await service.scanTicket(
                    selectedTripId,
                    qrCode
                );

                if (result.success) {
                    // Recharger le boarding pour voir le passager à jour
                    await loadBoarding(selectedTripId);
                }

                return result;
            } catch (error) {
                setServerError(
                    error.message || "Impossible de valider le billet."
                );
                throw error;
            } finally {
                setScanLoading(false);
            }
        },
        [selectedTripId, loadBoarding]
    );

    /* =========================================================
       Terminer l'embarquement
    ========================================================= */

    const finishBoarding = useCallback(async () => {
        if (!selectedTripId) {
            throw new Error("Veuillez sélectionner un départ.");
        }

        setFinishing(true);
        setServerError("");

        try {
            const result = await service.finishBoarding(selectedTripId);

            if (result.success) {
                await loadBoarding(selectedTripId);
            }

            return result;
        } catch (error) {
            setServerError(
                error.message || "Impossible de terminer l'embarquement."
            );
            throw error;
        } finally {
            setFinishing(false);
        }
    }, [selectedTripId, loadBoarding]);

    /* =========================================================
       Données dérivées
    ========================================================= */

    const selected = useMemo(
        () => departures.find((d) => d.id === selectedTripId) ?? null,
        [departures, selectedTripId]
    );

    const passengers = boarding?.passengers ?? [];

    /* =========================================================
       Return
    ========================================================= */

    return {
        // Données
        departures,
        selected, // objet départ enrichi
        boarding, // détail embarquement (passengers, bus, etc.)
        passengers, // raccourci

        selectedTripId, // id sélectionné

        // États
        loading,
        boardingLoading,
        scanLoading,
        finishing,
        serverError,

        // Actions
        selectTrip,
        scanTicket,
        finishBoarding,

        // Refresh
        refreshDepartures: loadDepartures,
        refreshBoarding: () => loadBoarding(selectedTripId),
    };
}