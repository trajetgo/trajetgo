import { useState } from "react";

import { validatePhone, validateEmail } from "@shared/utils/validation.utils";

import service from "../services/auth.service";

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */

const INITIAL_FORM = {
    identifier: '',
    acceptTerms: false,
};

const makeInitial = () => ({ ...INITIAL_FORM });

export default function useForgotPassword() {
    const [formData, setFormData] = useState(makeInitial());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [serverError, setServerError] = useState("");

    const validateIdentifier = (value) => {
        if (!value) {
            return "L'identifiant est obligatoire.";
        }
        if (!validateEmail(value) && !validatePhone(value)) {
            return "Entrez une adresse email ou un numéro de téléphone valide.";
        }
        return "";
    };

    const validateField = (name, value) => {
        let error = '';
        if (name === 'identifier') {
            error = validateIdentifier(value);
        }

        if (name === 'acceptTerms') {
            if (!value) {
                error = "Vous devez accepter les termes et conditions.";
            }
        }
        return error;
    };

    // Updates form state and runs validation dynamically
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        setFormData((prevData) => ({
            ...prevData,
            [name]: val
        }));

        // Run dynamic validation as the user types
        const fieldError = validateField(name, val);
        setErrors((prev) => ({ ...prev, [name]: fieldError }));

        // Effacer l'erreur serveur quand l'utilisateur tape
        setServerError('');
    };

    // Marks a field as touched when a user clicks/tabs out of it
    const handleBlur = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        setTouched((prev) => ({ ...prev, [name]: true }));

        const fieldError = validateField(name, val);
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        const identifierError = validateField('identifier', formData.identifier);
        const acceptTermsError = validateField('acceptTerms', formData.acceptTerms);

        if (identifierError || acceptTermsError) {
            setErrors({
                identifier: identifierError,
                acceptTerms: acceptTermsError
            });

            setTouched({
                identifier: true,
                acceptTerms: true
            });

            return;
        }

        setIsSubmitting(true);

        try {
            await service.forgotPassword(formData.identifier.trim());
            setIsSubmitting(false);

            return { success: true };
        } catch (error) {
            const message =
                error.status === 429
                    ? error.message ||
                    "Trop de tentatives. Réessayez dans quelques minutes."
                    : "Une erreur est survenue. Veuillez réessayer.";

            setServerError(message);

            return { success: false, error };
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData(makeInitial());
        setErrors({});
        setTouched({});
        setServerError("");
    }

    return {
        formData,
        isSubmitting,
        serverError,
        setServerError,
        errors,
        setErrors,
        touched,
        setTouched,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
    };
}
