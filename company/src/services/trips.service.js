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

class TripsService {
    getTrips = async () => {
        const response = await fetch(`${API_URL}/trips`, {
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

        console.log("Voyages ", result)

        return result;
    };

    getTrip = async (id) => {
        const response = await fetch(`${API_URL}/trips/${id}`, {
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

    createTrip = async (payload) => {
        const response = await makeCsrfRequest(`${API_URL}/trips`, {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            const error = new Error(result.message || `Erreur ${response.status}`);
            error.status = response.status;
            error.data = result;
            throw error;
        }

        return result;
    };

    searchTrips = async (filters = {}) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            if (value === "" || value === "all") return;

            if (Array.isArray(value)) {
                if (value.length > 0) params.set(key, value.join(","));
                return;
            }

            params.set(key, String(value));
        });

        const response = await fetch(
            `${API_URL}/trips/search?${params.toString()}`,
            {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
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

    bookTrip = async (tripId, data) => {
        const response = await makeCsrfRequest(`${API_URL}/bookings`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tripId,
                requestedKg: Number(data.requestedKg),
                parcelDescription: data.parcelDescription,
                recipientName: data.recipientName,
                recipientPhone: data.recipientPhone,
            })
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

    getMyTrips = async () => {
        const response = await fetch(`${API_URL}/trips/my`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })

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

        console.log("getMyTrips ", result)

        return result
    }

    updateTripStatus = async (id, status) => {
        const response = await makeCsrfRequest(`${API_URL}/trips/${id}/status`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status }),
        })

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

        return result
    }

    deleteTrip = async (id) => {
        const response = await makeCsrfRequest(`${API_URL}/trips/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })

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

        return result
    }
};

const tripsService = new TripsService();

export default tripsService;