import {
    Globe,
    Mail,
    MapPin,
    Phone,
    Building2,
} from "lucide-react";

import HighlightText from "@shared/components/ui/HighlightText";

import { formatStatus } from "../../constants/agency.constants";
import AgencyActions from "./AgencyActions";

import "../../styles/components/agency/AgencyGrid.scss";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function getInitials(name) {
    if (!name) return "?";

    return name
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

/* ------------------------------------------------------------------ */

export default function AgencyGrid({
    agencies,
    search,
    setSelectedAction,
    setSelectedAgency,
}) {
    if (!agencies || agencies.length === 0) {
        return null;
    }

    return (
        <ul className="agency-grid">
            {agencies.map((agency) => (
                <AgencyGridCard
                    key={agency.id}
                    agency={agency}
                    search={search}
                    setSelectedAction={setSelectedAction}
                    setSelectedAgency={setSelectedAgency}
                />
            ))}
        </ul>
    );
}

/* ------------------------------------------------------------------ */

function AgencyGridCard({
    agency,
    search,
    setSelectedAction,
    setSelectedAgency,
}) {
    const status = formatStatus(agency.status);

    const Icon = status.icon;

    const handleView = () => {
        setSelectedAgency?.(agency);
        setSelectedAction?.("VIEW");
    };

    return (
        <li className="agency-grid__item">
            <article className="agency-card">

                {/* ---------- En-tête ---------- */}

                <header className="agency-card__header">
                    <div className="agency-card__logo">
                        {agency.company?.logo ? (
                            <img
                                src={agency.company.logo}
                                alt={agency.company.name ?? "Compagnie"}
                                onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                }}
                            />
                        ) : (
                            <span>{getInitials(agency.company?.name)}</span>
                        )}
                    </div>

                    <span
                        className={`agency-card__status agency-card__status--${status.class}`}
                    >
                        <Icon size={14} />
                        {status.label}
                    </span>
                </header>

                {/* ---------- Identité ---------- */}

                <div className="agency-card__identity">
                    <h3 className="agency-card__name">
                        <HighlightText
                            text={agency.name ?? "—"}
                            search={search}
                            as="span"
                        />
                    </h3>

                    {agency.company?.name && (
                        <span className="agency-card__company">
                            {agency.company.name}
                        </span>
                    )}
                </div>

                {/* ---------- Contact ---------- */}

                <ul className="agency-card__meta">
                    {agency.phone && (
                        <li>
                            <Phone size={14} aria-hidden="true" />
                            <span>{agency.phone}</span>
                        </li>
                    )}

                    {agency.email && (
                        <li>
                            <Mail size={14} aria-hidden="true" />
                            <span>{agency.email}</span>
                        </li>
                    )}

                    {agency.city?.name && (
                        <li>
                            <MapPin size={14} aria-hidden="true" />
                            <span>{agency.city.name}</span>
                        </li>
                    )}

                    {agency.company?.website && (
                        <li>
                            <Globe size={14} aria-hidden="true" />
                            <span className="agency-card__website">
                                {agency.company.website.replace(
                                    /^https?:\/\//,
                                    ""
                                )}
                            </span>
                        </li>
                    )}
                </ul>

                {/* ---------- Actions ---------- */}

                <footer className="agency-card__footer">
                    <button
                        type="button"
                        className="agency-card__view"
                        onClick={handleView}
                    >
                        Voir les détails
                    </button>

                    <AgencyActions
                        agency={agency}
                        onView={handleView}
                        setSelectedAction={setSelectedAction}
                        setSelectedAgency={setSelectedAgency}
                    />
                </footer>

            </article>
        </li>
    );
}