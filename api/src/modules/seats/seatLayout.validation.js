const Joi = require('joi');

const seat = Joi.object({
    number: Joi.string()
        .trim()
        .required(),

    row: Joi.number()
        .integer()
        .min(1)
        .required(),

    column: Joi.number()
        .integer()
        .min(1)
        .required(),

    position: Joi.string()
        .valid(
            'WINDOW',
            'AISLE',
            'MIDDLE'
        )
        .optional()
        .allow(null)
});

module.exports = {
    create: Joi.object({
        busId: Joi.string()
            .required(),

        name: Joi.string()
            .trim()
            .min(2)
            .max(100)
            .required(),

        type: Joi.string()
            .valid(
                'TWO_PLUS_TWO',
                'TWO_PLUS_ONE',
                'ONE_PLUS_TWO',
                'CUSTOM'
            )
            .required(),

        rows: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .required(),

        columns: Joi.number()
            .integer()
            .min(1)
            .max(10)
            .required(),

        seats: Joi.array()
            .items(seat)
            .min(1)
            .required()
    }),

    updateSeat: Joi.object({
        status: Joi.string()
            .valid(
                'ACTIVE',
                'INACTIVE'
            )
            .required()
    }),
};