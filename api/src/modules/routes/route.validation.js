const { z } = require('zod');

const CUID_REGEX = /^c[a-z0-9]{24}$/;

module.exports = {
    create: z
        .object({
            companyId: z.string().regex(CUID_REGEX, "Compagnie invalide."),

            originCityId: z
                .string()
                .regex(CUID_REGEX, "Ville de départ invalide."),

            destinationCityId: z
                .string()
                .regex(CUID_REGEX, "Ville d'arrivée invalide."),

            distanceKm: z.coerce
                .number()
                .min(1)
                .max(3000)
                .optional()
                .nullable(),

            durationMin: z.coerce
                .number()
                .int()
                .min(5)
                .max(2880)
                .optional()
                .nullable(),

            /* ✅ Prix */
            basePrice: z.coerce
                .number()
                .min(100, "Prix minimum : 100 FCFA")
                .max(1_000_000, "Prix maximum : 1 000 000 FCFA"),

            active: z.boolean().default(true),
        })
        .refine((data) => data.originCityId !== data.destinationCityId, {
            message:
                "Les villes de départ et d'arrivée doivent être différentes.",
            path: ["destinationCityId"],
        }),

    update: z
        .object({
            companyId: z.string().regex(CUID_REGEX, "Compagnie invalide."),

            originCityId: z
                .string()
                .regex(CUID_REGEX, "Ville de départ invalide."),

            destinationCityId: z
                .string()
                .regex(CUID_REGEX, "Ville d'arrivée invalide."),

            distanceKm: z.coerce
                .number()
                .min(1)
                .max(3000)
                .optional()
                .nullable(),

            durationMin: z.coerce
                .number()
                .int()
                .min(5)
                .max(2880)
                .optional()
                .nullable(),

            /* ✅ Prix */
            basePrice: z.coerce
                .number()
                .min(100, "Prix minimum : 100 FCFA")
                .max(1_000_000, "Prix maximum : 1 000 000 FCFA"),

            active: z.boolean().default(true),
        })
        .refine((data) => data.originCityId !== data.destinationCityId, {
            message:
                "Les villes de départ et d'arrivée doivent être différentes.",
            path: ["destinationCityId"],
        }),

    list: z
        .object({
            companyId: z.string().regex(CUID_REGEX, "Compagnie invalide."),

            originCityId: z
                .string()
                .regex(CUID_REGEX, "Ville de départ invalide."),

            destinationCityId: z
                .string()
                .regex(CUID_REGEX, "Ville d'arrivée invalide."),

            active: z.boolean().default(true),
        })
        .refine((data) => data.originCityId !== data.destinationCityId, {
            message:
                "Les villes de départ et d'arrivée doivent être différentes.",
            path: ["destinationCityId"],
        })
}