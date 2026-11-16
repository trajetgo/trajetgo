
const {
    prisma,
    logSeed,
    logSuccess
} = require('./helpers');

const seedAgencies = async (companies, cities) => {
    logSeed('Seed agencies');

    const abidjan = await prisma.location.findFirst({
        where: {
            cityId: cities.ABJ.id
        }
    });

    const yamoussoukro = await prisma.location.findFirst({
        where: {
            cityId: cities.YAM.id
        }
    });

    const bouake = await prisma.location.findFirst({
        where: {
            cityId: cities.BKE.id
        }
    });

    const agenciesData = [
        {
            companyId: companies.UTB.id,
            locationId: abidjan.id,
            name: 'UTB Adjamé',
            code: 'ADJ',
            phone: '+2250700000010'
        },
        {
            companyId: companies.UTB.id,
            locationId: yamoussoukro.id,
            name: 'UTB Yamoussoukro',
            code: 'YAM',
            phone: '+2250700000011'
        },
        {
            companyId: companies.UTB.id,
            locationId: bouake.id,
            name: 'UTB Bouaké',
            code: 'BKE',
            phone: '+2250700000012'
        },
        {
            companyId: companies.STC.id,
            locationId: abidjan.id,
            name: 'STC Abidjan',
            code: 'ABJ',
            phone: '+2250700000020'
        }
    ];

    const agencies = {};

    for (const data of agenciesData) {
        const agency = await prisma.agency.upsert({
            where: {
                companyId_code: {
                    companyId: data.companyId,
                    code: data.code
                }
            },
            update: {
                name: data.name,
                locationId: data.locationId,
                phone: data.phone,
                status: 'ACTIVE'
            },
            create: {
                companyId: data.companyId,
                locationId: data.locationId,
                name: data.name,
                code: data.code,
                phone: data.phone,
                status: 'ACTIVE'
            }
        });

        agencies[`${data.companyId}_${data.code}`] = agency;

        logSuccess(`${agency.name}`);
    }

    return agencies;
};

module.exports = seedAgencies;