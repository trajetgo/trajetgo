import useLogin from '../../hooks/useLogin';
import { useAuth } from '../../contexts/auth.context';
import { useToast } from '../../contexts/toast.context';
import ActivityIndicator from '../../components/ui/ActivityIndicator';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Checkbox from '../ui/Checkbox';

export default function LoginForm() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const { setUser } = useAuth();

    const { showToast } = useToast();

    const {

        formData,
        errors,
        touched,
        isSubmitting,
        serverError,

        resetForm,
        handleChange,
        handleBlur,
        handleSubmit,

    } = useLogin();

    const continueUrl =
        searchParams.get("continue_url") || "/app/profile";

    const safeContinueUrl = continueUrl.startsWith("/")
        ? continueUrl
        : "/app/profile";

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

                // Rediriger vers le dashboard
                navigate(safeContinueUrl, { replace: true });
                resetForm();
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

        <form onSubmit={handleFormSubmit} className="login-form">
            {/* Afficher l'erreur générale */}
            {serverError && !errors.phone && !errors.password && (
                <div className="server-error" role="alert">
                    <span className="error-icon">⚠️</span>
                    <span>{serverError}</span>
                </div>
            )}

            <Input
                label="Téléphone"
                type="tel"
                name="phone"
                id="phone"
                placeholder="0707070707"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && errors.phone}
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
            {/*                     
                   <div className="form-group captcha-container">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={RECAPTCHA_SITE_KEY}
                            size="normal"
                            lang="fr"
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
                    </div> 
                    */}

            <Button
                type="submit"
                size="medium"
                variant="primary"
                loading={isSubmitting}
                fullWidth
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator size={14} type='dots' color='white' />
                ) : (
                    <span>Se connecter</span>
                )}
            </Button>
        </form>

    );

}
