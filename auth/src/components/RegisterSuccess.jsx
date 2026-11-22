import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    CheckCircle2,
    ArrowRight,
    RefreshCw,
    LoaderCircle,
    Smartphone,
} from "lucide-react";

import service from "../services/auth.service";

import "../styles/components/RegisterSuccess.scss";

export default function RegisterSuccess({ email,
    phone,
    verificationId,
    onNavigateAway,
}) {
    const navigate = useNavigate();
    
    const [resendStatus, setResendStatus] = useState("idle"); // idle | loading | success | error
    const [resendMessage, setResendMessage] = useState("");
    const [cooldown, setCooldown] = useState(0);

    const canResend = Boolean(verificationId) && cooldown === 0 && resendStatus !== "loading";

    const handleResend = async () => {
        if (!canResend) return;

        setResendStatus("loading");
        setResendMessage("");

        try {
            await service.resendVerificationEmail(verificationId);

            setResendStatus("success");
            setResendMessage("Un nouveau lien vient de vous être envoyé.");
            setCooldown(60);

            // Countdown
            const interval = setInterval(() => {
                setCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            setResendStatus("error");
            setResendMessage(
                error.message || "Impossible d'envoyer un nouveau lien. Réessayez plus tard."
            );
        }
    };


    const goTo = (path) => {
        onNavigateAway?.();
        navigate(path);
    };

    return (
        <main className="register-success">
            <div className="register-success__card">
                <div className="register-success__icon">
                    <CheckCircle2 size={40} />
                </div>

                <h1>Compte créé avec succès</h1>

                <p className="register-success__intro">
                    Bienvenue sur Trajet Go ! Votre compte a bien été créé.
                </p>

                {/* ---------- Email de vérification ---------- */}

                {email && (
                    <div className="register-success__block">
                        <div className="register-success__block-header">
                            <Mail size={18} />
                            <strong>Vérifiez votre adresse e-mail</strong>
                        </div>

                        <p>
                            Un email de vérification a été envoyé à{" "}
                            <strong>{email}</strong>. Cliquez sur le lien
                            qu'il contient pour activer votre compte.
                        </p>

                        {resendStatus === "success" ? (
                            <p className="register-success__inline register-success__inline--success">
                                <CheckCircle2 size={15} />
                                {resendMessage}
                            </p>
                        ) : (
                            <button
                                type="button"
                                className="register-success__btn register-success__btn--ghost"
                                onClick={handleResend}
                                disabled={!canResend}
                            >
                                {resendStatus === "loading" ? (
                                    <>
                                        <LoaderCircle size={15} className="is-spinning" />
                                        Envoi en cours...
                                    </>
                                ) : cooldown > 0 ? (
                                    <>
                                        <RefreshCw size={15} />
                                        Renvoyer dans {cooldown}s
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw size={15} />
                                        Renvoyer le lien
                                    </>
                                )}
                            </button>
                        )}

                        {resendStatus === "error" && (
                            <p className="register-success__inline register-success__inline--error" role="alert">
                                {resendMessage}
                            </p>
                        )}
                    </div>
                )}

                {/* ---------- Téléphone ---------- */}

                {phone && (
                    <div className="register-success__block">
                        <div className="register-success__block-header">
                            <Smartphone size={18} />
                            <strong>Vérifiez votre téléphone</strong>
                        </div>

                        <p>
                            Un code de vérification a été envoyé au{" "}
                            <strong>{phone}</strong>.
                        </p>

                        <Link
                            to="/verify-phone"
                            state={{ registeredPhone: phone }}
                            className="register-success__btn register-success__btn--ghost"
                        >
                            Saisir le code
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                )}

                {/* ---------- Actions ---------- */}

                <div className="register-success__actions">
                    <button
                        type="button"
                        className="register-success__btn register-success__btn--primary"
                        onClick={() => goTo("/login")}
                    >
                        Se connecter
                        <ArrowRight size={16} />
                    </button>

                    <button
                        type="button"
                        className="register-success__btn"
                        onClick={() => goTo("/")}
                    >
                        Retour à l'accueil
                    </button>
                </div>

                <p className="register-success__hint">
                    Vous ne trouvez pas l'email ? Vérifiez votre dossier spam
                    ou renvoyez le lien ci-dessus.
                </p>
            </div>
        </main>
    );
}