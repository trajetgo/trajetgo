import {
    Mail,
    Phone,
    MapPin,
    Globe,
} from "lucide-react";

import HighlightText from "@shared/components/ui/HighlightText";

import CompanyActions from "./CompanyActions";
import { COMPANY_STATUS } from "../../utils/company.utils";

import "../../styles/components/company/CompanyGrid.scss";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const getStatus = (status) =>
    COMPANY_STATUS[status] ?? {
        className: "unknown",
        label: "Inconnu",
    };

const getInitials = (name) => {
    if (!name) return "?";

    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join("");
};

/* ------------------------------------------------------------------ */

export default function CompanyGrid({
    companies,
    search,
    setSelectedAction,
    setSelectedCompany,
}) {
    if (!companies || companies.length === 0) {
        return null;
    }

    return (
        <ul className="company-grid">
            {companies.map((company) => (
                <CompanyGridCard
                    key={company.id}
                    company={company}
                    search={search}
                    setSelectedAction={setSelectedAction}
                    setSelectedCompany={setSelectedCompany}
                />
            ))}
        </ul>
    );
}

/* ------------------------------------------------------------------ */
/* Carte entreprise                                                    */
/* ------------------------------------------------------------------ */

function CompanyGridCard({
    company,
    search,
    setSelectedAction,
    setSelectedCompany,
}) {
    const status = getStatus(company.status);

    const handleView = () => {
        setSelectedCompany?.(company);
        setSelectedAction?.("VIEW");
    };

    return (
        <li className="company-grid__item">
            <article className="company-card">
                {/* ---------- En-tête ---------- */}

                <header className="company-card__header">
                    <div className="company-card__logo">
                        {company.logo ? (
                            <img
                                src={company.logo}
                                alt={company.name}
                                onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display =
                                        "flex";
                                }}
                            />
                        ) : null}

                        <span
                            className="company-card__logo-fallback"
                            style={{
                                display: company.logo ? "none" : "flex",
                            }}
                        >
                            {getInitials(company.name)}
                        </span>
                    </div>

                    <span
                        className={`company-card__status company-card__status--${status.className}`}
                    >
                        {status.label}
                    </span>
                </header>

                {/* ---------- Identité ---------- */}

                <div className="company-card__identity">
                    <h3 className="company-card__name">
                        <HighlightText
                            text={company.name ?? "—"}
                            search={search}
                            as="span"
                        />
                    </h3>

                    {company.code && (
                        <span className="company-card__code">
                            {company.code}
                        </span>
                    )}
                </div>

                {/* ---------- Contact ---------- */}

                <ul className="company-card__meta">
                    {company.phone && (
                        <li>
                            <Phone size={14} aria-hidden="true" />
                            <span>{company.phone}</span>
                        </li>
                    )}

                    {company.email && (
                        <li>
                            <Mail size={14} aria-hidden="true" />
                            <span>{company.email}</span>
                        </li>
                    )}

                    {company.city?.name && (
                        <li>
                            <MapPin size={14} aria-hidden="true" />
                            <span>{company.city.name}</span>
                        </li>
                    )}

                    {company.website && (
                        <li>
                            <Globe size={14} aria-hidden="true" />
                            <span className="company-card__website">
                                {company.website.replace(
                                    /^https?:\/\//,
                                    ""
                                )}
                            </span>
                        </li>
                    )}
                </ul>

                {/* ---------- Actions ---------- */}

                <footer className="company-card__footer">
                    <button
                        type="button"
                        className="company-card__view"
                        onClick={handleView}
                    >
                        Voir les détails
                    </button>

                    <CompanyActions
                        company={company}
                        onView={handleView}
                        setSelectedAction={setSelectedAction}
                        setSelectedCompany={setSelectedCompany}
                    />
                </footer>
            </article>
        </li>
    );
}

/* ------------------------------------------------------------------ */
/* Exposition du fallback icône si pas de logo                         */
/* ------------------------------------------------------------------ */

CompanyGridCard.defaultProps = {};