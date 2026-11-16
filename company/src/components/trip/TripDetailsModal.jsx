import {
    MapPin,
    CalendarDays,
    Bus,
    Users,
    Wallet,
} from "lucide-react";

import Modal from "@shared/components/ui/Modal";
import { formatDate } from "@shared/utils/date.utils";

import { TRIP_STATUS } from "../../utils/trip.utils";

import "../../styles/components/agency/TripDetailsModal.scss";

/* ------------------------------------------------------------------ */

export default function TripDetailsModal({ open, trip, onClose }) {
    if (!trip) return null;

    const status =
        TRIP_STATUS[trip.status] ?? {
            label: "Inconnu",
            class: "unknown",
        };

    const totalSeats = trip.seats?.total ?? trip.bus?.capacity ?? 0;
    const bookedSeats = trip.seats?.booked ?? 0;
    const availableSeats = Math.max(0, totalSeats - bookedSeats);
    const occupancy =
        totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title="Détails du voyage"
            size="lg"
        >
            <div className="trip-details">
                {/* ---------- En-tête ---------- */}

                <header className="trip-details__header">
                    <div className="trip-details__route">
                        <MapPin size={18} aria-hidden="true" />
                        <strong>{trip.departure?.city ?? "—"}</strong>
                        <span aria-hidden="true">→</span>
                        <strong>{trip.arrival?.city ?? "—"}</strong>
                    </div>

                    <span
                        className={`badge badge--${status.class}`}
                    >
                        {status.label}
                    </span>
                </header>

                {/* ---------- Horaires ---------- */}

                <section className="trip-details__section">
                    <h3 className="trip-details__section-title">
                        <CalendarDays size={16} aria-hidden="true" />
                        Horaires
                    </h3>

                    <div className="trip-details__grid">
                        <DetailItem
                            label="Départ"
                            value={formatDate(
                                trip.departure?.time,
                                "EEEE dd MMMM yyyy à HH:mm"
                            )}
                        />

                        <DetailItem
                            label="Arrivée"
                            value={formatDate(
                                trip.arrival?.time,
                                "EEEE dd MMMM yyyy à HH:mm"
                            )}
                        />

                        <DetailItem
                            label="Durée"
                            value={trip.duration ?? "—"}
                        />
                    </div>
                </section>

                {/* ---------- Bus ---------- */}

                <section className="trip-details__section">
                    <h3 className="trip-details__section-title">
                        <Bus size={16} aria-hidden="true" />
                        Véhicule
                    </h3>

                    <div className="trip-details__grid">
                        <DetailItem
                            label="Bus"
                            value={trip.bus?.name ?? "—"}
                        />

                        <DetailItem
                            label="Capacité"
                            value={`${totalSeats} places`}
                        />
                    </div>
                </section>

                {/* ---------- Occupation ---------- */}

                <section className="trip-details__section">
                    <h3 className="trip-details__section-title">
                        <Users size={16} aria-hidden="true" />
                        Occupation
                    </h3>

                    <div className="trip-details__occupancy">
                        <div className="trip-details__occupancy-header">
                            <span>
                                <strong>{bookedSeats}</strong> /{" "}
                                {totalSeats} réservées
                            </span>
                            <span>{occupancy} %</span>
                        </div>

                        <div
                            className="trip-details__occupancy-bar"
                            role="progressbar"
                            aria-valuenow={occupancy}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        >
                            <div
                                className="trip-details__occupancy-fill"
                                style={{ width: `${occupancy}%` }}
                            />
                        </div>

                        <p className="trip-details__occupancy-available">
                            {availableSeats > 0
                                ? `${availableSeats} place${
                                      availableSeats > 1 ? "s" : ""
                                  } disponible${availableSeats > 1 ? "s" : ""}`
                                : "Complet"}
                        </p>
                    </div>
                </section>

                {/* ---------- Tarif ---------- */}

                <section className="trip-details__section">
                    <h3 className="trip-details__section-title">
                        <Wallet size={16} aria-hidden="true" />
                        Tarif
                    </h3>

                    <p className="trip-details__price">
                        {new Intl.NumberFormat("fr-FR").format(
                            trip.price ?? 0
                        )}{" "}
                        FCFA
                    </p>
                </section>
            </div>
        </Modal>
    );
}

/* ------------------------------------------------------------------ */

function DetailItem({ label, value }) {
    return (
        <div className="trip-details__item">
            <span className="trip-details__item-label">{label}</span>
            <span className="trip-details__item-value">{value}</span>
        </div>
    );
}