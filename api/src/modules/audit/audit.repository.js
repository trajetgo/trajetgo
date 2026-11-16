const prisma = require("../../config/database");

class AuditRepository {
    log = async ({ userId, event, ip, userAgent, metadata }) => {
        return await prisma.auditLog.create({
            data: {
                userId,
                event,
                ip,
                userAgent,
                metadata
            }
        });
    };
};

module.exports = new AuditRepository();