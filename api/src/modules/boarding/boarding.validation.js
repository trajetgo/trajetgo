const { z } = require("zod");

module.exports = {
    scan: z.object({
        qrCode: z
            .string({
                required_error: "Le QR code est requis",
                invalid_type_error: "Le QR code doit être une chaîne de caractères",
            })
            .trim()
            .min(10, "Le QR code est invalide")
            .max(255, "Le QR code est trop long"),
    }),

    id: z.object({
        id: z
            .string({
                required_error: "L’identifiant est requis",
                invalid_type_error: "L’identifiant doit être une chaîne de caractères",
            })
            .trim()
            .min(1, "L’identifiant est requis"),
    }),

    tripId: z.object({
        tripId: z
            .string({
                required_error: "L’identifiant du trajet est requis",
                invalid_type_error: "L’identifiant du trajet doit être une chaîne de caractères",
            })
            .trim()
            .min(1, "L’identifiant du trajet est requis"),
    }),

    controllerId: z.object({
        controllerId: z
            .string({
                required_error: "L’identifiant du contrôleur est requis",
                invalid_type_error: "L’identifiant du contrôleur doit être une chaîne de caractères",
            })
            .trim()
            .min(1, "L’identifiant du contrôleur est requis"),
    }),
};