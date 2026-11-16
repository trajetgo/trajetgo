import { useState } from "react";
import service from "../services/teams.service";

const INITIAL_FORM_DATA = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    role: "AGENCY_AGENT",
    agencyId: "",
};

const ALLOWED_ROLES = [
    "COMPANY_ADMIN",
    "AGENCY_AGENT",
    "CONTROLLER",
];

const PHONE_REGEX = /^\+225\d{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizePhone(phone) {
    if (!phone) {
        return "";
    }

    let value = String(phone)
        .trim()
        .replace(/[\s\-().]/g, "");

    if (value.startsWith("00225")) {
        value = value.slice(5);
    }

    if (value.startsWith("+225")) {
        value = value.slice(4);
    }

    if (/^\d{10}$/.test(value)) {
        return `+225${value}`;
    }

    return value;
}

export default function useInviteTeamMember() {
    const [formData, setFormData] = useState(
        INITIAL_FORM_DATA
    );

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const validateField = (name, value) => {
        switch (name) {
            case "firstName": {
                if (!value?.trim()) {
                    return "Le prénom est obligatoire.";
                }
                return "";
            }

            case "lastName": {
                if (!value?.trim()) {
                    return "Le nom est obligatoire.";
                }
                return "";
            }

            case "phone": {
                const normalizedPhone =
                    normalizePhone(value);

                if (!normalizedPhone) {
                    return "Le numéro de téléphone est obligatoire.";
                }

                if (!PHONE_REGEX.test(normalizedPhone)) {
                    return "Numéro de téléphone ivoirien invalide.";
                }

                return "";
            }

            case "email": {
                if (!value?.trim()) {
                    return "";
                }

                if (!EMAIL_REGEX.test(value.trim())) {
                    return "Adresse email invalide.";
                }

                return "";
            }

            case "role": {
                if (!value) {
                    return "Le rôle est obligatoire.";
                }

                if (!ALLOWED_ROLES.includes(value)) {
                    return "Rôle invalide.";
                }

                return "";
            }

            case "agencyId": {
                if (
                    formData.role !== "COMPANY_ADMIN" &&
                    !value
                ) {
                    return "L'agence est obligatoire.";
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
            const error = validateField(
                name,
                formData[name]
            );

            if (error) {
                nextErrors[name] = error;
            }
        });

        return nextErrors;
    };

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        const val =
            type === "checkbox"
                ? checked
                : value;

        setFormData((previous) => ({
            ...previous,
            [name]: val,
        }));

        setServerError("");

        const fieldError = validateField(
            name,
            val
        );

        setErrors((previous) => ({
            ...previous,
            [name]: fieldError,
        }));

        // Si le rôle devient COMPANY_ADMIN,
        // l'agence n'est plus nécessaire.
        if (
            name === "role" &&
            val === "COMPANY_ADMIN"
        ) {
            setFormData((previous) => ({
                ...previous,
                agencyId: "",
            }));

            setErrors((previous) => ({
                ...previous,
                agencyId: "",
            }));
        }

        // Quand on change d'agence, on efface
        // uniquement l'erreur associée si nécessaire.
        if (name === "agencyId") {
            setErrors((previous) => ({
                ...previous,
                agencyId: fieldError,
            }));
        }
    };

    const handleBlur = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        const val =
            type === "checkbox"
                ? checked
                : value;

        setTouched((previous) => ({
            ...previous,
            [name]: true,
        }));

        const fieldError = validateField(
            name,
            val
        );

        setErrors((previous) => ({
            ...previous,
            [name]: fieldError,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setServerError("");

        const validationErrors = validateForm();

        // ✅ Tous les champs touchés
        setTouched({
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            role: true,
            agencyId: true,
        });

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return { success: false, validationError: true };
        }

        setIsSubmitting(true);

        try {
            const payload = {
                firstName: formData.firstName.trim(),   // ✅ ajouté
                lastName: formData.lastName.trim(),     // ✅ ajouté
                phone: normalizePhone(formData.phone),
                email: formData.email.trim() || null,
                role: formData.role,
                agencyId:
                    formData.role === "COMPANY_ADMIN"
                        ? null
                        : formData.agencyId,
            };

            const result = await service.inviteMember(payload);

            if (!result.success) {
                throw new Error(
                    result.message || "Impossible d'envoyer l'invitation."
                );
            }

            resetForm();
            return result;
        } catch (error) {
            setServerError(
                error.message || "Impossible d'envoyer l'invitation."
            );
            return {
                success: false,
                message:
                    error.message || "Impossible d'envoyer l'invitation.",
            };
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM_DATA);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
        setServerError("");
    };

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
    };
}