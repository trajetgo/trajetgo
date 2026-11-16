const { z } = require("zod");

module.exports = {
    list: z.object({
        search: z
            .string()
            .trim()
            .max(100)
            .optional(),

        status: z
            .enum([
                "ACTIVE",
                "INACTIVE",
                "CLOSED",
            ])
            .optional(),

        companyId: z
            .string()
            .optional(),

        cityId: z
            .string()
            .optional(),
    }),

    create: z.object({
        companyId: z
            .string()
            .trim()
            .optional(),

        cityId: z
            .string()
            .trim()
            .nullable()
            .optional(),

        name: z
            .string()
            .trim()
            .min(2)
            .max(150),

        phone: z
            .string()
            .trim()
            .max(30)
            .nullable()
            .optional(),

        email: z
            .string()
            .trim()
            .email()
            .nullable()
            .optional(),

        address: z
            .string()
            .trim()
            .max(300)
            .nullable()
            .optional(),
    }),

    update: z.object({
        cityId: z
            .string()
            .trim()
            .nullable()
            .optional(),

        name: z
            .string()
            .trim()
            .min(2)
            .max(150)
            .optional(),

        phone: z
            .string()
            .trim()
            .max(30)
            .nullable()
            .optional(),

        email: z
            .string()
            .trim()
            .email()
            .nullable()
            .optional(),

        address: z
            .string()
            .trim()
            .max(300)
            .nullable()
            .optional(),

        status: z
            .enum([
                "ACTIVE",
                "INACTIVE",
                "CLOSED",
            ])
            .optional(),
    }).refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "Au moins un champ doit être fourni.",
        }
    ),
};