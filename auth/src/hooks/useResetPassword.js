import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import service from "../services/auth.service";
import { PASSWORD_MIN_LENGTH } from "../utils/auth.utils";

function validatePassword(value) {
    if (!value) return "Le mot de passe est obligatoire.";

    if (value.length < PASSWORD_MIN_LENGTH) {
        return `Au moins ${PASSWORD_MIN_LENGTH} caractères.`;
    }

    if (!/[A-Z]/.test(value)) return "Au moins une majuscule.";
    if (!/[a-z]/.test(value)) return "Au moins une minuscule.";
    if (!/[0-9]/.test(value)) return "Au moins un chiffre.";

    return "";
}

export default function useResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const verificationId = searchParams.get("vid");

    /* ---------- État de validation du token ---------- */

    const [tokenStatus, setTokenStatus] = useState("idle");
    // idle | loading | valid | invalid
    const [tokenError, setTokenError] = useState("");

    /* ---------- Formulaire ---------- */

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");
    const [success, setSuccess] = useState(false);

    /* ---------- Évite le double appel en StrictMode ---------- */

    const hasValidated = useRef(false);

    useEffect(() => {
        if (hasValidated.current) return;
        hasValidated.current = true;

        if (!token) {
            setTokenStatus("invalid");
            setTokenError("Lien invalide : aucun token fourni.");
            return;
        }

        const validate = async () => {
            setTokenStatus("loading");
            setTokenError("");

            try {
                await service.validateResetToken(token);
                setTokenStatus("valid");
            } catch (error) {
                setTokenStatus("invalid");
                setTokenError(
                    error.message ||
                    "Ce lien est invalide ou a expiré. Demandez-en un nouveau."
                );
            }
        };

        validate();
    }, [token]);

    /* ---------- Handlers ---------- */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }

        setServerError("");
    };

    const handleBlur = (event) => {
        const { name, value } = event.target;

        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const validateField = (name, value) => {
        if (name === "newPassword") {
            return validatePassword(value);
        }

        if (name === "confirmPassword") {
            if (!value) return "Confirmez votre mot de passe.";
            if (value !== formData.newPassword) {
                return "Les mots de passe ne correspondent pas.";
            }
        }

        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setServerError("");

        const newPasswordError = validateField(
            "newPassword",
            formData.newPassword
        );
        const confirmPasswordError = validateField(
            "confirmPassword",
            formData.confirmPassword
        );

        if (newPasswordError || confirmPasswordError) {
            setErrors({
                newPassword: newPasswordError,
                confirmPassword: confirmPasswordError,
            });
            setTouched({ newPassword: true, confirmPassword: true });
            return { success: false };
        }

        setIsSubmitting(true);

        try {
            await service.resetPassword({
                token,
                verificationId,
                newPassword: formData.newPassword,
            });

            setSuccess(true);

            return { success: true };
        } catch (error) {
            setServerError(
                error.message ||
                "Impossible de réinitialiser le mot de passe. Réessayez."
            );

            // Token expiré entre la validation et la soumission
            if (error.status === 400 || error.status === 410) {
                setTokenStatus("invalid");
                setTokenError(
                    error.message ||
                    "Ce lien est invalide ou a expiré. Demandez-en un nouveau."
                );
            }

            return { success: false, error };
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        token,
        verificationId,
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
    };
}
