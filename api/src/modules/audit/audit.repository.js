const prisma = require("../../config/database");

class AuditRepository {
    log = async ({ userId, event, ip, userAgent, deviceName, os, browser, metadata }) => {
        return await prisma.auditLog.create({
            data: {
                userId,
                event,
                ip,
                userAgent,
                device: deviceName,
                os,
                browser,
                metadata
            }
        });
    };
};

module.exports = new AuditRepository();