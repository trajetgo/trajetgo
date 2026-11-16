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

class TicketsService {
    getTickets = async (filters = {}) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") return;
            params.set(key, String(value));
        });

        const response = await fetch(`${API_URL}/tickets?${params.toString()}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        }
        );

        const result = await response.json();

        if (!response.ok) {
            const error = new Error(
                result.message || result.error || `Erreur ${response.status}`
            );
            error.status = response.status;
            error.data = result;
            throw error;
        }

        console.log("Tickets ", result)

        return result;
    };

    sellTicket = async (payload) => {
        const response = await makeCsrfRequest(`${API_URL}/tickets/sell`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            const error = new Error(
                result.message || result.error || `Erreur ${response.status}`
            );
            error.status = response.status;
            error.data = result;
            throw error;
        }

        return result;
    }

    updateStatus = async (id, status) => {
        const response = await makeCsrfRequest(`${API_URL}/tickets/${id}/status`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });

        const result = await response.json();

        if (!response.ok) {
            const error = new Error(
                result.message || result.error || `Erreur ${response.status}`
            );
            error.status = response.status;
            error.data = result;
            throw error;
        }

        return result;
    };
};

const ticketService = new TicketsService();

export default ticketService;