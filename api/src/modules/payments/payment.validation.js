const Joi = require('joi');

module.exports = {
    /**
 * Création d'un paiement
 *
 * POST /payments
 */
    create: Joi.object({
        bookingId: Joi.string()
            .trim()
            .required()
            .messages({
                'string.empty': 'La réservation est requise',
                'any.required': 'La réservation est requise'
            }),

        method: Joi.string()
            .valid(
                'ORANGE_MONEY',
                'MTN_MOBILE_MONEY',
                'MOOV_MONEY',
                'WAVE',
                'CARD'
            )
            .required()
            .messages({
                'any.only': 'Méthode de paiement invalide',
                'any.required': 'La méthode de paiement est requise'
            })
    }),


    /**
     * ID d'un paiement
     *
     * GET /payments/:id
     */
    id: Joi.object({
        id: Joi.string()
            .trim()
            .required()
            .messages({
                'string.empty': 'L’identifiant du paiement est requis',
                'any.required': 'L’identifiant du paiement est requis'
            })
    }),


    /**
     * Données reçues lors de la confirmation
     * par un fournisseur de paiement.
     *
     * Cette validation sera utilisée plus tard
     * par les webhooks.
     */
    confirm: Joi.object({
        providerReference: Joi.string()
            .trim()
            .optional(),

        transactionId: Joi.string()
            .trim()
            .optional()
    }).or(
        'providerReference',
        'transactionId'
    ),


    /**
     * Données reçues lorsqu'un fournisseur
     * signale un échec de paiement.
     */
    fail: Joi.object({
        providerReference: Joi.string()
            .trim()
            .optional(),

        transactionId: Joi.string()
            .trim()
            .optional(),

        reason: Joi.string()
            .trim()
            .max(500)
            .optional()
    }).or(
        'providerReference',
        'transactionId'
    ),
};