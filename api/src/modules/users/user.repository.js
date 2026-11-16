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
    agencyId: true,
    role: true,
    status: true,
};

class UserRepository {
    /* =========================================================
       FIND BY ID
    ========================================================= */

    findById = async (id) => {
        return prisma.user.findUnique({
            where: { id },
            select: PUBLIC_SELECT,
        });
    };

    /* =========================================================
       FIND MANY
    ========================================================= */

    findMany = async ({
        companyId = null,
        agencyId = null,
        role = null,
        status = null,
        search = null,
        skip = 0,
        take = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = {}) => {
        /* ---------- Where ---------- */

        const where = {};

        if (companyId) {
            where.companyId = companyId;
        }

        if (agencyId) {
            where.agencyId = agencyId;
        }

        if (role) {
            where.role = role;
        }

        if (status) {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
                { fullName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search } },
            ];
        }

        /* ---------- Order by ---------- */

        const orderBy = { [sortBy]: sortOrder };

        /* ---------- Requête ---------- */

        const [items, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take,
                orderBy,
                select: PUBLIC_SELECT
            }),
            prisma.user.count({ where }),
        ]);

        return { items, total };
    };

    /* =========================================================
       FIND BY PHONE / EMAIL (pour invitation)
    ========================================================= */

    findByPhone = async (phone) => {
        return prisma.user.findUnique({
            where: { phone },
            select: { id: true },
        });
    };

    findByEmail = async (email) => {
        if (!email) return null;

        return prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });
    };

    /* =========================================================
       CREATE
    ========================================================= */

    create = async (data) => {
        return await prisma.user.create({
            data,
            select: PUBLIC_SELECT
        });
    };

    /* =========================================================
       UPDATE
    ========================================================= */

    updateStatus = async (id, status) => {
        return prisma.user.update({
            where: { id },
            data: { status },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                status: true,
            },
        });
    };

    updateRole = async (id, role) => {
        return prisma.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                status: true,
            },
        });
    };

    /** Pour la connexion : inclut l'identifiant de mot de passe. */
    findForLogin = async ({ type, value }) => {
        return await prisma.user.findUnique({
            where: type === 'email' ? { email: value } : { phone: value },
            include: { password: true },
        });
    }

    touchLastLogin = async (id) => {
        return await prisma.user.update({
            where: { id },
            data: { lastLoginAt: new Date() }
        });
    }

    /** Recherche légère (sans mot de passe) par e-mail ou téléphone normalisé. */
    findByIdentifier = async ({ type, value }) => {
        return await prisma.user.findUnique({
            where: type === 'email' ? { email: value } : { phone: value },
            select: { id: true, status: true, email: true, phone: true },
        });
    }

    markPhoneVerified = async (userId) => {
        return await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                phoneVerified: true,
                phoneVerifiedAt: new Date()
            },
            select: PUBLIC_SELECT
        })
    };

    updateProfile = async (data) => {
        return await prisma.user.update({
            where: { id: data.id },
            data,
            select: PUBLIC_SELECT
        })
    }

    findSessions = async (userId) => {
        return await prisma.session.findMany({
            where: {
                userId
            }
        });
    }
}

module.exports = new UserRepository();