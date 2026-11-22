const ApiError = require('../utils/ApiError.js');
const asyncHandler = require('../utils/asyncHandler.js');
const authRepository = require('../modules/auth/auth.repository');
const { hashToken } = require('../utils/tokens');
const { SESSION_COOKIE, clearSessionCookie } = require('../utils/sessionCookie');

const TOUCH_INTERVAL_MS = 5 * 60 * 1000; // met à jour lastSeenAt au plus toutes les 5 min
const ALLOWED_STATUSES = ['ACTIVE', 'PENDING'];

module.exports = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.[SESSION_COOKIE];

    if (!token) {
        throw new ApiError(401, 'Non authentifié.');
    }

    const session = await authRepository.findActiveSessionByTokenHash(hashToken(token));

    if (!session || !ALLOWED_STATUSES.includes(session.user.status)) {
        clearSessionCookie(res);
        throw new ApiError(401, 'Session invalide ou expirée.');
    }

    if (Date.now() - session.lastSeenAt.getTime() > TOUCH_INTERVAL_MS) {
        authRepository.touchSession(session.id).catch(() => { });
    }

    req.user = session.user;
    req.session = session;

    next();
});
