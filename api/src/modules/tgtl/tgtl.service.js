const ensureCompanyAccess = require("../../utils/ensureCompanyAccess");
const repository = require("./tgtl.repository");

class TgtlService {
    getStatus = async (user) => {
        let companyId = user.companyId;
        const access = ensureCompanyAccess(companyId, user);

        const integration = await repository.findByCompanyId(companyId);

        if (!integration) {
            return {
                synced: false,
                lastSyncAt: null,
                lastSyncType: null,
                lastSyncVersion: null,
                resources: {
                    total: 0,
                    agencies: 0,
                    buses: 0,
                    routes: 0,
                    schedules: 0,
                    staff: 0,
                },
            };
        }

        return {
            synced: Boolean(integration.lastSyncAt),
            lastSyncAt: integration.lastSyncAt,
            lastSyncType: integration.lastSyncType,
            lastSyncVersion: integration.lastSyncVersion,
            resources: {
                total: integration.resourcesImported,
                agencies: integration.agenciesCount,
                buses: integration.busesCount,
                routes: integration.routesCount,
                schedules: integration.schedulesCount,
                staff: integration.staffCount,
            },
        };
    };
};

module.exports = new TgtlService();