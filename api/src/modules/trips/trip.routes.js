const express = require('express');

const router = express.Router();

const controller = require('./trip.controller');
const schema = require('./trip.validation');

const validate = require('../../middlewares/validate.middleware');
const authenticate = require('../../middlewares/auth.middleware');
const validateCsrf = require('../../middlewares/csrf.middleware');
const authorize = require('../../middlewares/role.middleware');


router.get(
    '/',
    authenticate,
    authorize(
        'SUPER_ADMIN',
        'COMPANY_ADMIN',
        'AGENCY_AGENT',
        'CONTROLLER'
    ),
    validate(schema.list),
    controller.getTrips
);

router.post(
    '/',
    authenticate,
    authorize(
        'SUPER_ADMIN',
        'COMPANY_ADMIN',
    ),
    validateCsrf,
    validate(schema.create),
    controller.createTrip
);

router.get(
    '/search',
    validate(schema.search, 'query'),
    controller.searchTrips
);

router.get(
    "/prices",
    validate(schema.prices, "query"),
    controller.getPricesAroundDate
);

router.get(
    '/:id',
    controller.getTrip
);

router.patch(
    '/:id',
    authenticate,
    authorize(
        'SUPER_ADMIN',
        'COMPANY_ADMIN',
    ),
    validateCsrf,
    validate(schema.update),
    controller.updateTrip
);

router.get(
    '/:id/seats',
    authenticate,
    authorize(
        "AGENCY_AGENT"
    ),
    controller.getSeatsForTrip
)

router.post(
    '/:id/cancel',
    authenticate,
    authorize(
        'SUPER_ADMIN',
        'COMPANY_ADMIN',
    ),
    validateCsrf,
    controller.cancelTrip
);

module.exports = router;