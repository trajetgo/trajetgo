import { useState } from "react";
import service from "../services/buses.service";
import { 
    ALLOWED_AMENITIES, 
    ALLOWED_BUS_TYPES, 
    ALLOWED_STATUSES, 
    FLEET_NUMBER_REGEX, 
    INITIAL_FORM_DATA, 
    MAX_CAPACITY, 
    MAX_YEAR, 
    MIN_CAPACITY, 
    MIN_YEAR, 
    normalizeFleetNumber, 
    normalizeRegistration, 
    REGISTRATION_REGEX, 
    STEPS 
} from "../utils/bus.utils";



const makeInitial = () => ({
    ...INITIAL_FORM_DATA,
});

/* ------------------------------------------------------------------ */

export default function useCreateBus() {
    const [formData, setFormData] = useState(makeInitial());

    const [errors, setErrors] = useState({});

    const [touched, setTouched] = useState({});

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [serverError, setServerError] =
        useState("");

    const [currentStep, setCurrentStep] = useState(0);

    const getStepFields = (step) => {
        switch (step) {
            case 0: return ["companyId", "registrationNumber", "fleetNumber", "name"];
            case 1: return ["brand", "model", "year", "busType"];
            case 2: return ["capacity", "status"];
            case 3: return ["amenities"];
            default: return [];
        }
    };

    const validateStep = (step) => {
        const fields = getStepFields(step);
        const stepErrors = {};

        fields.forEach((name) => {
            const error = validateField(
                name,
                formData[name]
            );

            if (error) {
                stepErrors[name] = error;
            }
        });

        setErrors((prev) => ({
            ...prev,
            ...stepErrors,
        }));

        setTouched((prev) => ({
            ...prev,
            ...fields.reduce(
                (acc, field) => ({
                    ...acc,
                    [field]: true,
                }),
                {}
            ),
        }));

        return stepErrors;
    };

    /* =========================================================
       Validation
       ========================================================= */

    const validateField = (name, value) => {
        switch (name) {
            /* -------------------------------------------------
               Company
               ------------------------------------------------- */

            case "companyId": {
                if (!value?.trim()) {
                    return "Veuillez sélectionner une compagnie.";
                }

                return "";
            }

            /* -------------------------------------------------
               Registration
               ------------------------------------------------- */

            case "registrationNumber": {
                const normalized =
                    normalizeRegistration(value);

                if (!normalized) {
                    return "Le numéro d'immatriculation est obligatoire.";
                }

                if (
                    !REGISTRATION_REGEX.test(
                        normalized
                    )
                ) {
                    return "Format invalide (lettres, chiffres, espaces et tirets — 3 à 20 caractères).";
                }

                return "";
            }

            /* -------------------------------------------------
               Fleet number
               ------------------------------------------------- */

            case "fleetNumber": {
                const normalized =
                    normalizeFleetNumber(value);

                // Optionnel
                if (!normalized) {
                    return "";
                }

                if (
                    !FLEET_NUMBER_REGEX.test(
                        normalized
                    )
                ) {
                    return "Format invalide pour le numéro de parc.";
                }

                return "";
            }

            /* -------------------------------------------------
               Name
               ------------------------------------------------- */

            case "name": {
                // Optionnel
                if (!value?.trim()) {
                    return "";
                }

                if (value.trim().length < 2) {
                    return "Le nom doit contenir au moins 2 caractères.";
                }

                if (value.trim().length > 50) {
                    return "Le nom ne peut pas dépasser 50 caractères.";
                }

                return "";
            }

            /* -------------------------------------------------
               Brand
               ------------------------------------------------- */

            case "brand": {
                // Optionnel
                if (!value?.trim()) {
                    return "";
                }

                if (value.trim().length < 2) {
                    return "La marque doit contenir au moins 2 caractères.";
                }

                if (value.trim().length > 50) {
                    return "La marque ne peut pas dépasser 50 caractères.";
                }

                return "";
            }

            /* -------------------------------------------------
               Model
               ------------------------------------------------- */

            case "model": {
                // Optionnel
                if (!value?.trim()) {
                    return "";
                }

                if (value.trim().length < 1) {
                    return "Le modèle est invalide.";
                }

                if (value.trim().length > 80) {
                    return "Le modèle ne peut pas dépasser 80 caractères.";
                }

                return "";
            }

            /* -------------------------------------------------
               Year
               ------------------------------------------------- */

            case "year": {
                // Optionnel
                if (
                    value === "" ||
                    value === null ||
                    value === undefined
                ) {
                    return "";
                }

                const num = Number(value);

                if (!Number.isInteger(num)) {
                    return "L'année doit être un nombre entier.";
                }

                if (
                    num < MIN_YEAR ||
                    num > MAX_YEAR
                ) {
                    return `L'année doit être comprise entre ${MIN_YEAR} et ${MAX_YEAR}.`;
                }

                return "";
            }

            /* -------------------------------------------------
               Bus type
               ------------------------------------------------- */

            case "busType": {
                if (!value) {
                    return "Le type de bus est obligatoire.";
                }

                if (
                    !ALLOWED_BUS_TYPES.includes(
                        value
                    )
                ) {
                    return "Type de bus invalide.";
                }

                return "";
            }

            /* -------------------------------------------------
               Capacity
               ------------------------------------------------- */

            case "capacity": {
                if (
                    value === "" ||
                    value === null ||
                    value === undefined
                ) {
                    return "La capacité est obligatoire.";
                }

                const num = Number(value);

                if (!Number.isInteger(num)) {
                    return "La capacité doit être un nombre entier.";
                }

                if (num < MIN_CAPACITY) {
                    return `La capacité minimale est ${MIN_CAPACITY}.`;
                }

                if (num > MAX_CAPACITY) {
                    return `La capacité maximale est ${MAX_CAPACITY}.`;
                }

                return "";
            }

            /* -------------------------------------------------
               Status
               ------------------------------------------------- */

            case "status": {
                if (!value) {
                    return "Le statut est obligatoire.";
                }

                if (
                    !ALLOWED_STATUSES.includes(
                        value
                    )
                ) {
                    return "Statut invalide.";
                }

                return "";
            }

            case "amenities": {
                if (!Array.isArray(value)) {
                    return "Les équipements sont invalides.";
                }

                const invalidAmenities = value.filter(
                    (amenity) =>
                        !ALLOWED_AMENITIES.includes(amenity)
                );

                if (invalidAmenities.length > 0) {
                    return "Un ou plusieurs équipements sont invalides.";
                }

                return "";
            }

            default:
                return "";
        }
    };

    /* =========================================================
       Validate form
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
       Change
       ========================================================= */

    const handleAmenityChange = (amenity) => {
        setFormData((prev) => {
            const exists =
                prev.amenities.includes(amenity);

            return {
                ...prev,
                amenities: exists
                    ? prev.amenities.filter(
                        (item) => item !== amenity
                    )
                    : [
                        ...prev.amenities,
                        amenity,
                    ],
            };
        });

        setServerError("");
    };

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
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

        const fieldError =
            validateField(
                name,
                nextValue
            );

        setErrors((prev) => ({
            ...prev,
            [name]: fieldError,
        }));
    };

    /* =========================================================
       Blur
       ========================================================= */

    const handleBlur = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        const nextValue =
            type === "checkbox"
                ? checked
                : value;

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        const fieldError =
            validateField(
                name,
                nextValue
            );

        setErrors((prev) => ({
            ...prev,
            [name]: fieldError,
        }));
    };

    const goNext = () => {
        const stepErrors = validateStep(currentStep);

        if (Object.keys(stepErrors).length > 0) {
            return { success: false, validationError: true };
        }

        setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
        return { success: true };
    };

    const goPrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const goToStep = (step) => {
        if (step >= 0 && step < STEPS.length) {
            setCurrentStep(step);
        }
    };

    /* =========================================================
       Submit
       ========================================================= */

    const handleSubmit = async (e) => {
        e.preventDefault?.();

        setServerError("");

        const validationErrors =
            validateForm();

        const allTouched =
            Object.keys(formData).reduce(
                (acc, key) => ({
                    ...acc,
                    [key]: true,
                }),
                {}
            );

        setTouched(allTouched);
        setErrors(validationErrors);

        if (
            Object.keys(validationErrors)
                .length > 0
        ) {
            return {
                success: false,
                validationError: true,
            };
        }

        setIsSubmitting(true);

        try {
            const payload = {
                companyId: formData.companyId,

                registrationNumber:
                    normalizeRegistration(
                        formData.registrationNumber
                    ),

                fleetNumber:
                    normalizeFleetNumber(
                        formData.fleetNumber
                    ) || null,

                name:
                    formData.name.trim() || null,

                brand:
                    formData.brand.trim() || null,

                model:
                    formData.model.trim() || null,

                year:
                    formData.year === ""
                        ? null
                        : Number(formData.year),

                busType:
                    formData.busType,

                capacity:
                    Number(formData.capacity),

                status:
                    formData.status,

                amenities:
                    formData.amenities,
            };

            const result =
                await service.createBus(
                    payload
                );

            if (!result.success) {
                throw new Error(
                    result.message ||
                    "Impossible de créer le bus."
                );
            }

            resetForm();

            return result;
        } catch (error) {
            const message =
                error.message ||
                "Impossible de créer le bus.";

            /* ---------------------------------------------
               Immatriculation déjà utilisée
               --------------------------------------------- */

            if (
                error.status === 409 &&
                (
                    message
                        .toLowerCase()
                        .includes(
                            "immatriculation"
                        ) ||
                    message
                        .toLowerCase()
                        .includes(
                            "registration"
                        )
                )
            ) {
                setErrors((prev) => ({
                    ...prev,

                    registrationNumber:
                        "Ce numéro d'immatriculation est déjà utilisé pour cette compagnie.",
                }));

                setTouched((prev) => ({
                    ...prev,
                    registrationNumber: true,
                }));

                return {
                    success: false,
                    validationError: true,
                };
            }

            /* ---------------------------------------------
               Numéro de parc déjà utilisé
               --------------------------------------------- */

            if (
                error.status === 409 &&
                (
                    message
                        .toLowerCase()
                        .includes(
                            "parc"
                        ) ||
                    message
                        .toLowerCase()
                        .includes(
                            "fleet"
                        )
                )
            ) {
                setErrors((prev) => ({
                    ...prev,

                    fleetNumber:
                        "Ce numéro de parc est déjà utilisé pour cette compagnie.",
                }));

                setTouched((prev) => ({
                    ...prev,
                    fleetNumber: true,
                }));

                return {
                    success: false,
                    validationError: true,
                };
            }

            setServerError(message);

            return {
                success: false,
                message,
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
        setCurrentStep(1);
    };

    /* =========================================================
       Return
       ========================================================= */

    return {
        formData,
        setFormData,

        errors,
        touched,

        isSubmitting,
        serverError,

        handleChange,
        handleBlur,
        handleSubmit,

        handleAmenityChange,

        resetForm,

        // Steps
        steps: STEPS,
        currentStep,
        goNext,
        goPrevious,
        goToStep,

        isFirstStep:
            currentStep === 0,

        isLastStep:
            currentStep === STEPS.length - 1,
            
        step: STEPS[currentStep],

        allowedStatuses:
            ALLOWED_STATUSES,

        allowedBusTypes:
            ALLOWED_BUS_TYPES,

        allowedAmenities:
            ALLOWED_AMENITIES,
    };
}