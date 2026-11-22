import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useToast } from "@shared/contexts/toast.context";

import useRegister from "../hooks/useRegister";
import RegisterHeader from "../components/auth/RegisterHeader";
import RegisterForm from "../components/auth/RegisterForm";
import RegisterFooter from "../components/auth/RegisterFooter";

import { REGISTER_SUCCESS_STORAGE_KEY } from "../utils/auth.utils";

import "../styles/pages/Register.scss";

export default function Register() {
    const {
        STEPS,
        currentStep,
        step,
        isFirstStep,
        isLastStep,
        formData,
        errors,
        touched,
        serverError,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        goNext,
        goPrev,
        goTo,
        resetForm,
    } = useRegister();

    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Authentification - Inscription | Trajet Go";
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await handleSubmit(e);

            if (result?.success) {
                const responseData =
                    result.data?.data ?? result.data ?? result;

                const payload = {
                    email: responseData.email ?? formData.email,
                    phone: responseData.phone ?? formData.phone,
                    verificationId: responseData.verificationId ?? null,
                };

                resetForm();

                // Persister avant navigation
                sessionStorage.setItem(
                    REGISTER_SUCCESS_STORAGE_KEY,
                    JSON.stringify(payload)
                );

                showToast(
                    "success",
                    "Compte créé",
                    "Votre compte a été créé. Vérifiez votre email et votre téléphone.",
                    { duration: 4000 }
                );

                navigate("/register/success", { replace: true });
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
        <main className="register-page">
            <div className="register-container">
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
                />

                <RegisterFooter />
            </div>
        </main>
    );
}