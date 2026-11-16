import { API_URL } from "./api";

let csrfToken = null;
let csrfInitialized = false;

class CsrfService {
    initializeCsrf = async () => {
        if (csrfInitialized) return csrfToken;

        try {
            const resp = await fetch(`${API_URL}/csrf/token`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!resp.ok) {
                throw new Error(`Failed to get CSRF Token: ${resp.status}`);
            }

            const data = await resp.json();
            csrfToken = data.csrfToken;
            csrfInitialized = true;

            console.log("✅ CSRF Token initiated:", csrfToken);
            return csrfToken;
        } catch (error) {
            console.error('❌ Error CSRF token initialization :', error);
            csrfInitialized = false;
            throw error;
        }
    };

    getCsrfToken = async () => {
        if (!csrfToken) {
            await this.initializeCsrf();
        }
        return csrfToken;
    };

    getStoredCsrfToken = () => csrfToken;

    resetCsrfToken = () => {
        csrfToken = null;
        csrfInitialized = false;
    };
};

const csrfService = new CsrfService();

export default csrfService;