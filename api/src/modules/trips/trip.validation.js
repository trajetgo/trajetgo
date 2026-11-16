const { z } = require("zod");

/* ------------------------------------------------------------------ */
/* Constantes                                                          */
/* ------------------------------------------------------------------ */

const CUID_REGEX = /^c[a-z0-9]{24}$/;

const TRIP_STATUSES = [
    "SCHEDULED",
    "BOARDING",
    "DEPARTED",
    "ARRIVED",
    "CANCELLED",
];

/* ------------------------------------------------------------------ */
/* Helper : string optionnel (accepte "", null, undefined → null)      */
/* ------------------------------------------------------------------ */

const optionalId = () =>
    z
        .string()
        .regex(CUID_REGEX, "Identifiant invalide.")
        .optional()
        .nullable()
        .or(z.literal("").transform(() => null));

/* ------------------------------------------------------------------ */
/* Schemas                                                             */
/* ------------------------------------------------------------------ */

module.exports = {
    /* =========================================================
       CREATE
    ========================================================= */

    create: z
        .object({
            routeId: z
                .string({ required_error: "La ligne est obligatoire." })
                .regex(CUID_REGEX, "Ligne invalide."),

            busId: z
                .string({ required_error: "Le bus est obligatoire." })
                .regex(CUID_REGEX, "Bus invalide."),

            departureAgencyId: optionalId(),

            arrivalAgencyId: optionalId(),

            departureAt: z.coerce
                .date({ invalid_type_error: "Date de départ invalide." }),

            arrivalAt: z.coerce
                .date({ invalid_type_error: "Date d'arrivée invalide." })
                .optional()
                .nullable(),

            price: z.coerce
                .number({ invalid_type_error: "Prix invalide." })
                .int("Le prix doit être un entier.")
                .min(0, "Le prix doit être positif."),
        })
        .refine(
            (data) =>
                !data.arrivalAt || data.arrivalAt > data.departureAt,
            {
                message:
                    "L'arrivée doit être après le départ.",
                path: ["arrivalAt"],
            }
        )
        .refine(
            (data) =>
                !data.departureLocationId ||
                !data.arrivalLocationId ||
                data.departureLocationId !== data.arrivalLocationId,
            {
                message:
                    "Les agences de départ et d'arrivée doivent être différentes.",
                path: ["arrivalLocationId"],
            }
        ),

    /* =========================================================
       UPDATE
    ========================================================= */

    update: z
        .object({
            busId: z
                .string()
                .regex(CUID_REGEX, "Bus invalide.")
                .optional(),

            departureLocationId: optionalId(),

            arrivalLocationId: optionalId(),

            departureAt: z.coerce.date().optional(),

            arrivalAt: z.coerce.date().optional().nullable(),

            price: z.coerce
                .number()
                .int()
                .min(0)
                .optional(),

            status: z.enum(TRIP_STATUSES).optional(),
        })
        .refine(
            (data) => Object.keys(data).length > 0,
            {
                message:
                    "Au moins un champ doit être fourni pour la mise à jour.",
            }
        ),

    /* =========================================================
       LIST
    ========================================================= */

    list: z.object({
        routeId: z
            .string()
            .regex(CUID_REGEX)
            .optional(),

        busId: z
            .string()
            .regex(CUID_REGEX)
            .optional(),

        status: z.enum(TRIP_STATUSES).optional(),

        date: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Format attendu : YYYY-MM-DD.")
            .optional(),
    }),

    /* =========================================================
       SEARCH (route publique)
    ========================================================= */

    search: z
        .object({
            from: z
                .string({ required_error: "La ville de départ est requise." })
                .regex(CUID_REGEX, "L'identifiant de la ville de départ est invalide."),

            to: z
                .string({ required_error: "La ville d'arrivée est requise." })
                .regex(CUID_REGEX, "L'identifiant de la ville d'arrivée est invalide."),

            date: z
                .string()
                .regex(/^\d{4}-\d{2}-\d{2}$/, "Format attendu : YYYY-MM-DD."),

            adults: z.coerce.number().int().min(1).max(10).default(1),

            children: z
                .string()
                .optional()
                .transform((val) => {
                    if (!val) return [];
                    return val
                        .split(",")
                        .map((n) => Number(n.trim()))
                        .filter((n) => Number.isFinite(n) && n >= 0 && n <= 11);
                }),

            limit: z.coerce.number().int().min(1).max(50).default(20),

            offset: z.coerce.number().int().min(0).default(0),
        })
        .refine((data) => data.from !== data.to, {
            message:
                "La ville de départ et la ville d'arrivée doivent être différentes.",
            path: ["to"],
        }),

    prices: z
        .object({
            from: z.string().regex(CUID_REGEX, "Ville de départ invalide."),
            to: z.string().regex(CUID_REGEX, "Ville d'arrivée invalide."),
            date: z
                .string()
                .regex(/^\d{4}-\d{2}-\d{2}$/, "Format attendu : YYYY-MM-DD."),
            range: z.coerce.number().int().min(2).max(2).default(2),
        })
        .refine((data) => data.from !== data.to, {
            message: "Les villes doivent être différentes.",
            path: ["to"],
        }),
};