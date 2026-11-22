import { useState } from "react";
import { AlertCircle, Building2, CheckCircle2, CreditCard, FileText, Globe, Mail, MapPin, Phone } from "lucide-react";

import Modal from "@shared/components/ui/Modal";
import Avatar from "@shared/components/ui/Avatar";
import { formatStatus } from "../../constants/company.constants";

import "../../styles/components/company/CompanyDetailsModal.scss";

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */

const TABS = [
    { key: "identity", label: "Identité", icon: Building2 },
    { key: "legal", label: "Informations légales", icon: FileText },
    { key: "contact", label: "Contact", icon: Mail },
    { key: "subscription", label: "Abonnement", icon: CreditCard },
];

/* ------------------------------------------------------------------ */
/* Field                                                               */
/* ------------------------------------------------------------------ */

function Field({ label, value, icon: Icon }) {
    return (
        <div className="company-details__field">
            <span className="company-details__field-label">
                {Icon && <Icon size={13} aria-hidden="true" />}
                {label}
            </span>
            <strong className="company-details__field-value">
                {value || "—"}
            </strong>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Tab contents                                                        */
/* ------------------------------------------------------------------ */

function IdentityTab({ company }) {
    const statusConfig = formatStatus(company?.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="company-details__grid">
            <Field label="Nom" value={company?.name} icon={Building2} />
            <Field label="Raison sociale" value={company?.legalName} icon={FileText} />
            <Field label="Ville" value={company?.city?.name} icon={MapPin} />

            <div className="company-details__field">
                <span className="company-details__field-label">Statut</span>
                <span className={`company-details__status ${statusConfig.class}`}>
                    <StatusIcon size={13} />
                    {statusConfig.label}
                </span>
            </div>

            <div className="company-details__field company-details__field--wide">
                <span className="company-details__field-label">Adresse du siège</span>
                <strong className="company-details__field-value">
                    {company?.address || "—"}
                </strong>
            </div>
        </div>
    );
}

function LegalTab({ company }) {
    return (
        <div className="company-details__grid">
            <Field
                label="Numéro RCCM"
                value={company?.registrationNumber}
                icon={FileText}
            />
            <Field
                label="Identifiant fiscal (DFE)"
                value={company?.taxId}
                icon={CreditCard}
            />
        </div>
    );
}

function ContactTab({ company }) {
    return (
        <div className="company-details__grid">
            <Field label="Email" value={company?.email} icon={Mail} />
            <Field label="Téléphone" value={company?.phone} icon={Phone} />
            <Field label="Site web" value={company?.website} icon={Globe} />

            <div className="company-details__field company-details__field--wide">
                <span className="company-details__field-label">Adresse</span>
                <strong className="company-details__field-value">
                    {company?.address || "—"}
                </strong>
            </div>
        </div>
    );
}

function SubscriptionTab({ company }) {
    const subscription = company?.subscription;

    if (!subscription) {
        return (
            <div className="company-details__empty">
                <AlertCircle size={22} />
                <p>Aucun abonnement actif pour cette compagnie.</p>
            </div>
        );
    }

    return (
        <div className="company-details__grid">
            <Field
                label="Plan"
                value={subscription.plan?.name}
                icon={CreditCard}
            />
            <Field
                label="Statut"
                value={subscription.status}
                icon={CheckCircle2}
            />
            <Field
                label="Début"
                value={
                    subscription.startDate
                        ? new Date(subscription.startDate).toLocaleDateString("fr-FR")
                        : null
                }
                icon={FileText}
            />
            <Field
                label="Fin"
                value={
                    subscription.endDate
                        ? new Date(subscription.endDate).toLocaleDateString("fr-FR")
                        : null
                }
                icon={FileText}
            />
        </div>
    );
}

export default function CompanyDetailsModal({
    isOpen,
    onClose,
    company
}) {

    const [activeTab, setActiveTab] = useState("identity");

    if (!company) return null;

    const statusConfig = formatStatus(company.status);
    const StatusIcon = statusConfig.icon;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Détails — ${company.name}`}
        >
            <div className="company-details">

                {/* ---------- En-tête ---------- */}

                <header className="company-details__header">
                    <div className="company-details__logo">
                        {company.logo && (
                            <img src={company.logo} alt={company.name} />
                        )}
                    </div>

                    <div className="company-details__identity">
                        <h2>{company.name}</h2>
                        {company.legalName && (
                            <p>{company.legalName}</p>
                        )}

                        <div className="company-details__badges">
                            <span className={`company-details__status ${statusConfig.class}`}>
                                <StatusIcon size={13} />
                                {statusConfig.label}
                            </span>

                            {company.city?.name && (
                                <span className="company-details__badge">
                                    <MapPin size={12} />
                                    {company.city.name}
                                </span>
                            )}
                        </div>
                    </div>
                </header>

                {/* ---------- Tabs ---------- */}

                <nav
                    className="company-details__tabs"
                    role="tablist"
                    aria-label="Sections de détails"
                >
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;

                        return (
                            <button
                                key={tab.key}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                aria-controls={`tabpanel-${tab.key}`}
                                className={`company-details__tab ${isActive ? "is-active" : ""}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                <Icon size={14} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>

                {/* ---------- Contenu ---------- */}

                <div
                    className="company-details__content"
                    id={`tabpanel-${activeTab}`}
                    role="tabpanel"
                >
                    {activeTab === "identity" && <IdentityTab company={company} />}
                    {activeTab === "legal" && <LegalTab company={company} />}
                    {activeTab === "contact" && <ContactTab company={company} />}
                    {activeTab === "subscription" && <SubscriptionTab company={company} />}
                </div>

            </div>
        </Modal>
    )
}
