const express = require('express');

const controller = require('./route.controller');
const schema = require('./route.validation');

const validateCsrf = require('../../middlewares/csrf.middleware');
const validate = require('../../middlewares/validate.middleware');
const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');

const router = express.Router();

router.use(authenticate);

router.get(
    '/',
    authorize(
        'SUPER_ADMIN',
        'COMPANY_ADMIN'
    ),
    // validate(schema.list),
    controller.getRoutes
);

router.post(
    '/',
    authorize(
        'SUPER_ADMIN',
        'COMPANY_ADMIN'
    ),
    validateCsrf,
    validate(schema.create),
    controller.createRoute
);

router.get(
    '/cities/:cityId/locations',
    controller.getLocationsByCity
);

router.get(
    '/cities',
    controller.getCities
);

router.get(
    '/:id',
    controller.getRoute
);



router.post(
    '/',
    authorize(
        'SUPER_ADMIN',
        'COMPANY_ADMIN'
    ),
    validate(schema.create),
    validateCsrf,
    controller.createRoute
);

router.patch(
    '/:id',
    validate(schema.update),
    validateCsrf,
    controller.updateRoute
);

router.delete(
    '/:id',
    validateCsrf,
    controller.deleteRoute
);


module.exports = router;