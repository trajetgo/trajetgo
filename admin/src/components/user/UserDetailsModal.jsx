import { useState } from "react";
import {
    User as UserIcon,
    Mail,
    Phone,
    Building2,
    ShieldCheck,
    Calendar,
    Clock,
    KeyRound,
    Ban,
    RotateCcw,
    Power,
} from "lucide-react";

import Modal from "@shared/components/ui/Modal";
import Button from "@shared/components/ui/Button";
import { formatDate } from "@shared/utils/date.utils";

import {
    getUserFullName,
    getUserRole,
    getUserStatus,
} from "../../utils/user.utils";

import "../../styles/components/user/UserDetailsModal.scss";

/* ------------------------------------------------------------------ */
/* Onglets                                                             */
/* ------------------------------------------------------------------ */

const TABS = [
    { key: "identity", label: "Identité" },
    { key: "assignment", label: "Affectations" },
    { key: "activity", label: "Activité" },
];

/* ------------------------------------------------------------------ */

export default function UserDetailsModal({
    open,
    user,
    onClose,
    onEditRole,
    onEditStatus,
}) {
    const [activeTab, setActiveTab] = useState("identity");

    if (!user) return null;

    const fullName = getUserFullName(user);
    const role = getUserRole(user.role);
    const status = getUserStatus(user.status);
    const initials = `${user.firstName?.charAt(0) ?? ""}${
        user.lastName?.charAt(0) ?? ""
    }`.toUpperCase();

    /* =========================================================
       Rendu
    ========================================================= */

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title="Détails du membre"
            size="md"
        >
            <div className="user-details">
                {/* =====================================================
                    En-tête (avatar + nom + badges)
                ===================================================== */}

                <header className="user-details__header">
                    <div className="user-details__avatar">
                        {user.avatar ? (
                            <img src={user.avatar} alt={fullName} />
                        ) : (
                            <span>{initials || "?"}</span>
                        )}
                    </div>

                    <div className="user-details__identity">
                        <h2 className="user-details__name">{fullName}</h2>

                        <div className="user-details__badges">
                            <span
                                className={`user-details__badge user-details__badge--role-${role.className}`}
                            >
                                {role.label}
                            </span>

                            <span
                                className={`user-details__badge user-details__badge--status-${status.className}`}
                            >
                                <span className="user-details__badge-dot" />
                                {status.label}
                            </span>
                        </div>
                    </div>
                </header>

                {/* =====================================================
                    Onglets
                ===================================================== */}

                <nav
                    className="user-details__tabs"
                    role="tablist"
                    aria-label="Sections du membre"
                >
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === tab.key}
                            className={`user-details__tab ${
                                activeTab === tab.key
                                    ? "user-details__tab--active"
                                    : ""
                            }`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* =====================================================
                    Contenu
                ===================================================== */}

                <section className="user-details__content">
                    {activeTab === "identity" && (
                        <IdentityTab user={user} />
                    )}

                    {activeTab === "assignment" && (
                        <AssignmentTab user={user} />
                    )}

                    {activeTab === "activity" && (
                        <ActivityTab user={user} />
                    )}
                </section>

                {/* =====================================================
                    Actions rapides
                ===================================================== */}

                <footer className="user-details__actions">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onEditRole?.(user)}
                    >
                        <ShieldCheck size={16} />
                        Changer le rôle
                    </Button>

                    <Button
                        type="button"
                        variant={
                            user.status === "ACTIVE" ? "danger" : "primary"
                        }
                        onClick={() => onEditStatus?.(user)}
                    >
                        {user.status === "ACTIVE" ? (
                            <>
                                <Ban size={16} />
                                Suspendre
                            </>
                        ) : (
                            <>
                                <RotateCcw size={16} />
                                Réactiver
                            </>
                        )}
                    </Button>
                </footer>
            </div>
        </Modal>
    );
}

/* ------------------------------------------------------------------ */
/* Onglet Identité                                                     */
/* ------------------------------------------------------------------ */

function IdentityTab({ user }) {
    return (
        <div className="user-details__grid">
            <DetailItem
                icon={UserIcon}
                label="Prénom"
                value={user.firstName ?? "—"}
            />

            <DetailItem
                icon={UserIcon}
                label="Nom"
                value={user.lastName ?? "—"}
            />

            <DetailItem
                icon={Mail}
                label="Email"
                value={user.email ?? "—"}
            />

            <DetailItem
                icon={Phone}
                label="Téléphone"
                value={user.phone ?? "—"}
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Onglet Affectations                                                 */
/* ------------------------------------------------------------------ */

function AssignmentTab({ user }) {
    return (
        <div className="user-details__grid">
            <DetailItem
                icon={Building2}
                label="Compagnie"
                value={user.company?.name ?? "—"}
            />

            <DetailItem
                icon={Building2}
                label="Agence"
                value={user.agency?.name ?? "—"}
            />

            <DetailItem
                icon={ShieldCheck}
                label="Rôle"
                value={getUserRole(user.role).label}
            />

            <DetailItem
                icon={Power}
                label="Statut"
                value={getUserStatus(user.status).label}
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Onglet Activité                                                     */
/* ------------------------------------------------------------------ */

function ActivityTab({ user }) {
    return (
        <div className="user-details__grid">
            <DetailItem
                icon={Calendar}
                label="Compte créé le"
                value={
                    user.createdAt
                        ? formatDate(user.createdAt, "dd MMMM yyyy à HH:mm")
                        : "—"
                }
            />

            <DetailItem
                icon={Clock}
                label="Dernière modification"
                value={
                    user.updatedAt
                        ? formatDate(user.updatedAt, "dd MMMM yyyy à HH:mm")
                        : "—"
                }
            />

            <DetailItem
                icon={KeyRound}
                label="Dernière connexion"
                value={
                    user.lastLoginAt
                        ? formatDate(
                              user.lastLoginAt,
                              "dd MMMM yyyy à HH:mm"
                          )
                        : "Jamais connecté"
                }
            />

            <DetailItem
                icon={Calendar}
                label="ID interne"
                value={
                    <code className="user-details__id">{user.id}</code>
                }
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Sous-composant : item de détail                                     */
/* ------------------------------------------------------------------ */

function DetailItem({ icon: Icon, label, value }) {
    return (
        <div className="user-details__item">
            <div className="user-details__item-icon">
                <Icon size={16} aria-hidden="true" />
            </div>

            <div className="user-details__item-body">
                <span className="user-details__item-label">{label}</span>
                <span className="user-details__item-value">
                    {value ?? "—"}
                </span>
            </div>
        </div>
    );
}