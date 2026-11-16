// import ReCAPTCHA from "react-google-recaptcha";

import ActivityIndicator from '@shared/components/ui/ActivityIndicator';
import Input from '@shared/components/ui/Input';
import Button from '@shared/components/ui/Button';
import Checkbox from '@shared/components/ui/Checkbox';
// import { RECAPTCHA_SITE_KEY } from "@shared/services/api";

export default function LoginForm({
    formData,
    errors,
    touched,
    isSubmitting,
    serverError,

    captchaError,
    setCaptchaError,
    recaptchaRef,
    handleCaptchaChange,
    handleCaptchaExpired,

    resetForm,
    handleChange,
    handleBlur,
    handleSubmit,
}) {
    return (

        <form onSubmit={handleSubmit} className="login-form">
            {/* Afficher l'erreur générale */}
            {serverError && !errors.email && !errors.password && (
                <div className="server-error" role="alert">
                    <span className="error-icon">⚠️</span>
                    <span>{serverError}</span>
                </div>
            )}

            <Input
                label="Email ou téléphone"
                type="identifier"
                name="identifier"
                id="identifier"
                placeholder="Email ou téléphone"
                value={formData.identifier}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.identifier && errors.identifier}
                required
                // autoComplete="email"
                autoFocus
            />

            <Input
                label="Mot de passe"
                type="password"
                name="password"
                id="password"
                placeholder="Entrez votre mot de passe"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
                required
                autoComplete="current-password"
            />

            <div className="form-options">
                <Checkbox
                    name={'rememberMe'}
                    label={"Se souvenir de moi"}
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.rememberMe && errors.rememberMe}
                />

            </div>

            <div className="form-options">
                <Checkbox
                    name={'agree'}
                    label={'J\'accepte les termes et conditions'}
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


            <Button
                type="submit"
                size="medium"
                variant="primary"
                loading={isSubmitting}
                fullWidth
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator
                        size={14}
                        type='dots'
                        color='white'
                    />
                ) : (
                    <span>Se connecter</span>
                )}
            </Button>
        </form>

    );

}
