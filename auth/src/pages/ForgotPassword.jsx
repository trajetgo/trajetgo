import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    Send,
    LoaderCircle,
    AlertCircle,
} from "lucide-react";

import Input from "@shared/components/ui/Input";
import Checkbox from "@shared/components/ui/Checkbox";
import { useToast } from "@shared/contexts/toast.context";

import useForgotPassword from "../hooks/useForgotPassword";

import { FORGOT_PASSWORD_IDENTIFIER_STORAGE_KEY } from "../utils/auth.utils";

import "../styles/pages/ForgotPassword.scss";

export default function ForgotPassword() {
    const navigate = useNavigate();

    const { showToast } = useToast();

    const {
        formData,
        isSubmitting,
        serverError,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
    } = useForgotPassword();

    const handleFormSubmit = async (e) => {
        const result = await handleSubmit(e);

        if (result.success) {
            const identifier = formData.identifier.trim();

            sessionStorage.setItem(
                FORGOT_PASSWORD_IDENTIFIER_STORAGE_KEY,
                JSON.stringify(identifier)
            );

            resetForm();

            showToast(
                "success",
                "Demande envoyée",
                "Si un compte est associé à cet identifiant, un lien vous sera envoyé."
            );

            navigate("/forgot-password/success", {
                state: { identifier },
                replace: true,
            });
        } else {
            // L'erreur est déjà affichée via serverError dans le formulaire,
            // mais on peut aussi afficher un toast pour les erreurs 429.
            if (result.error?.status === 429) {
                showToast(
                    "error",
                    "Trop de tentatives",
                    result.error.message ||
                    "Veuillez patienter avant de réessayer."
                );
            }
        }
    };

    return (
        <main className="forgot-password">
            <div className="forgot-password__card">

                <div className="forgot-password__icon">
                    <Mail size={28} />
                </div>

                <h1>Mot de passe oublié</h1>

                <p>
                    Saisissez l'email ou le téléphone associé à votre compte.
                    Nous vous enverrons un lien pour réinitialiser votre mot
                    de passe.
                </p>

                <form
                    className="forgot-password__form"
                    onSubmit={handleFormSubmit}
                    noValidate
                >
                    <Input
                        label="Email ou téléphone"
                        type="identifier"
                        name="identifier"
                        id="identifier"
                        placeholder="Email ou téléphone"
                        value={formData.identifier}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.identifier && errors.identifier}
                        required
                        // autoComplete="email"
                        autoFocus
                    />

                    {serverError && (
                        <p className="forgot-password__alert" role="alert">
                            <AlertCircle size={15} />
                            {serverError}
                        </p>
                    )}

                    <div className="form-options">
                        <Checkbox
                            name={'acceptTerms'}
                            label={'J\'accepte les termes et conditions'}
                            checked={formData.acceptTerms}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            error={touched.acceptTerms && errors.acceptTerms}
                        />
                    </div>

                    <button
                        type="submit"
                        className="forgot-password__btn forgot-password__btn--primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <LoaderCircle size={16} className="is-spinning" />
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                Envoyer le lien
                            </>
                        )}
                    </button>
                </form>

                <p className="forgot-password__footer">
                    Vous n'avez pas de compte ?{" "}
                    <Link to="/register">Créer un compte</Link>
                </p>
            </div>
        </main>
    )
}
