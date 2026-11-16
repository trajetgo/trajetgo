const { z } = require("zod");

const CUID_REGEX = /^c[a-z0-9]{24}$/;

const USER_ROLES = ["PASSENGER", "COMPANY_ADMIN", "AGENCY_AGENT", "CONTROLLER"];
const USER_STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED"];

module.exports = {
    /* =========================================================
       LIST
    ========================================================= */

    list: z.object({
        companyId: z
            .string()
            .regex(CUID_REGEX, "Compagnie invalide.")
            .optional(),

        agencyId: z
            .string()
            .regex(CUID_REGEX, "Agence invalide.")
            .optional(),

        role: z.enum(USER_ROLES).optional(),

        status: z.enum(USER_STATUSES).optional(),

        search: z.string().trim().max(100).optional(),

        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(20),

        sortBy: z
            .enum(["createdAt", "firstName", "lastName", "role", "status"])
            .default("createdAt"),

        sortOrder: z.enum(["asc", "desc"]).default("desc"),
    }),

    /* =========================================================
       STATUS
    ========================================================= */

    status: z.object({
        status: z.enum(USER_STATUSES, {
            required_error: "Le statut est obligatoire.",
        }),
    }),

    /* =========================================================
       ROLE
    ========================================================= */

    role: z.object({
        role: z.enum(USER_ROLES, {
            required_error: "Le rôle est obligatoire.",
        }),
    }),

    invite: z
        .object({
            firstName: z
                .string({ required_error: "Le prénom est obligatoire." })
                .trim()
                .min(2, "Le prénom doit contenir au moins 2 caractères.")
                .max(50),

            lastName: z
                .string({ required_error: "Le nom est obligatoire." })
                .trim()
                .min(2, "Le nom doit contenir au moins 2 caractères.")
                .max(50),

            phone: z
                .string({ required_error: "Le téléphone est obligatoire." })
                .trim()
                .regex(
                    /^\+225\d{10}$/,
                    "Numéro ivoirien invalide (format attendu : +225 XX XX XX XX XX)."
                ),

            email: z
                .string()
                .trim()
                .email("Adresse email invalide.")
                .optional()
                .nullable()
                .or(z.literal("").transform(() => null)),

            role: z.enum(
                ["COMPANY_ADMIN", "AGENCY_AGENT", "CONTROLLER"],
                {
                    required_error: "Le rôle est obligatoire.",
                }
            ),

            agencyId: z
                .string()
                .regex(CUID_REGEX, "Agence invalide.")
                .optional()
                .nullable()
                .or(z.literal("").transform(() => null)),
        })
        .refine(
            (data) =>
                data.role === "COMPANY_ADMIN" || Boolean(data.agencyId),
            {
                message: "L'agence est obligatoire pour ce rôle.",
                path: ["agencyId"],
            }
        ),

    /* =========================================================
       PARAM :id
    ========================================================= */

    idParam: z.object({
        id: z.string().regex(CUID_REGEX, "Identifiant invalide."),
    }),
};