const { z } = require("zod");

const CUID_REGEX = /^c[a-z0-9]{24}$/;

const DAYS = [
    "MONDAY", "TUESDAY", "WEDNESDAY",
    "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY",
];

const SCHEDULE_STATUSES = ["ACTIVE", "INACTIVE"];

const departureSchema = z.object({
    busId: z.string().regex(CUID_REGEX, "Bus invalide."),
    departureTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format HH:mm attendu."),
});

module.exports = {
    create: z
        .object({
            routeId: z.string().regex(CUID_REGEX),
            departureAgencyId: z.string().regex(CUID_REGEX),
            arrivalAgencyId: z.string().regex(CUID_REGEX),

            departures: z
                .array(departureSchema)
                .min(1, "Au moins un départ requis.")
                .max(50, "Maximum 50 départs par programmation."),

            daysOfWeek: z
                .array(z.enum(DAYS))
                .min(1, "Sélectionnez au moins un jour."),

            startDate: z.coerce.date(),
            endDate: z.coerce.date().optional().nullable(),

            autoGenerate: z.boolean().default(true),
        })
        .refine(
            (data) =>
                !data.endDate || data.endDate >= data.startDate,
            {
                message: "La date de fin doit être après le début.",
                path: ["endDate"],
            }
        )
        .refine(
            (data) => {
                // ✅ Pas deux départs à la même heure avec le même bus
                const keys = data.departures.map(
                    (d) => `${d.departureTime}-${d.busId}`
                );
                return new Set(keys).size === keys.length;
            },
            {
                message:
                    "Deux départs ne peuvent pas avoir le même bus à la même heure.",
                path: ["departures"],
            }
        ),

    list: z
        .object({
            routeId: z
                .string()
                .regex(CUID_REGEX, "Ligne invalide.")
                .optional(),

            busId: z
                .string()
                .regex(CUID_REGEX, "Bus invalide.")
                .optional(),

            companyId: z
                .string()
                .regex(CUID_REGEX, "Compagnie invalide.")
                .optional(),

            search: z.string().trim().max(100).optional(),

            status: z.enum(SCHEDULE_STATUSES).optional(),

            daysOfWeek: z
                .union([
                    z.enum(DAYS),
                    z.array(z.enum(DAYS)),
                ])
                .optional(),

            startDate: z.coerce.date().optional(),
            endDate: z.coerce.date().optional(),

            /* Pagination */
            page: z.coerce.number().int().min(1).default(1),
            limit: z.coerce.number().int().min(1).max(100).default(20),

            /* Tri */
            sortBy: z
                .enum(["createdAt", "startDate", "price"])
                .default("createdAt"),
            sortOrder: z.enum(["asc", "desc"]).default("desc"),
        })
        .refine(
            (data) =>
                !data.startDate ||
                !data.endDate ||
                data.endDate >= data.startDate,
            {
                message: "La date de fin doit être après le début.",
                path: ["endDate"],
            }
        ),

    /* =========================================================
       UPDATE
    ========================================================= */

    update: z
        .object({
            routeId: z.string().regex(CUID_REGEX).optional(),
            departureAgencyId: z.string().regex(CUID_REGEX).optional(),
            arrivalAgencyId: z.string().regex(CUID_REGEX).optional(),

            departures: z.array(departureSchema).min(1).optional(),

            daysOfWeek: z.array(z.enum(DAYS)).min(1).optional(),

            startDate: z.coerce.date().optional(),
            endDate: z.coerce.date().optional().nullable(),

            active: z.boolean().optional(),
            autoGenerate: z.boolean().optional(),
        })
        .refine(
            (data) => Object.keys(data).length > 0,
            {
                message:
                    "Au moins un champ doit être fourni pour la mise à jour.",
            }
        ),
};