
const {
    prisma,
    logSeed,
    logSuccess
} = require('./helpers');

const seedBuses = async (companies) => {
    logSeed('Seed buses');

    const busesData = [
        /*
         * ==============================
         * UTB
         * ==============================
         */

        {
            companyId: companies.UTB.id,
            registrationNumber: 'UTB-001-ABJ',
            name: 'UTB Express 01',
            capacity: 50
        },

        {
            companyId: companies.UTB.id,
            registrationNumber: 'UTB-002-ABJ',
            name: 'UTB Express 02',
            capacity: 52
        },

        {
            companyId: companies.UTB.id,
            registrationNumber: 'UTB-003-ABJ',
            name: 'UTB Grand Voyageur',
            capacity: 70
        },

        /*
         * ==============================
         * STC
         * ==============================
         */

        {
            companyId: companies.STC.id,
            registrationNumber: 'STC-001-ABJ',
            name: 'STC Express 01',
            capacity: 50
        },

        {
            companyId: companies.STC.id,
            registrationNumber: 'STC-002-ABJ',
            name: 'STC Confort',
            capacity: 52
        }
    ];

    const buses = {};

    for (const data of busesData) {
        const bus = await prisma.bus.upsert({
            where: {
                companyId_registrationNumber: {
                    companyId: data.companyId,
                    registrationNumber: data.registrationNumber
                }
            },

            update: {
                name: data.name,
                capacity: data.capacity,
                status: 'ACTIVE'
            },

            create: {
                companyId: data.companyId,
                registrationNumber: data.registrationNumber,
                name: data.name,
                capacity: data.capacity,
                status: 'ACTIVE'
            },

            include: {
                company: true
            }
        });

        /*
         * Clé pratique pour les prochains seeds.
         *
         * Exemple :
         *
         * buses.UTB_001
         * buses.UTB_002
         * buses.STC_001
         */
        const key = `${bus.company.code}_${data.registrationNumber
            .replace(`${bus.company.code}-`, '')
            .split('-')[0]}`;

        buses[key] = bus;

        logSuccess(
            `${bus.company.code} : ` +
            `${bus.name} (${bus.capacity} places)`
        );
    }

    return buses;
};

module.exports = seedBuses;