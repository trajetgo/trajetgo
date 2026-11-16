const express = require('express');

const router = express.Router();

const controller = require('./ticket.controller');
const schema = require('./ticket.validation');

const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const validate = require('../../middlewares/validate.middleware');
const validateCsrf = require('../../middlewares/csrf.middleware');

router.use(authenticate);

// Pour la Compagnie l'Agence
router.get(
    '/',
    authorize(
        'SUPER_ADMIN',
        'COMPANY_ADMIN',
        'AGENCY_AGENT'
    ),
    controller.getTickets
);

// Mes tickets
router.get(
    '/my',
    authorize('PASSENGER'),
    controller.getMyTickets
);

router.post(
    '/sell',
    authorize('AGENCY_AGENT'),
    validateCsrf,
    controller.sellTicket
);


// Recherche par numéro de ticket
router.get(
    '/number/:ticketNumber',
    validate(schema.ticketNumber),
    authorize(
        'PASSENGER',
        'AGENCY_AGENT',
        'CONTROLLER',
        'COMPANY_ADMIN',
        'SUPER_ADMIN'
    ),
    controller.getByNumber
);

// Recherche par QR Code
router.get(
    '/qr/:qrCode',
    validate(schema.qrCode),
    authorize(
        'PASSENGER',
        'AGENCY_AGENT',
        'CONTROLLER',
        'COMPANY_ADMIN',
        'SUPER_ADMIN'
    ),
    controller.getByQrCode
);

// Consulter un ticket
router.get(
    '/:id',
    validate(schema.id),
    authorize(
        'PASSENGER',
        'AGENCY_AGENT',
        'CONTROLLER',
        'COMPANY_ADMIN',
        'SUPER_ADMIN'
    ),
    controller.getById
);

// Annuler un ticket
router.patch(
    '/:id/cancel',
    validateCsrf,
    validate(schema.id),
    authorize(
        'PASSENGER',
        'AGENCY_AGENT',
        'COMPANY_ADMIN',
        'SUPER_ADMIN'
    ),
    controller.cancel
);

// Marquer un ticket comme utilisé
// Cette route sera principalement utilisée par le futur module Boarding.
router.patch(
    '/:id/use',
    validateCsrf,
    validate(schema.id),
    authorize(
        'CONTROLLER',
        'AGENCY_AGENT',
        'COMPANY_ADMIN',
        'SUPER_ADMIN'
    ),
    controller.use
);

module.exports = router;
