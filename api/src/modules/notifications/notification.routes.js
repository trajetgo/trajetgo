const express = require('express');

const controller = require('./notification.controller');
const schema = require('./notification.validation');
const subscriptionSchema = require('./subscriptions/subscription.validation');
const subscriptionController = require('./subscriptions/subscription.controller');

const authenticate = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const validateCsrf = require("../../middlewares/csrf.middleware");

const router = express.Router();

// Toutes les routes nécessitent une authentification.
router.use(authenticate);

// Liste des notifications.
router.get(
    "/",
    validate(schema.list, "query"),
    controller.getAll
);

// Nombre de notifications non lues.
router.get(
    "/unread-count",
    controller.getUnreadCount
);

// Tout marquer comme lu.
router.patch(
    "/read-all",
    validateCsrf,
    controller.markAllAsRead
);

// Enregistrer un abonnement Push.
router.post(
    "/push/subscribe",
    validateCsrf,
    validate(subscriptionSchema.subscribe),
    subscriptionController.subscribe
);

// Révoquer un abonnement Push.
router.delete(
    "/push/:id",
    validateCsrf,
    validate(subscriptionSchema.subscriptionId, "params"),
    subscriptionController.unsubscribe
);

// Marquer une notification comme lue.
router.patch(
    "/:id/read",
    validateCsrf,
    validate(schema.notificationId, "params"),
    controller.markAsRead
);

// Archiver une notification.
router.patch(
    "/:id/archive",
    validateCsrf,
    validate(schema.notificationId, "params"),
    controller.archive
);
module.exports = router;