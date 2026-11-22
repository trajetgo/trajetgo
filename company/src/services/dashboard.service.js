import { API_URL } from "@shared/services/api";

class DashboardService {
    getSummary = async () => {
        const response = await fetch(`${API_URL}/dashboard/companies/summary`, {
            method: "GET",
            credentials: "include",
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
};

const dashboardService = new DashboardService();

export default dashboardService;