import React, { useState } from 'react'
import useRegister from '../../hooks/useRegister'
import { useToast } from '../../contexts/toast.context';
import ActivityIndicator from '../../components/ui/ActivityIndicator';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Checkbox from '../../components/ui/Checkbox';
import Modal from '../../components/ui/Modal';
import RegisterSuccess from './RegisterSuccess'

export default function RegisterForm() {

    const { showToast } = useToast();

    const {
        formData,
        errors,
        isSubmitting,
        touched,
        serverError,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
    } = useRegister();

    const [isSuccess, setIsSuccess] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await handleSubmit(e);
            if (result?.success) {
                showToast('success', 'Bienvenue', 'Inscription réussie !', {
                    title: 'Bienvenue',
                    duration: 3000,
                });

                setRegisteredEmail(formData.email);
                setIsSuccess(true);
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
        <>
            <form onSubmit={handleFormSubmit} className="register-form">
                {/* Afficher l'erreur générale */}
                {serverError && !errors.email && !errors.password && (
                    <div className="server-error" role="alert">
                        <span className="error-icon">⚠️</span>
                        <span>{serverError}</span>
                    </div>
                )}

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
                    required
                    // autoComplete="email"
                    autoFocus
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
                    required
                    // autoComplete="email"
                    autoFocus
                />

                <Input
                    label="Email"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Entrez votre email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && errors.email}
                    required
                    autoComplete="email"
                    autoFocus
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
                    required
                />

                <Input
                    label="Password"
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

                <Input
                    label="Confirmer mot de passe"
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Confirmez votre mot de passe"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.confirmPassword && errors.confirmPassword}
                    required
                    autoComplete="current-password"
                />

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
                        <span>S'inscrire</span>
                    )}
                </Button>

            </form>
            <Modal
                isOpen={isSuccess}
                title={'Compte créé avec succès !'}
                onClose={() => setIsSuccess(false)}

            >
                <RegisterSuccess
                    email={registeredEmail}
                    onResendEmail={{}}
                />
            </Modal>
        </>
    )
}
