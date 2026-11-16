const { z } = require('zod');

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#.])[A-Za-z\d@$!%*?&_\-#.]{8,}$/;


module.exports = {
    register: z.object({
        firstName: z
            .string({
                required_error: "Le prénom est obligatoire.",
            })
            .trim()
            .min(2, "Le prénom doit contenir au moins 2 caractères.")
            .max(50, "Le prénom ne peut pas dépasser 50 caractères."),

        lastName: z
            .string({
                required_error: "Le nom est obligatoire.",
            })
            .trim()
            .min(2, "Le nom doit contenir au moins 2 caractères.")
            .max(50, "Le nom ne peut pas dépasser 50 caractères."),

        email: z
            .string({
                required_error: "L'adresse email est obligatoire.",
            })
            .trim()
            .toLowerCase()
            .email("Adresse email invalide."),

        phone: z
            .string()
            .trim()
            .min(8)
            .max(20),

        password: z
            .string({
                required_error: "Le mot de passe est obligatoire.",
            })
            .regex(
                passwordRegex,
                "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
            ),

        // captchaToken: z
        //     .string()
        //     .nonoptional(),
    }),

    login: z.object({
        identifier: z
            .string({
                required_error:
                    "L'adresse email ou le numéro de téléphone est obligatoire.",
            })
            .trim()
            .min(
                1,
                "L'adresse email ou le numéro de téléphone est obligatoire."
            ),

        password: z
            .string({
                required_error: "Le mot de passe est obligatoire.",
            })
            .min(1, "Le mot de passe est obligatoire."),

        rememberMe: z
            .boolean()
            .optional(),

        // recaptchaToken: z
        //     .string()
        //     .nonoptional(),
    }),

    verifyPhone: z.object({
        phone: z
            .string()
            .trim()
            .min(8)
            .max(20),
        code: z
            .string({
                required_error: "Le code de vérification est obligatoire.",
            })
            .length(6, "Le code doit contenir 6 chiffres."),
    }),

    sendOtp: z.object({
        phone: z
            .string()
            .trim()
            .min(8)
            .max(20),
    }),
};