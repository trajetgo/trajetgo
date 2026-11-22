const repository = require("./audit.repository");

class AuditService {
    log = async ({ userId, event, ip, userAgent, deviceName, os, browser, metadata }) => {
        return await repository.log({
            userId,
            event,
            ip,
            userAgent,
            deviceName,
            os,
            browser,
            metadata
        });
    };
};

module.exports = new AuditService();