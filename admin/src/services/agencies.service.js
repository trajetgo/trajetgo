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

class AgencyService {
    getAgencies = async () => {
        const response = await fetch(`${API_URL}/agencies`, {
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

    createAgency = async (formData) => {
        try {
            const response = await makeCsrfRequest(`${API_URL}/agencies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
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

    activateAgency = async (id) => {
        try {
            const response = await makeCsrfRequest(`${API_URL}/agencies/${id}/activate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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

    deactivateAgency = async (id) => {
        try {
            const response = await makeCsrfRequest(`${API_URL}/agencies/${id}/deactivate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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

    closeAgency = async (id) => {
        try {
            const response = await makeCsrfRequest(`${API_URL}/agencies/${id}/close`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
    }
};

const agencyService = new AgencyService();

export default agencyService;