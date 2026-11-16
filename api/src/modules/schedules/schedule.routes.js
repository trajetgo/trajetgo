const express = require('express');
const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const validateCsrf = require('../../middlewares/csrf.middleware');
const controller = require('./schedule.controller');
const schema = require('./schedule.validation');
const validate = require('../../middlewares/validate.middleware');

const router = express.Router();

router.use(authenticate);

router.use(
    authorize(
        "SUPER_ADMIN",
        "COMPANY_ADMIN"
    )
);

router.get(
    "/",
    validate(schema.list, 'query'),
    controller.getSchedules
);

router.post(
    "/",
    validateCsrf,
    validate(schema.create, 'body'),
    controller.create
);

module.exports = router;