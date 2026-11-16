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

class ControllerTripsService {
    /**
    * Départs de la journée
    */
    getTodayDepartures = async () => {
        const response = await fetch(`${API_URL}/boarding/departures/today`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (!response.ok) {
            const error = new Error(
                result.message ||
                result.error ||
                `Erreur ${response.status}`
            );

            error.status = response.status;
            error.data = result;

            throw error;
        }

        return result;
    };

    /**
    * État actuel de l'embarquement
    */
    getBoarding = async (tripId) => {
        if (!tripId) {
            throw new Error(
                "Identifiant du voyage manquant."
            );
        }

        const response = await fetch(`${API_URL}/boarding/trip/${tripId}`, {
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
    }

    /**
    * Scanner / valider un billet
    *
    * qrCode = contenu décodé du QR
    */
    scanTicket = async (tripId, qrCode) => {
        if (!tripId) {
            throw new Error(
                "Identifiant du voyage manquant."
            );
        }

        if (!qrCode) {
            throw new Error(
                "QR code manquant."
            );
        }

        const response = await makeCsrfRequest(`${API_URL}/boarding/scan`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tripId,
                qrCode,
            }),
        }
        );

        const result = await response.json();

        if (!response.ok) {
            const error = new Error(
                result.message ||
                result.error ||
                `Erreur ${response.status}`
            );

            error.status = response.status;
            error.data = result;

            throw error;
        }

        return result;
    };

    /**
    * Terminer l'embarquement
    */
    finishBoarding = async (tripId) => {
        if (!tripId) {
            throw new Error(
                "Identifiant du voyage manquant."
            );
        }

        const response = await makeCsrfRequest(`${API_URL}/boarding/trips/${tripId}/finish-boarding`, {
            method: 'POST',
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

const controllerTripsService = new ControllerTripsService();

export default controllerTripsService;