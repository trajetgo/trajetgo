const { z } = require("zod");

const COMPANY_STATUS = ["ACTIVE", "INACTIVE", "SUSPENDED"];

const CUID_REGEX = /^c[a-z0-9]{24}$/;

/**
 * Champ string optionnel qui accepte : valeur, "", null, undefined.
 * Renvoie `null` si vide.
 */
const optionalString = ({ max, min } = {}) => {
    let schema = z.string().trim();

    if (typeof min === "number") schema = schema.min(min);
    if (typeof max === "number") schema = schema.max(max);

    return schema
        .optional()
        .nullable()
        .or(z.literal("").transform(() => null));
};

module.exports = {
    list: z.object({
        search: z.string().trim().max(100).optional(),

        status: z.enum(COMPANY_STATUS).optional(),
    }),

    create: z.object({
        name: z
            .string({ required_error: "Le nom est obligatoire." })
            .trim()
            .min(2, "Le nom doit contenir au moins 2 caractères.")
            .max(150, "Le nom ne peut pas dépasser 150 caractères."),

        legalName: optionalString({ max: 200 }),

        // ✅ APRÈS
        registrationNumber: z
            .string()
            .trim()
            .max(100)
            .transform((v) => v.toUpperCase())   // ← transform après max
            .optional()
            .nullable()
            .or(z.literal("").transform(() => null)),

        taxId: z
            .string()
            .trim()
            .max(100)
            .transform((v) => v.toUpperCase())   // ← transform après max
            .optional()
            .nullable()
            .or(z.literal("").transform(() => null)),

        email: z
            .string()
            .trim()
            .email("Adresse email invalide.")
            .optional()
            .nullable()
            .or(z.literal("").transform(() => null)),

        phone: z
            .string({ required_error: "Le téléphone est obligatoire." })
            .trim()
            .max(30, "Le téléphone est trop long.")
            .min(1, "Le téléphone est obligatoire."),

        website: z
            .string()
            .trim()
            .url("URL du site web invalide.")
            .optional()
            .nullable()
            .or(z.literal("").transform(() => null)),

        address: z
            .string()
            .trim()
            .max(300, "L'adresse ne peut pas dépasser 300 caractères.")
            .optional()
            .nullable()
            .or(z.literal("").transform(() => null)),

        cityId: z
            .string()
            .trim()
            .regex(CUID_REGEX, "Identifiant de ville invalide.")
            .optional()
            .nullable()
            .or(z.literal("").transform(() => null)),

        logoUrl: z
            .string()
            .trim()
            .url("URL du logo invalide.")
            .optional()
            .nullable()
            .or(z.literal("").transform(() => null)),
    }),

    update: z
        .object({
            name: z
                .string()
                .trim()
                .min(2, "Le nom doit contenir au moins 2 caractères.")
                .max(150)
                .optional(),

            phone: z
                .string()
                .trim()
                .max(30)
                .optional()
                .nullable()
                .or(z.literal("").transform(() => null)),

            email: z
                .string()
                .trim()
                .email("Adresse email invalide.")
                .optional()
                .nullable()
                .or(z.literal("").transform(() => null)),

            website: z
                .string()
                .trim()
                .url("URL du site web invalide.")
                .optional()
                .nullable()
                .or(z.literal("").transform(() => null)),

            logo: z
                .string()
                .trim()
                .url("URL du logo invalide.")
                .optional()
                .nullable()
                .or(z.literal("").transform(() => null)),

            status: z.enum(COMPANY_STATUS).optional(),
        })
        .refine(
            (data) => Object.keys(data).length > 0,
            {
                message:
                    "Au moins un champ doit être fourni pour la mise à jour.",
            }
        )
};