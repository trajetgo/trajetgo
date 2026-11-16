const express = require('express');

const controller = require('./booking.controller');
const schema = require('./booking.validation');

const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const validate = require('../../middlewares/validate.middleware');
const validateCsrf = require('../../middlewares/csrf.middleware');

const router = express.Router();

/**
 * Toutes les routes Booking nécessitent
 * une authentification.
 */
router.use(authenticate);

/**
 * Créer une réservation
 *
 * POST /bookings
 */
router.post(
    '/',
    validateCsrf,
    authorize('PASSENGER'),
    validate(schema.create),
    controller.create
);

/**
 * Mes réservations
 *
 * GET /bookings/my
 */
router.get(
    '/my',
    authorize('PASSENGER'),
    controller.getMyBookings
);

/**
 * Consulter une réservation
 *
 * GET /bookings/:id
 *
 * Le service vérifiera si l'utilisateur
 * possède réellement les droits sur la réservation.
 */
router.get(
    '/:id',
    validate(schema.id),
    controller.getById
);

/**
 * Annuler une réservation
 *
 * PATCH /bookings/:id/cancel
 */
router.patch(
    '/:id/cancel',
    validateCsrf,
    validate(schema.id),
    controller.cancel
);

module.exports = router;