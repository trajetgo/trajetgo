
import { useCallback, useMemo, useState } from "react";

export default function useBoardingScanner({
    passengers = [],
    scanTicket,
}) {
    const [scanning, setScanning] = useState(false);
    const [lastResult, setLastResult] = useState(null);

    const stats = useMemo(() => {
        const total = passengers.length;
        const boarded = passengers.filter(
            (p) => p.status === "BOARDED"
        ).length;

        return {
            total,
            boarded,
            remaining: Math.max(0, total - boarded),
            progress: total > 0 ? (boarded / total) * 100 : 0,
        };
    }, [passengers]);

    const validatedIds = useMemo(
        () =>
            new Set(
                passengers
                    .filter((p) => p.status === "BOARDED")
                    .map((p) => p.id)
            ),
        [passengers]
    );

    const handleScan = useCallback(
        async (qrPayload) => {
            if (!qrPayload || scanning) return null;

            if (typeof scanTicket !== "function") {
                setLastResult({
                    status: "error",
                    message: "Le service de validation est indisponible.",
                    passenger: null,
                });
                return null;
            }

            setScanning(true);

            try {
                const result = await scanTicket(qrPayload);

                setLastResult({
                    status: result?.success ? "success" : "error",
                    message:
                        result?.message ||
                        (result?.success
                            ? "Billet validé avec succès."
                            : "Billet invalide."),
                    passenger: result?.data?.passenger ?? null,
                });

                return result;
            } catch (error) {
                setLastResult({
                    status: "error",
                    message:
                        error.message || "Impossible de valider le billet.",
                    passenger: error.data?.data?.passenger ?? null,
                });

                return null;
            } finally {
                setScanning(false);
            }
        },
        [scanTicket, scanning]
    );

    const clearResult = useCallback(() => {
        setLastResult(null);
    }, []);

    return {
        scanning,
        lastResult,
        stats,
        validatedIds,
        handleScan,
        clearResult,
    };
}
