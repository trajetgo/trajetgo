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

class AuthRepository {
    createSession = (data) => prisma.session.create({ data });

    findActiveSessionByTokenHash = async (tokenHash) => {
        return await prisma.session.findFirst({
            where: {
                tokenHash,
                revokedAt: null,
                expiresAt: { gt: new Date() },
            },
            include: { user: { select: PUBLIC_SELECT } },
        });
    }

    touchSession = async (id) => {
        return await prisma.session.update({
            where: { id },
            data: { lastSeenAt: new Date() }
        });
    }


    findByIdentifier = async ({ type, value }) => {
        if (type === 'email') {
            return prisma.user.findUnique({
                where: {
                    email: value
                }
            });
        }

        if (type === 'phone') {
            return prisma.user.findUnique({
                where: {
                    phone: value
                }
            });
        }

        return null;
    };

    findByEmailAndPhone = async (email, phone) => {
        return await prisma.user.findFirst({
            where: {
                AND: [
                    { email },
                    { phone }
                ]
            },
            select: PUBLIC_SELECT
        });
    };


    findUserByPhone = async (phone) => {
        return await prisma.user.findUnique({
            where: { phone }
        });
    }

    findUserById = async (id) => {
        return await prisma.user.findUnique({
            where: { id },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        logo: true
                    }
                },
                agency: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    createUser = async (data) => {
        return await prisma.user.create({
            data
        });
    }

    createVerification = async (data) => {
        return await prisma.verification.create({
            data
        });
    }

    createRefreshToken = async (data) => {
        return await prisma.refreshToken.create({
            data
        });
    }

    findRefreshToken = async (tokenHash) => {
        return await prisma.refreshToken.findFirst({
            where: { tokenHash }
        });
    }

    revokeRefreshToken = async (tokenHash) => {
        return await prisma.refreshToken.delete({
            where: { tokenHash }
        });
    }

    revokeSessions = async (userId) => {
        return await prisma.refreshToken.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
        })
    }

    updatePasswordCredential = async (userId, { hash, algorithm }) => {
        return await prisma.passwordCredential.update({
            where: { userId },
            data: { hash, algorithm, needsRehash: false },
        });
    }

    findActiveVerification = async (target, purpose) => {
        return prisma.verification.findFirst({
            where: {
                target,
                purpose,
                consumedAt: null,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: "desc" },
        });
    };

    incrementAttempts = async (id) => {
        return prisma.verification.update({
            where: { id },
            data: { attempts: { increment: 1 } },
        });
    };

    consumeVerification = async (id) => {
        return prisma.verification.update({
            where: { id },
            data: { consumedAt: new Date() },
        });
    };

    findRecentVerification = async ({ target, purpose, since }) => {
        return prisma.verification.findFirst({
            where: {
                target,
                purpose,
                createdAt: { gte: since },
            },
            orderBy: { createdAt: "desc" },
        });
    };
};

module.exports = new AuthRepository();