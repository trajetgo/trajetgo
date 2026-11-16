const { z } = require("zod");

const SEAT_LAYOUT_TYPES = [
    "TWO_PLUS_TWO",
    "TWO_PLUS_ONE",
    "ONE_PLUS_TWO",
    "CUSTOM",
];

const SEAT_POSITIONS = ["WINDOW", "AISLE", "MIDDLE"];
const SEAT_STATUSES = ["ACTIVE", "INACTIVE"];

const SEAT_LABEL_REGEX = /^[A-Z]\d{1,2}$/;

const BUS_TYPES = ["COACH", "MINIBUS", "BUS", "VAN", "OTHER"];
const BUS_STATUSES = ["ACTIVE", "INACTIVE", "MAINTENANCE", "RETIRED"];

const AMENITIES = [
    "AIR_CONDITIONING",
    "WIFI",
    "USB_CHARGING",
    "POWER_OUTLET",
    "TOILET",
    "TV",
    "RECLINING_SEATS",
    "READING_LIGHT",
    "LUGGAGE_SPACE",
];

const CUID_REGEX = /^c[a-z0-9]{24}$/;

module.exports = {
    list: z.object({
        busType: z.enum(BUS_TYPES).default("COACH"),

        status: z.enum(BUS_STATUSES).default("ACTIVE"),
    }),

    create: z.object({
        // companyId: z.string().regex(CUID_REGEX, "Compagnie invalide."),
        registrationNumber: z
            .string({ required_error: "L'immatriculation est obligatoire." })
            .trim()
            .toUpperCase()
            .min(3, "Immatriculation trop courte.")
            .max(20, "Immatriculation trop longue.")
            .regex(/^[A-Z0-9\- ]+$/, "Format d'immatriculation invalide."),

        fleetNumber: z
            .string()
            .trim()
            .toUpperCase()
            .min(1)
            .max(30)
            .regex(/^[A-Z0-9\- ]+$/)
            .optional()
            .nullable()
            .or(z.literal("").transform(() => null)),

        name: z
            .string()
            .trim()
            .min(2, "Nom trop court.")
            .max(50, "Nom trop long.")
            .optional()
            .nullable()
            .or(z.literal("").transform(() => null)),

        brand: z.string().trim().min(2).max(50).optional().nullable(),
        model: z.string().trim().min(1).max(80).optional().nullable(),

        year: z.coerce
            .number()
            .int()
            .min(1950)
            .max(new Date().getFullYear() + 1)
            .optional()
            .nullable(),

        busType: z.enum(BUS_TYPES).default("COACH"),

        capacity: z.coerce
            .number()
            .int()
            .min(1, "Capacité minimale : 1.")
            .max(100, "Capacité maximale : 100."),

        status: z.enum(BUS_STATUSES).default("ACTIVE"),

        amenities: z.array(z.enum(AMENITIES)).default([]),
    }),

    seatLayout: z.object({
        name: z
            .string()
            .trim()
            .min(2, "Nom trop court.")
            .max(50, "Nom trop long.")
            .optional()
            .or(z.literal("").transform(() => "Configuration standard")),

        type: z.enum(SEAT_LAYOUT_TYPES).default("CUSTOM"),

        rows: z.coerce.number().int().min(1).max(20),

        columns: z.coerce.number().int().min(1).max(6),

        aisleAfterColumn: z.coerce
            .number()
            .int()
            .min(1)
            .max(5)
            .optional()
            .nullable(),

        seats: z
            .array(
                z.object({
                    number: z
                        .string()
                        .trim()
                        .regex(SEAT_LABEL_REGEX, "Format de siège invalide (ex: A1)."),

                    row: z.coerce.number().int().min(1).max(20),

                    column: z.coerce.number().int().min(1).max(6),

                    position: z.enum(SEAT_POSITIONS).optional().nullable(),

                    status: z.enum(SEAT_STATUSES).default("ACTIVE"),
                })
            )
            .min(1, "Au moins un siège requis."),
    })
        .refine(
            (data) => {
                // Vérifier que le nombre de sièges correspond à rows × columns
                const expected = data.rows * data.columns;
                return data.seats.length === expected;
            },
            {
                message: "Le nombre de sièges ne correspond pas à la grille (rows × columns).",
                path: ["seats"],
            }
        )
        .refine(
            (data) => {
                // Vérifier les doublons de coordonnées
                const coords = new Set();
                for (const seat of data.seats) {
                    const key = `${seat.row}-${seat.column}`;
                    if (coords.has(key)) return false;
                    coords.add(key);
                }
                return true;
            },
            {
                message: "Coordonnées de sièges en doublon.",
                path: ["seats"],
            }
        )
        .refine(
            (data) => {
                // Vérifier les doublons de numéro
                const numbers = new Set();
                for (const seat of data.seats) {
                    if (numbers.has(seat.number)) return false;
                    numbers.add(seat.number);
                }
                return true;
            },
            {
                message: "Numéros de sièges en doublon.",
                path: ["seats"],
            }
        ),

    update: z.object({
        registrationNumber: z
            .string({ required_error: "L'immatriculation est obligatoire." })
            .trim()
            .toUpperCase()
            .min(3, "Immatriculation trop courte.")
            .max(20, "Immatriculation trop longue.")
            .regex(/^[A-Z0-9\- ]+$/, "Format d'immatriculation invalide."),

        fleetNumber: z
            .string()
            .trim()
            .toUpperCase()
            .min(1)
            .max(30)
            .regex(/^[A-Z0-9\- ]+$/)
            .optional()
            .nullable()
            .or(z.literal("").transform(() => null)),

        name: z
            .string()
            .trim()
            .min(2, "Nom trop court.")
            .max(50, "Nom trop long.")
            .optional()
            .nullable()
            .or(z.literal("").transform(() => null)),

        brand: z.string().trim().min(2).max(50).optional().nullable(),
        model: z.string().trim().min(1).max(80).optional().nullable(),

        year: z.coerce
            .number()
            .int()
            .min(1950)
            .max(new Date().getFullYear() + 1)
            .optional()
            .nullable(),

        busType: z.enum(BUS_TYPES).default("COACH"),

        capacity: z.coerce
            .number()
            .int()
            .min(1, "Capacité minimale : 1.")
            .max(100, "Capacité maximale : 100."),

        status: z.enum(BUS_STATUSES).default("ACTIVE"),

        amenities: z.array(z.enum(AMENITIES)).default([]),
    }),
};