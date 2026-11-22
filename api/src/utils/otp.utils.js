const crypto = require("node:crypto");

/* ------------------------------------------------------------------ */
/* OTP (téléphone, SMS)                                                */
/* ------------------------------------------------------------------ */

const generateOtp = () => {
    return crypto
        .randomInt(0, 1_000_000)
        .toString()
        .padStart(6, "0");
};

const hashOtp = (otp) => {
    return crypto
        .createHash("sha256")
        .update(String(otp))
        .digest("hex");
};

const compareOtp = (otp, hash) => {
    if (typeof otp !== "string" || typeof hash !== "string") {
        return false;
    }

    const candidate = Buffer.from(hashOtp(otp), "hex");
    const expected = Buffer.from(hash, "hex");

    if (candidate.length !== expected.length) {
        return false;
    }

    return crypto.timingSafeEqual(candidate, expected);
};

/* ------------------------------------------------------------------ */
/* Token (email, lien de vérification)                                 */
/* ------------------------------------------------------------------ */

/**
 * Génère un token opaque (256 bits, URL-safe).
 * Retourné en clair à l'appelant : à mettre dans l'URL, jamais en base.
 */
const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString("base64url");
};

/**
 * Hash le token pour stockage en base.
 * SHA-256 suffit ici : le token a 256 bits d'entropie, pas de risque
 * de brute-force (contrairement à un OTP à 6 chiffres).
 */
const hashVerificationToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(String(token))
        .digest("hex");
};

const compareVerificationToken = (token, hash) => {
    if (typeof token !== "string" || typeof hash !== "string") {
        return false;
    }

    const candidate = Buffer.from(hashVerificationToken(token), "hex");
    const expected = Buffer.from(hash, "hex");

    if (candidate.length !== expected.length) {
        return false;
    }

    return crypto.timingSafeEqual(candidate, expected);
};

module.exports = {
    // OTP
    generateOtp,
    hashOtp,
    compareOtp,
    // Token
    generateVerificationToken,
    hashVerificationToken,
    compareVerificationToken,
};