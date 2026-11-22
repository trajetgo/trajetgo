const express = require('express');

const router = express.Router();

const controller = require('./auth.controller');
const schema = require('./auth.validation');

const authenticate = require('../../middlewares/auth.middleware');
const validateCsrf = require('../../middlewares/csrf.middleware');
const validate = require('../../middlewares/validate.middleware');
const requireRecaptcha = require('./recaptcha.middleware');

router.post(
    "/test-email",
    controller.testEmail
)

router.post(
    '/register',
    validate(schema.register, "body"),
    validateCsrf,
    // requireRecaptcha('register'),
    controller.register
);

router.post(
    '/login',
    validateCsrf,
    validate(schema.login, "body"),
    // requireRecaptcha('login'),
    controller.loginWithIdentifier
);

router.post(
    '/verify-phone',
    validateCsrf,
    validate(schema.verifyPhone),
    controller.verifyPhone
);

router.get(
    '/verify-email',
    validate(schema.verifyEmail, "query"),
    controller.verifyEmail
);

router.post(
    "/forgot-password",
    validateCsrf,
    validate(schema.forgotPassword, "body"),
    controller.forgotPassword
);

router.get(
    "/validate-reset-token",
    validate(schema.validateResetToken, "query"),
    controller.validateResetToken
);

router.post(
    "/reset-password",
    validateCsrf,
    validate(schema.resetPassword, "body"),
    controller.resetPassword
);

router.post(
    '/logout',
    authenticate,
    validateCsrf,
    controller.logout
);

// router.post(
//     '/refresh',
//     validateCsrf,
//     controller.refresh
// );

router.post(
    '/send-otp',
    validateCsrf,
    validate(schema.sendOtp, "body"),
    controller.sendOtp
);

router.post(
    '/verify-phone',
    validateCsrf,
    validate(schema.verifyPhone, "body"),
    controller.verifyPhone
);

router.use(authenticate);

router.get('/whoami', controller.whoami);

module.exports = router;