import { API_URL } from "@shared/services/api";
import csrfService from "@shared/services/csrf.service";

// Fonction utilitaire pour les requêtes protégées CSRF
const makeCsrfRequest = async (url, options = {}) => {
    let token;
    try {
        token = await csrfService.getCsrfToken();
    } catch (error) {
        console.error('Impossible de récupérer le token CSRF:', error);
        throw new Error('CSRF token unavailable');
    }

    const config = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': token, // Utilisez un seul header pour plus de clarté
        },
        ...options
    };


    const response = await fetch(url, config);


    // Si CSRF invalide, reset et relance une fois
    if (response.status === 403) {
        const responseText = await response.text();

        let errorData;
        try {
            errorData = JSON.parse(responseText);
        } catch {
            errorData = { message: responseText };
        }

        if (errorData.code === 'EBADCSRFTOKEN' || errorData.message?.includes('CSRF')) {
            csrfService.resetCsrfToken();
            token = await csrfService.getCsrfToken();

            config.headers['x-csrf-token'] = token;

            return await fetch(url, config);
        }
    }

    return response;
};

class AuthService {
    loginWithIdentifier = async (identifier, password, rememberMe, recaptchaToken) => {
        try {
            const response = await makeCsrfRequest(`${API_URL}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier,
                    password,
                    rememberMe,
                    recaptchaToken
                }),
            });

            const result = await response.json();

            // Si la réponse n'est pas ok, on lance une erreur avec le message du backend
            if (!response.ok) {
                // Le backend renvoie un objet avec un message d'erreur
                const errorMessage = result.message ||
                    result.error ||
                    `Erreur ${response.status}`;

                // Créer une erreur avec le message du backend
                const error = new Error(errorMessage);
                error.status = response.status;
                error.data = result;
                throw error;
            }

            return result;
        } catch (error) {
            // Si c'est une erreur réseau
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion internet.');
            }

            // Si c'est une erreur de réponse HTTP
            if (error.status === 401) {
                throw new Error('Email ou mot de passe incorrect');
            }
            if (error.status === 403) {
                throw new Error('Compte désactivé. Contactez l\'administrateur.');
            }
            if (error.status === 404) {
                throw new Error('Service de connexion indisponible');
            }

            // Si c'est une erreur réseau
            if (error.name === 'TypeError') {
                throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion.');
            }

            // Ré-throw l'erreur originale
            throw error;
        }
    };

    register = async (userData) => {
        try {
            const response = await makeCsrfRequest(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
                credentials: 'include',
            });

            const result = await response.json();

            if (!response.ok) {
                const errorMessage = result.message || result.error || `Erreur ${response.status}`;
                const error = new Error(errorMessage);
                error.status = response.status;
                error.data = result;
                throw error;
            }

            return result;
        } catch (error) {
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion internet.');
            }
            throw error;
        }
    };

    sendOTPPhone = async (phone) => {
        try {
            const response = await makeCsrfRequest(`${API_URL}/auth/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
                credentials: "include",
            });

            const result = await response.json();

            if (!response.ok) {
                const errorMessage =
                    result.message ||
                    result.error ||
                    `Erreur ${response.status}`;
                const error = new Error(errorMessage);
                error.status = response.status;
                error.data = result;
                throw error;
            }

            return result;
        } catch (error) {
            if (error.name === "TypeError" || error.message.includes("fetch")) {
                throw new Error(
                    "Impossible de contacter le serveur. Vérifiez votre connexion."
                );
            }
            throw error;
        }
    };

    verifyPhone = async ({ phone, code }) => {
        try {
            const response = await makeCsrfRequest(
                `${API_URL}/auth/verify-phone`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phone, code }),
                    credentials: "include",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                const errorMessage =
                    result.message ||
                    result.error ||
                    `Erreur ${response.status}`;
                const error = new Error(errorMessage);
                error.status = response.status;
                error.data = result;
                throw error;
            }

            return result;
        } catch (error) {
            if (error.name === "TypeError" || error.message.includes("fetch")) {
                throw new Error(
                    "Impossible de contacter le serveur. Vérifiez votre connexion."
                );
            }
            throw error;
        }
    };

    verifyEmail = async (token, verificationId) => {
        const params = new URLSearchParams({ token });
        if (verificationId) params.set("vid", verificationId);


        try {
            const response = await fetch(`${API_URL}/auth/verify-email?${params.toString()}`, {
                method: "GET",
                credentials: "include",
            });

            const result = await response.json();

            if (!response.ok) {
                const error = new Error(
                    result.message || "Lien invalide ou expiré."
                );
                error.status = response.status;
                error.data = result;
                throw error;
            }

            return result;
        } catch (error) {
            if (error.name === "TypeError" || error.message.includes("fetch")) {
                throw new Error(
                    "Impossible de contacter le serveur. Vérifiez votre connexion."
                );
            }
            throw error;
        }
    };

    resendVerificationEmail = async (verificationId) => {
        const response = await makeCsrfRequest(`${API_URL}/auth/resend-verification`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ verificationId }),
            credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
            const error = new Error(
                result.message || "Impossible d'envoyer un nouveau lien."
            );
            error.status = response.status;
            error.data = result;
            throw error;
        }

        return result;
    };

    forgotPassword = async (identifier) => {
        const response = await makeCsrfRequest(`${API_URL}/auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier }),
            credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
            const error = new Error(
                result.message || "Impossible d'envoyer le lien."
            );
            error.status = response.status;
            error.data = result;
            throw error;
        }

        return result;
    };

    validateResetToken = async (token) => {
        const params = new URLSearchParams({ token });

        const response = await fetch(`${API_URL}/auth/validate-reset-token?${params.toString()}`, {
            method: "GET",
            credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
            const error = new Error(
                result.message || "Lien invalide ou expiré."
            );
            error.status = response.status;
            error.data = result;
            throw error;
        }

        console.log("Token de réinitialisation validé avec succès:", result);

        return result;
    };

    resetPassword = async ({ token, verificationId, newPassword }) => {
        const response = await makeCsrfRequest(`${API_URL}/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, verificationId, newPassword }),
            credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
            const error = new Error(
                result.message || "Impossible de réinitialiser le mot de passe."
            );
            error.status = response.status;
            error.data = result;
            throw error;
        }

        return result;
    };
};

const authService = new AuthService();

export default authService;