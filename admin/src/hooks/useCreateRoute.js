import { useEffect, useMemo, useState } from "react";

import service from "../services/routes.service";
import useLocations from "../hooks/useLocations";

import {
    INITIAL_ROUTE_FORM,
    MIN_DISTANCE,
    MAX_DISTANCE,
    MIN_DURATION,
    MAX_DURATION,
    computeDistanceKm,
    MIN_BASE_PRICE,
    MAX_BASE_PRICE,
} from "../utils/route.utils";

/* ------------------------------------------------------------------ */

const makeInitial = () => ({ ...INITIAL_ROUTE_FORM });

/* ------------------------------------------------------------------ */

export default function useCreateRoute() {
    /* ---------- Form ---------- */

    const [formData, setFormData] = useState(makeInitial);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    /* ---------- Villes ---------- */

    const { locations = [], loading: citiesLoading } = useLocations('city');

    /* ---------- Villes sélectionnées ---------- */

    const originCity = useMemo(
        () => locations.find((c) => c.id === formData.originCityId) ?? null,
        [locations, formData.originCityId]
    );

    const destinationCity = useMemo(
        () => locations.find((c) => c.id === formData.destinationCityId) ?? null,
        [locations, formData.destinationCityId]
    );

    /* =========================================================
       Auto-complétion de la distance
    ========================================================= */

    useEffect(() => {
        if (!originCity || !destinationCity) return;

        // Ne pas écraser si l'utilisateur a déjà saisi une valeur
        if (formData.distanceKm) return;

        const km = computeDistanceKm(
            originCity.latitude,
            originCity.longitude,
            destinationCity.latitude,
            destinationCity.longitude
        );

        if (km != null) {
            setFormData((prev) => ({ ...prev, distanceKm: km }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [originCity, destinationCity]);

    /* =========================================================
       Validation
    ========================================================= */

    const validateField = (name, value) => {
        switch (name) {
            case "originCityId": {
                if (!value) return "La ville de départ est obligatoire.";
                if (value === formData.destinationCityId) {
                    return "Les villes de départ et d'arrivée doivent être différentes.";
                }
                return "";
            }

            case "destinationCityId": {
                if (!value) return "La ville d'arrivée est obligatoire.";
                if (value === formData.originCityId) {
                    return "Les villes de départ et d'arrivée doivent être différentes.";
                }
                return "";
            }

            case "distanceKm": {
                if (value === "" || value == null) return "";  // optionnel
                const num = Number(value);
                if (!Number.isFinite(num)) {
                    return "La distance doit être un nombre.";
                }
                if (num < MIN_DISTANCE) {
                    return `La distance minimale est ${MIN_DISTANCE} km.`;
                }
                if (num > MAX_DISTANCE) {
                    return `La distance maximale est ${MAX_DISTANCE} km.`;
                }
                return "";
            }

            case "durationMin": {
                if (value === "" || value == null) return "";  // optionnel
                const num = Number(value);
                if (!Number.isInteger(num)) {
                    return "La durée doit être un nombre entier de minutes.";
                }
                if (num < MIN_DURATION) {
                    return `La durée minimale est ${MIN_DURATION} minutes.`;
                }
                if (num > MAX_DURATION) {
                    return `La durée maximale est ${MAX_DURATION} minutes.`;
                }
                return "";
            }

            case "basePrice": {
                if (value === "" || value == null) {
                    return "Le prix de base est obligatoire.";
                }

                const num = Number(value);

                if (!Number.isFinite(num)) {
                    return "Le prix doit être un nombre.";
                }

                if (num < MIN_BASE_PRICE) {
                    return `Le prix minimum est ${MIN_BASE_PRICE} FCFA.`;
                }

                if (num > MAX_BASE_PRICE) {
                    return `Le prix maximum est ${MAX_BASE_PRICE} FCFA.`;
                }

                return "";
            }

            default:
                return "";
        }
    };

    const validateForm = () => {
        const nextErrors = {};

        // Origine
        const originErr = validateField("originCityId", formData.originCityId);
        if (originErr) nextErrors.originCityId = originErr;

        // Destination
        const destErr = validateField("destinationCityId", formData.destinationCityId);
        if (destErr) nextErrors.destinationCityId = destErr;

        // Distance
        const distErr = validateField("distanceKm", formData.distanceKm);
        if (distErr) nextErrors.distanceKm = distErr;

        // Durée
        const durErr = validateField("durationMin", formData.durationMin);
        if (durErr) nextErrors.durationMin = durErr;

        // ✅ Prix de base
        const priceErr = validateField("basePrice", formData.basePrice);
        if (priceErr) nextErrors.basePrice = priceErr;

        return nextErrors;
    };

    /* =========================================================
       Handlers
    ========================================================= */

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const nextValue = type === "checkbox" ? checked : value;

        setFormData((prev) => ({ ...prev, [name]: nextValue }));
        setServerError("");

        const fieldError = validateField(name, nextValue);

        setErrors((prev) => ({
            ...prev,
            [name]: fieldError,
        }));
    };

    const handleBlur = (e) => {
        const { name, value, type, checked } = e.target;

        const nextValue = type === "checkbox" ? checked : value;

        setTouched((prev) => ({ ...prev, [name]: true }));

        const fieldError = validateField(name, nextValue);

        setErrors((prev) => ({ ...prev, [name]: fieldError }));
    };

    /* =========================================================
       Submit
    ========================================================= */

    const handleSubmit = async (e) => {
        e?.preventDefault?.();

        setServerError("");

        const validationErrors = validateForm();

        const allTouched = Object.keys(formData).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {}
        );

        setTouched(allTouched);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return { success: false, validationError: true };
        }


        setIsSubmitting(true);

        try {
            const payload = {
                companyId: formData.companyId,
                originCityId: formData.originCityId,
                destinationCityId: formData.destinationCityId,
                distanceKm: formData.distanceKm
                    ? Number(formData.distanceKm)
                    : null,
                durationMin: formData.durationMin
                    ? Number(formData.durationMin)
                    : null,
                basePrice: Number(formData.basePrice),
                active: formData.active,
            };

            const result = await service.createRoute(payload);

            if (!result.success) {
                throw new Error(
                    result.message || "Impossible de créer la ligne."
                );
            }

            resetForm();

            return result;
        } catch (error) {
            const message =
                error.message || "Impossible de créer la ligne.";

            /* Ligne déjà existante */
            if (
                error.status === 409 ||
                message.toLowerCase().includes("exist")
            ) {
                setErrors((prev) => ({
                    ...prev,
                    destinationCityId:
                        "Cette ligne existe déjà pour votre compagnie.",
                }));
                setTouched((prev) => ({
                    ...prev,
                    destinationCityId: true,
                }));

                return { success: false, validationError: true };
            }

            setServerError(message);

            return { success: false, message };
        } finally {
            setIsSubmitting(false);
        }
    };

    /* =========================================================
       Reset
    ========================================================= */

    const resetForm = () => {
        setFormData(makeInitial());
        setErrors({});
        setTouched({});
        setServerError("");
    };

    /* =========================================================
       Return
    ========================================================= */

    return {
        /* Data */
        formData,
        setFormData,

        /* Options */
        locations,
        citiesLoading,

        originCity,
        destinationCity,

        /* Errors */
        errors,
        touched,
        serverError,

        /* State */
        isSubmitting,

        /* Handlers */
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
    };
}