const Joi = require('joi');

module.exports = {
    id: Joi.object({
        id: Joi.string()
            .trim()
            .required()
            .messages({
                'string.empty': 'L’identifiant du ticket est requis',
                'any.required': 'L’identifiant du ticket est requis'
            })
    }),

    ticketNumber: Joi.object({
        ticketNumber: Joi.string()
            .trim()
            .min(5)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Le numéro du ticket est requis',
                'string.min': 'Le numéro du ticket est invalide',
                'any.required': 'Le numéro du ticket est requis'
            })
    }),

    qrCode: Joi.object({
        qrCode: Joi.string()
            .trim()
            .min(5)
            .max(200)
            .required()
            .messages({
                'string.empty': 'Le QR Code est requis',
                'string.min': 'Le QR Code est invalide',
                'any.required': 'Le QR Code est requis'
            })
    }),
};
