const getEnv = (key) => {
    const value = process.env[key];

    return value?.trim().replace(/\/+$/, "") || "";
};

const API_URL = getEnv("REACT_APP_API_URL");

const PASSENGER_URL = getEnv("REACT_APP_PASSENGER_URL");
const AUTH_URL = getEnv("REACT_APP_AUTH_URL");
const CHECKOUT_URL = getEnv("REACT_APP_CHECKOUT_URL");

const ADMIN_URL = getEnv("REACT_APP_ADMIN_URL");
const COMPANY_URL = getEnv("REACT_APP_COMPANY_URL");
const AGENCY_URL = getEnv("REACT_APP_AGENCY_URL");
const CONTROLLER_URL = getEnv("REACT_APP_CONTROLLER_URL");

const POLICY_URL = getEnv("REACT_APP_POLICY_URL");
const SUPPORT_URL = getEnv("REACT_APP_SUPPORT_URL");
const MY_URL = getEnv("REACT_APP_MY_URL");

const RECAPTCHA_SITE_KEY = getEnv("REACT_APP_RECAPTCHA_SITE_KEY");
const VAPID_PUBLIC_KEY = getEnv("REACT_APP_VAPID_PUBLIC_KEY");

export {
    API_URL,
    AUTH_URL,
    CHECKOUT_URL,
    POLICY_URL,
    SUPPORT_URL,
    PASSENGER_URL,
    COMPANY_URL,
    AGENCY_URL,
    CONTROLLER_URL,
    ADMIN_URL,
    MY_URL,
    RECAPTCHA_SITE_KEY,
    VAPID_PUBLIC_KEY,
};