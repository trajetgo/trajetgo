import { useState, useRef } from "react";
import service from "../services/auth.service";

export default function useLogin() {
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
        rememberMe: false,
        agree: false,
    });
    // const [captchaValue, setCaptchaValue] = useState(null);
    // const [captchaError, setCaptchaError] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');
    const recaptchaRef = useRef(null);

    const validatePhone = (value) => {

        const phoneRegex =
            /^\+?[0-9]{8,15}$/;

        if (!value) {
            return "Le numéro de téléphone est obligatoire.";
        }

        if (!phoneRegex.test(value)) {
            return "Entrez un numéro de téléphone valide.";
        }

        return "";
    };


    // Validation business logic
    const validateField = (name, value) => {
        let error = '';

        if (name === 'phone') {
            error = validatePhone(value);
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

    // Réinitialiser le reCAPTCHA après soumission
    // const resetCaptcha = () => {
    //     if (recaptchaRef.current) {
    //         recaptchaRef.current.reset();
    //     }
    //     setCaptchaValue(null);
    //     setCaptchaError('');
    // };

    // // Valider le captcha
    // const validateCaptcha = () => {
    //     if (!captchaValue) {
    //         setCaptchaError('Veuillez confirmer que vous n\'êtes pas un robot');
    //         return false;
    //     }
    //     setCaptchaError('');
    //     return true;
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

    // Gérer le changement de valeur du captcha
    // const handleCaptchaChange = (value) => {
    //     setCaptchaValue(value);
    //     setCaptchaError('');

    //     // Supprimer l'erreur du formulaire
    //     if (errors.captcha) {
    //         setErrors(prev => ({ ...prev, captcha: '' }));
    //     }
    // };

    // Gérer l'expiration du captcha
    // const handleCaptchaExpired = () => {
    //     setCaptchaValue(null);
    //     setCaptchaError('Le captcha a expiré, veuillez le refaire');
    // };

    // Safe form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Force validation on all fields before moving forward
        const phoneError = validateField('phone', formData.phone);
        const passwordError = validateField('password', formData.password);
        const agreeError = validateField('agree', formData.agree);
        // const captchaValid = validateCaptcha();

        if (phoneError || passwordError || agreeError) {
            setErrors({
                phone: phoneError,
                password: passwordError,
                agree: agreeError,
            });
            setTouched({
                phone: true,
                password: true,
                agree: true,
                captcha: true,
            });
            return;
        }

        // Submission
        setIsSubmitting(true);
        try {
            const result = await service.login(
                formData.phone,
                formData.password,
                formData.rememberMe,
                // captchaValue // Ajouter le captcha si le backend le demande
            );

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
        setFormData({
            phone: '',
            password: '',
            rememberMe: false,
            agree: false,
        });
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
        setServerError(null);
        // resetCaptcha();
        // setCaptchaError('');
    };

    return {
        formData,
        errors,
        isSubmitting,
        touched,
        serverError,
        // captchaValue,
        // captchaError,
        recaptchaRef,
        handleChange,
        handleBlur,
        handleSubmit,
        // handleCaptchaChange,
        // handleCaptchaExpired,
        resetForm,
        // resetCaptcha,
        setFormData,
        setErrors,
        setServerError,
        // setCaptchaError
    };
}