
const { z } = require("zod");

const applications = [
    "PASSENGER",
    "COMPANY",
    "AGENCY",
    "CONTROLLER",
    "ADMIN"
];

module.exports = {
    subscribe: z.object({
        subscription: z.object({
            endpoint: z.string().url(),
            expirationTime: z.number().nullable().optional(),
            keys: z.object({
                p256dh: z.string().min(1),
                auth: z.string().min(1)
            })
        }),
        application: z.enum(applications),
        deviceLabel: z.string().trim().max(100).optional(),
    }),

    subscriptionId: z.object({
        id: z.string().trim().min(1)
    })
};
