import { useState } from "react";
import {
    Bus,
    Armchair,
    Calendar,
    Hash,
    Users,
    Gauge,
} from "lucide-react";

import Modal from "@shared/components/ui/Modal";
import { formatDate } from "@shared/utils/date.utils";

import { getBusStatus } from "../../utils/bus.utils";

import "../../styles/components/bus/BusDetailsModal.scss";

/* ------------------------------------------------------------------ */
/* Onglets                                                             */
/* ------------------------------------------------------------------ */

const TABS = [
    { key: "info", label: "Informations" },
    { key: "seats", label: "Sièges" },
    { key: "history", label: "Historique" },
];

/* ------------------------------------------------------------------ */

export default function BusDetailsModal({ open, bus, onClose }) {
    const [activeTab, setActiveTab] = useState("info");

    if (!bus) return null;

    const status = getBusStatus(bus.status);

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={bus.name || bus.registrationNumber}
            size="lg"
        >
            <div className="bus-details">
                {/* ---------- En-tête ---------- */}

                <header className="bus-details__header">
                    <div className="bus-details__identity">
                        <div className="bus-details__icon">
                            <Bus size={24} aria-hidden="true" />
                        </div>

                        <div>
                            <h3>{bus.name || "Bus sans nom"}</h3>
                            <p>{bus.registrationNumber}</p>
                        </div>
                    </div>

                    <span
                        className={`badge badge--${status.className}`}
                    >
                        {status.label}
                    </span>
                </header>

                {/* ---------- Onglets ---------- */}

                <nav
                    className="bus-details__tabs"
                    role="tablist"
                    aria-label="Sections du bus"
                >
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === tab.key}
                            className={`bus-details__tab ${
                                activeTab === tab.key
                                    ? "bus-details__tab--active"
                                    : ""
                            }`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* ---------- Contenu ---------- */}

                <section className="bus-details__content">
                    {activeTab === "info" && <InfoTab bus={bus} />}
                    {activeTab === "seats" && <SeatsTab bus={bus} />}
                    {activeTab === "history" && <HistoryTab bus={bus} />}
                </section>
            </div>
        </Modal>
    );
}

/* ------------------------------------------------------------------ */
/* Onglet Informations                                                 */
/* ------------------------------------------------------------------ */

function InfoTab({ bus }) {
    return (
        <div className="bus-details__grid">
            <DetailItem
                icon={Hash}
                label="Immatriculation"
                value={bus.registrationNumber}
            />

            <DetailItem
                icon={Users}
                label="Capacité"
                value={`${bus.capacity ?? 0} places`}
            />

            <DetailItem
                icon={Gauge}
                label="Modèle / Nom"
                value={bus.name || "—"}
            />

            <DetailItem
                icon={Calendar}
                label="Ajouté le"
                value={formatDate(bus.createdAt, "dd MMMM yyyy")}
            />

            {bus.updatedAt && (
                <DetailItem
                    icon={Calendar}
                    label="Dernière modification"
                    value={formatDate(bus.updatedAt, "dd MMMM yyyy")}
                />
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Onglet Sièges                                                       */
/* ------------------------------------------------------------------ */

function SeatsTab({ bus }) {
    const layout = bus.seatLayout;

    if (!layout) {
        return (
            <div className="bus-details__empty">
                <Armchair size={36} aria-hidden="true" />
                <h4>Aucun plan de sièges configuré</h4>
                <p>
                    Utilisez l'action « Gérer les sièges » pour définir la
                    disposition du bus.
                </p>
            </div>
        );
    }

    const { rows = 0, columns = 0, aisleAfterColumn, excludedSeats = [] } =
        layout;

    const totalSeats =
        bus.capacity ?? rows * columns - excludedSeats.length;

    return (
        <div className="bus-details__seats">
            <div className="bus-details__seats-summary">
                <div>
                    <strong>{rows}</strong>
                    <span>rangées</span>
                </div>
                <div>
                    <strong>{columns}</strong>
                    <span>colonnes</span>
                </div>
                <div>
                    <strong>{totalSeats}</strong>
                    <span>sièges actifs</span>
                </div>
            </div>

            {/* Aperçu visuel */}
            <div
                className="bus-details__seats-preview"
                style={{
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                }}
            >
                {Array.from({ length: rows }).map((_, rowIdx) =>
                    Array.from({ length: columns }).map((_, colIdx) => {
                        const seatNumber = `${String.fromCharCode(
                            65 + rowIdx
                        )}${colIdx + 1}`;
                        const excluded = excludedSeats.includes(seatNumber);
                        const isAisle =
                            aisleAfterColumn !== undefined &&
                            colIdx === aisleAfterColumn - 1;

                        return (
                            <div
                                key={`${rowIdx}-${colIdx}`}
                                className={`bus-details__seat ${
                                    excluded
                                        ? "bus-details__seat--excluded"
                                        : ""
                                } ${
                                    isAisle
                                        ? "bus-details__seat--aisle"
                                        : ""
                                }`}
                                title={seatNumber}
                            >
                                {seatNumber}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Onglet Historique                                                   */
/* ------------------------------------------------------------------ */

function HistoryTab({ bus }) {
    const trips = bus.trips ?? [];

    if (trips.length === 0) {
        return (
            <div className="bus-details__empty">
                <Calendar size={36} aria-hidden="true" />
                <h4>Aucun voyage enregistré</h4>
                <p>
                    Ce bus n'a pas encore été utilisé pour un voyage.
                </p>
            </div>
        );
    }

    return (
        <ul className="bus-details__history">
            {trips.map((trip) => (
                <li key={trip.id} className="bus-details__history-item">
                    <div className="bus-details__history-route">
                        <strong>{trip.departure?.city ?? "—"}</strong>
                        <span aria-hidden="true">→</span>
                        <strong>{trip.arrival?.city ?? "—"}</strong>
                    </div>

                    <span className="bus-details__history-date">
                        {formatDate(
                            trip.departure?.time,
                            "dd MMM yyyy à HH:mm"
                        )}
                    </span>
                </li>
            ))}
        </ul>
    );
}

/* ------------------------------------------------------------------ */
/* Sous-composant : ligne d'info                                      */
/* ------------------------------------------------------------------ */

function DetailItem({ icon: Icon, label, value }) {
    return (
        <div className="bus-details__item">
            <div className="bus-details__item-icon">
                <Icon size={16} aria-hidden="true" />
            </div>

            <div className="bus-details__item-body">
                <span className="bus-details__item-label">{label}</span>
                <span className="bus-details__item-value">{value}</span>
            </div>
        </div>
    );
}