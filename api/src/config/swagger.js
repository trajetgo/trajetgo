const swaggerJSDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.3",

        info: {
            title: "Trajet Go API",
            version: "1.0.0",
            description:
                "API de la plateforme Trajet Go pour la digitalisation du transport interurbain en Côte d'Ivoire.",
        },

        servers: [
            {
                url: "http://localhost:3000",
                description: "Développement",
            },
            {
                url: "https://trajetgo.net",
                description: "Production"
            }
        ],

        tags: [
            {
                name: "Auth",
                description: "Authentification et gestion des sessions",
            },
            {
                name: "Companies",
                description: "Gestion des compagnies de transport",
            },
            {
                name: "Agencies",
                description: "Gestion des agences",
            },
            {
                name: "Buses",
                description: "Gestion des bus",
            },
            {
                name: "Routes",
                description: "Gestion des lignes et itinéraires",
            },
            {
                name: "Trips",
                description: "Gestion des voyages",
            },
            {
                name: "Bookings",
                description: "Réservations",
            },
            {
                name: "Payments",
                description: "Paiements",
            },
            {
                name: "Boardings",
                description: "Contrôle et embarquement",
            },
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },

            schemas: {
                ApiResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true,
                        },
                        message: {
                            type: "string",
                            example: "Operation successful",
                        },
                        data: {
                            nullable: true,
                        },
                    },
                },

                ApiError: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false,
                        },
                        message: {
                            type: "string",
                            example: "An error occurred",
                        },
                    },
                },

                User: {
                    type: "object",
                    required: [
                        "firstName",
                        "lastName",
                        "phone",
                        "role",
                        "status"
                    ],
                    properties: {
                        id: {
                            type: "string",
                            example: "cm123abc",
                        },

                        firstName: {
                            type: "string",
                            example: "Joe",
                        },

                        lastName: {
                            type: "string",
                            example: "Doe",
                        },

                        phone: {
                            type: "string",
                            example: "+225 XX XX XX XX XX",
                        },

                        role: {
                            type: "string",
                            enum: [
                                "PASSENGER",
                                "AGENCY_AGENT",
                                "CONTROLLER", ,
                                "COMPANY_ADMIN",
                                "SUPER_ADMIN"
                            ],
                            example: "PASSENGER",
                        },

                        status: {
                            type: "string",
                            enum: [
                                "ACTIVE",
                                "INACTIVE",
                                "SUSPENDED",
                            ],
                            example: "ACTIVE",
                        },
                    }
                },

                Bus: {
                    type: "object",
                    required: [
                        "companyId",
                        "registrationNumber",
                        "capacity",
                    ],
                    properties: {
                        id: {
                            type: "string",
                            example: "cm123abc",
                        },

                        companyId: {
                            type: "string",
                            example: "company-001",
                        },

                        registrationNumber: {
                            type: "string",
                            example: "225-AB-1234",
                        },

                        name: {
                            type: "string",
                            nullable: true,
                            example: "Confort Express",
                        },

                        capacity: {
                            type: "integer",
                            example: 50,
                        },

                        amenities: {
                            type: "array",
                            items: {
                                type: "string",
                                enum: [
                                    "AIR_CONDITIONING",
                                    "WIFI",
                                    "USB_CHARGING",
                                    "POWER_OUTLET",
                                    "TOILET",
                                    "TV",
                                    "RECLINING_SEATS",
                                    "READING_LIGHT",
                                    "LUGGAGE_SPACE",
                                ],
                            },
                            example: [
                                "AIR_CONDITIONING",
                                "WIFI",
                                "USB_CHARGING",
                            ],
                        },

                        status: {
                            type: "string",
                            enum: [
                                "ACTIVE",
                                "INACTIVE",
                                "MAINTENANCE",
                            ],
                            example: "ACTIVE",
                        },

                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },

                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },

                Trip: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "trip-001",
                        },

                        companyId: {
                            type: "string",
                            example: "company-001",
                        },

                        routeId: {
                            type: "string",
                            example: "route-001",
                        },

                        busId: {
                            type: "string",
                            example: "bus-001",
                        },

                        scheduleId: {
                            type: "string",
                            nullable: true,
                            example: "schedule-001",
                        },

                        departureAt: {
                            type: "string",
                            format: "date-time",
                        },

                        arrivalAt: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                        },

                        price: {
                            type: "integer",
                            example: 5000,
                        },

                        currency: {
                            type: "string",
                            example: "XOF",
                        },

                        status: {
                            type: "string",
                            enum: [
                                "SCHEDULED",
                                "BOARDING",
                                "DEPARTED",
                                "ARRIVED",
                                "CANCELLED",
                            ],
                            example: "SCHEDULED",
                        },
                    },
                },

                Ticket: {
                    type: "object",
                    required: [
                        "id",
                        "bookingId",
                        "qrCode",
                        "ticketNumber"
                    ],
                    properties: {
                        id: {
                            type: "string",
                            example: "cm123abc",
                        },

                        bookingId: {
                            type: "string",
                            example: "cm5mpe"
                        },

                        qrCode: {
                            type:"string",
                            example: "6ed96c57"
                        },

                        status: {
                            type: "string",
                            enum: [
                                "ACTIVE",
                                "USED",
                                "CANCELLED",
                                "EXPIRED"
                            ]
                        },

                        ticketNumber: {
                            type: "string",
                            example: "TG-1789655911473-B24AF2F6"
                        }
                    }
                }
            },
        },
    },

    apis: [
        "./src/routes/*.js",
    ],
};

module.exports = swaggerJSDoc(options);