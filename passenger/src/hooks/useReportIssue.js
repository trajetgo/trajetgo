import { useState } from "react";

import service from "../services/report-issue.service";

export default function useReportIssue() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        type: "",
        reference: "",
        description: "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const validateField = (name, value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        switch (name) {
            case "name":
                if (!value) {
                    return "Le nom est obligatoire.";
                }

                if (value.trim().length < 2) {
                    return "Le nom doit contenir au moins 2 caractères.";
                }

                return "";

            case "email":
                if (!value) {
                    return "L'adresse email est obligatoire.";
                }

                if (!emailRegex.test(value)) {
                    return "Adresse email invalide.";
                }

                return "";

            case "type":
                if (!value) {
                    return "Veuillez sélectionner un sujet.";
                }

                return "";

            case "description":
                if (!value) {
                    return "Le message est obligatoire.";
                }

                if (value.trim().length < 10) {
                    return "Le message doit contenir au moins 10 caractères.";
                }

                return "";

            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        const fieldError = validateField(name, value);

        setErrors((prev) => ({
            ...prev,
            [name]: fieldError,
        }));

        setServerError("");
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        const fieldError = validateField(name, value);

        setErrors((prev) => ({
            ...prev,
            [name]: fieldError,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fields = Object.keys(form);
        const newErrors = {};

        fields.forEach((field) => {
            const error = validateField(field, form[field]);

            if (error) {
                newErrors[field] = error;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            setTouched(
                fields.reduce(
                    (acc, field) => ({
                        ...acc,
                        [field]: true,
                    }),
                    {}
                )
            );

            return;
        }

        setIsSubmitting(true);
        setServerError("");

        try {
            const result = await service.report(form);

            if (result.success) {
                return {
                    success: true,
                    data: result.data,
                };
            }

            throw new Error(
                result.message ||
                "Une erreur est survenue lors de l'envoi du signalement."
            );
        } catch (error) {
            setServerError(
                error.message ||
                "Une erreur est survenue lors de l'envoi du signalement."
            );

            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setForm({
            name: "",
            email: "",
            type: "",
            reference: "",
            description: "",
        });

        setErrors({});
        setTouched({});
        setServerError("");
    };

    return {
        form,
        errors,
        touched,
        serverError,
        isSubmitting,
        handleBlur,
        handleChange,
        handleReset,
        handleSubmit,
    };
}