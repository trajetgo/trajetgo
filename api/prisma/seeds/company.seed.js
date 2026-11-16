const {
    prisma,
    logSeed,
    logSuccess
} = require('./helpers');

const seedCompanies = async () => {
    logSeed('Seed companies');

    // Récupération des villes existantes
    const abidjan = await prisma.city.findFirst({
        where: {
            name: 'Abidjan'
        }
    });

    const companiesData = [
        {
            name: 'UTB',
            legalName: 'Union des Transports de Bouaké',
            registrationNumber: 'CI-ABJ-UTB-000001',
            taxId: 'CI-UTB-000001',
            email: 'contact@utb.test',
            phone: '+2250700000001',
            website: 'https://utb.test',
            address: 'Abidjan',
            cityId: abidjan?.id || null,
            logo: null,
        },
        {
            name: 'STC',
            legalName: 'Société de Transport de Côte d’Ivoire',
            registrationNumber: 'CI-ABJ-STC-000002',
            taxId: 'CI-STC-000002',
            email: 'contact@stc.test',
            phone: '+2250700000002',
            website: 'https://stc.test',
            address: 'Abidjan',
            cityId: abidjan?.id || null,
            logo: null,
        }
    ];

    const companies = {};

    for (const data of companiesData) {
        const company = await prisma.company.upsert({
            where: {
                name: data.name
            },

            update: {
                legalName: data.legalName,
                registrationNumber: data.registrationNumber,
                taxId: data.taxId,
                email: data.email,
                phone: data.phone,
                website: data.website,
                address: data.address,
                cityId: data.cityId,
                logo: data.logo,
                status: 'ACTIVE'
            },

            create: {
                name: data.name,
                legalName: data.legalName,
                registrationNumber: data.registrationNumber,
                taxId: data.taxId,
                email: data.email,
                phone: data.phone,
                website: data.website,
                address: data.address,
                cityId: data.cityId,
                logo: data.logo,
                status: 'ACTIVE'
            }
        });

        companies[data.name] = company;

        logSuccess(`${company.name}`);
    }

    return companies;
};

module.exports = seedCompanies;