const prisma = require("../../config/database");

class RouteRepository {
    /* =========================================================
       ROUTES
    ========================================================= */

    findMany = async (filters = {}) => {
        const where = {};

        if (filters.originCityId) where.originCityId = filters.originCityId;
        if (filters.destinationCityId)
            where.destinationCityId = filters.destinationCityId;
        if (filters.companyId) where.companyId = filters.companyId;
        if (filters.active !== undefined) where.active = filters.active;

        return prisma.route.findMany({
            where,
            include: {
                originCity: {
                    select: { id: true, name: true, code: true },
                },
                destinationCity: {
                    select: { id: true, name: true, code: true },
                },
                company: {
                    select: { id: true, name: true, logo: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    };

    findById = async (id) => {
        return prisma.route.findUnique({
            where: { id },
            include: {
                originCity: {
                    include: { region: true },
                },
                destinationCity: {
                    include: { region: true },
                },
                company: true,
            },
        });
    };

    findByCities = async (originCityId, destinationCityId, companyId) => {
        return prisma.route.findUnique({
            where: {
                companyId_originCityId_destinationCityId: {
                    companyId,
                    originCityId,
                    destinationCityId,
                },
            },
        });
    };

    create = async (data) => {
        return prisma.route.create({
            data,
            include: {
                originCity: true,
                destinationCity: true,
            },
        });
    };

    update = async (id, data) => {
        return prisma.route.update({
            where: { id },
            data,
            include: {
                originCity: true,
                destinationCity: true,
            },
        });
    };

    /* Soft delete */
    deleteById = async (id) => {
        return prisma.route.update({
            where: { id },
            data: { active: false },
        });
    };

    /* =========================================================
       CITIES
    ========================================================= */

    findCities = async (filters = {}) => {
        const where = {};

        if (filters.active !== undefined) where.active = filters.active;
        if (filters.search) {
            where.name = {
                contains: filters.search,
                mode: "insensitive",
            };
        }

        return prisma.city.findMany({
            where,
            select: {
                id: true,
                name: true,
                code: true,
                _count: {
                    select: { locations: true },
                },
            },
            orderBy: { name: "asc" },
        });
    };

    findCityById = async (id) => {
        return prisma.city.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                locations: {
                    where: { active: true },
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        latitude: true,
                        longitude: true,
                    },
                    orderBy: { name: "asc" },
                },
            },
        });
    };

    /* =========================================================
       LOCATIONS
    ========================================================= */

    /* ✅ findMany — plusieurs lieux par ville */
    findLocationsByCityId = async (cityId) => {
        return prisma.location.findMany({
            where: {
                cityId,
                active: true,
            },
            select: {
                id: true,
                name: true,
                address: true,
                latitude: true,
                longitude: true,
            },
            orderBy: { name: "asc" },
        });
    };

    findLocationById = async (id) => {
        return prisma.location.findUnique({
            where: { id },
            include: {
                city: {
                    select: { id: true, name: true, code: true },
                },
            },
        });
    };

    findRouteById = async (id) => {
        return prisma.route.findUnique({
            where: { id }
        });
    }
}

module.exports = new RouteRepository();