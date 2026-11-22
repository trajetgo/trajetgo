// locations.schema.js
const { z } = require("zod");

const coordsSchema = z
    .object({
        lat: z.union([z.number(), z.string()]).optional().nullable(),
        lng: z.union([z.number(), z.string()]).optional().nullable(),
    })
    .optional();

const country = z.object({
    type: z.literal("country"),
    name: z.string().trim().min(2, "Le nom est trop court.").max(100),
    code: z.string().trim().length(2, "Le code doit faire 2 caractères.").toUpperCase(),
    phoneCode: z.string().trim().regex(/^\+\d{1,4}$/, "Indicatif invalide (ex. +225)."),
    coords: coordsSchema,
});

const region = z.object({
    type: z.literal("region"),
    name: z.string().trim().min(2).max(100),
    code: z.string().trim().max(10).optional().nullable(),
    countryId: z.string().cuid("Pays invalide."),
    coords: coordsSchema,
});

const city = z.object({
    type: z.literal("city"),
    name: z.string().trim().min(2).max(100),
    code: z.string().trim().max(10).optional().nullable(),
    countryId: z.string().cuid("Pays invalide."),
    regionId: z.string().cuid().optional().nullable(),
    coords: coordsSchema,
});

const location = z.object({
    type: z.literal("location"),
    name: z.string().trim().min(2).max(100),
    cityId: z.string().cuid("Ville invalide."),
    coords: coordsSchema,
});

/* ------------------------------------------------------------------ */
/* Union discriminée : Zod lit `type` et applique le bon schéma        */
/* ------------------------------------------------------------------ */

const create = z.discriminatedUnion("type", [
    country,
    region,
    city,
    location,
]);

module.exports = {
    create,
    country,
    region,
    city,
    location,
};