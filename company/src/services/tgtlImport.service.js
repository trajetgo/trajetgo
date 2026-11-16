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

class TgtlImportService {
    analyze = async (formData) => {
        try {
            const response = await fetch(`${API_URL}/tgtl/import/analyze`, {
                method: 'POST',
                credentials: "include",
                body: formData,
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

    confirm = async (formData) => {
        const response = await fetch(`${API_URL}/tgtl/import/confirm`, {
            method: 'POST',
            credentials: "include",
            body: formData,
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

const tgtlImportService = new TgtlImportService();

export default tgtlImportService;