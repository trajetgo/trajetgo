const express = require('express');

const controller = require('./location.controller');
const schema = require('./location.validation');

const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const validateCsrf = require("../../middlewares/csrf.middleware");
const validate = require("../../middlewares/validate.middleware");

const router = express.Router();

router.get(
    '/',
    controller.getByType
);

router.get(
    '/cities',
    controller.searchCities
);

router.use(authenticate);

router.use(
    authorize(
        "SUPER_ADMIN"
    )
);

router.post(
    "/",
    validateCsrf,
    validate(schema.create, "body"),
    controller.create
);

module.exports = router;