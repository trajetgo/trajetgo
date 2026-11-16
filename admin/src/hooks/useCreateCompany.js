import { useState } from "react";
import service from "../services/companies.service";
import {
    normalizePhoneCI,
    validateEmail,
    validatePhone,
} from "../utils/validation.utils";
import { 
    ALLOWED_STATUSES, 
    STEPS, 
    URL_REGEX 
} from "../utils/company.utils";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const INITIAL_FORM = {
    name: "",
    legalName: "",
    rccm: "",
    idu: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    cityId: "",
    logo: "",
};

const makeInitial = () => ({ ...INITIAL_FORM });

/* ------------------------------------------------------------------ */

export default function useCreateCompany() {
    const [formData, setFormData] = useState(makeInitial);
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
            case "name": {
                if (!value?.trim()) return "Le nom est obligatoire.";
                if (value.trim().length < 2) {
                    return "Le nom doit contenir au moins 2 caractères.";
                }
                if (value.trim().length > 100) {
                    return "Le nom ne peut pas dépasser 100 caractères.";
                }
                return "";
            }

            case "legalName": {
                if (!value?.trim()) return "";
                if (value.trim().length > 150) {
                    return "La raison sociale est trop longue.";
                }
                return "";
            }

            case "rccm": {
                if (!value?.trim()) return "";
                if (value.trim().length < 5) {
                    return "Numéro RCCM invalide.";
                }
                return "";
            }

            case "idu": {
                if (!value?.trim()) return "";
                if (value.trim().length < 5) {
                    return "Identifiant unique (IDU) invalide.";
                }
                return "";
            }

            case "email": {
                if (!value?.trim()) return "";
                return validateEmail(value);
            }

            case "phone": {
                return validatePhone(value);
            }

            case "website": {
                if (!value?.trim()) return "";
                if (!URL_REGEX.test(value.trim())) {
                    return "URL invalide (ex : https://exemple.com).";
                }
                return "";
            }

            case "address": {
                if (!value?.trim()) return "";
                if (value.trim().length < 5) {
                    return "Adresse trop courte.";
                }
                return "";
            }

            case "logo": {
                if (!value?.trim()) return "";
                if (!URL_REGEX.test(value.trim())) {
                    return "URL du logo invalide.";
                }
                return "";
            }

            default:
                return "";
        }
    };

    /* Valide uniquement les champs d'une étape */
    const validateStep = (stepIndex) => {
        const stepConfig = STEPS[stepIndex];
        const stepErrors = {};

        stepConfig.fields.forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) stepErrors[field] = error;
        });

        return stepErrors;
    };

    /* Valide tous les champs */
    const validateForm = () => {
        const nextErrors = {};
        Object.keys(formData).forEach((name) => {
            const error = validateField(name, formData[name]);
            if (error) nextErrors[name] = error;
        });
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

        setErrors((prev) => ({
            ...prev,
            [name]: fieldError,
        }));
    };

    /* =========================================================
       Navigation
    ========================================================= */

    const goNext = () => {
        const stepErrors = validateStep(currentStep);

        // Marquer tous les champs de l'étape comme touchés
        const stepTouched = step.fields.reduce(
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
    };

    const goPrev = () => {
        if (!isFirstStep) {
            setCurrentStep((s) => s - 1);
        }
    };

    const goTo = (index) => {
        // On ne peut aller qu'à une étape déjà visitée ou la suivante
        if (index < 0 || index >= totalSteps) return;
        if (index > currentStep) return; // pas de saut en avant
        setCurrentStep(index);
    };

    /* =========================================================
       Submit
    ========================================================= */

    const handleSubmit = async (e) => {
        e?.preventDefault?.();

        // Si on n'est pas à la dernière étape, on avance
        if (!isLastStep) {
            return goNext();
        }

        setServerError("");

        const validationErrors = validateForm();

        const allTouched = Object.keys(formData).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {}
        );

        setTouched(allTouched);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            // Trouver la première étape qui contient une erreur
            const firstErrorStep = STEPS.findIndex((s) =>
                s.fields.some((f) => validationErrors[f])
            );

            if (firstErrorStep !== -1) {
                setCurrentStep(firstErrorStep);
            }

            return { success: false, validationError: true };
        }

        setIsSubmitting(true);

        try {
            const payload = {
                name: formData.name.trim(),
                legalName: formData.legalName.trim() || null,
                registrationNumber: formData.rccm.trim().toUpperCase() || null,
                taxId: formData.idu.trim().toUpperCase(),
                email: formData.email.trim().toLowerCase() || null,
                phone: normalizePhoneCI(formData.phone),
                website: formData.website.trim() || null,
                address: formData.address.trim() || null,
                cityId: formData.cityId || null,
                logoUrl: formData.logo.trim() || null,
            };

            const result = await service.createCompany(payload);

            if (!result.success) {
                throw new Error(
                    result.message || "Impossible de créer la compagnie."
                );
            }

            resetForm();

            return result;
        } catch (error) {
            const message =
                error.message || "Impossible de créer la compagnie.";

            if (
                error.status === 409 ||
                message.toLowerCase().includes("already") ||
                message.toLowerCase().includes("existe")
            ) {
                const lower = message.toLowerCase();

                if (lower.includes("nom")) {
                    setErrors((prev) => ({
                        ...prev,
                        name: "Ce nom est déjà utilisé.",
                    }));
                    setCurrentStep(0);
                } else if (lower.includes("email")) {
                    setErrors((prev) => ({
                        ...prev,
                        email: "Cet email est déjà utilisé.",
                    }));
                    setCurrentStep(2);
                } else if (lower.includes("rccm")) {
                    setErrors((prev) => ({
                        ...prev,
                        rccm: "Ce numéro RCCM est déjà enregistré.",
                    }));
                    setCurrentStep(1);
                } else {
                    setServerError(message);
                }

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
        setCurrentStep(0);
    };

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
        STEPS,
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
        setCurrentStep,

        /* Utils */
        resetForm,
        allowedStatuses: ALLOWED_STATUSES,
    };
}