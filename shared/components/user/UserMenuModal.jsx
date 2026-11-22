import { Link } from "react-router-dom";
import {
    LogOut,
    ShieldCheck,
    Mail,
    Phone,
    User,
    Settings,
    Bell,
    Wallet,
    Ticket,
    CalendarCheck,
} from "lucide-react";

import Avatar from "../ui/Avatar";
import Modal from "../ui/Modal";
import { useAuth } from "../../contexts/auth.context";

import trajetGoLogo from "../../assets/logo.png";

import {MY_URL} from "../../services/api";

import "../../styles/components/user/UserMenuModal.scss";

export default function UserMenuModal({ open, onClose, onLogout }) {
    const { user } = useAuth();

    if (!open || !user) return null;

    const emailVerified = Boolean(user.emailVerified);
    const phoneVerified = Boolean(user.phoneVerified);
    const fullyVerified = emailVerified && phoneVerified;

    const fullName =
        user.fullName ||
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        "Voyageur";

    return (
        <Modal isOpen={open} title={null} onClose={onClose}>
            <div
                className="user-modal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ---------- En-tête ---------- */}

                <div className="user-modal__header">
                    <Avatar
                        src={user.avatarUrl}
                        name={fullName}
                        size="lg"
                    />

                    <div className="user-modal__identity">
                        <h3>{fullName}</h3>

                        {user.email && (
                            <p className="user-modal__email">{user.email}</p>
                        )}

                        {user.phone && (
                            <p className="user-modal__phone">{user.phone}</p>
                        )}

                        {fullyVerified ? (
                            <span className="user-modal__badge user-modal__badge--ok">
                                <ShieldCheck size={14} />
                                Compte vérifié
                            </span>
                        ) : (
                            <span className="user-modal__badge user-modal__badge--pending">
                                <ShieldCheck size={14} />
                                Vérification incomplète
                            </span>
                        )}
                    </div>
                </div>

                {/* ---------- Alertes de vérification ---------- */}

                {(!emailVerified || !phoneVerified) && (
                    <div className="user-modal__alerts">
                        {!emailVerified && (
                            <div className="user-modal__alert">
                                <div className="user-modal__alert-icon">
                                    <Mail size={18} />
                                </div>

                                <div className="user-modal__alert-body">
                                    <strong>Email non vérifié</strong>
                                    <p>
                                        Vérifiez votre adresse email pour
                                        recevoir vos billets et confirmations.
                                    </p>

                                    <Link
                                        to="/security"
                                        className="user-modal__alert-action"
                                        onClick={onClose}
                                    >
                                        Vérifier mon email
                                    </Link>
                                </div>
                            </div>
                        )}

                        {!phoneVerified && (
                            <div className="user-modal__alert">
                                <div className="user-modal__alert-icon">
                                    <Phone size={18} />
                                </div>

                                <div className="user-modal__alert-body">
                                    <strong>Téléphone non vérifié</strong>
                                    <p>
                                        Vérifiez votre numéro pour sécuriser
                                        vos réservations et votre compte.
                                    </p>

                                    <Link
                                        to="/security"
                                        className="user-modal__alert-action"
                                        onClick={onClose}
                                    >
                                        Vérifier mon téléphone
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ---------- Navigation rapide ---------- */}

                <nav className="user-modal__nav">
                    <Link
                        to="/bookings"
                        className="user-modal__nav-item"
                        onClick={onClose}
                    >
                        <CalendarCheck size={18} />
                        <span>Mes réservations</span>
                    </Link>

                    <Link
                        to="/tickets"
                        className="user-modal__nav-item"
                        onClick={onClose}
                    >
                        <Ticket size={18} />
                        <span>Mes billets</span>
                    </Link>

                    <Link
                        to="/profile"
                        className="user-modal__nav-item"
                        onClick={onClose}
                    >
                        <User size={18} />
                        <span>Mon profil</span>
                    </Link>

                    <Link
                        to="/security"
                        className="user-modal__nav-item"
                        onClick={onClose}
                    >
                        <Settings size={18} />
                        <span>Sécurité</span>
                    </Link>
                </nav>

                {/* ---------- Pied ---------- */}

                <div className="user-modal__footer">
                    <a
                        href={`${MY_URL}`}
                        className="user-modal__manage"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src={trajetGoLogo} alt="" aria-hidden="true" />
                        <span>Gérer mon compte Trajet Go</span>
                    </a>

                    <button
                        type="button"
                        className="user-modal__logout"
                        onClick={() => {
                            onClose?.();
                            onLogout?.();
                        }}
                    >
                        <LogOut size={18} />
                        <span>Se déconnecter</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
}