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

    console.log('🚀 Making request to:', url);
    console.log('📤 Request config:', config);

    const response = await fetch(url, config);

    // DEBUG de la réponse
    console.log('📥 Response status:', response.status);
    console.log('📥 Response OK:', response.ok);

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

class SessionService {
    getSessions = async () => {
        const response = await fetch(`${API_URL}/users/me/sessions`, {
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

        console.log("Sessions actives ", result)

        return result;
    };

    revokeSession = async (sessionId) => {
        const response = await makeCsrfRequest(`${API_URL}/users/me/sessions/${sessionId}`, {
            method: 'DELETE',
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

    revokeAllSessions = async () => {
        const response = await makeCsrfRequest(`${API_URL}/users/me/sessions`, {
            method: 'DELETE',
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
};

const sessionService = new SessionService();

export default sessionService;