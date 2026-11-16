import { useState } from "react";
import service from "../services/buses.service";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const INITIAL_FORM_DATA = {
    registrationNumber: "",
    name: "",
    capacity: "",
    status: "ACTIVE",
};

const ALLOWED_STATUSES = ["ACTIVE", "INACTIVE", "MAINTENANCE"];

const REGISTRATION_REGEX = /^[A-Z0-9\- ]{3,20}$/i;

const MIN_CAPACITY = 1;
const MAX_CAPACITY = 100;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const normalizeRegistration = (value) =>
    String(value ?? "").trim().toUpperCase();

/* ------------------------------------------------------------------ */

export default function useCreateBus() {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    /* =========================================================
       Validation
       ========================================================= */

    const validateField = (name, value) => {
        switch (name) {
            case "registrationNumber": {
                const normalized = normalizeRegistration(value);

                if (!normalized) {
                    return "Le numéro d'immatriculation est obligatoire.";
                }

                if (!REGISTRATION_REGEX.test(normalized)) {
                    return "Format invalide (lettres, chiffres, tirets — 3 à 20 caractères).";
                }

                return "";
            }

            case "name": {
                if (!value?.trim()) return "";
                if (value.trim().length < 2) {
                    return "Le nom doit contenir au moins 2 caractères.";
                }
                if (value.trim().length > 50) {
                    return "Le nom ne peut pas dépasser 50 caractères.";
                }
                return "";
            }

            case "capacity": {
                if (value === "" || value === null || value === undefined) {
                    return "La capacité est obligatoire.";
                }

                const num = Number(value);

                if (!Number.isInteger(num)) {
                    return "La capacité doit être un nombre entier.";
                }

                if (num < MIN_CAPACITY) {
                    return `La capacité minimale est ${MIN_CAPACITY}.`;
                }

                if (num > MAX_CAPACITY) {
                    return `La capacité maximale est ${MAX_CAPACITY}.`;
                }

                return "";
            }

            case "status": {
                if (!value) return "Le statut est obligatoire.";
                if (!ALLOWED_STATUSES.includes(value)) {
                    return "Statut invalide.";
                }
                return "";
            }

            default:
                return "";
        }
    };

    const validateForm = () => {
        const nextErrors = {};

        Object.keys(formData).forEach((name) => {
            const error = validateField(name, formData[name]);
            if (error) nextErrors[name] = error;
        });

        return nextErrors;
    };

    /* =========================================================
       Handlers
       ========================================================= */

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        const nextValue = type === "checkbox" ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: nextValue,
        }));

        setServerError("");

        // Validation live
        const fieldError = validateField(name, nextValue);

        setErrors((prev) => ({
            ...prev,
            [name]: fieldError,
        }));
    };

    const handleBlur = (e) => {
        const { name, value, type, checked } = e.target;

        const nextValue = type === "checkbox" ? checked : value;

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        const fieldError = validateField(name, nextValue);

        setErrors((prev) => ({
            ...prev,
            [name]: fieldError,
        }));
    };

    /* =========================================================
       Submit
       ========================================================= */

    const handleSubmit = async (e) => {
        e.preventDefault?.();

        setServerError("");

        const validationErrors = validateForm();

        // Marquer tous les champs comme touchés
        setTouched({
            registrationNumber: true,
            name: true,
            capacity: true,
            status: true,
        });

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return { success: false, validationError: true };
        }

        setIsSubmitting(true);

        try {
            const payload = {
                registrationNumber: normalizeRegistration(
                    formData.registrationNumber
                ),
                name: formData.name.trim() || null,
                capacity: Number(formData.capacity),
                status: formData.status,
            };

            const result = await service.createBus(payload);

            if (!result.success) {
                throw new Error(
                    result.message || "Impossible de créer le bus."
                );
            }

            resetForm();

            return result;
        } catch (error) {
            // Gestion spécifique : immatriculation en double
            const message =
                error.message || "Impossible de créer le bus.";

            if (
                error.status === 409 ||
                message.toLowerCase().includes("immatriculation") ||
                message.toLowerCase().includes("registration")
            ) {
                setErrors((prev) => ({
                    ...prev,
                    registrationNumber:
                        "Ce numéro d'immatriculation est déjà utilisé.",
                }));

                return {
                    success: false,
                    validationError: true,
                };
            }

            setServerError(message);

            return {
                success: false,
                message,
            };
        } finally {
            setIsSubmitting(false);
        }
    };

    /* =========================================================
       Reset
       ========================================================= */

    const resetForm = () => {
        setFormData(INITIAL_FORM_DATA);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
        setServerError("");
    };

    /* =========================================================
       Return
       ========================================================= */

    return {
        formData,
        setFormData,

        errors,
        touched,

        isSubmitting,
        serverError,

        handleChange,
        handleBlur,
        handleSubmit,

        resetForm,

        // Utile pour les selects côté form
        allowedStatuses: ALLOWED_STATUSES,
    };
}