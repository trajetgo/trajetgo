const express = require('express');

const controller = require('./company.controller');
const schema = require('./company.validation');

const validate = require('../../middlewares/validate.middleware');
const authenticate = require('../../middlewares/auth.middleware');
const validateCsrf = require('../../middlewares/csrf.middleware');
const authorize = require('../../middlewares/role.middleware');

const router = express.Router();

router.use(authenticate);

router.get(
    '/',
    // validate(schema.list),
    authorize('SUPER_ADMIN'),
    controller.getCompanies
);

router.post(
    '/',
    authorize('SUPER_ADMIN'),
    validateCsrf,
    validate(schema.create),
    controller.createCompany
);

router.get(
    '/members',
    authorize(
        'SUPER_ADMIN',
        'COMPANY_ADMIN',
        'AGENCY_AGENT'
    ),
    controller.getTeams
)

router.get(
    '/:id',
    controller.getCompany
);


router.patch(
    '/:id',
    authorize(
        'SUPER_ADMIN',
        'COMPANY_ADMIN'
    ),
    validate(schema.update),
    validateCsrf,
    controller.updateCompany
);

router.post(
    '/:id/deactivate',
    authorize('SUPER_ADMIN'),
    validateCsrf,
    controller.deactivateCompany
);


module.exports = router;