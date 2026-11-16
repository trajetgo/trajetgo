import { useState } from "react";
import service from "../services/schedules.service";
import {
    INITIAL_SCHEDULE_FORM,
    SCHEDULE_STEPS,
} from "../utils/schedule.utils";

/* ------------------------------------------------------------------ */

function uuid() {
    return (
        crypto.randomUUID?.() ??
        `dep-${Date.now()}-${Math.random().toString(36).slice(2)}`
    );
}

const makeInitial = () => ({
    ...INITIAL_SCHEDULE_FORM,
    departures: [
        {
            id: uuid(),
            busId: "",
            departureTime: "",
        },
    ],
});

/* ------------------------------------------------------------------ */

export default function useCreateSchedule({ routes = [] } = {}) {
    const [formData, setFormData] = useState(makeInitial);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");
    const [currentStep, setCurrentStep] = useState(0);

    const step = SCHEDULE_STEPS[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === SCHEDULE_STEPS.length - 1;

    /* ---------- Route sélectionnée ---------- */

    const selectedRoute =
        routes.find((r) => r.id === formData.routeId) ?? null;

    /* =========================================================
       updateField / updateDays / touchField
    ========================================================= */

    const updateField = (field, value) => {
        setFormData((current) => {
            if (field === "companyId") {
                return {
                    ...current,
                    companyId: value,
                    routeId: "",
                    departureAgencyId: "",
                    arrivalAgencyId: "",
                    departures: [
                        {
                            id: uuid(),
                            busId: "",
                            departureTime: "",
                        },
                    ],
                };
            }

            if (field === "routeId") {
                return {
                    ...current,
                    routeId: value,
                    departureAgencyId: "",
                    arrivalAgencyId: "",
                };
            }

            return { ...current, [field]: value };
        });

        setErrors({});
    };

    const updateDays = (day) => {
        setFormData((current) => {
            const exists = current.daysOfWeek.includes(day);

            return {
                ...current,
                daysOfWeek: exists
                    ? current.daysOfWeek.filter((item) => item !== day)
                    : [...current.daysOfWeek, day],
            };
        });

        setErrors((current) => ({ ...current, daysOfWeek: "" }));
    };

    const touchField = (field) => {
        setTouched(
            (current) => ({
                ...current,
                [field]: true
            })
        );
    };

    /* =========================================================
       Départs — CRUD
    ========================================================= */

    const addDeparture = () => {
        setFormData((prev) => ({
            ...prev,
            departures: [
                ...prev.departures,
                {
                    id: uuid(),
                    busId: "",
                    departureTime: "",
                },
            ],
        }));
    };

    const updateDeparture = (id, field, value) => {
        setFormData((prev) => ({
            ...prev,
            departures: prev.departures.map((d) =>
                d.id === id
                    ? {
                        ...d,
                        [field]: value
                    }
                    : d
            ),
        }));

        setErrors((prev) => {
            const next = { ...prev };
            delete next[`departure-${id}-${field}`];
            return next;
        });
    };

    const removeDeparture = (id) => {
        setFormData((prev) => ({
            ...prev,
            departures: prev.departures.filter(
                (d) => d.id !== id
            ),
        }));
    };

    /* =========================================================
       Validation des départs (bus + heure uniquement)
    ========================================================= */

    const validateDepartures = () => {
        const nextErrors = {};

        if (formData.departures.length === 0) {
            nextErrors.departures = "Ajoutez au moins un départ.";
            return nextErrors;
        }

        const seenTimes = new Set();

        formData.departures.forEach((dep) => {
            const prefix = `departure-${dep.id}`;

            if (!dep.busId) {
                nextErrors[`${prefix}-busId`] = "Sélectionnez un bus.";
            }

            if (!dep.departureTime) {
                nextErrors[`${prefix}-departureTime`] =
                    "L'heure est obligatoire.";
            } else if (seenTimes.has(dep.departureTime)) {
                nextErrors[`${prefix}-departureTime`] =
                    "Cette heure est déjà utilisée.";
            } else {
                seenTimes.add(dep.departureTime);
            }
        });

        return nextErrors;
    };

    /* =========================================================
       Validation globale
    ========================================================= */

    const validateFields = (fields) => {
        const nextErrors = {};

        fields.forEach((field) => {
            switch (field) {
                case "routeId":
                    if (!formData.routeId) {
                        nextErrors.routeId = "La ligne est obligatoire.";
                    }
                    break;

                case "departureAgencyId":
                    if (!formData.departureAgencyId) {
                        nextErrors.departureAgencyId =
                            "L'agence de départ est obligatoire.";
                    }
                    break;

                case "arrivalAgencyId":
                    if (!formData.arrivalAgencyId) {
                        nextErrors.arrivalAgencyId =
                            "L'agence d'arrivée est obligatoire.";
                    } else if (
                        formData.departureAgencyId &&
                        formData.departureAgencyId ===
                        formData.arrivalAgencyId
                    ) {
                        nextErrors.arrivalAgencyId =
                            "Les agences doivent être différentes.";
                    }
                    break;

                case "departures": {
                    Object.assign(nextErrors, validateDepartures());
                    break;
                }

                case "daysOfWeek":
                    if (!formData.daysOfWeek.length) {
                        nextErrors.daysOfWeek =
                            "Sélectionnez au moins un jour.";
                    }
                    break;

                case "startDate":
                    if (!formData.startDate) {
                        nextErrors.startDate =
                            "La date de début est obligatoire.";
                    }
                    break;

                case "endDate":
                    if (
                        formData.endDate &&
                        formData.startDate &&
                        formData.endDate < formData.startDate
                    ) {
                        nextErrors.endDate =
                            "La date de fin doit être après le début.";
                    }
                    break;

                default:
                    break;
            }
        });

        setErrors((current) => ({
            ...current,
            ...nextErrors,
            ...Object.fromEntries(
                fields
                    .filter((field) => !nextErrors[field])
                    .map((field) => [field, ""])
            ),
        }));

        return Object.keys(nextErrors).length === 0;
    };

    const validateStep = (stepIndex = currentStep) => {
        const stepToValidate = SCHEDULE_STEPS[stepIndex];
        if (!stepToValidate) return false;

        setTouched((current) => ({
            ...current,
            ...Object.fromEntries(
                stepToValidate.fields.map((field) => [field, true])
            ),
        }));

        return validateFields(stepToValidate.fields);
    };

    const validate = () => {
        const fields = SCHEDULE_STEPS.flatMap((item) => item.fields);

        setTouched((current) => ({
            ...current,
            ...Object.fromEntries(fields.map((field) => [field, true])),
        }));

        return validateFields(fields);
    };

    /* =========================================================
       Navigation
    ========================================================= */

    const goNext = () => {
        if (!validateStep(currentStep)) return false;
        setCurrentStep((current) =>
            Math.min(current + 1, SCHEDULE_STEPS.length - 1)
        );
        return true;
    };

    const goPrev = () => {
        setCurrentStep((current) => Math.max(current - 1, 0));
    };

    const goTo = (stepIndex) => {
        if (stepIndex < 0 || stepIndex >= SCHEDULE_STEPS.length) return false;

        if (stepIndex > currentStep) {
            const allFieldsToValidate = [];

            for (let i = currentStep; i < stepIndex; i++) {
                allFieldsToValidate.push(...SCHEDULE_STEPS[i].fields);
            }

            setTouched((current) => ({
                ...current,
                ...Object.fromEntries(
                    allFieldsToValidate.map((field) => [field, true])
                ),
            }));

            if (!validateFields(allFieldsToValidate)) return false;
        }

        setCurrentStep(stepIndex);
        return true;
    };

    /* =========================================================
       Submit
    ========================================================= */

    const handleSubmit = async (e) => {
        e?.preventDefault?.();

        setServerError("");

        const departureErrors = validateDepartures();
        const validForm = validate();

        if (!validForm || Object.keys(departureErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...departureErrors }));
            return { success: false, validation: true };
        }

        setIsSubmitting(true);

        try {
            const payload = {
                routeId: formData.routeId,
                departureAgencyId: formData.departureAgencyId,
                arrivalAgencyId: formData.arrivalAgencyId,

                /* ✅ Uniquement bus + heure */
                departures: formData.departures.map((d) => ({
                    busId: d.busId,
                    departureTime: d.departureTime,
                })),

                daysOfWeek: formData.daysOfWeek,
                startDate: formData.startDate,
                endDate: formData.endDate || null,
                autoGenerate: formData.autoGenerate,
            };

            const result = await service.createSchedule(payload);

            if (!result.success) {
                setServerError(
                    result.message ||
                    "Impossible de créer la programmation."
                );
                return { success: false };
            }

            resetForm();
            return { success: true, data: result.data };
        } catch (error) {
            setServerError(
                error.message ||
                "Une erreur est survenue lors de la création."
            );
            return { success: false };
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData(makeInitial());
        setErrors({});
        setTouched({});
        setServerError("");
        setCurrentStep(0);
    };

    return {
        formData,
        errors,
        touched,

        currentStep,
        step,
        steps: SCHEDULE_STEPS,
        isFirstStep,
        isLastStep,

        isSubmitting,
        serverError,

        selectedRoute,

        setFormData,
        updateField,
        updateDays,
        touchField,

        validate,
        validateStep,
        goNext,
        goPrev,
        goTo,

        handleSubmit,
        resetForm,

        addDeparture,
        updateDeparture,
        removeDeparture,
    };
}