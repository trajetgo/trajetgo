const { parsePhoneNumberFromString } = require('libphonenumber-js');

const DEFAULT_COUNTRY = process.env.DEFAULT_PHONE_COUNTRY || 'CI';

/** Retourne le numéro au format E.164 (+2250700000000) ou null s'il est invalide. */
const normalizePhone = (raw) => {
    if (typeof raw !== 'string') return null;
    const parsed = parsePhoneNumberFromString(raw.trim(), DEFAULT_COUNTRY);
    return parsed && parsed.isValid() ? parsed.number : null;
};

const normalizeEmail = (raw) => String(raw).trim().toLowerCase();

/**
 * Identifiant de connexion : e-mail (contient "@") ou téléphone.
 * @returns {{type: 'email'|'phone', value: string} | null}
 */
const parseIdentifier = (raw) => {
    if (typeof raw !== 'string' || !raw.trim()) return null;
    if (raw.includes('@')) return { type: 'email', value: normalizeEmail(raw) };
    const phone = normalizePhone(raw);
    return phone ? { type: 'phone', value: phone } : null;
};

module.exports = { normalizePhone, normalizeEmail, parseIdentifier };
