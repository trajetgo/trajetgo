const express = require('express');

const controller = require('./bus.controller');
const schema = require('./bus.validation');
const authenticate = require('../../middlewares/auth.middleware');
const validateCsrf = require('../../middlewares/csrf.middleware');
const validate = require('../../middlewares/validate.middleware');
const authorize = require('../../middlewares/role.middleware');

const router = express.Router();

router.use(authenticate);

router.get(
    '/',
    authorize(
        'SUPER_ADMIN',
        'COMPANY_ADMIN'
    ),
    validate(schema.list, "query"),
    controller.getBuses
);

router.post(
    '/',
    authorize(
        'SUPER_ADMIN',
        'COMPANY_ADMIN'
    ),
    validate(schema.create, "body"),
    validateCsrf,
    controller.createBus
);

router.put(
    '/:id/seat-layout',
    authorize(
        'SUPER_ADMIN',
        'COMPANY_ADMIN'
    ),
    validateCsrf,
    validate(schema.seatLayout, 'body'),
    controller.updateSeatLayout
);

router.get(
    '/:id',
    controller.getBus
);


router.patch(
    '/:id',
    authorize(
        'COMPANY_ADMIN'
    ),
    validate(schema.update, 'body'),
    validateCsrf,
    controller.updateBus
);

router.post(
    '/:id/deactivate',
    validateCsrf,
    controller.deactivateBus
);

module.exports = router;