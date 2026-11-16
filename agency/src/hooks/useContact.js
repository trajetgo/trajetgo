import { useState } from "react";
import service from "../services/contact.service";

export default function useContact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');

    // Validation business logic
    const validateField = (name, value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        switch (name) {
            case "name":
                if (!value.trim()) {
                    return "Le nom est obligatoire.";
                }

                if (value.trim().length < 2) {
                    return "Le nom doit contenir au moins 2 caractères.";
                }

                return "";

            case "email":
                if (!value.trim()) {
                    return "L'adresse email est obligatoire.";
                }

                if (!emailRegex.test(value.trim())) {
                    return "Adresse email invalide.";
                }

                return "";

            case "subject":
                if (!value) {
                    return "Veuillez sélectionner un sujet.";
                }

                return "";

            case "message":
                if (!value.trim()) {
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

    // Updates form state and runs validation dynamically
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

    // Marks a field as touched when a user clicks/tabs out of it
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

    // Safe form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        const fields = Object.keys(form);
        const newErrors = {};

        fields.forEach((field) => {
            const error = validateField(
                field,
                form[field]
            );

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
            const result = await service.sendMessage(form);

            if (result.success) {
                return {
                    success: true,
                    data: result.data,
                };
            }

            throw new Error(
                result.message ||
                "Erreur lors de l'envoi du message."
            );
        } catch (error) {
            setServerError(
                error.message ||
                "Une erreur est survenue lors de l'envoi du message."
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
            subject: "",
            message: "",
        });

        setErrors({});
        setTouched({});
        setServerError("");
    }

    return {
        form,
        errors,
        touched,
        serverError,
        isSubmitting,

        handleBlur,
        handleChange,
        handleReset,
        handleSubmit
    }
};