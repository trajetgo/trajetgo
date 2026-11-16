const ApiError = require('./ApiError');

/**
 * Normalise un numéro ivoirien vers E.164.
 *
 * Exemples :
 * 0707070707       -> +2250707070707
 * 07 07 07 07 07  -> +2250707070707
 * +2250707070707   -> +2250707070707
 * 0022507070707    -> +2250707070707
 */
const normalizeIvoryCoastPhone = (phone) => {
    if (!phone) {
        throw new ApiError(
            400,
            'Le numéro de téléphone est obligatoire.'
        );
    }

    let value = String(phone).trim();

    // Supprimer espaces, tirets, parenthèses et points
    value = value.replace(/[\s\-().]/g, '');

    // Supprimer le préfixe international
    if (value.startsWith('+225')) {
        value = value.slice(4);
    } else if (value.startsWith('00225')) {
        value = value.slice(5);
    }

    // Format national ivoirien : 10 chiffres
    if (!/^\d{10}$/.test(value)) {
        throw new ApiError(
            400,
            'Numéro de téléphone ivoirien invalide.'
        );
    }

    return `+225${value}`;
};


/**
 * Vérifie si un numéro ivoirien est valide.
 */
const isValidIvoryCoastPhone = (phone) => {
    try {
        normalizeIvoryCoastPhone(phone);
        return true;
    } catch {
        return false;
    }
};


/**
 * Normalise l'identifiant de connexion.
 *
 * L'utilisateur peut se connecter avec :
 * - son email
 * - son numéro de téléphone
 */
const normalizeIdentifier = (identifier) => {
    if (!identifier) {
        throw new ApiError(
            400,
            "L'adresse email ou le numéro de téléphone est obligatoire."
        );
    }

    const value = String(identifier).trim();

    // Email
    if (value.includes('@')) {
        return {
            type: 'email',
            value: value.toLowerCase()
        };
    }

    // Téléphone
    return {
        type: 'phone',
        value: normalizeIvoryCoastPhone(value)
    };
};


module.exports = {
    normalizeIvoryCoastPhone,
    isValidIvoryCoastPhone,
    normalizeIdentifier
};