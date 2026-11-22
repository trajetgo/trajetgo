const prisma = require("../../config/database");

class ScheduleRepository {
    create = async (data) => {
        return await prisma.schedule.create({
            data,
            include: {
                departures: { include: { bus: true } },
                route: true,
            },
        })
    };

    findMany = async ({
        companyId = null,
        routeId = null,
        busId = null,
        status = null,
        search = null,
        daysOfWeek = null,
        startDate = null,
        endDate = null,
        skip = 0,
        take = 20,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = {}) => {
        /* ---------- Construction du where ---------- */

        const where = {};

        if (companyId) {
            where.companyId = companyId;
        }

        if (routeId) {
            where.routeId = routeId;
        }

        if (status === "ACTIVE") {
            where.active = true;
        } else if (status === "INACTIVE") {
            where.active = false;
        }

        /* ---------- Filtre par bus (dans les départs) ---------- */

        if (busId) {
            where.departures = {
                some: { busId },
            };
        }

        /* ---------- Filtre par jours de la semaine ---------- */
        if (daysOfWeek && daysOfWeek.length > 0) {
            where.daysOfWeek = {
                hasSome: daysOfWeek,
            };
        }

        /* ---------- Filtre par période ---------- */

        if (startDate || endDate) {
            where.AND = [];

            // Le schedule doit être actif à un moment dans la plage
            if (startDate) {
                where.AND.push({
                    OR: [
                        { endDate: null },
                        { endDate: { gte: startDate } },
                    ],
                });
            }

            if (endDate) {
                where.AND.push({
                    startDate: { lte: endDate },
                });
            }

            if (where.AND.length === 0) {
                delete where.AND;
            }
        }

        /* ---------- Recherche (origine/destination) ---------- */

        if (search) {
            where.route = {
                ...(where.route ?? {}),
                OR: [
                    {
                        originCity: {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                    {
                        destinationCity: {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                ],
            };
        }

        /* ---------- Order by ---------- */

        const orderBy = {
            [sortBy]: sortOrder === "asc" ? "asc" : "desc",
        };

        /* ---------- Requête ---------- */

        const [items, total] = await Promise.all([
            prisma.schedule.findMany({
                where,
                skip,
                take,
                orderBy,
                include: {
                    route: {
                        select: {
                            id: true,
                            distanceKm: true,
                            company: {
                                select: {
                                    id: true,
                                    name: true,
                                    logo: true
                                }
                            },
                            originCity: {
                                select: { id: true, name: true },
                            },
                            destinationCity: {
                                select: { id: true, name: true },
                            },
                            basePrice: true,
                            durationMin: true
                        },
                    },
                    departureAgency: {
                        select: { id: true, name: true },
                    },
                    arrivalAgency: {
                        select: { id: true, name: true },
                    },
                    departures: {
                        include: {
                            bus: {
                                select: {
                                    id: true,
                                    name: true,
                                    registrationNumber: true,
                                    capacity: true,
                                },
                            },
                        },
                        orderBy: { departureTime: "asc" },
                    },
                    _count: {
                        select: { trips: true },
                    },
                },
            }),
            prisma.schedule.count({ where }),
        ]);

        return { items, total };
    };

    /* =========================================================
       FIND BY ID
    ========================================================= */

    findById = async (id) => {
        return prisma.schedule.findUnique({
            where: { id },
            include: {
                route: {
                    select: {
                        id: true,
                        originCityId: true,
                        destinationCityId: true,
                        distanceKm: true,
                        durationMin: true,
                        basePrice: true,
                    },
                },
                departureAgency: {
                    select: { id: true, name: true },
                },
                arrivalAgency: {
                    select: { id: true, name: true },
                },
                departures: {
                    select: {
                        id: true,
                        busId: true,
                        departureTime: true,
                    },
                    orderBy: { departureTime: "asc" },
                },
            },
        });
    };

    /**
 * Récupère les schedules actifs avec autoGenerate.
 * Utilisé par le cron de génération.
 *
 * @returns {Promise<Array<{ id: string, companyId: string }>>}
 */
    findActiveForGeneration = async () => {
        return prisma.schedule.findMany({
            where: {
                active: true,
                autoGenerate: true,
            },
            select: {
                id: true,
                companyId: true,
            },
        });
    };
};

module.exports = new ScheduleRepository();