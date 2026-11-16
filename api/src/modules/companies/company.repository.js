const prisma = require("../../config/database");

const PUBLIC_SELECT = {
    id: true,
    email: true,
    emailVerified: true,
    emailVerifiedAt: true,
    phone: true,
    phoneVerified: true,
    phoneVerifiedAt: true,
    firstName: true,
    lastName: true,
    fullName: true,
    avatarUrl: true,
    companyId: true,
    company: true,
    agencyId: true,
    agency: true,
    role: true,
    status: true,
    createdAt: true,
};

class CompanyRepository {
    findMany = async (filters = {}) => {
        const where = {};

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
                {
                    code: {
                        contains: filters.search,
                        mode: 'insensitive'
                    }
                }
            ];
        }

        return prisma.company.findMany({
            where,
            include: {
                city: {
                    select: {
                        id: true,
                        name: true,
                        country: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    findMembers = async ({
        companyId,
        agencyId,
        status,
        role,
        search,
        page,
        limit
    }) => {
        const where = {};

        // =====================================================
        // Périmètre compagnie
        // =====================================================

        if (companyId) {
            where.companyId = companyId;
        }

        // =====================================================
        // Périmètre agence
        // =====================================================

        if (agencyId) {
            where.agencyId = agencyId;
        }

        // =====================================================
        // Statut
        // =====================================================

        if (status) {
            where.status = status;
        }

        // =====================================================
        // Rôle
        // =====================================================

        if (role) {
            where.role = role;
        }

        // =====================================================
        // Recherche
        // =====================================================

        if (search?.trim()) {
            const term = search.trim();

            where.OR = [
                { firstName: { contains: term, mode: "insensitive" } },
                { lastName: { contains: term, mode: "insensitive" } },
                { fullName: { contains: term, mode: "insensitive" } },
                { phone: { contains: term, mode: "insensitive" } },
                { email: { contains: term, mode: "insensitive" } }
            ];
        }

        const skip = (page - 1) * limit;

        const [members, total] = await prisma.$transaction([
            prisma.user.findMany({
                where,

                skip,
                take: limit,

                orderBy: {
                    createdAt: "desc"
                },

                select: PUBLIC_SELECT
            }),

            prisma.user.count({
                where
            })
        ]);

        return {
            members,

            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    };

    findById = async (id) => {
        return prisma.company.findUnique({
            where: { id }
        });
    };

    findByCode = async (code) => {
        return prisma.company.findUnique({
            where: {
                code
            }
        });
    };

    createWithLocation = async (data) => {
        return prisma.$transaction(async (tx) => {

            const location = await tx.location.create({
                data: {
                    name: data.name,
                    cityId: data.cityId,
                    address: data.address || null,
                    latitude: data.latitude || null,
                    longitude: data.longitude || null,
                }
            });

            const agency = await tx.agency.create({
                data: {
                    companyId: data.companyId,
                    locationId: location.id,
                    name: data.name,
                    code: data.code,
                    description: data.description || null,
                    phone: data.phone || null,
                    email: data.email || null,
                    address: data.address || null,
                    latitude: data.latitude || null,
                    longitude: data.longitude || null,
                }
            });

            return agency;
        });
    };

    create = async (data) => {
        return prisma.company.create({
            data,
        });
    };

    findByRegistrationNumber = async (registrationNumber) => {
        return prisma.company.findUnique({
            where: {
                registrationNumber
            }
        });
    };

    update = async (id, data) => {
        return prisma.company.update({
            where: {
                id
            },
            data
        });
    };
};

module.exports = new CompanyRepository();