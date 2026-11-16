import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    Edit2,
    Mail,
    Phone,
    ShieldCheck,
    ShieldAlert,
    CheckCircle2,
    AlertCircle,
    Camera,
    Save,
    LoaderCircle,
} from "lucide-react";

import { useAuth } from "@shared/contexts/auth.context";
import Loading from "@shared/components/Loading";
import Avatar from "@shared/components/ui/Avatar";
import Modal from "@shared/components/ui/Modal";
import Button from "@shared/components/ui/Button";

import service from "../services/user.service.js";

import "../styles/pages/Profile.scss";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatPhone(phone) {
    if (!phone) return "—";
    return phone;
}

/* ------------------------------------------------------------------ */
/* Sous-composant : badge de vérification                              */
/* ------------------------------------------------------------------ */

function VerificationBadge({ verified, label }) {
    return (
        <span
            className={`profile__badge ${verified ? "profile__badge--ok" : "profile__badge--pending"
                }`}
        >
            {verified ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
            {label}
        </span>
    );
}

/* ------------------------------------------------------------------ */
/* Sous-composant : formulaire d'informations                          */
/* ------------------------------------------------------------------ */

function ProfileForm({ user, onSaved }) {
    const [formData, setFormData] = useState({
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        email: user?.email ?? "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const next = {};

        if (!formData.firstName.trim()) {
            next.firstName = "Le prénom est obligatoire.";
        }

        if (!formData.lastName.trim()) {
            next.lastName = "Le nom est obligatoire.";
        }

        if (formData.email && !EMAIL_REGEX.test(formData.email)) {
            next.email = "Adresse email invalide.";
        }

        setErrors(next);

        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setServerError("");
        setSuccess("");

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const result = await service.updateProfile({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim() || null,
            });

            setSuccess("Informations mises à jour.");
            onSaved?.(result.data);
        } catch (error) {
            setServerError(
                error.message || "Impossible de mettre à jour le profil."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="profile__form" onSubmit={handleSubmit} noValidate>
            <div className="profile__form-grid">
                <label className="profile__field">
                    <span>Prénom</span>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        autoComplete="given-name"
                        aria-invalid={Boolean(errors.firstName)}
                    />
                    {errors.firstName && (
                        <small className="profile__field-error">
                            {errors.firstName}
                        </small>
                    )}
                </label>

                <label className="profile__field">
                    <span>Nom</span>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        autoComplete="family-name"
                        aria-invalid={Boolean(errors.lastName)}
                    />
                    {errors.lastName && (
                        <small className="profile__field-error">
                            {errors.lastName}
                        </small>
                    )}
                </label>

                <div className="profile__field profile__field--readonly">
                    <span>Email</span>
                    <input
                        type="email"
                        value={formData.email}
                        autoComplete="email"
                        readOnly
                        aria-invalid={Boolean(errors.email)}
                    />

                    <small id="phone-help" className="profile__field-hint">
                        Pour modifier votre email, passez par{" "}
                        <Link to="/security">Sécurité</Link>.
                    </small>
                </div>

                <div className="profile__field profile__field--readonly">
                    <span>Téléphone</span>
                    <input
                        type="tel"
                        value={formatPhone(user?.phone)}
                        readOnly
                        aria-describedby="phone-help"
                    />
                    <small id="phone-help" className="profile__field-hint">
                        Pour modifier votre numéro, passez par{" "}
                        <Link to="/security">Sécurité</Link>.
                    </small>
                </div>
            </div>

            {serverError && (
                <p className="profile__form-error" role="alert">
                    {serverError}
                </p>
            )}

            {success && (
                <p className="profile__form-success" role="status">
                    {success}
                </p>
            )}

            <div className="profile__form-actions">
                <button
                    type="submit"
                    className="profile__btn profile__btn--primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <LoaderCircle size={16} className="is-spinning" />
                            Enregistrement...
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            Enregistrer
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Profile() {
    const { user, loading, setUser } = useAuth();

    const fileInputRef = useRef(null);

    const [preview, setPreview] = useState(null);
    const [pendingFile, setPendingFile] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [avatarError, setAvatarError] = useState("");

    if (loading) {
        return <Loading message="Chargement du profil..." />;
    }

    if (!user) {
        return (
            <main className="profile">
                <p className="profile__error">
                    Vous devez être connecté pour accéder à cette page.
                </p>
            </main>
        );
    }

    const emailVerified = Boolean(user.emailVerified);
    const phoneVerified = Boolean(user.phoneVerified);
    const fullyVerified = emailVerified && phoneVerified;

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setAvatarError("");

        if (!file.type.startsWith("image/")) {
            setAvatarError("Veuillez sélectionner une image.");
            event.target.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setAvatarError("L'image ne doit pas dépasser 2 Mo.");
            event.target.value = "";
            return;
        }

        const objectUrl = URL.createObjectURL(file);

        setPendingFile(file);
        setPreview(objectUrl);
        setOpenModal(true);
    };

    const closeModal = () => {
        if (avatarLoading) return;

        setOpenModal(false);

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setPreview(null);
        setPendingFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const confirmUpload = async () => {
        if (!pendingFile) return;

        setAvatarLoading(true);
        setAvatarError("");

        try {
            const result = await service.uploadAvatar(pendingFile);
            setUser(result.data);
            closeModal();
        } catch (error) {
            setAvatarError(
                error.message || "Impossible de mettre à jour l'avatar."
            );
        } finally {
            setAvatarLoading(false);
        }
    };

    return (
        <main className="profile">
            {/* ---------- En-tête ---------- */}

            <section className="profile__hero">
                <div className="profile__hero-avatar">
                    <Avatar
                        size="2xl"
                        name={user.fullName}
                        src={user.avatarUrl}
                    />

                    <label
                        className={`profile__avatar-edit ${avatarLoading ? "is-loading" : ""
                            }`}
                        aria-label="Changer la photo de profil"
                    >
                        {avatarLoading ? (
                            <LoaderCircle size={16} className="is-spinning" />
                        ) : (
                            <Camera size={16} />
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleAvatarChange}
                            disabled={avatarLoading}
                        />
                    </label>
                </div>

                <div className="profile__hero-info">
                    <h1>{user.fullName || "Mon profil"}</h1>

                    <div className="profile__hero-meta">
                        <span>
                            <Mail size={14} />
                            {user.email || "Aucun email"}
                        </span>

                        <span>
                            <Phone size={14} />
                            {formatPhone(user.phone)}
                        </span>
                    </div>

                    <div className="profile__hero-badges">
                        <VerificationBadge
                            verified={emailVerified}
                            label={emailVerified ? "Email vérifié" : "Email à vérifier"}
                        />

                        <VerificationBadge
                            verified={phoneVerified}
                            label={phoneVerified ? "Téléphone vérifié" : "Téléphone à vérifier"}
                        />
                    </div>

                    {avatarError && (
                        <p className="profile__form-error" role="alert">
                            {avatarError}
                        </p>
                    )}
                </div>

                {fullyVerified ? (
                    <div className="profile__shield profile__shield--ok">
                        <ShieldCheck size={22} />
                        <span>Compte vérifié</span>
                    </div>
                ) : (
                    <Link
                        to="/security"
                        className="profile__shield profile__shield--warning"
                    >
                        <ShieldAlert size={22} />
                        <span>Compléter la vérification</span>
                    </Link>
                )}
            </section>

            {/* ---------- Informations ---------- */}

            <section className="profile__section">
                <header className="profile__section-header">
                    <h2>Mes informations</h2>
                    <p>Ces informations apparaissent sur vos billets.</p>
                </header>

                <ProfileForm user={user} onSaved={(updated) => setUser(updated)} />
            </section>

            {/* ---------- Raccourcis ---------- */}

            <section className="profile__section">
                <header className="profile__section-header">
                    <h2>Compte</h2>
                </header>

                <ul className="profile__shortcuts">
                    <li>
                        <Link to="/security" className="profile__shortcut">
                            <ShieldCheck size={20} />
                            <div>
                                <strong>Sécurité</strong>
                                <span>Mot de passe, sessions, vérifications</span>
                            </div>
                            <Edit2 size={16} />
                        </Link>
                    </li>

                    <li>
                        <Link to="/bookings" className="profile__shortcut">
                            <Mail size={20} />
                            <div>
                                <strong>Mes réservations</strong>
                                <span>Historique et réservations en cours</span>
                            </div>
                            <Edit2 size={16} />
                        </Link>
                    </li>

                    <li>
                        <Link to="/tickets" className="profile__shortcut">
                            <CheckCircle2 size={20} />
                            <div>
                                <strong>Mes billets</strong>
                                <span>Billets disponibles et QR codes</span>
                            </div>
                            <Edit2 size={16} />
                        </Link>
                    </li>
                </ul>
            </section>

            <Modal
                open={openModal}
                onClose={closeModal}
                title="Nouvelle photo de profil"
                size="sm"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={closeModal}
                            disabled={avatarLoading}
                        >
                            Annuler
                        </Button>

                        <Button
                            variant="primary"
                            onClick={confirmUpload}
                            loading={avatarLoading}
                            disabled={!pendingFile}
                        >
                            Enregistrer la photo
                        </Button>
                    </>
                }
            >
                <div className="profile__preview">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Aperçu de la nouvelle photo de profil"
                            className="profile__preview-image"
                        />
                    ) : (
                        <div className="profile__preview-placeholder">
                            <Camera size={28} />
                        </div>
                    )}

                    <p className="profile__preview-hint">
                        Cette photo sera visible sur vos billets et dans votre compte.
                        Format carré recommandé, 2 Mo maximum.
                    </p>

                    {avatarError && (
                        <p className="profile__form-error" role="alert">
                            {avatarError}
                        </p>
                    )}
                </div>
            </Modal>

        </main>
    );
}