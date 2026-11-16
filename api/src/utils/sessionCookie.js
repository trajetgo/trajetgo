const SESSION_COOKIE = 'xid_session';

const baseOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // Ex. ".xenady.com" en production : cookie partagé entre les sous-domaines.
    // Vide en développement (localhost).
    domain: process.env.COOKIE_DOMAIN || undefined,
});

/** persistent = true ("Se souvenir de moi") : cookie persistant, sinon cookie de session. */
const setSessionCookie = (res, token, { persistent, expiresAt }) => {
    const options = baseOptions();
    if (persistent) options.expires = expiresAt;
    res.cookie(SESSION_COOKIE, token, options);
};

const clearSessionCookie = (res) => {
    res.clearCookie(SESSION_COOKIE, baseOptions());
};

module.exports = { SESSION_COOKIE, setSessionCookie, clearSessionCookie };
