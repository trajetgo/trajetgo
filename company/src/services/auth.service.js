import { API_URL } from "./api";
import csrfService from "./csrf.service";

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
        console.warn('CSRF 403 response:', responseText);

        let errorData;
        try {
            errorData = JSON.parse(responseText);
        } catch {
            errorData = { message: responseText };
        }

        if (errorData.code === 'EBADCSRFTOKEN' || errorData.message?.includes('CSRF')) {
            console.warn('CSRF token invalide, régénération...');
            csrfService.resetCsrfToken();
            token = await csrfService.getCsrfToken();

            config.headers['x-csrf-token'] = token;

            return await fetch(url, config);
        }
    }

    return response;
};

class AuthService {
    whoami = async () => {
        const response = await fetch(`${API_URL}/auth/whoami`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
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
    };

    login = async (phone, password, rememberMe) => {
        try {
            const response = await makeCsrfRequest(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone, password, rememberMe }),
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
};

const authService = new AuthService();

export default authService;