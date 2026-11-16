import { useState } from "react";
import service from "../services/locations.service";

export default function useCreateLocation(type) {
    const initialFormData = {
        name: "",
        code: "",
        coords: {
            lat: "",
            lng: "",
        },
    };

    if (type === "COUNTRY") {
        initialFormData.phoneCode = "";
    }

    if (type === "CITY") {
        initialFormData.countryId = "";
    }

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const updateField = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    const updateCoords = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            coords: {
                ...prev.coords,
                [field]: value,
            },
        }));

        setErrors((prev) => ({
            ...prev,
            [`coords.${field}`]: "",
        }));
    };

    const touchField = (field) => {
        setTouched((prev) => ({
            ...prev,
            [field]: true,
        }));
    };

    const validate = () => {
        const nextErrors = {};

        if (!formData.name.trim()) {
            nextErrors.name = "Le nom est obligatoire.";
        }

        if (!formData.code.trim()) {
            nextErrors.code = "Le code est obligatoire.";
        }

        if (type === "COUNTRY" && !formData.phoneCode.trim()) {
            nextErrors.phoneCode = "L'indicatif téléphonique est obligatoire.";
        }

        if (type === "CITY" && !formData.countryId) {
            nextErrors.countryId = "Le pays est obligatoire.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const submit = async () => {
        setServerError("");

        setTouched({
            name: true,
            code: true,
            phoneCode: type === "COUNTRY",
            countryId: type === "CITY",
        });

        if (!validate()) {
            return {
                success: false,
                validation: true,
            };
        }

        setIsSubmitting(true);

        try {
            const payload = {
                type,
                name: formData.name.trim(),
                code: formData.code.trim(),
                coords: {
                    lat: formData.coords.lat
                        ? Number(formData.coords.lat)
                        : null,

                    lng: formData.coords.lng
                        ? Number(formData.coords.lng)
                        : null,
                },
            };

            if (type === "COUNTRY") {
                payload.phoneCode = formData.phoneCode.trim();
            }

            if (type === "CITY") {
                payload.countryId = formData.countryId;
            }

            const result = await service.createLocation(payload);

            if (!result.success) {
                setServerError(
                    result.message || "Impossible de créer ce lieu."
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
            const message =
                error.message ||
                "Une erreur est survenue lors de la création.";

            setServerError(message);

            return {
                success: false,
            };
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        touched,
        isSubmitting,
        serverError,

        setFormData,
        updateField,
        updateCoords,
        touchField,

        validate,
        submit,
    };
}