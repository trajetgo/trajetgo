import { useEffect, useRef, useState, useId } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff, CheckCircle } from "lucide-react";

import "../../styles/components/scanner/TicketScanner.scss";

export default function TicketScanner({
    onScan,
    scanning = false,
    soundEnabled = true,
}) {
    const reactId = useId().replace(/:/g, "");
    const regionId = `ticket-scanner-${reactId}`;

    const scannerRef = useRef(null);
    const onScanRef = useRef(onScan);
    const processingRef = useRef(false);
    const startingRef = useRef(false);
    const resetTimerRef = useRef(null);

    const [cameraActive, setCameraActive] = useState(false);
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState(null); // "success" | "error"
    const [starting, setStarting] = useState(false);

    useEffect(() => {
        onScanRef.current = onScan;
    }, [onScan]);

    const playBeep = () => {
        if (!soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.value = 0.1;
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch { }
    };

    const stopCamera = async () => {
        const scanner = scannerRef.current;
        scannerRef.current = null;

        if (!scanner) {
            setCameraActive(false);
            return;
        }

        try {
            if (scanner.isScanning) {
                await scanner.stop(); // Must stop first
            }
        } catch (err) {
            console.error("Erreur arrêt caméra :", err);
        }

        try {
            scanner.clear(); // Then clear
        } catch { }

        setCameraActive(false);
    };


    const startCamera = async () => {
        if (scannerRef.current || startingRef.current) return;

        startingRef.current = true;
        setStarting(true);
        setError("");
        setFeedback(null);

        let scanner = null;

        try {
            // Laisse au navigateur le temps de libérer une caméra précédente.
            await new Promise((resolve) => setTimeout(resolve, 300));

            const cameras = await Html5Qrcode.getCameras();

            if (!cameras.length) {
                throw new Error("NO_CAMERA");
            }

            const virtualCameraPattern =
                /virtual|obs|manycam|snap camera|droidcam|iriun|camo|vcam/i;

            const physicalCameraPattern =
                /integrated camera|webcam|hd camera|usb camera|facetime/i;

            const camera =
                cameras.find(
                    (item) =>
                        physicalCameraPattern.test(item.label) &&
                        !virtualCameraPattern.test(item.label)
                ) ||
                cameras.find(
                    (item) => !virtualCameraPattern.test(item.label)
                ) ||
                cameras[0];

            scanner = new Html5Qrcode(regionId);
            scannerRef.current = scanner;

            const config = {
                fps: 8,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1,
            };

            const onDecoded = async (decodedText) => {
                if (processingRef.current) return;

                processingRef.current = true;

                try {
                    await handleScanSuccess(decodedText);

                    playBeep()
                } catch (err) {
                    console.error("Erreur de validation :", err);
                    setError(
                        err.message || "Impossible de valider le billet."
                    );
                } finally {
                    // Évite les lectures multiples du même QR.
                    resetTimerRef.current = setTimeout(() => {
                        processingRef.current = false;
                    }, 1200);
                }
            };

            // Une seule nouvelle tentative après un AbortError.
            for (let attempt = 0; attempt < 2; attempt++) {
                try {
                    await scanner.start(
                        camera.id,
                        config,
                        onDecoded,
                        () => { }
                    );

                    setCameraActive(true);
                    return;
                } catch (err) {
                    console.error(
                        `Échec démarrage caméra (${attempt + 1}/2)`,
                        err
                    );

                    if (attempt === 1 || err.name !== "AbortError") {
                        throw err;
                    }

                    // Nettoyer avant de retenter.
                    try {
                        if (scanner.isScanning) {
                            await scanner.stop();
                        }
                    } catch { }

                    try {
                        scanner.clear();
                    } catch { }

                    scanner = null;
                    scannerRef.current = null;

                    await new Promise((resolve) =>
                        setTimeout(resolve, 1500)
                    );

                    scanner = new Html5Qrcode(regionId);
                    scannerRef.current = scanner;
                }
            }
        } catch (err) {
            console.error("Erreur caméra :", err);

            if (err.message === "NO_CAMERA") {
                setError("Aucune caméra détectée sur cet appareil.");
            } else if (
                err.name === "NotAllowedError" ||
                err.name === "PermissionDeniedError"
            ) {
                setError("Autorisez l'accès à la caméra dans votre navigateur.");
            } else if (
                err.name === "NotFoundError" ||
                err.name === "DevicesNotFoundError"
            ) {
                setError("Aucune caméra compatible n'a été trouvée.");
            } else if (
                err.name === "NotReadableError" ||
                err.name === "TrackStartError"
            ) {
                setError(
                    "La caméra est indisponible. Fermez les autres applications qui l'utilisent, puis réessayez."
                );
            } else {
                setError(
                    "Impossible de démarrer la caméra. Vérifiez les permissions, fermez les autres applications utilisant la caméra, puis réessayez."
                );
            }

            if (scanner) {
                try {
                    if (scanner.isScanning) {
                        await scanner.stop();
                    }
                } catch { }

                try {
                    scanner.clear();
                } catch { }
            }

            scannerRef.current = null;
            setCameraActive(false);
        } finally {
            startingRef.current = false;
            setStarting(false);
        }
    };


    useEffect(() => {
        return () => {
            clearTimeout(resetTimerRef.current);
            const scanner = scannerRef.current;
            scannerRef.current = null;
            if (!scanner) return;
            (async () => {
                try {
                    if (scanner.isScanning) await scanner.stop();
                } catch { }
                try { scanner.clear(); } catch { }
            })();
        };
    }, []);

    const handleScanSuccess = async (decodedText) => {
        await stopCamera();

        try {
            const result = await onScanRef.current?.(decodedText);

            setFeedback(result?.success ? "success" : "error");

            if (!result?.success) {
                setError(result?.message || "Billet invalide.");
            } else {
                setError("");
            }
        } finally {
            // La caméra reste arrêtée jusqu'à la prochaine activation.
            processingRef.current = false;
        }
    };

    return (
        <div className="ticket-scanner">
            <div
                id={regionId}
                className="ticket-scanner__viewport"
                aria-label="Zone de scan du QR code"
            />

            {error && (
                <p className="ticket-scanner__error" role="alert">
                    {error}
                </p>
            )}

            {feedback === "success" && (
                <p className="ticket-scanner__success" role="status">
                    <CheckCircle size={16} /> Billet validé
                </p>
            )}

            <div className="ticket-scanner__actions">
                {!cameraActive ? (
                    <button
                        type="button"
                        onClick={startCamera}
                        disabled={starting || scanning}
                    >
                        <Camera size={18} />
                        {starting ? "Démarrage..." : "Activer la caméra"}
                    </button>
                ) : (
                    <button type="button" onClick={stopCamera}>
                        <CameraOff size={18} />
                        Arrêter la caméra
                    </button>
                )}
            </div>

            <p className="ticket-scanner__hint">
                Placez le QR code du billet dans le cadre pour le scanner.
            </p>
        </div>
    );
}