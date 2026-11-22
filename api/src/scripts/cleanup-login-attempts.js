const prisma = require("../config/database");

async function cleanupLoginAttempts() {
    try {
        await prisma.loginAttempt.deleteMany({
            where: {
                createdAt: { lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
            },
        });
    } catch (error) {
        console.error()
    }
}