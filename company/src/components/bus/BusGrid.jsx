import {
    BusFront,
    Users,
    Armchair,
} from "lucide-react";

import { getAmenityConfig } from "@shared/constants/amenities";
import HighlightText from "@shared/components/ui/HighlightText";

import BusActions from "./BusActions";
import { getBusStatus } from "../../utils/bus.utils";

import "../../styles/components/bus/BusGrid.scss";


/* ------------------------------------------------------------------ */

export default function BusGrid({
    buses,
    search,
    setSelectedAction,
    setSelectedBus,
}) {
    if (!buses || buses.length === 0) return null;

    return (
        <ul className="bus-grid">
            {buses.map((bus) => (
                <BusGridCard
                    key={bus.id}
                    bus={bus}
                    search={search}
                    setSelectedAction={setSelectedAction}
                    setSelectedBus={setSelectedBus}
                />
            ))}
        </ul>
    );
}

/* ------------------------------------------------------------------ */

function BusGridCard({
    bus,
    search,
    setSelectedAction,
    setSelectedBus,
}) {
    const status = getBusStatus(bus.status);

    const handleView = () => {
        setSelectedBus?.(bus);
        setSelectedAction?.("VIEW");
    };

    const amenities = bus.amenities ?? [];
    const visibleAmenities = amenities.slice(0, 4);
    const extraAmenities = amenities.length - visibleAmenities.length;

    const seatLayout = bus.seatLayout;

    const hasSeatLayout = Boolean(seatLayout);

    return (
        <li className="bus-grid__item">
            <article className="bus-card">

                {/* ---------- En-tête ---------- */}

                <header className="bus-card__header">
                    <div className="bus-card__icon">
                        <BusFront size={22} />
                    </div>

                    <div className="bus-card__identity">
                        <h3>
                            <HighlightText
                                text={bus.name ?? bus.registrationNumber ?? "—"}
                                search={search}
                                as="span"
                            />
                        </h3>

                        {bus.name && bus.registrationNumber && (
                            <span className="bus-card__plate">
                                <HighlightText
                                    text={bus.registrationNumber}
                                    search={search}
                                    as="span"
                                />
                            </span>
                        )}
                    </div>

                    <span
                        className={`bus-table__badge bus-table__badge--status-${status.className}`}
                    >
                        <span className="bus-table__badge-dot" />
                        {status.label}
                    </span>
                </header>

                {/* ---------- Caractéristiques ---------- */}

                <dl className="bus-card__meta">
                    <div>
                        <dt>Marque</dt>
                        <dd>{bus.brand ?? "—"}</dd>
                    </div>

                    <div>
                        <dt>Flotte</dt>
                        <dd>{bus.fleetNumber ?? "—"}</dd>
                    </div>

                    <div>
                        <dt>
                            <Users size={12} aria-hidden="true" />
                            Capacité
                        </dt>
                        <dd>
                            {bus.capacity ?? 0} place
                            {(bus.capacity ?? 0) > 1 ? "s" : ""}
                        </dd>
                    </div>

                    <div>
                        <dt>
                            <Armchair size={12} aria-hidden="true" />
                            Plan de sièges
                        </dt>
                        <dd>
                            <span
                                className={`bus-table__badge bus-table__badge--layout-${hasSeatLayout ? "configured" : "missing"
                                    }`}
                            >
                                {hasSeatLayout ? "Configurés" : "Non configurés"}
                            </span>
                        </dd>
                    </div>
                </dl>

                {/* ---------- Équipements ---------- */}

                {amenities.length > 0 && (
                    <div className="bus-card__amenities">
                        {visibleAmenities.map((amenity) => {
                            const config = getAmenityConfig(amenity);
                            const Icon = config.icon;

                            return (
                                <span
                                    key={amenity}
                                    className="bus-card__amenity"
                                    title={config.label}
                                >
                                    {Icon && <Icon size={13} aria-hidden="true" />}
                                </span>
                            );
                        })}

                        {extraAmenities > 0 && (
                            <span className="bus-card__amenity bus-card__amenity--more">
                                +{extraAmenities}
                            </span>
                        )}
                    </div>
                )}

                {/* ---------- Actions ---------- */}

                <footer className="bus-card__footer">
                    <button
                        type="button"
                        className="bus-card__view"
                        onClick={handleView}
                    >
                        Voir les détails
                    </button>

                    <BusActions
                        bus={bus}
                        onView={handleView}
                        setSelectedAction={setSelectedAction}
                        setSelectedBus={setSelectedBus}
                    />
                </footer>

            </article>
        </li>
    );
}