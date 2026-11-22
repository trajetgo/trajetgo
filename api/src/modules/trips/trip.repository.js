const prisma = require("../../config/database");
const ApiError = require("../../utils/ApiError");
const { getDayRange } = require("../../utils/dateRange");

class TripRepository {
    findMany = async ({
        companyId,
        agencyId,
        routeId,
        busId,
        status,
        date       // "18:00" (optionnel)
    }) => {
        const where = {};

        // ================================================
        // Compagnie
        // ================================================

        if (companyId) {
            where.route = {
                companyId
            };
        }

        // ================================================
        // Agence
        // ================================================

        if (agencyId) {
            where.departureAgencyId = agencyId;
        }

        // ================================================
        // Route
        // ================================================

        if (routeId) {
            where.routeId = routeId;
        }

        // ================================================
        // Bus
        // ================================================

        if (busId) {
            where.busId = busId;
        }

        // ================================================
        // Statut
        // ================================================

        if (status) {
            where.status = status;
        }

        // ================================================
        // Dates
        // ================================================

        if (date) {
            const { start, end, isToday } = getDayRange(date, now);

            where.departureAt = {
                gte: start,
                lte: end,
            };

            // Optionnel : si isToday et qu'aucun voyage n'est à venir,
            // on peut retourner [] directement sans requêter.
            // (à faire dans le service, pas ici)
        }

        return prisma.trip.findMany({
            where,

            include: {
                route: true,

                bus: {
                    select: {
                        id: true,
                        name: true,
                        capacity: true
                    }
                },

                departureAgency: {
                    select: {
                        id: true,
                        name: true,
                        city: {
                            select: { name: true }
                        }
                    }
                },

                arrivalAgency: {
                    select: {
                        id: true,
                        name: true,
                        city: {
                            select: { name: true }
                        }
                    }
                },

                _count: {
                    select: {
                        bookings: {
                            where: {
                                status: { in: ["PENDING", "CONFIRMED"] }
                            }
                        }
                    }
                }
            },

            orderBy: {
                departureAt: "asc"
            },
            take: 100
        });
    };

    findById = async (id) => {
        return prisma.trip.findUnique({
            where: { id },
            include: {
                route: {
                    include: {
                        originCity: {
                            select: { id: true, name: true },
                        },
                        destinationCity: {
                            select: { id: true, name: true },
                        },
                        company: {
                            select: {
                                id: true,
                                name: true,
                                logo: true,
                            },
                        },
                    },
                },

                bus: {
                    select: {
                        id: true,
                        name: true,
                        registrationNumber: true,
                        fleetNumber: true,
                        capacity: true,

                        /* ✅ Seat layout complet */
                        seatLayout: {
                            include: {
                                seats: {
                                    orderBy: [
                                        { row: "asc" },
                                        { column: "asc" },
                                    ],
                                },
                            },
                        },
                    },
                },

                departureAgency: {
                    select: {
                        id: true,
                        name: true,
                        city: {
                            select: { id: true, name: true },
                        },
                    },
                },

                arrivalAgency: {
                    select: {
                        id: true,
                        name: true,
                        city: {
                            select: { id: true, name: true },
                        },
                    },
                },

                /* ✅ Bookings actifs */
                bookings: {
                    where: {
                        status: {
                            in: ["PENDING", "CONFIRMED", "BOARDED"],
                        },
                    },
                    select: {
                        id: true,
                        seatId: true,
                        status: true,
                    },
                },
            },
        });
    };

    findRouteById = async (id) => {
        return prisma.route.findUnique({
            where: { id }
        });
    }

    findLocationById = async (id) => {
        return prisma.location.findUnique({
            where: { id },
            include: {
                city: true
            }
        });
    }

    create = async (data) => {
        return prisma.trip.create({
            data: {
                routeId: data.routeId,
                busId: data.busId,
                departureAgencyId: data.departureAgencyId,
                arrivalAgencyId: data.arrivalAgencyId,
                departureAt: data.departureAt,
                arrivalAt: data.arrivalAt,
                price: data.price,
            },
            include: {
                route: true,
                bus: true,
                departureAgency: true,
                arrivalAgency: true,
            },
        });
    };

    update = async (id, data) => {
        return prisma.trip.update({
            where: { id },
            data,
            include: {
                route: true,
                bus: true,
                departureAgency: true,
                arrivalAgency: true
            }
        });
    };

    search = async ({
        originCityId,
        destinationCityId,
        startDate,
        endDate,
        limit = 20,
        offset = 0,
    }) => {
        return prisma.trip.findMany({
            where: {
                route: {
                    originCityId,
                    destinationCityId,
                    active: true,
                },
                status: "SCHEDULED",
                departureAt: {
                    gte: startDate,
                    lte: endDate,      // lte, pas lt, car end = 23:59:59.999
                },
            },

            include: {
                route: {
                    select: {
                        id: true,
                        distanceKm: true,
                        durationMin: true,
                        originCity: { select: { id: true, name: true } },
                        destinationCity: { select: { id: true, name: true } },
                        basePrice: true,
                        company: { select: { id: true, name: true, logo: true } },
                    },
                },

                bus: {
                    select: {
                        id: true,
                        companyId: true,
                        capacity: true,
                        status: true,
                        name: true,
                        registrationNumber: true,
                        fleetNumber: true,
                        amenities: true,
                    },
                },

                departureAgency: { select: { id: true, name: true } },
                arrivalAgency: { select: { id: true, name: true } },

                // ✅ comptage agrégé côté base
                _count: {
                    select: {
                        bookings: {
                            where: {
                                status: { in: ["PENDING", "CONFIRMED"] },
                            },
                        },
                    },
                },
            },

            orderBy: { departureAt: "asc" },
            take: Math.min(limit, 50),
            skip: offset,
        });
    };

    findBoardingContext = async (tripId) => {
        return prisma.trip.findUnique({
            where: {
                id: tripId
            },

            select: {
                id: true,

                route: {
                    select: {
                        companyId: true
                    }
                },

                departureAgency: {
                    select: {
                        id: true,
                    }
                },
            }
        });
    };

    /* =========================================================
      ✅ NOUVEAU : récupérer les trips existants
      pour la génération d'un schedule
   ========================================================= */

    /**
     * Récupère les trips d'une liste de bus sur une plage de dates.
     * Utilisé pour éviter les conflits lors de la génération.
     *
     * @param {object} params
     * @param {string[]} params.busIds
     * @param {Date} params.from
     * @param {Date} params.to
     * @param {string[]} [params.statuses]
     * @returns {Promise<Array>}
     */
    findManyByBusIdsAndPeriod = async ({
        busIds = [],
        from,
        to,
        statuses = ["SCHEDULED", "BOARDING", "DEPARTED"],
    } = {}) => {
        if (busIds.length === 0) return [];

        return prisma.trip.findMany({
            where: {
                busId: { in: busIds },
                status: { in: statuses },
                departureAt: {
                    gte: from,
                    lte: to,
                },
            },
            select: {
                id: true,
                busId: true,
                scheduleId: true,
                departureAt: true,
                arrivalAt: true,
                status: true,
            },
        });
    };

    /* =========================================================
       ✅ NOUVEAU : insertion bulk
    ========================================================= */

    /**
     * Insère plusieurs trips en une seule requête.
     * Utilise skipDuplicates pour ignorer les conflits de clé unique.
     *
     * @param {Array} data
     * @returns {Promise<{ count: number }>}
     */
    createMany = async (data = [], { chunkSize = 1000 } = {}) => {
        if (data.length === 0) return { count: 0 };

        let totalCount = 0;

        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            const result = await prisma.trip.createMany({
                data: chunk,
                skipDuplicates: true,
            });
            totalCount += result.count;
        }

        return { count: totalCount };
    };

    findPricesByDateRange = async ({
        originCityId,
        destinationCityId,
        startDate,
        endDate,
    }) => {
        const trips = await prisma.trip.findMany({
            where: {
                route: {
                    originCityId,
                    destinationCityId,
                    active: true,
                },
                status: "SCHEDULED",
                departureAt: {
                    gte: startDate,
                    lt: endDate,
                },
            },
            select: {
                departureAt: true,
                price: true,
            },
        });

        /* Group by jour côté Node */
        const byDate = new Map();

        for (const trip of trips) {
            const dateKey = trip.departureAt.toISOString().split("T")[0];

            const existing = byDate.get(dateKey);

            if (!existing) {
                byDate.set(dateKey, {
                    date: dateKey,
                    minPrice: trip.price,
                    tripsCount: 1,
                });
            } else {
                existing.minPrice = Math.min(existing.minPrice, trip.price);
                existing.tripsCount += 1;
            }
        }

        return Array.from(byDate.values()).sort((a, b) =>
            a.date.localeCompare(b.date)
        );
    };

    getSeatsForTrip = async ({ tripId, busId }) => {
        const [bus, bookings] = await Promise.all([
            prisma.bus.findUnique({
                where: { id: busId },
                select: {
                    id: true,
                    capacity: true,
                    seatLayout: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                            rows: true,
                            columns: true,
                            seats: {
                                where: { status: "ACTIVE" },
                                orderBy: [{ row: "asc" }, { column: "asc" }],
                                select: {
                                    id: true,
                                    number: true,
                                    row: true,
                                    column: true,
                                    position: true,
                                    status: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.booking.findMany({
                where: {
                    tripId,
                    status: { in: ["CONFIRMED", "PENDING"] }, // à adapter à ton enum BookingStatus
                },
                select: { seatId: true },
            }),
        ]);

        if (!bus) {
            throw new ApiError(404, "Bus introuvable.");
        }

        if (!bus.seatLayout) {
            throw new ApiError(400, "Aucun plan de sièges configuré pour ce bus.");
        }

        const bookedSeatIds = new Set(bookings.map((b) => b.seatId));

        return {
            layout: {
                id: bus.seatLayout.id,
                name: bus.seatLayout.name,
                type: bus.seatLayout.type,
                rows: bus.seatLayout.rows,
                columns: bus.seatLayout.columns,
            },
            seats: bus.seatLayout.seats.map((seat) => ({
                ...seat,
                // status: bookedSeatIds.has(seat.id) ? "TAKEN" : "FREE",
                isTaken: bookedSeatIds.has(seat.id),
            })),
        };
    };
}

module.exports = new TripRepository();