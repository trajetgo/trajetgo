export const PHONE_REGEX_CI = /^\+225\d{10}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizePhoneCI(phone) {
    if (!phone) return "";

    let value = String(phone).trim().replace(/[\s\-().]/g, "");

    if (value.startsWith("00225")) value = value.slice(5);
    if (value.startsWith("+225")) value = value.slice(4);

    return /^\d{10}$/.test(value) ? `+225${value}` : value;
}

export function validatePhone(value) {
    const normalized = normalizePhoneCI(value);
    if (!normalized) return "Le téléphone est obligatoire.";
    if (!PHONE_REGEX_CI.test(normalized)) {
        return "Numéro ivoirien invalide (+225 XX XX XX XX XX).";
    }
    return "";
}

export function validateEmail(value, { required = false } = {}) {
    if (!value?.trim()) {
        return required ? "L'email est obligatoire." : "";
    }
    if (!EMAIL_REGEX.test(value.trim())) {
        return "Adresse email invalide.";
    }
    return "";
}

export function validateRequired(value, label) {
    return value?.trim() ? "" : `${label} est obligatoire.`;
}