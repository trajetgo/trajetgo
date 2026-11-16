import { useCallback, useState } from "react";
import service from "../services/trips.service";

import {
    INITIAL_TRIP_FORM,
    TRIP_STEPS,
    MIN_PRICE,
    MAX_PRICE,
    getStepFields,
} from "../utils/trip.utils";

/* ------------------------------------------------------------------ */

const makeInitial = () => ({ ...INITIAL_TRIP_FORM });

/* ------------------------------------------------------------------ */

export default function useCreateTrip() {
    /* ---------- Form ---------- */

    const [formData, setFormData] = useState(makeInitial);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    /* ---------- État ---------- */

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    /* ---------- Steps ---------- */

    const [currentStep, setCurrentStep] = useState(0);

    const totalSteps = TRIP_STEPS.length;
    const step = TRIP_STEPS[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === totalSteps - 1;

    /* =========================================================
       Validation
    ========================================================= */

    const validateField = useCallback(
        (name, value, allData = formData) => {
            switch (name) {
                case "routeId":
                    return value ? "" : "Veuillez sélectionner une ligne.";

                case "busId":
                    return value ? "" : "Veuillez sélectionner un bus.";

                case "departureLocationId":
                    return value
                        ? ""
                        : "Veuillez sélectionner l'agence de départ.";

                case "arrivalLocationId":
                    if (!value) {
                        return "Veuillez sélectionner l'agence d'arrivée.";
                    }
                    if (value === allData.departureLocationId) {
                        return "Les agences de départ et d'arrivée doivent être différentes.";
                    }
                    return "";

                case "departureDate":
                    return value ? "" : "La date de départ est obligatoire.";

                case "departureTime":
                    return value ? "" : "L'heure de départ est obligatoire.";

                case "arrivalDate":
                    return "";    // optionnel

                case "arrivalTime":
                    return "";    // optionnel

                case "price": {
                    if (value === "" || value == null) {
                        return "Le prix est obligatoire.";
                    }
                    const num = Number(value);
                    if (!Number.isFinite(num)) {
                        return "Le prix doit être un nombre.";
                    }
                    if (num < MIN_PRICE) {
                        return `Le prix minimum est ${MIN_PRICE} FCFA.`;
                    }
                    if (num > MAX_PRICE) {
                        return `Le prix maximum est ${MAX_PRICE} FCFA.`;
                    }
                    return "";
                }

                default:
                    return "";
            }
        },
        [formData]
    );

    /* Valide uniquement une étape */
    const validateStep = useCallback(
        (stepIndex) => {
            const fields = getStepFields(stepIndex);
            const stepErrors = {};

            fields.forEach((name) => {
                const error = validateField(name, formData[name]);
                if (error) stepErrors[name] = error;
            });

            return stepErrors;
        },
        [formData, validateField]
    );

    /* Valide tout le form */
    const validateForm = useCallback(() => {
        const nextErrors = {};

        Object.entries(formData).forEach(([name, value]) => {
            const error = validateField(name, value);
            if (error) nextErrors[name] = error;
        });

        // Vérif supplémentaire : gares différentes
        if (
            formData.departureLocationId &&
            formData.arrivalLocationId &&
            formData.departureLocationId === formData.arrivalLocationId
        ) {
            nextErrors.arrivalLocationId =
                "Les agences de départ et d'arrivée doivent être différentes.";
        }

        // Vérif dates : arrivée > départ
        if (
            formData.departureDate &&
            formData.departureTime &&
            formData.arrivalDate &&
            formData.arrivalTime
        ) {
            const departure = new Date(
                `${formData.departureDate}T${formData.departureTime}`
            );
            const arrival = new Date(
                `${formData.arrivalDate}T${formData.arrivalTime}`
            );

            if (arrival <= departure) {
                nextErrors.arrivalTime =
                    "L'arrivée doit être après le départ.";
            }
        }

        return nextErrors;
    }, [formData, validateField]);

    /* =========================================================
       Handlers
    ========================================================= */

    const handleChange = useCallback(
        (e) => {
            const { name, value, type, checked } = e.target;
            const nextValue = type === "checkbox" ? checked : value;

            // Cas spécial : changement de departureDate et sameDay actif
            if (name === "departureDate") {
                setFormData((prev) => ({
                    ...prev,
                    departureDate: nextValue,
                    arrivalDate: prev.sameDay ? nextValue : prev.arrivalDate,
                }));
                // ... validation ...
                return;
            }

            // Cas spécial : changement de route → reset gares
            if (name === "routeId") {
                setFormData((prev) => ({
                    ...prev,
                    routeId: value,
                    departureLocationId: "",
                    arrivalLocationId: "",
                }));

                setErrors((prev) => ({
                    ...prev,
                    routeId: "",
                    departureLocationId: "",
                    arrivalLocationId: "",
                }));

                setServerError("");
                return;
            }

            setFormData((prev) => ({ ...prev, [name]: nextValue }));
            setServerError("");

            const fieldError = validateField(name, nextValue);

            setErrors((prev) => ({ ...prev, [name]: fieldError }));
        },
        [validateField]
    );

    const handleBlur = useCallback(
        (e) => {
            const { name, value } = e.target;

            setTouched((prev) => ({ ...prev, [name]: true }));

            const fieldError = validateField(name, value);

            setErrors((prev) => ({ ...prev, [name]: fieldError }));
        },
        [validateField]
    );

    /* =========================================================
       Navigation
    ========================================================= */

    const goNext = useCallback(() => {
        const stepErrors = validateStep(currentStep);

        // Marquer tous les champs de l'étape comme touchés
        const stepTouched = getStepFields(currentStep).reduce(
            (acc, field) => ({ ...acc, [field]: true }),
            {}
        );

        setTouched((prev) => ({ ...prev, ...stepTouched }));
        setErrors((prev) => ({ ...prev, ...stepErrors }));

        if (Object.keys(stepErrors).length > 0) {
            return { success: false, validationError: true };
        }

        if (!isLastStep) {
            setCurrentStep((s) => s + 1);
        }

        return { success: true };
    }, [currentStep, isLastStep, validateStep]);

    const goPrev = useCallback(() => {
        if (!isFirstStep) {
            setCurrentStep((s) => s - 1);
        }
    }, [isFirstStep]);

    const goTo = useCallback(
        (index) => {
            if (index < 0 || index >= totalSteps) return;
            if (index > currentStep) return;  // pas de saut en avant
            setCurrentStep(index);
        },
        [currentStep, totalSteps]
    );

    /* =========================================================
       Submit
    ========================================================= */

    const handleSubmit = useCallback(
        async (e) => {
            e?.preventDefault?.();

            // Si pas à la dernière étape → on avance
            if (!isLastStep) {
                return goNext();
            }

            setServerError("");

            const validationErrors = validateForm();

            setTouched(
                Object.keys(formData).reduce(
                    (acc, key) => ({ ...acc, [key]: true }),
                    {}
                )
            );

            setErrors(validationErrors);

            if (Object.keys(validationErrors).length > 0) {
                // Trouver la 1ère étape en erreur
                const firstErrorStep = TRIP_STEPS.findIndex((s) =>
                    s.fields.some((field) => validationErrors[field])
                );

                if (firstErrorStep !== -1) {
                    setCurrentStep(firstErrorStep);
                }

                return { success: false, validationError: true };
            }

            setIsSubmitting(true);

            try {
                // ✅ Fusionner date + heure en ISO
                const departureAt = new Date(
                    `${formData.departureDate}T${formData.departureTime}:00`
                ).toISOString();

                const arrivalAt =
                    formData.arrivalDate && formData.arrivalTime
                        ? new Date(
                            `${formData.arrivalDate}T${formData.arrivalTime}:00`
                        ).toISOString()
                        : null;

                const payload = {
                    routeId: formData.routeId,
                    busId: formData.busId,
                    departureAgencyId: formData.departureLocationId,
                    arrivalAgencyId: formData.arrivalLocationId,
                    departureAt,
                    arrivalAt,
                    price: Number(formData.price),
                };

                const result = await service.createTrip(payload);

                if (!result.success) {
                    throw new Error(
                        result.message || "Impossible de créer le voyage."
                    );
                }

                resetForm();

                return { success: true, data: result.data };
            } catch (error) {
                setServerError(
                    error.message || "Impossible de créer le voyage."
                );
                return { success: false, message: error.message };
            } finally {
                setIsSubmitting(false);
            }
        },
        [formData, isLastStep, goNext, validateForm]
    );

    /* =========================================================
       Reset
    ========================================================= */

    const resetForm = useCallback(() => {
        setFormData(makeInitial());
        setErrors({});
        setTouched({});
        setServerError("");
        setIsSubmitting(false);
        setCurrentStep(0);
    }, []);

    /* =========================================================
       Return
    ========================================================= */

    return {
        /* Data */
        formData,
        setFormData,

        /* Errors */
        errors,
        touched,
        serverError,

        /* Submitting */
        isSubmitting,

        /* Steps */
        STEPS: TRIP_STEPS,
        currentStep,
        totalSteps,
        step,
        isFirstStep,
        isLastStep,

        /* Handlers */
        handleChange,
        handleBlur,
        handleSubmit,

        /* Navigation */
        goNext,
        goPrev,
        goTo,

        /* Utils */
        resetForm,
    };
}