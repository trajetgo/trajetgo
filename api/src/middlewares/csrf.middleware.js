const ApiError = require('../utils/ApiError.js');
const asyncHandler = require('../utils/asyncHandler.js');


const validateCsrf = asyncHandler(async (req, res, next) => {
    const cookieToken = req.cookies["csrfToken"];

    const headerToken = req.headers["x-csrf-token"];

    if (!cookieToken || !headerToken) {
        return next(new ApiError(
            403,
            "CSRF token manquant."
        ));
    }

    if (cookieToken !== headerToken) {
        return next(new ApiError(
            403,
            "CSRF token invalide."
        ));
    }

    next();
});

module.exports = validateCsrf;