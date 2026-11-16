const express = require('express');

const controller = require('./agency.controller');
const schema = require('./agency.validation');

const validate = require('../../middlewares/validate.middleware');
const authenticate = require('../../middlewares/auth.middleware');
const validateCsrf = require('../../middlewares/csrf.middleware');
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
    controller.getAgencies
);

router.post(
    '/',
    authorize(
        'SUPER_ADMIN',
        'COMPANY_ADMIN'
    ),
    validateCsrf,
    validate(schema.create, 'body'),
    controller.createAgency
);

router.get(
    '/:id',
    controller.getAgency
);

router.patch(
    '/:id',
    authorize(
        'SUPER_ADMIN',
        'COMPANY_ADMIN'
    ),
    validate(schema.update),
    validateCsrf,
    controller.updateAgency
);

router.post(
    '/:id/activate',
    validateCsrf,
    controller.activateAgency
);

router.post(
    '/:id/deactivate',
    validateCsrf,
    controller.deactivateAgency
);

router.post(
    '/:id/close',
    validateCsrf,
    controller.closeAgency
);


module.exports = router;