const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Restricts route access to specified user roles.
 * @param {...string} allowedRoles - The roles permitted to access the route.
 */
const authorize = (...allowedRoles) => {

    return asyncHandler(async (req, res, next) => {
        // 1. Ensure user is authenticated and attached to the request object
        if (!req.user) {
            return next(
                new ApiError(
                    401,
                    'Authentification requise'
                )
            );
        }

        // 2. Check if the user's role matches any of the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new ApiError(
                    403,
                    'Accès interdit'
                )
            );
        }

        // 3. User has the correct role, proceed to the next function
        next();
    })
};

module.exports = authorize;
