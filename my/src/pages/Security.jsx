import { useEffect, useState } from "react";
import {
    Lock,
    ShieldCheck,
    ShieldAlert,
    Smartphone,
    Monitor,
    LogOut,
    KeyRound,
    CheckCircle2,
    AlertCircle,
    LoaderCircle,
    RefreshCw,
} from "lucide-react";

import { useAuth } from "@shared/contexts/auth.context";
import Loading from "@shared/components/Loading";

import service from "../services/security.service";
import sessionService from "../services/session.service";

import "../styles/pages/Security.scss";
import useSessions from "../hooks/useSessions";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatDate(value) {
    if (!value) return "—";

    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function deviceLabel(userAgent = "") {
    if (/mobile|android|iphone/i.test(userAgent)) return "Mobile";
    if (/tablet|ipad/i.test(userAgent)) return "Tablette";
    return "Ordinateur";
}

/* ------------------------------------------------------------------ */
/* 1. Changement de mot de passe                                       */
/* ------------------------------------------------------------------ */

function PasswordSection() {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
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

        if (!formData.currentPassword) {
            next.currentPassword = "Mot de passe actuel requis.";
        }

        if (!formData.newPassword) {
            next.newPassword = "Nouveau mot de passe requis.";
        } else if (formData.newPassword.length < 8) {
            next.newPassword = "Au moins 8 caractères.";
        } else if (!/[A-Z]/.test(formData.newPassword)) {
            next.newPassword = "Au moins une majuscule.";
        } else if (!/[0-9]/.test(formData.newPassword)) {
            next.newPassword = "Au moins un chiffre.";
        }

        if (formData.confirmPassword !== formData.newPassword) {
            next.confirmPassword = "Les mots de passe ne correspondent pas.";
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
            await service.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            setSuccess("Mot de passe mis à jour.");
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            setServerError(
                error.message || "Impossible de mettre à jour le mot de passe."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="security__section">
            <header className="security__section-header">
                <div className="security__section-icon">
                    <Lock size={20} />
                </div>
                <div>
                    <h2>Mot de passe</h2>
                    <p>Utilisez un mot de passe fort et unique.</p>
                </div>
            </header>

            <form className="security__form" onSubmit={handleSubmit} noValidate>
                <label className="security__field">
                    <span>Mot de passe actuel</span>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        autoComplete="current-password"
                        aria-invalid={Boolean(errors.currentPassword)}
                    />
                    {errors.currentPassword && (
                        <small className="security__field-error">
                            {errors.currentPassword}
                        </small>
                    )}
                </label>

                <div className="security__form-grid">
                    <label className="security__field">
                        <span>Nouveau mot de passe</span>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            aria-invalid={Boolean(errors.newPassword)}
                        />
                        {errors.newPassword && (
                            <small className="security__field-error">
                                {errors.newPassword}
                            </small>
                        )}
                    </label>

                    <label className="security__field">
                        <span>Confirmer</span>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            aria-invalid={Boolean(errors.confirmPassword)}
                        />
                        {errors.confirmPassword && (
                            <small className="security__field-error">
                                {errors.confirmPassword}
                            </small>
                        )}
                    </label>
                </div>

                {serverError && (
                    <p className="security__alert security__alert--error" role="alert">
                        {serverError}
                    </p>
                )}

                {success && (
                    <p className="security__alert security__alert--success" role="status">
                        {success}
                    </p>
                )}

                <div className="security__form-actions">
                    <button
                        type="submit"
                        className="security__btn security__btn--primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <LoaderCircle size={16} className="is-spinning" />
                                Mise à jour...
                            </>
                        ) : (
                            <>
                                <KeyRound size={16} />
                                Mettre à jour
                            </>
                        )}
                    </button>
                </div>
            </form>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* 2. Vérification du téléphone                                        */
/* ------------------------------------------------------------------ */

function PhoneVerificationSection({ user, onVerified }) {
    const [step, setStep] = useState(user?.phoneVerified ? "done" : "idle");
    const [code, setCode] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [serverError, setServerError] = useState("");
    const [devOtp, setDevOtp] = useState(null);

    useEffect(() => {
        if (countdown <= 0) return;

        const id = setInterval(() => {
            setCountdown((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(id);
    }, [countdown]);

    const handleSend = async () => {
        setServerError("");
        setIsSending(true);

        try {
            const result = await service.sendPhoneOtp();
            setStep("sent");
            setCountdown(60);

            if (result?.data?.devOtp) {
                setDevOtp(result.data.devOtp);
            }
        } catch (error) {
            setServerError(error.message || "Impossible d'envoyer le code.");
        } finally {
            setIsSending(false);
        }
    };

    const handleVerify = async (event) => {
        event.preventDefault();
        setServerError("");
        setIsVerifying(true);

        try {
            const result = await service.verifyPhone({ code });
            onVerified?.(result.data);
            setStep("done");
        } catch (error) {
            setServerError(error.message || "Code invalide ou expiré.");
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <section className="security__section">
            <header className="security__section-header">
                <div className="security__section-icon">
                    <Smartphone size={20} />
                </div>
                <div>
                    <h2>Téléphone</h2>
                    <p>Vérifiez votre numéro pour sécuriser vos réservations.</p>
                </div>
            </header>

            <div className="security__phone">
                <div className="security__phone-number">
                    <span>{user?.phone || "Aucun numéro"}</span>

                    {user?.phoneVerified ? (
                        <span className="security__badge security__badge--ok">
                            <CheckCircle2 size={13} />
                            Vérifié
                        </span>
                    ) : (
                        <span className="security__badge security__badge--pending">
                            <AlertCircle size={13} />
                            Non vérifié
                        </span>
                    )}
                </div>

                {user?.phoneVerified && (
                    <p className="security__hint">
                        Votre numéro est déjà vérifié. Contactez le support
                        pour le modifier.
                    </p>
                )}

                {!user?.phoneVerified && step === "idle" && (
                    <button
                        type="button"
                        className="security__btn security__btn--primary"
                        onClick={handleSend}
                        disabled={isSending}
                    >
                        {isSending ? (
                            <>
                                <LoaderCircle size={16} className="is-spinning" />
                                Envoi...
                            </>
                        ) : (
                            <>
                                <Smartphone size={16} />
                                Envoyer le code
                            </>
                        )}
                    </button>
                )}

                {step === "sent" && (
                    <form
                        className="security__otp-form"
                        onSubmit={handleVerify}
                        noValidate
                    >
                        <label className="security__field">
                            <span>Code à 6 chiffres</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="\d{6}"
                                maxLength={6}
                                value={code}
                                onChange={(e) =>
                                    setCode(e.target.value.replace(/\D/g, ""))
                                }
                                placeholder="123456"
                            />
                        </label>

                        {devOtp && (
                            <p className="security__hint security__hint--dev">
                                [DEV] Code : <strong>{devOtp}</strong>
                            </p>
                        )}

                        {serverError && (
                            <p className="security__alert security__alert--error" role="alert">
                                {serverError}
                            </p>
                        )}

                        <div className="security__otp-actions">
                            <button
                                type="submit"
                                className="security__btn security__btn--primary"
                                disabled={isVerifying || code.length !== 6}
                            >
                                {isVerifying ? (
                                    <>
                                        <LoaderCircle size={16} className="is-spinning" />
                                        Vérification...
                                    </>
                                ) : (
                                    "Vérifier"
                                )}
                            </button>

                            <button
                                type="button"
                                className="security__btn"
                                onClick={handleSend}
                                disabled={countdown > 0 || isSending}
                            >
                                {countdown > 0
                                    ? `Renvoyer (${countdown}s)`
                                    : "Renvoyer le code"}
                            </button>
                        </div>
                    </form>
                )}

                {step === "done" && (
                    <p className="security__alert security__alert--success">
                        <CheckCircle2 size={16} />
                        Numéro vérifié avec succès.
                    </p>
                )}
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* 3. Sessions actives                                                 */
/* ------------------------------------------------------------------ */

function SessionsSection() {
    const {
        loading,
        serverError,
        revoking,
        sessions,

        handleRevoke,
        handleRevokeAll,

        refresh
    } = useSessions();

    return (
        <section className="security__section">
            <header className="security__section-header">
                <div className="security__section-icon">
                    <Monitor size={20} />
                </div>
                <div>
                    <h2>Sessions actives</h2>
                    <p>Appareils connectés à votre compte.</p>
                </div>

                <button
                    type="button"
                    className="security__btn security__btn--ghost"
                    onClick={refresh}
                    disabled={loading}
                    aria-label="Rafraîchir"
                >
                    <RefreshCw size={15} className={loading ? "is-spinning" : ""} />
                </button>
            </header>

            {serverError && (
                <p className="security__alert security__alert--error" role="alert">
                    {serverError}
                </p>
            )}

            {loading && sessions.length === 0 ? (
                <p className="security__hint">Chargement...</p>
            ) : sessions.length === 0 ? (
                <p className="security__hint">Aucune session active.</p>
            ) : (
                <ul className="security__sessions">
                    {sessions.map((session) => (
                        <li key={session.id} className="security__session">
                            <div className="security__session-icon">
                                <Monitor size={18} />
                            </div>

                            <div className="security__session-info">
                                <strong>
                                    {deviceLabel(session.userAgent)}
                                    {session.current && (
                                        <span className="security__badge security__badge--ok">
                                            Actuel
                                        </span>
                                    )}
                                </strong>
                                <span>
                                    {session.ip || "IP inconnue"} ·{" "}
                                    {formatDate(session.lastSeenAt)}
                                </span>
                            </div>

                            {!session.current && (
                                <button
                                    type="button"
                                    className="security__btn security__btn--danger"
                                    onClick={() => handleRevoke(session.id)}
                                    disabled={revoking}
                                >
                                    <LogOut size={14} />
                                    Révoquer
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {sessions.length > 0 && (
                <div className="security__form-actions">
                    <button
                        type="button"
                        className="security__btn security__btn--danger"
                        onClick={handleRevokeAll}
                        disabled={revoking}
                    >
                        <LogOut size={15} />
                        Révoquer toutes les sessions
                    </button>
                </div>
            )}
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Security() {
    const { user, loading, setUser } = useAuth();

    if (loading) {
        return <Loading message="Chargement de la sécurité..." />;
    }

    const emailVerified = Boolean(user?.emailVerified);
    const phoneVerified = Boolean(user?.phoneVerified);
    const fullyVerified = emailVerified && phoneVerified;

    return (
        <main className="security">
            <header className="security__header">
                <h1>Sécurité</h1>
                <p>Protégez votre compte et vérifiez vos informations.</p>
            </header>

            <div
                className={`security__summary ${fullyVerified
                        ? "security__summary--ok"
                        : "security__summary--warning"
                    }`}
            >
                {fullyVerified ? (
                    <ShieldCheck size={22} />
                ) : (
                    <ShieldAlert size={22} />
                )}

                <div>
                    <strong>
                        {fullyVerified
                            ? "Votre compte est sécurisé"
                            : "Votre compte nécessite une vérification"}
                    </strong>
                    <p>
                        {fullyVerified
                            ? "Email et téléphone vérifiés."
                            : "Vérifiez votre email et votre téléphone pour sécuriser vos réservations."}
                    </p>
                </div>
            </div>

            <PasswordSection />

            <PhoneVerificationSection
                user={user}
                onVerified={(updated) => setUser(updated)}
            />

            <SessionsSection />
        </main>
    );
}