const crypto = require('crypto');
const ApiResponse = require('./ApiResponse');
const asyncHandler = require('./asyncHandler');

/** Jeton opaque du cookie de session (256 bits). Seul son hash va en base. */
const generateSessionToken = () => crypto.randomBytes(32).toString('base64url');

const hashToken = (token) =>
    crypto.createHash('sha256').update(token).digest('hex');

/** Code à 6 chiffres pour la vérification du téléphone. */
const generateOtp = () =>
    String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');

// Un code à 6 chiffres se retrouve en quelques secondes depuis un simple SHA-256 :
// on utilise donc un HMAC avec un secret serveur.
const hashOtp = (code) => {
    const secret = process.env.OTP_SECRET;
    if (!secret && process.env.NODE_ENV === 'production') {
        throw new Error('OTP_SECRET est obligatoire en production.');
    }
    return crypto
        .createHmac('sha256', secret || 'dev-only-otp-secret')
        .update(code)
        .digest('hex');
};

const generateCsrfToken = asyncHandler(async (req, res) => {
    const token = crypto.randomBytes(32).toString('hex');

    // Set session cookie
    res.cookie("csrfToken", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
    });

    console.log("CSRF Token ", token);

    return ApiResponse.success(
        res,
        { csrfToken: token },
        'CSRF token generated successfully'
    );
});

module.exports = { generateSessionToken, hashToken, generateOtp, hashOtp, generateCsrfToken };
