import { useState } from "react";
import service from "../services/agencies.service.js";

export default function useCreateAgency() {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        locationId: "",
        description: "",
        phone: "",
        email: "",
        address: "",
    });

    const validateField = (name, value) => {
        switch (name) {
            case "name":
                if (!value.trim()) {
                    return "Le nom de l'agence est obligatoire.";
                }

                if (value.trim().length < 2) {
                    return "Le nom doit contenir au moins 2 caractères.";
                }

                return "";

            case "code":
                if (!value.trim()) {
                    return "Le code de l'agence est obligatoire.";
                }

                if (value.trim().length < 2) {
                    return "Le code doit contenir au moins 2 caractères.";
                }

                return "";

            case "locationId":
                if (!value) {
                    return "Veuillez sélectionner une ville.";
                }

                return "";

            case "phone":
                if (!value) {
                    return "";
                }

                const phoneRegex = /^\+?[0-9]{8,15}$/;

                if (!phoneRegex.test(value)) {
                    return "Entrez un numéro de téléphone valide.";
                }

                return "";

            case "email":
                if (!value) {
                    return "";
                }

                const emailRegex =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(value)) {
                    return "Entrez une adresse email valide.";
                }

                return "";

            default:
                return "";
        }
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

        setFormData((prev) => ({
            ...prev,
            [name]: val,
        }));

        const fieldError =
            validateField(name, val);

        setErrors((prev) => ({
            ...prev,
            [name]: fieldError,
        }));

        setServerError("");
    };

    const handleBlur = (e) => {
        const {
            name,
            value,
        } = e.target;

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        const fieldError =
            validateField(name, value);

        setErrors((prev) => ({
            ...prev,
            [name]: fieldError,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        Object.entries(formData).forEach(
            ([name, value]) => {
                const error =
                    validateField(
                        name,
                        value
                    );

                if (error) {
                    newErrors[name] = error;
                }
            }
        );

        setErrors(newErrors);

        setTouched({
            name: true,
            code: true,
            locationId: true,
            description: true,
            phone: true,
            email: true,
            address: true,
        });

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return {
                success: false,
            };
        }

        setIsSubmitting(true);
        setServerError("");

        try {
            const payload = {
                name: formData.name.trim(),
                code: formData.code.trim().toUpperCase(),
                locationId: formData.locationId || null,
                description:
                    formData.description.trim() || null,
                phone:
                    formData.phone.trim() || null,
                email:
                    formData.email.trim() || null,
                address:
                    formData.address.trim() || null,
            };

            const result =
                await service.createAgency(payload);

            if (!result.success) {
                setServerError(
                    result.message ||
                    "Impossible de créer l'agence."
                );

                return {
                    success: false,
                };
            }

            return {
                success: true,
                data: result.data,
            };

        } catch (error) {
            setServerError(
                error.message ||
                "Impossible de créer l'agence."
            );

            return {
                success: false,
                error,
            };

        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            code: "",
            locationId: "",
            description: "",
            phone: "",
            email: "",
            address: "",
        });

        setErrors({});
        setIsSubmitting(false);
        setServerError("");
        setTouched({});
    }

    return {
        isSubmitting,
        serverError,
        formData,
        errors,
        touched,
        handleSubmit,
        handleBlur,
        handleChange,
        resetForm,
    };
}