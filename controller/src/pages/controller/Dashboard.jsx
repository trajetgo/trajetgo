import { useMemo, useState } from "react";
import { QrCode, Users, Volume1, VolumeX, Search } from "lucide-react";

import Loading from "@shared/components/Loading";

import useBoardingDepartures from "../../hooks/useBoardingDepartures";
import useBoardingScanner from "../../hooks/useBoardingScanner";

import TicketScanner from "../../components/scanner/TicketScanner";
import ScanResult from "../../components/scanner/ScanResult";
import PassengerList from "../../components/scanner/PassengerList";

import "../../styles/pages/controller/Dashboard.scss";
import { formatDate } from "../../utils/date.utils";

export default function Dashboard() {
    /* =========================================================
       Départs + Embarquement
    ========================================================= */

    const {
        loading: departuresLoading,
        serverError,                 // ✅ unifié
        departures,
        selected,                    // ✅ existe maintenant
        passengers,                  // ✅ existe
        selectedTripId,              // ✅
        selectTrip,                  // ✅
        scanTicket,                  // ✅ pour le scanner
        finishBoarding,
        finishing,
        refreshDepartures,
    } = useBoardingDepartures();

    /* =========================================================
       Scanner
    ========================================================= */

    const {
        scanning,
        lastResult,
        stats,
        validatedIds,
        handleScan,
        clearResult,
    } = useBoardingScanner({
        passengers,                  // ✅ objet
        scanTicket,                  // ✅ objet
    });

    /* =========================================================
       UI locale
    ========================================================= */

    const [soundEnabled, setSoundEnabled] = useState(true);
    const [passengerSearch, setPassengerSearch] = useState("");

    const filteredPassengers = useMemo(() => {
        const q = passengerSearch.trim().toLowerCase();
        if (!q) return passengers;

        return passengers.filter(
            (p) =>
                p.firstName?.toLowerCase().includes(q) ||
                p.lastName?.toLowerCase().includes(q) ||
                p.seat?.toLowerCase().includes(q) ||
                p.phone?.includes(q)
        );
    }, [passengers, passengerSearch]);

    /* =========================================================
       Loading
    ========================================================= */

    if (departuresLoading) {
        return <Loading message="Chargement des départs..." />;
    }

    /* =========================================================
       Rendu
    ========================================================= */

    return (
        <div className="dashboard">
            {/* ---------- Header ---------- */}

            <header className="dashboard__header">
                <div className="dashboard__header-icon">
                    <QrCode size={28} aria-hidden="true" />
                </div>

                <div className="dashboard__header-text">
                    <h1>Contrôle & Validation d'Embarquement</h1>
                    <p>
                        Vérification des billets par QR code à la montée
                        des passagers et pointage en direct.
                    </p>
                </div>

                {departures.length > 0 && (
                    <div className="dashboard__departure-select">
                        <label htmlFor="departure-select">
                            Départ en cours
                        </label>

                        <select
                            id="departure-select"
                            value={selectedTripId ?? ""}
                            onChange={(e) => selectTrip(e.target.value)}
                        >
                            {departures.map((dep) => (
                                <option key={dep.id} value={dep.id}>
                                    {formatDate(dep.time, "dd MMMM yyyy à HH:mm")} · {dep.originCity} →{" "}
                                    {dep.destinationCity}
                                    {dep.busName ? ` (${dep.busName})` : ""}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </header>

            {/* ---------- Erreur ---------- */}

            {serverError && (
                <div className="dashboard__error" role="alert">
                    {serverError}
                </div>
            )}

            {/* ---------- Aucun départ ---------- */}

            {departures.length === 0 && (
                <div className="dashboard__empty">
                    <QrCode size={48} aria-hidden="true" />
                    <h2>Aucun départ aujourd'hui</h2>
                    <p>
                        Les départs programmés apparaîtront ici dès
                        qu'ils seront disponibles.
                    </p>
                    <button
                        type="button"
                        onClick={refreshDepartures}
                        className="dashboard__refresh"
                    >
                        Rafraîchir
                    </button>
                </div>
            )}

            {/* ---------- Contenu principal ---------- */}

            {selected && (
                <>
                    {/* ---------- Stats ---------- */}

                    <section
                        className="dashboard__stats"
                        aria-label="Statistiques d'embarquement"
                    >
                        <StatCard
                            label="Car & Chauffeur"
                            primary={selected.busName ?? "—"}
                            secondary={`${formatDate(selected.time, "dd MMMM yyyy à HH:mm")} · ${selected.driverName ?? "Chauffeur non assigné"
                                }`}
                        />

                        <StatCard
                            label="Passagers validés"
                            primary={`${stats.boarded} / ${stats.total}`}
                            progress={stats.progress}
                        />

                        <StatCard
                            label="Restant à quai"
                            primary={
                                stats.remaining === 0
                                    ? "Tout le monde est à bord !"
                                    : `${stats.remaining} passager${stats.remaining > 1 ? "s" : ""
                                    }`
                            }
                            highlight={stats.remaining === 0}
                        />
                    </section>

                    {/* ---------- Scanner ---------- */}

                    <section className="dashboard__scanner">
                        <header className="dashboard__scanner-header">
                            <h2>
                                <QrCode size={20} aria-hidden="true" />
                                Zone de scan optique
                            </h2>

                            <button
                                type="button"
                                className="dashboard__sound-toggle"
                                onClick={() => setSoundEnabled((v) => !v)}
                                aria-pressed={soundEnabled}
                            >
                                {soundEnabled ? (
                                    <>
                                        <Volume1 size={16} />
                                        Signal sonore actif
                                    </>
                                ) : (
                                    <>
                                        <VolumeX size={16} />
                                        Signal sonore coupé
                                    </>
                                )}
                            </button>
                        </header>

                        <TicketScanner
                            onScan={handleScan}
                            scanning={scanning}
                            soundEnabled={soundEnabled}
                        />

                        <ScanResult
                            result={lastResult}
                            onDismiss={clearResult}
                        />
                    </section>

                    {/* ---------- Liste des passagers ---------- */}

                    <section className="dashboard__passengers">
                        <header className="dashboard__passengers-header">
                            <h2>
                                <Users size={20} aria-hidden="true" />
                                Liste des passagers ({passengers.length})
                            </h2>

                            <span className="dashboard__passengers-count">
                                {stats.boarded} monté
                                {stats.boarded > 1 ? "s" : ""}
                            </span>
                        </header>

                        <div className="dashboard__passengers-search">
                            <Search size={16} aria-hidden="true" />
                            <input
                                type="search"
                                placeholder="Rechercher un passager..."
                                value={passengerSearch}
                                onChange={(e) =>
                                    setPassengerSearch(e.target.value)
                                }
                                aria-label="Rechercher un passager"
                            />
                        </div>

                        <PassengerList
                            passengers={filteredPassengers}
                            validatedIds={validatedIds}
                        />
                    </section>
                </>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Sous-composant StatCard                                             */
/* ------------------------------------------------------------------ */

function StatCard({ label, primary, secondary, progress, highlight }) {
    return (
        <div
            className={`stat-card ${highlight ? "stat-card--highlight" : ""}`}
        >
            <span className="stat-card__label">{label}</span>
            <p className="stat-card__primary">{primary}</p>

            {secondary && (
                <p className="stat-card__secondary">{secondary}</p>
            )}

            {typeof progress === "number" && (
                <div
                    className="stat-card__progress"
                    role="progressbar"
                    aria-valuenow={Math.round(progress)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <div
                        className="stat-card__progress-bar"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}