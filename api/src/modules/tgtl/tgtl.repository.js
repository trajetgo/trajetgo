const prisma = require("../../config/database");

class TgtlRepository {
    findByCompanyId = (companyId) => {
        return prisma.tgtlIntegration.findUnique({
            where: { companyId },
        });
    };

    upsert = (companyId, data) => {
        return prisma.tgtlIntegration.upsert({
            where: { companyId },
            update: data,
            create: { companyId, ...data },
        });
    };
};

module.exports = new TgtlRepository();