const prisma = require("../../config/database");

class LocationRepository {

    findCountries = async (filters = {}) => {
        const where = {};

        if (filters.active !== undefined) where.active = filters.active;
        if (filters.search) {
            where.name = {
                contains: filters.search,
                mode: "insensitive",
            };
        }

        return prisma.country.findMany({
            where,
            select: {
                id: true,
                name: true,
                code: true,
                phoneCode: true,
                _count: {
                    select: { cities: true }
                }
            }
        })
    };

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
                country: {
                    select: { id: true, name: true, }
                },
                _count: {
                    select: {
                        locations: true

                    },
                },
            },
            orderBy: { name: "asc" },
        });
    };

    searchCities = async (search) => {
        const term = search?.trim();

        if (!term) {
            return [];
        }

        return prisma.city.findMany({
            where: {
                name: {
                    contains: term,
                    mode: "insensitive",
                },
            },
            include: {
                country: true,
            },
            orderBy: {
                name: "asc",
            },
            take: 20,
        });
    }

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

};

module.exports = new LocationRepository();