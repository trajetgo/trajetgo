import { useRef, useState } from "react";

import { 
    validateEmail, 
    validatePhone 
} from "@shared/utils/validation.utils";

import service from "../services/auth.service";
import { REGISTER_STEPS } from "../utils/auth.utils";

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */

const INITIAL_FORM = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
};

const makeInitial = () => ({ ...INITIAL_FORM });

/* ------------------------------------------------------------------ */

export default function useRegister() {
    const [formData, setFormData] = useState(makeInitial());
    // const [captchaValue, setCaptchaValue] = useState(null);
    // const [captchaError, setCaptchaError] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');
    // const recaptchaRef = useRef(null);

    /* ---------- Step ---------- */

    const [currentStep, setCurrentStep] = useState(0);

    const totalSteps = REGISTER_STEPS.length;
    const step = REGISTER_STEPS[currentStep];

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === totalSteps - 1;

    /* =========================================================
       Validation
    ========================================================= */

    const validateField = (name, value) => {
        switch (name) {
            case "firstName":
                if (!value?.trim()) return "Le prénom est obligatoire.";
                if (value.trim().length < 2) {
                    return "Le prénom doit contenir au moins 2 caractères.";
                }
                return "";

            case "lastName":
                if (!value?.trim()) return "Le nom est obligatoire.";
                if (value.trim().length < 2) {
                    return "Le nom doit contenir au moins 2 caractères.";
                }
                return "";

            case "phone":
                return validatePhone(value);

            case "email": {
                if (!value?.trim()) return "";
                return validateEmail(value);
            }

            case "password":
                if (!value) return "Le mot de passe est obligatoire.";
                if (value.length < 8) {
                    return "Le mot de passe doit comporter au moins 8 caractères.";
                }
                if (!/[A-Z]/.test(value)) {
                    return "Le mot de passe doit contenir une majuscule.";
                }
                if (!/[0-9]/.test(value)) {
                    return "Le mot de passe doit contenir un chiffre.";
                }
                return "";

            case "confirmPassword":
                if (!value) return "Veuillez confirmer le mot de passe.";
                if (value !== formData.password) {
                    return "Les mots de passe ne correspondent pas.";
                }
                return "";

            case "agree":
                if (!value) {
                    return "Vous devez accepter les conditions d'utilisation.";
                }
                return "";

            default:
                return "";
        }
    };

    const validateStep = (stepIndex) => {
        const stepConfig = REGISTER_STEPS[stepIndex];
        const stepErrors = {};

        stepConfig.fields.forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) stepErrors[field] = error;
        });

        return stepErrors;
    };

    const validateForm = () => {
        const nextErrors = {};

        Object.keys(formData).forEach((name) => {
            const error = validateField(name, formData[name]);
            if (error) nextErrors[name] = error;
        });

        return nextErrors;
    };

    // const handleCaptchaChange = (value) => {
    //     setCaptchaValue(value);
    //     setCaptchaError(value ? "" : "Veuillez confirmer que vous n'êtes pas un robot.");
    // };

    // const handleCaptchaExpired = () => {
    //     setCaptchaValue(null);
    //     setCaptchaError("Le captcha a expiré. Veuillez le refaire.");
    // };

    // const resetCaptcha = () => {
    //     recaptchaRef.current?.reset();
    //     setCaptchaValue(null);
    //     setCaptchaError("");
    // };

    /* =========================================================
       Handlers
    ========================================================= */

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        const nextValue = type === "checkbox" ? checked : value;

        setFormData((prev) => ({ ...prev, [name]: nextValue }));
        setServerError("");

        const fieldError = validateField(name, nextValue);
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
    };

    const handleBlur = (e) => {
        const { name, value, type, checked } = e.target;

        const nextValue = type === "checkbox" ? checked : value;

        setTouched((prev) => ({ ...prev, [name]: true }));

        const fieldError = validateField(name, nextValue);
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
    };

    /* =========================================================
       Navigation
    ========================================================= */

    const goNext = () => {
        const stepErrors = validateStep(currentStep);

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
        if (index < 0 || index >= totalSteps) return;
        if (index > currentStep) return;
        setCurrentStep(index);
    };

    /* =========================================================
       Submit
    ========================================================= */

    const handleSubmit = async (e) => {
        e?.preventDefault?.();

        /* Si on n'est pas à la dernière étape, on avance */
        if (!isLastStep) {
            return goNext();
        }

        setServerError("");

        const validationErrors = validateForm();

        const allTouched = Object.keys(formData).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {}
        );

        // if (!captchaValue) {
        //     setCaptchaError("Veuillez confirmer que vous n'êtes pas un robot.");
        //     return;
        // }

        setTouched(allTouched);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            const firstErrorStep = REGISTER_STEPS.findIndex((s) =>
                s.fields.some((field) => validationErrors[field])
            );

            if (firstErrorStep !== -1) {
                setCurrentStep(firstErrorStep);
            }

            return { success: false, validationError: true };
        }

        setIsSubmitting(true);

        try {
            const payload = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim() || null,
                password: formData.password,
                // captchaToken: captchaValue
            };

            const result = await service.register(payload);

            if (!result.success) {
                throw new Error(
                    result.message || "Impossible de créer le compte."
                );
            }

            return { success: true, data: result.data };
        } catch (error) {
            const message =
                error?.message || "Une erreur est survenue.";

           setServerError(message);

            // Réinitialiser le captcha en cas d'erreur
            // resetCaptcha();

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
        // resetCaptcha();
        // setCaptchaError('');
    };

    /* =========================================================
       Return
    ========================================================= */

    return {
        /* Steps */
        STEPS: REGISTER_STEPS,
        currentStep,
        step,
        totalSteps,
        isFirstStep,
        isLastStep,

        // captchaValue,
        // captchaError,
        // recaptchaRef,
        // setCaptchaError,
        // handleCaptchaChange,
        // handleCaptchaExpired,
        // resetCaptcha,

        /* Data */
        formData,
        setFormData,

        /* Errors */
        errors,
        touched,
        serverError,

        /* Submitting */
        isSubmitting,

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
        setErrors,
        setServerError,
    };
}