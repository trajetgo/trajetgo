import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@shared/contexts/toast.context';
import Modal from "@shared/components/ui/Modal";

import useRegister from '../../hooks/useRegister';
import RegisterHeader from '../../components/auth/RegisterHeader';
import RegisterForm from '../../components/auth/RegisterForm';
import RegisterFooter from '../../components/auth/RegisterFooter';

import '../../styles/pages/auth/Register.scss';

export default function Register() {
    const {
        /* Steps */
        STEPS,
        currentStep,
        step,
        isFirstStep,
        isLastStep,

        // captchaError,
        // recaptchaRef,
        // setCaptchaError,
        // handleCaptchaChange,
        // handleCaptchaExpired,

        /* Data */
        formData,

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
    } = useRegister();

    const { showToast } = useToast();

    const [isSuccess, setIsSuccess] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Authentification - Inscription | Trajet Go"
    }, []);


    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const phone = formData.phone;
            const result = await handleSubmit(e);

            if (result?.success) {
                const responseData =
                    result.data?.data ?? result.data ?? result;

                resetForm();

                showToast(
                    "success",
                    "Compte créé",
                    "Votre compte est créé. Vérifiez votre numéro de téléphone.",
                    { duration: 3000 }
                );

                navigate("/verify-phone", {
                    state: {
                        registeredPhone: phone,
                        devOtp: responseData.devOtp ?? null,
                    },
                });
            }
        } catch (error) {
            const message = error?.message?.toLowerCase() || "";

            if (message.includes("captcha")) {
                showToast(
                    "error",
                    "Erreur de captcha",
                    "Veuillez réessayer.",
                    { duration: 5000 }
                );
            } else {
                showToast(
                    "error",
                    "Échec de l'inscription",
                    error.message || "Impossible de créer votre compte.",
                    { duration: 5000 }
                );
            }
        }
    };

    return (
        <main className='register-page'>
            <div className='register-container'>
                <RegisterHeader />
                <RegisterForm
                    handleFormSubmit={handleFormSubmit}

                    formData={formData}
                    errors={errors}
                    touched={touched}

                    handleBlur={handleBlur}
                    handleChange={handleChange}

                    isSubmitting={isSubmitting}
                    serverError={serverError}

                    STEPS={STEPS}
                    currentStep={currentStep}
                    step={step}
                    isFirstStep={isFirstStep}
                    isLastStep={isLastStep}
                    goNext={goNext}
                    goPrev={goPrev}
                    goTo={goTo}

                    // captchaError={captchaError}
                    // setCaptchaError={setCaptchaError}
                    // handleCaptchaChange={handleCaptchaChange}
                    // handleCaptchaExpired={handleCaptchaExpired}
                    // recaptchaRef={recaptchaRef}
                />
                <RegisterFooter />
            </div>

            <Modal
                isOpen={isSuccess}
                title={'Compte créé avec succès !'}
                onClose={() => setIsSuccess(false)}

            >
            </Modal>
        </main>
    )
}
