const Joi = require('joi');


module.exports = {
    create: Joi.object({
        tripId: Joi.string()
            .trim()
            .required()
            .messages({
                'string.empty': 'Le voyage est requis',
                'any.required': 'Le voyage est requis'
            }),

        seatId: Joi.string()
            .trim()
            .required()
            .messages({
                'string.empty': 'Le siège est requis',
                'any.required': 'Le siège est requis'
            })
    }),


    id: Joi.object({
        id: Joi.string()
            .trim()
            .required()
            .messages({
                'string.empty': 'L’identifiant de la réservation est requis',
                'any.required': 'L’identifiant de la réservation est requis'
            })
    }),


    list: Joi.object({
        status: Joi.string()
            .valid(
                'PENDING',
                'CONFIRMED',
                'CANCELLED',
                'EXPIRED',
                'BOARDED',
                'COMPLETED',
                'NO_SHOW'
            )
            .optional(),

        tripId: Joi.string()
            .trim()
            .optional(),

        userId: Joi.string()
            .trim()
            .optional()
    }),
};