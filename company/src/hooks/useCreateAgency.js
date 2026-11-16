import { useState } from "react";
import service from "../services/agencies.service";

import {
    normalizePhoneCI,
    validateEmail,
    validatePhone,
} from "../utils/validation.utils";

import {
    STEPS,
} from "../utils/agency.utils";

const INITIAL_FORM = {
    name: "",
    phone: "",
    email: "",
    address: "",
    cityId: "",
};

const makeInitial = () => ({ ...INITIAL_FORM });

export default function useCreateAgency() {
    const [formData, setFormData] = useState(makeInitial());
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    /* ---------- Step ---------- */

    const [currentStep, setCurrentStep] = useState(0);

    const totalSteps = STEPS.length;
    const step = STEPS[currentStep];

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === totalSteps - 1;

    /* =========================================================
       Validation
    ========================================================= */

    const validateField = (name, value) => {
        switch (name) {
            case "name":
                if (!value?.trim()) {
                    return "Le nom de l'agence est obligatoire.";
                }

                if (value.trim().length < 2) {
                    return "Le nom doit contenir au moins 2 caractères.";
                }

                return "";

            case "phone":
                return validatePhone(value);

            case "email":
                if (!value?.trim()) {
                    return "";
                }

                return validateEmail(value);

            case "address":
                if (!value?.trim()) {
                    return "L'adresse du siège est obligatoire.";
                }

                if (value.trim().length < 5) {
                    return "Adresse trop courte.";
                }

                return "";

            case "cityId":
                if (!value?.trim()) {
                    return "Veuillez sélectionner une ville.";
                }

                return "";

            default:
                return "";
        }
    };

    /* =========================================================
       Validation étape
    ========================================================= */

    const validateStep = (stepIndex) => {
        const stepConfig = STEPS[stepIndex];
        const stepErrors = {};

        stepConfig.fields.forEach((field) => {
            const error = validateField(
                field,
                formData[field]
            );

            if (error) {
                stepErrors[field] = error;
            }
        });

        return stepErrors;
    };

    /* =========================================================
       Validation formulaire
    ========================================================= */

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

    /* =========================================================
       Handlers
    ========================================================= */

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked
        } = e.target;

        const nextValue =
            type === "checkbox"
                ? checked
                : value;

        setFormData((prev) => ({
            ...prev,
            [name]: nextValue,
        }));

        setServerError("");

        const fieldError = validateField(
            name,
            nextValue
        );

        setErrors((prev) => ({
            ...prev,
            [name]: fieldError,
        }));
    };

    const handleBlur = (e) => {
        const {
            name,
            value,
            type,
            checked
        } = e.target;

        const nextValue =
            type === "checkbox"
                ? checked
                : value;

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        const fieldError = validateField(
            name,
            nextValue
        );

        setErrors((prev) => ({
            ...prev,
            [name]: fieldError,
        }));
    };

    /* =========================================================
       Navigation
    ========================================================= */

    const goNext = () => {
        const stepErrors = validateStep(
            currentStep
        );

        const stepTouched = step.fields.reduce(
            (acc, field) => ({
                ...acc,
                [field]: true,
            }),
            {}
        );

        setTouched((prev) => ({
            ...prev,
            ...stepTouched,
        }));

        setErrors((prev) => ({
            ...prev,
            ...stepErrors,
        }));

        if (Object.keys(stepErrors).length > 0) {
            return {
                success: false,
                validationError: true,
            };
        }

        if (!isLastStep) {
            setCurrentStep((s) => s + 1);
        }

        return {
            success: true,
        };
    };

    const goPrev = () => {
        if (!isFirstStep) {
            setCurrentStep((s) => s - 1);
        }
    };

    const goTo = (index) => {
        if (index < 0 || index >= totalSteps) {
            return;
        }

        if (index > currentStep) {
            return;
        }

        setCurrentStep(index);
    };

    /* =========================================================
       Submit
    ========================================================= */

    const handleSubmit = async (e) => {
        e?.preventDefault?.();

        if (!isLastStep) {
            return goNext();
        }

        setServerError("");

        const validationErrors = validateForm();

        const allTouched = Object.keys(formData).reduce(
            (acc, key) => ({
                ...acc,
                [key]: true,
            }),
            {}
        );

        setTouched(allTouched);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            const firstErrorStep = STEPS.findIndex((s) =>
                s.fields.some(
                    (field) => validationErrors[field]
                )
            );

            if (firstErrorStep !== -1) {
                setCurrentStep(firstErrorStep);
            }

            return {
                success: false,
                validationError: true,
            };
        }

        setIsSubmitting(true);

        try {
            const payload = {
                name: formData.name.trim(),

                cityId: formData.cityId,

                email:
                    formData.email.trim().toLowerCase() ||
                    null,

                phone:
                    normalizePhoneCI(formData.phone),

                address:
                    formData.address.trim(),
            };

            const result =
                await service.createAgency(payload);

            if (!result.success) {
                throw new Error(
                    result.message ||
                    "Impossible de créer l'agence."
                );
            }

            return {
                success: true,
                data: result.data,
            };

        } catch (error) {
            const message =
                error.message ||
                "Impossible de créer l'agence.";

            setServerError(message);

            return {
                success: false,
                error,
            };

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
        setIsSubmitting(false);
        setServerError("");
        setCurrentStep(0);
    };

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

        currentStep,
        step,
        isFirstStep,
        isLastStep,

        goNext,
        goPrev,
        goTo,
    };
}