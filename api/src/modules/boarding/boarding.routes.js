const express = require('express');

const controller = require('./boarding.controller');
const schema = require('./boarding.validation');

const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const validate = require('../../middlewares/validate.middleware');
const validateCsrf = require('../../middlewares/csrf.middleware');

const router = express.Router();

/*

* Toutes les routes de boarding nécessitent
* une authentification.
  */
router.use(authenticate);

router.post(
  "/scan",
  validateCsrf,
  authorize("CONTROLLER", "SUPER_ADMIN"),
  validate(schema.scan, "body"),
  controller.scan
);

router.get(
  "/departures/today",
  authorize(
    "CONTROLLER",
    "COMPANY_ADMIN",
    "SUPER_ADMIN"
  ),
  controller.getTodayDepartures
);

router.get(
  "/trip/:tripId",
  authorize(
    "CONTROLLER",
    "COMPANY_ADMIN",
    "SUPER_ADMIN"
  ),
  validate(schema.tripId, 'params'),
  controller.getByTrip
);

router.get(
  "/controller/:controllerId",
  authorize(
    "CONTROLLER",
    "SUPER_ADMIN"
  ),
  validate(schema.controllerId, "params"),
  controller.getByController
);

router.get(
  "/:id",
  controller.getById
);


module.exports = router;
