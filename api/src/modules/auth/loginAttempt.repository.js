const prisma = require("../../config/database");

class LoginAttemptRepository {
    create = async (data) => {
        return await prisma.loginAttempt.create({
            data
        });
    }

    /**
    * Compte les échecs récents pour un identifiant.
    * @param {string} identifier - email ou téléphone normalisé
    * @param {number} windowMs   - fenêtre (ex. 15 min)
    */
    countRecentFailures = async (identifier, windowMs = 15 * 60 * 1000) => {
        return prisma.loginAttempt.count({
            where: {
                identifier,
                success: false,
                createdAt: { gte: new Date(Date.now() - windowMs) },
            },
        });
    }

    /**
     * Dernière connexion réussie pour un utilisateur.
     * Sert à comparer l'appareil/IP actuel aux précédents.
     */
    findLastSuccess = async (userId) => {
        return prisma.loginAttempt.findFirst({
            where: {
                userId,
                success: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    /**
    * Appareils (userAgent) déjà vus pour cet utilisateur.
    */
    findKnownUserAgents = async (userId, limit = 10) => {
        const rows = await prisma.loginAttempt.findMany({
            where: { userId, success: true },
            select: { userAgent: true },
            distinct: ["userAgent"],
            orderBy: { createdAt: "desc" },
            take: limit,
        });

        return new Set(rows.map((r) => r.userAgent).filter(Boolean));
    }
};

module.exports = new LoginAttemptRepository();