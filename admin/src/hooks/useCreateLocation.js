import { useState } from "react";
import service from "../services/locations.service";

export default function useCreateLocation(rawType) {
    const type = rawType?.toLowerCase() ?? null;

    const initialFormData = {
        name: "",
        coords: { lat: "", lng: "" },
    };

    if (type === "country") {
        initialFormData.phoneCode = "";
        initialFormData.code = "";
    }

    if (type === "region") {
        initialFormData.code = "";
        initialFormData.countryId = "";
    }

    if (type === "city") {
        initialFormData.countryId = "";
        initialFormData.regionId = "";
    }

    if (type === "location") {
        initialFormData.cityId = "";
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

        if (!formData.name?.trim()) {
            nextErrors.name = "Le nom est obligatoire.";
        }

        // Le code n'est obligatoire que pour country et city
        if (type === "country") {
            if (!formData.code?.trim()) {
                nextErrors.code = "Le code est obligatoire.";
            }
        }

        if (type === "country" && !formData.phoneCode?.trim()) {
            nextErrors.phoneCode = "L'indicatif téléphonique est obligatoire.";
        }

        if ((type === "region" || type === "city") && !formData.countryId) {
            nextErrors.countryId = "Le pays est obligatoire.";
        }

        if (type === "location" && !formData.cityId) {
            nextErrors.cityId = "La ville est obligatoire.";
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
                type,                                   // ← "country" | "region" | …
                name: formData.name.trim(),
                ...(type === "country" && {
                    code: formData.code.trim().toUpperCase(),
                    phoneCode: formData.phoneCode.trim(),
                }),
                ...(type === "region" && {
                    code: formData.code?.trim() || null,
                    countryId: formData.countryId,
                }),
                ...(type === "city" && {
                    // code: formData.code.trim().toUpperCase(),
                    countryId: formData.countryId,
                    regionId: formData.regionId || null,
                }),
                ...(type === "location" && {
                    cityId: formData.cityId,
                }),
            };

            if (formData.coords?.lat || formData.coords?.lng) {
                payload.coords = {
                    lat: formData.coords.lat,
                    lng: formData.coords.lng,
                };
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