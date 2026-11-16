import { useState } from "react";
import service from "../services/auth.service";

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */

const INITIAL_FORM = {
    identifier: '',
    password: '',
    rememberMe: false,
    agree: false,
};

const makeInitial = () => ({ ...INITIAL_FORM });

export default function useLogin() {
    const [formData, setFormData] = useState(makeInitial());
    // const [captchaValue, setCaptchaValue] = useState(null);
    const [captchaError, setCaptchaError] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');
    // const recaptchaRef = useRef(null);

    const validateIdentifier = (value) => {

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const phoneRegex =
            /^\+?[0-9]{8,15}$/;

        if (!value) {
            return "L'identifiant est obligatoire.";
        }

        if (
            !emailRegex.test(value) &&
            !phoneRegex.test(value)
        ) {
            return "Entrez une adresse email ou un numéro de téléphone valide.";
        }

        return "";
    };


    // Validation business logic
    const validateField = (name, value) => {
        let error = '';

        if (name === 'identifier') {
            error = validateIdentifier(value);
        }

        if (name === 'password') {
            if (!value) {
                error = 'Un mot de passe est requis';
            } else if (value.length < 6) {
                error = 'Le mot de passe doit comporter au moins 6 caractères';
            }
        }

        if (name === 'agree') {
            if (!value) {
                error = 'Vous devez accepter les conditions';
            }
        }

        return error;
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

    // Safe form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Force validation on all fields before moving forward
        const identifierError = validateField('identifier', formData.identifier);
        const passwordError = validateField('password', formData.password);
        const agreeError = validateField('agree', formData.agree);
        // const captchaValid = validateCaptcha();

        // if (!captchaValue) {
        //     setCaptchaError("Veuillez confirmer que vous n'êtes pas un robot.");
        //     return;
        // }

        if (identifierError || passwordError || agreeError) {
            setErrors({
                identifier: identifierError,
                password: passwordError,
                agree: agreeError,
            });
            setTouched({
                identifier: true,
                password: true,
                agree: true,
                captcha: true,
            });
            return;
        }

        // Submission
        setIsSubmitting(true);
        try {
            const result = await service.loginWithIdentifier(
                formData.identifier,
                formData.password,
                formData.rememberMe,
                // captchaValue // Ajouter le captcha si le backend le demande
            );

            if (formData.rememberMe) {
                localStorage.setItem("rememberedIdentifier", formData.identifier);
                localStorage.setItem("rememberMe", "true");
            } else {
                localStorage.removeItem("rememberedIdentifier");
                localStorage.removeItem("rememberMe");
            }

            // Vérifier si le login a réussi
            if (result.success) {
                return { success: true, data: result.data };
            } else {
                throw new Error(result.message || 'Erreur de connexion');
            }
        } catch (err) {
            console.error('Login failed:', err);

            // Gérer différents types d'erreurs
            let errorMessage = err.message || 'Une erreur est survenue';

            if (err.message.includes('identifiants')) {
                errorMessage = 'Email ou mot de passe incorrect';
            } else if (err.message.includes('compte désactivé')) {
                errorMessage = 'Votre compte a été désactivé';
            } else if (err.message.includes('email non vérifié')) {
                errorMessage = 'Veuillez vérifier votre email avant de vous connecter';
            } else if (err.message.includes('réseau')) {
                errorMessage = 'Impossible de contacter le serveur';
            }

            // Mettre à jour l'erreur serveur
            setServerError(errorMessage);

            // Afficher l'erreur dans le champ correspondant
            if (errorMessage.includes('email') || errorMessage.includes('identifiants')) {
                setErrors(prev => ({ ...prev, email: errorMessage }));
                setTouched(prev => ({ ...prev, email: true }));
            } else if (errorMessage.includes('vérifier')) {
                setErrors(prev => ({ ...prev, email: errorMessage }));
                setTouched(prev => ({ ...prev, email: true }));
            } else {
                setErrors(prev => ({ ...prev, general: errorMessage }));
            }

            // Réinitialiser le captcha en cas d'erreur
            // resetCaptcha();

            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData(makeInitial());
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
        setServerError(null);
        // resetCaptcha();
        setCaptchaError('');
    };

    return {
        formData,
        errors,
        isSubmitting,
        touched,
        serverError,

        // captchaValue,
        captchaError,
        // recaptchaRef,
        setCaptchaError,
        // handleCaptchaChange,
        // handleCaptchaExpired,
        // resetCaptcha,

        handleChange,
        handleBlur,
        handleSubmit,

        resetForm,
        setFormData,
        setErrors,
        setServerError,
    };
}