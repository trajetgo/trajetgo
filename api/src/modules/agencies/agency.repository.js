const prisma = require("../../config/database");


class AgencyRepository {
    findMany = async (filters = {}) => {
        const where = {};

        if (filters.companyId) {
            where.companyId = filters.companyId;
        }

        if (filters.cityId) {
            where.cityId = filters.cityId;
        }

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.search) {
            where.OR = [
                {
                    name: {
                        contains: filters.search,
                        mode: 'insensitive'
                    }
                },
            ];
        }

        return prisma.agency.findMany({
            where,
            include: {
                city: {
                    select: {
                        id: true,
                        name: true,
                        country: {
                            select: {
                                id: true,
                                name: true,
                                code: true
                            }
                        }
                    }
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        logo: true
                    }
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    };

    findById = async (id) => {
        return prisma.agency.findUnique({
            where: {
                id
            }
        });
    };

    create = async (data) => {
        return prisma.agency.create({
            data: {
                companyId: data.companyId,
                cityId: data.cityId || null,

                name: data.name,
                address: data.address || null,

                phone: data.phone || null,
                email: data.email || null,
            },

            include: {
                company: true,
                city: {
                    include: {
                        country: true,
                    },
                },
            },
        });
    };

    update = async (id, data) => {
        return prisma.agency.update({
            where: {
                id
            },
            data
        });
    };
};

module.exports = new AgencyRepository();