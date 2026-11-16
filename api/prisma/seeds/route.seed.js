
const {
    prisma,
    logSeed,
    logSuccess
} = require('./helpers');

const seedRoutes = async (companies, cities) => {
    logSeed('Seed routes');

    /*
     * Vérification des villes nécessaires.
     */
    const requiredCities = [
        'ABJ',
        'YAM',
        'BKE',
        'DAL'
    ];

    for (const code of requiredCities) {
        if (!cities[code]) {
            throw new Error(
                `Ville ${code} introuvable. Vérifiez le seed des locations.`
            );
        }
    }

    /*
     * Routes de démonstration.
     *
     * Les distances et durées sont volontairement
     * approximatives et servent uniquement aux tests.
     */
    const routesData = [
        /*
         * ==============================
         * UTB
         * ==============================
         */

        {
            companyId: companies.UTB.id,
            originCityId: cities.ABJ.id,
            destinationCityId: cities.YAM.id,
            distanceKm: 240,
            durationMin: 210
        },

        {
            companyId: companies.UTB.id,
            originCityId: cities.YAM.id,
            destinationCityId: cities.ABJ.id,
            distanceKm: 240,
            durationMin: 210
        },

        {
            companyId: companies.UTB.id,
            originCityId: cities.ABJ.id,
            destinationCityId: cities.BKE.id,
            distanceKm: 350,
            durationMin: 300
        },

        {
            companyId: companies.UTB.id,
            originCityId: cities.BKE.id,
            destinationCityId: cities.ABJ.id,
            distanceKm: 350,
            durationMin: 300
        },

        {
            companyId: companies.UTB.id,
            originCityId: cities.ABJ.id,
            destinationCityId: cities.DAL.id,
            distanceKm: 380,
            durationMin: 330
        },

        {
            companyId: companies.UTB.id,
            originCityId: cities.DAL.id,
            destinationCityId: cities.ABJ.id,
            distanceKm: 380,
            durationMin: 330
        },

        {
            companyId: companies.UTB.id,
            originCityId: cities.YAM.id,
            destinationCityId: cities.BKE.id,
            distanceKm: 105,
            durationMin: 100
        },

        {
            companyId: companies.UTB.id,
            originCityId: cities.BKE.id,
            destinationCityId: cities.YAM.id,
            distanceKm: 105,
            durationMin: 100
        },

        /*
         * ==============================
         * STC
         * ==============================
         */

        {
            companyId: companies.STC.id,
            originCityId: cities.ABJ.id,
            destinationCityId: cities.YAM.id,
            distanceKm: 240,
            durationMin: 210
        },

        {
            companyId: companies.STC.id,
            originCityId: cities.YAM.id,
            destinationCityId: cities.ABJ.id,
            distanceKm: 240,
            durationMin: 210
        },

        {
            companyId: companies.STC.id,
            originCityId: cities.ABJ.id,
            destinationCityId: cities.BKE.id,
            distanceKm: 350,
            durationMin: 300
        },

        {
            companyId: companies.STC.id,
            originCityId: cities.BKE.id,
            destinationCityId: cities.ABJ.id,
            distanceKm: 350,
            durationMin: 300
        }
    ];

    const routes = {};

    for (const data of routesData) {
        const route = await prisma.route.upsert({
            where: {
                companyId_originCityId_destinationCityId: {
                    companyId: data.companyId,
                    originCityId: data.originCityId,
                    destinationCityId: data.destinationCityId
                }
            },

            update: {
                distanceKm: data.distanceKm,
                durationMin: data.durationMin,
                active: true
            },

            create: {
                companyId: data.companyId,
                originCityId: data.originCityId,
                destinationCityId: data.destinationCityId,
                distanceKm: data.distanceKm,
                durationMin: data.durationMin,
                active: true
            },

            include: {
                originCity: true,
                destinationCity: true,
                company: true
            }
        });

        /*
         * Clé pratique pour les prochains seeds.
         *
         * Exemple :
         *
         * routes.UTB_ABJ_YAM
         * routes.STC_ABJ_YAM
         */
        const key = [
            route.company.code,
            route.originCity.code,
            route.destinationCity.code
        ].join('_');

        routes[key] = route;

        logSuccess(
            `${route.company.code} : ` +
            `${route.originCity.name} → ${route.destinationCity.name}`
        );
    }

    return routes;
};

module.exports = seedRoutes;