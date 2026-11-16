
const { z } = require('zod');

const categories = [
    "BOOKING",
    "PAYMENT",
    "TRIP",
    "BOARDING",
    "ACCOUNT",
    "SECURITY",
    "SYSTEM",
    "MARKETING"
];

module.exports = {
    /**
 * Validation d'un ID de notification
 */
    notificationId: z.object({
        id: z.string().trim().min(1)
    }),

    /**
     * Validation de la liste des notifications
     */
    list: z.object({
        category: z.enum(categories).optional(),

        unreadOnly: z.preprocess(
            (value) => {
                if (value === "true") return true;
                if (value === "false") return false;
                return value;
            },
            z.boolean().default(false)
        ),

        includeArchived: z.preprocess(
            (value) => {
                if (value === "true") return true;
                if (value === "false") return false;
                return value;
            },
            z.boolean().default(false)
        ),

        page: z.coerce.number().int().min(1).default(1),

        limit: z.coerce.number().int().min(1).max(100).default(20)
    }),
};