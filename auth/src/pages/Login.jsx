import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAuth } from '@shared/contexts/auth.context';
import { useToast } from '@shared/contexts/toast.context';

import LoginHeader from '../components/auth/LoginHeader';
import LoginForm from '../components/auth/LoginForm';
import LoginFooter from '../components/auth/LoginFooter';
import useLogin from '../hooks/useLogin';
import { getDefaultRedirect, getSafeContinueUrl } from '../utils/redirect.utils';

import '../styles/pages/Login.scss';

export default function Login() {

    const [searchParams] = useSearchParams();

    const { setUser } = useAuth();

    const { showToast } = useToast();

    const {

        formData,
        errors,
        touched,
        isSubmitting,
        serverError,

        captchaError,
        recaptchaRef,
        setCaptchaError,
        handleCaptchaChange,
        handleCaptchaExpired,

        resetForm,
        handleChange,
        handleBlur,
        handleSubmit,

    } = useLogin();

    useEffect(() => {
        document.title = "Authentification - Connexion | Trajet Go"
    }, []);

    const continueUrl =
        searchParams.get("continue_url");


    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await handleSubmit(e);
            if (result?.success) {
                showToast('success', 'Bienvenue', 'Connexion réussie !', {
                    title: 'Bienvenue',
                    duration: 3000,
                });

                // Mettre à jour le contexte d'authentification
                if (result.data) {
                    setUser(result.data);
                }

                resetForm();

                const redirectUrl =
                    getSafeContinueUrl(continueUrl)
                    || getDefaultRedirect(result.data?.role);

                window.location.href = redirectUrl;
            }
        } catch (error) {
            if (error.message.includes('vérifier')) {
                showToast('warning', 'Email non vérifié', 'Veuillez vérifier votre email', {
                    title: 'Email non vérifié',
                    duration: 5000,
                });
            } else if (error.message.includes('captcha')) {
                showToast('error', 'Erreur', 'Erreur de captcha. Veuillez réessayer.', {
                    title: 'Erreur',
                    duration: 5000,
                });
            } else {
                showToast('error', 'Echec', 'Erreur de connexion', {
                    title: 'Échec',
                    duration: 5000,
                });
            }
        }
    };

    return (
        <main className='login-page'>
            <div className='login-container'>
                <LoginHeader />
                <LoginForm
                    formData={formData}
                    errors={errors}
                    touched={touched}
                    isSubmitting={isSubmitting}
                    serverError={serverError}

                    captchaError={captchaError}
                    setCaptchaError={setCaptchaError}
                    recaptchaRef={recaptchaRef}
                    handleCaptchaChange={handleCaptchaChange}
                    handleCaptchaExpired={handleCaptchaExpired}

                    resetForm={resetForm}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    handleSubmit={handleFormSubmit}
                />
                <LoginFooter />
            </div>
        </main>
    )
}
