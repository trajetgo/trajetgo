import { LockKeyhole, User } from "lucide-react";
// import ReCAPTCHA from "react-google-recaptcha";

import ActivityIndicator from "@shared/components/ui/ActivityIndicator";
import Input from "@shared/components/ui/Input";
import Button from "@shared/components/ui/Button";
import Checkbox from "@shared/components/ui/Checkbox";
// import { RECAPTCHA_SITE_KEY } from "@shared/services/api";

import RegisterStepper from "./RegisterStepper";


import "../../styles/components/auth/RegisterForm.scss";

export default function RegisterForm({
    handleFormSubmit,

    formData,
    errors,
    touched,

    handleBlur,
    handleChange,

    isSubmitting,
    serverError,

    /* Steps */
    STEPS,
    currentStep,
    step,
    isFirstStep,
    isLastStep,
    goNext,
    goPrev,
    goTo,

    captchaError,
    setCaptchaError,
    handleCaptchaChange,
    handleCaptchaExpired,
    recaptchaRef,
}) {
    /* ---------- Icône par étape ---------- */

    const STEP_ICONS = {
        'perso-data': User,
        security: LockKeyhole,
    };

    const StepIcon = STEP_ICONS[step.key] ?? User;

    const renderFields = () => {
        switch (step.key) {
            case 'identity':
                return (
                    <>
                        <Input
                            label="Nom"
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.lastName && errors.lastName}
                            autoComplete="family-name"
                            required
                        />

                        <Input
                            label="Prénoms"
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.firstName && errors.firstName}
                            autoComplete="given-name"
                            required
                        />
                    </>
                )

            case 'contact':
                return (
                    <>
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Entrez votre adresse e-mail"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email && errors.email}
                            autoComplete="email"
                            required
                        />

                        <Input
                            label="Téléphone"
                            type="tel"
                            name="phone"
                            id="phone"
                            placeholder="+2250700000000"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.phone && errors.phone}
                            autoComplete="tel"
                            required
                        />
                    </>
                )

            case 'security':
                return (
                    <>
                        <Input
                            label="Mot de passe"
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Créez un mot de passe"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.password && errors.password}
                            autoComplete="new-password"
                            required
                        />

                        <Input
                            label="Confirmer le mot de passe"
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="Confirmez votre mot de passe"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                touched.confirmPassword &&
                                errors.confirmPassword
                            }
                            autoComplete="new-password"
                            required
                        />

                        <div className="form-options">
                            <Checkbox
                                name="agree"
                                label="J'accepte les termes et conditions"
                                checked={formData.agree}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                error={touched.agree && errors.agree}
                            />
                        </div>

                        {/* reCAPTCHA */}

                        {/* <div className="form-group captcha-container">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={RECAPTCHA_SITE_KEY}
                                size="normal"
                                hl="fr"
                                onChange={handleCaptchaChange}
                                onExpired={handleCaptchaExpired}
                                onErrored={() => {
                                    // Gérer l'erreur de chargement
                                    setCaptchaError('Captcha loading error');
                                }}
                            />
                            {(captchaError || errors.captcha) && (
                                <div className="input-error-message captcha-error" role="alert">
                                    <span className="error-icon">⚠️</span>
                                    <span>{captchaError || errors.captcha}</span>
                                </div>
                            )}
                        </div> */}
                    </>
                )

            default:
                return null;
        }
    }

    /* ---------- Submit ---------- */

    const handleFormLocalSubmit = async (e) => {
        e.preventDefault();

        if (isLastStep) {
            return handleFormSubmit(e);
        }

        return goNext();
    };

    return (
        <form
            onSubmit={handleFormLocalSubmit}
            className="register-form"
            noValidate
        >

            {/* ---------- Stepper ---------- */}

            <RegisterStepper
                steps={STEPS}
                currentStep={currentStep}
                onStepClick={goTo}
            />

            {/* ---------- En-tête de l'étape ---------- */}

            <header className="register-form__step-header">
                <div className="register-form__step-icon">
                    <StepIcon size={20} aria-hidden="true" />
                </div>

                <div>
                    <h2>{step.title}</h2>
                    <p>{step.description}</p>
                </div>
            </header>

            {/* Afficher l'erreur générale */}
            {serverError && !errors.email && !errors.password && (
                <div className="server-error" role="alert">
                    <span className="error-icon">⚠️</span>
                    <span>{serverError}</span>
                </div>
            )}

            {/* ---------- Champs ---------- */}

            <div className="register-form__fields">
                {renderFields()}
            </div>

            {/* ---------- Navigation ---------- */}

            <footer className="register-form__actions">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={goPrev}
                    disabled={isFirstStep || isSubmitting}
                >
                    Précédent
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator
                            size={14}
                            type="dots"
                            color="white"
                        />
                    ) : isLastStep ? (
                        <>
                            S'inscrire
                        </>
                    ) : (
                        <>
                            Suivant
                        </>
                    )}
                </Button>
            </footer>

        </form>
    )
}
