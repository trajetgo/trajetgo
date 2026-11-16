const express = require('express');

const router = express.Router();

const controller = require('./auth.controller');
const schema = require('./auth.validation');

const authenticate = require('../../middlewares/auth.middleware');
const validateCsrf = require('../../middlewares/csrf.middleware');
const validate = require('../../middlewares/validate.middleware');
const requireRecaptcha = require('./recaptcha.middleware');


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

// router.post(
//     '/logout',
//     validateCsrf,
//     controller.logout
// );

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