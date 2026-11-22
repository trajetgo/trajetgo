import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    KeyRound,
    Lock,
    LoaderCircle,
    CheckCircle2,
    AlertCircle,
    XCircle,
    ArrowLeft,
} from "lucide-react";

import Input from "@shared/components/ui/Input";
import { useToast } from "@shared/contexts/toast.context";

import useResetPassword from "../hooks/useResetPassword";

import "../styles/pages/ResetPassword.scss";

export default function ResetPassword() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const {
        tokenStatus,
        tokenError,
        formData,
        errors,
        touched,
        isSubmitting,
        serverError,
        success,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useResetPassword();

    /* ---------- Succès : redirection après 3 s ---------- */

    useEffect(() => {
        if (!success) return;

        showToast(
            "success",
            "Mot de passe mis à jour",
            "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe."
        );

        const id = setTimeout(() => {
            navigate("/login", { replace: true });
        }, 3000);

        return () => clearTimeout(id);
    }, [success, navigate, showToast]);

    /* ---------- Token en cours de validation ---------- */

    if (tokenStatus === "idle" || tokenStatus === "loading") {
        return (
            <main className="reset-password">
                <div className="reset-password__card">
                    <div className="reset-password__icon reset-password__icon--loading">
                        <LoaderCircle size={32} className="is-spinning" />
                    </div>

                    <h1>Vérification du lien</h1>
                    <p>Nous vérifions la validité de votre lien...</p>
                </div>
            </main>
        );
    }

    /* ---------- Token invalide ---------- */

    if (tokenStatus === "invalid") {
        return (
            <main className="reset-password">
                <div className="reset-password__card">
                    <div className="reset-password__icon reset-password__icon--error">
                        <XCircle size={32} />
                    </div>

                    <h1>Lien invalide</h1>

                    <p>{tokenError}</p>

                    <div className="reset-password__actions">
                        <Link
                            to="/forgot-password"
                            className="reset-password__btn reset-password__btn--primary"
                        >
                            Demander un nouveau lien
                        </Link>

                        <Link to="/login" className="reset-password__btn">
                            <ArrowLeft size={16} />
                            Retour à la connexion
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    /* ---------- Succès ---------- */

    if (success) {
        return (
            <main className="reset-password">
                <div className="reset-password__card">
                    <div className="reset-password__icon reset-password__icon--success">
                        <CheckCircle2 size={32} />
                    </div>

                    <h1>Mot de passe mis à jour</h1>

                    <p>
                        Votre mot de passe a été réinitialisé avec succès.
                        Vous allez être redirigé vers la page de connexion.
                    </p>

                    <Link
                        to="/login"
                        className="reset-password__btn reset-password__btn--primary"
                    >
                        Se connecter maintenant
                    </Link>
                </div>
            </main>
        );
    }

    /* ---------- Formulaire ---------- */

    return (
        <main className="reset-password">
            <div className="reset-password__card">
                <Link to="/login" className="reset-password__back">
                    <ArrowLeft size={16} />
                    Retour à la connexion
                </Link>

                <div className="reset-password__icon">
                    <KeyRound size={28} />
                </div>

                <h1>Nouveau mot de passe</h1>

                <p>
                    Choisissez un mot de passe fort. Il doit contenir au
                    moins 8 caractères, une majuscule, une minuscule et un
                    chiffre.
                </p>

                <form
                    className="reset-password__form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Input
                        type="password"
                        label="Nouveau mot de passe"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.newPassword && errors.newPassword}
                        autoComplete="new-password"
                        autoFocus
                    />

                    <Input
                        type="password"
                        label="Confirmer le mot de passe"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.confirmPassword && errors.confirmPassword}
                        autoComplete="new-password"
                    />

                    {serverError && (
                        <p className="reset-password__alert" role="alert">
                            <AlertCircle size={15} />
                            {serverError}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="reset-password__btn reset-password__btn--primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <LoaderCircle size={16} className="is-spinning" />
                                Mise à jour...
                            </>
                        ) : (
                            <>
                                <Lock size={16} />
                                Réinitialiser le mot de passe
                            </>
                        )}
                    </button>
                </form>
            </div>
        </main>
    );
}