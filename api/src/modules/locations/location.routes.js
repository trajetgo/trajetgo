const express = require('express');
const controller = require('./location.controller');
const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');

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

router.use(authorize("SUPER_ADMIN"));



module.exports = router;