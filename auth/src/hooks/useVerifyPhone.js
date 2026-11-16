
import { useState } from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "@shared/contexts/auth.context";

import service from "../services/auth.service";

export default function useVerifyPhone() {
    const location = useLocation();

    const { user } = useAuth();

    const registeredPhone = location.state?.registeredPhone || "";
    const devOtp = location.state?.devOtp || null;

    const [formData, setFormData] = useState({
        phone: registeredPhone || user?.phone || "",
        code: "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [codeSent, setCodeSent] = useState(Boolean(registeredPhone));
    const [countdown, setCountdown] = useState(0);
    const [serverError, setServerError] = useState("");

    const validateField = (name, value) => {
        switch (name) {
            case "phone":
                return value.trim()
                    ? ""
                    : "Le numéro est obligatoire.";

            case "code":
                if (!value) return "Le code est obligatoire.";
                if (!/^\d{6}$/.test(value)) {
                    return "Le code doit contenir 6 chiffres.";
                }
                return "";

            default:
                return "";
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value),
        }));
    };

    const handleBlur = (event) => {
        const { name, value } = event.target;

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value),
        }));
    };

    const handleSendCode = async () => {
        const error = validateField("phone", formData.phone);

        if (error) {
            setErrors((prev) => ({ ...prev, phone: error }));
            return;
        }

        setServerError("");

        try {
            const result = await service.sendOTPPhone(
                formData.phone
            );

            setCodeSent(true);
            setCountdown(60);

            // Si le backend renvoie un OTP de développement,
            // utilise-le dans l'interface après le renvoi.
            // Le hook ne modifie pas la valeur initiale devOtp.
            return result;
        } catch (error) {
            setServerError(
                error.message || "Impossible d'envoyer le code."
            );
        }
    };

    const handleVerify = async (event) => {
        event.preventDefault();
        setServerError("");

        const phoneError = validateField("phone", formData.phone);
        const codeError = validateField("code", formData.code);

        setTouched({ phone: true, code: true });
        setErrors({ phone: phoneError, code: codeError });

        if (phoneError || codeError) return;

        setIsSubmitting(true);

        try {
            const result = await service.verifyPhone({
                phone: formData.phone,
                code: formData.code,
            });

            if (!result.success) {
                throw new Error(
                    result.message || "Impossible de créer le compte."
                );
            }

            return { success: true, data: result.data };
        } catch (error) {
            setServerError(
                error.message || "Code invalide ou expiré."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        touched,
        isSubmitting,
        codeSent,
        countdown,
        devOtp,
        serverError,
        phone: formData.phone,
        handleChange,
        handleBlur,
        handleSendCode,
        handleVerify,
    };
}
