const repository = require("./audit.repository");

class AuditService {
    log = async ({ userId, event, ip, userAgent, metadata }) => {
        return await repository.log({
            userId,
            event,
            ip,
            userAgent,
            metadata
        });
    };
};

module.exports = new AuditService();