const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./recaptcha.service');

const requireRecaptcha = (expectedAction) => asyncHandler(async (req, res, next) => {
    try {
        const { recaptchaToken } = req.body;

        const isValid = service.verify(
            recaptchaToken,
            expectedAction
        );

        if (!isValid) {
            return next(
                new ApiError(
                    403,
                    "Vérification de sécurité échouée. Veuillez réessayer."
                )
            );
        }

        next();
    } catch (error) {
        // Une configuration incorrecte ou une panne Google
        // ne doit pas permettre de contourner la protection.
        if (error instanceof ApiError) {
            return next(error);
        }

        return next(
            new ApiError(
                503,
                "Vérification de sécurité temporairement indisponible."
            )
        );
    }
});

module.exports = requireRecaptcha;