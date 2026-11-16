const express = require('express');

const controller = require('./seatLayout.controller');
const schema = require('./seatLayout.validation');

const validate = require('../../middlewares/validate.middleware');
const authenticate = require('../../middlewares/auth.middleware');
const validateCsrf = require('../../middlewares/csrf.middleware');

const router = express.Router();

router.use(authenticate);

router.get(
    '/bus/:busId',
    controller.getLayoutByBus
);

router.post(
    '/',
    validate(schema.create),
    validateCsrf,
    controller.createLayout
);

router.patch(
    '/seats/:seatId',
    validate(schema.updateSeat),
    validateCsrf,
    controller.updateSeatStatus
);

module.exports = router;