const express = require('express');

const router = express.Router();

const controller = require('./payment.controller');
const schema = require('./payment.validation');

const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const validate = require('../../middlewares/validate.middleware');
const validateCsrf = require('../../middlewares/csrf.middleware');

// Toutes les routes de paiement nécessitent une authentification
router.use(authenticate);

// Initialiser un paiement pour une réservation
router.post(
    '/',
    validateCsrf,
    authorize('PASSENGER'),
    validate(schema.create),
    controller.create
);

// Historique des paiements du passager
router.get(
    '/my',
    authorize('PASSENGER'),
    controller.getMyPayments
);

router.post(
    '/:id/simulate-success',
    validateCsrf,
    authorize('PASSENGER'),
    validate(schema.id),
    controller.simulateSuccess
);

// Consulter un paiement
router.get(
    '/:id',
    validate(schema.id),
    controller.getById
);

module.exports = router;
