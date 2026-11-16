
const {
    prisma,
    futureDate,
    addMinutes,
    logSeed,
    logSuccess
} = require('./helpers');

/*
 * Récupère une Location appartenant à une ville.
 *
 * On utilise ici la première location active de la ville.
 */
const getCityLocation = async (cityId) => {
    const location = await prisma.location.findFirst({
        where: {
            cityId,
            active: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    if (!location) {
        throw new Error(
            `Aucune location active trouvée pour la ville ${cityId}`
        );
    }

    return location;
};

const seedTrips = async (routes, buses, cities) => {
    logSeed('Seed trips');

    /*
     * ==========================================
     * Locations de départ / arrivée
     * ==========================================
     */

    const locations = {
        ABJ: await getCityLocation(cities.ABJ.id),
        YAM: await getCityLocation(cities.YAM.id),
        BKE: await getCityLocation(cities.BKE.id),
        DAL: await getCityLocation(cities.DAL.id)
    };

    /*
     * ==========================================
     * Vérification des routes nécessaires
     * ==========================================
     */

    const requiredRoutes = [
        'UTB_ABJ_YAM',
        'UTB_YAM_ABJ',
        'UTB_ABJ_BKE',
        'UTB_BKE_ABJ',
        'UTB_ABJ_DAL',
        'STC_ABJ_YAM',
        'STC_YAM_ABJ',
        'STC_ABJ_BKE'
    ];

    for (const key of requiredRoutes) {
        if (!routes[key]) {
            throw new Error(
                `Route ${key} introuvable. Vérifiez le seed des routes.`
            );
        }
    }

    /*
     * ==========================================
     * Vérification des bus
     * ==========================================
     */

    const requiredBuses = [
        'UTB_001',
        'UTB_002',
        'UTB_003',
        'STC_001',
        'STC_002'
    ];

    for (const key of requiredBuses) {
        if (!buses[key]) {
            throw new Error(
                `Bus ${key} introuvable. Vérifiez le seed des buses.`
            );
        }
    }

    /*
     * ==========================================
     * Données des voyages
     * ==========================================
     *
     * departureDay :
     *
     * 1 = demain
     * 2 = après-demain
     * 3 = dans trois jours
     *
     * Les horaires sont locaux à la Côte d'Ivoire.
     */

    const tripsData = [
        /*
         * ======================================
         * UTB - Abidjan → Yamoussoukro
         * ======================================
         */

        {
            key: 'UTB_ABJ_YAM_1',
            route: routes.UTB_ABJ_YAM,
            bus: buses.UTB_001,

            departureLocation: locations.ABJ,
            arrivalLocation: locations.YAM,

            departureDay: 1,
            departureHour: 7,
            departureMinute: 0,

            price: 7000
        },

        {
            key: 'UTB_ABJ_YAM_2',
            route: routes.UTB_ABJ_YAM,
            bus: buses.UTB_002,

            departureLocation: locations.ABJ,
            arrivalLocation: locations.YAM,

            departureDay: 1,
            departureHour: 10,
            departureMinute: 30,

            price: 7000
        },

        {
            key: 'UTB_ABJ_YAM_3',
            route: routes.UTB_ABJ_YAM,
            bus: buses.UTB_003,

            departureLocation: locations.ABJ,
            arrivalLocation: locations.YAM,

            departureDay: 2,
            departureHour: 8,
            departureMinute: 0,

            price: 8500
        },

        /*
         * ======================================
         * UTB - Yamoussoukro → Abidjan
         * ======================================
         */

        {
            key: 'UTB_YAM_ABJ_1',
            route: routes.UTB_YAM_ABJ,
            bus: buses.UTB_001,

            departureLocation: locations.YAM,
            arrivalLocation: locations.ABJ,

            departureDay: 2,
            departureHour: 14,
            departureMinute: 0,

            price: 7000
        },

        /*
         * ======================================
         * UTB - Abidjan → Bouaké
         * ======================================
         */

        {
            key: 'UTB_ABJ_BKE_1',
            route: routes.UTB_ABJ_BKE,
            bus: buses.UTB_003,

            departureLocation: locations.ABJ,
            arrivalLocation: locations.BKE,

            departureDay: 1,
            departureHour: 6,
            departureMinute: 30,

            price: 10000
        },

        {
            key: 'UTB_ABJ_BKE_2',
            route: routes.UTB_ABJ_BKE,
            bus: buses.UTB_002,

            departureLocation: locations.ABJ,
            arrivalLocation: locations.BKE,

            departureDay: 3,
            departureHour: 9,
            departureMinute: 0,

            price: 10000
        },

        /*
         * ======================================
         * UTB - Bouaké → Abidjan
         * ======================================
         */

        {
            key: 'UTB_BKE_ABJ_1',
            route: routes.UTB_BKE_ABJ,
            bus: buses.UTB_003,

            departureLocation: locations.BKE,
            arrivalLocation: locations.ABJ,

            departureDay: 3,
            departureHour: 14,
            departureMinute: 0,

            price: 10000
        },

        /*
         * ======================================
         * UTB - Abidjan → Daloa
         * ======================================
         */

        {
            key: 'UTB_ABJ_DAL_1',
            route: routes.UTB_ABJ_DAL,
            bus: buses.UTB_001,

            departureLocation: locations.ABJ,
            arrivalLocation: locations.DAL,

            departureDay: 2,
            departureHour: 7,
            departureMinute: 30,

            price: 10000
        },

        /*
         * ======================================
         * STC - Abidjan → Yamoussoukro
         * ======================================
         */

        {
            key: 'STC_ABJ_YAM_1',
            route: routes.STC_ABJ_YAM,
            bus: buses.STC_001,

            departureLocation: locations.ABJ,
            arrivalLocation: locations.YAM,

            departureDay: 1,
            departureHour: 8,
            departureMinute: 0,

            price: 7500
        },

        {
            key: 'STC_ABJ_YAM_2',
            route: routes.STC_ABJ_YAM,
            bus: buses.STC_002,

            departureLocation: locations.ABJ,
            arrivalLocation: locations.YAM,

            departureDay: 2,
            departureHour: 11,
            departureMinute: 0,

            price: 7500
        },

        /*
         * ======================================
         * STC - Yamoussoukro → Abidjan
         * ======================================
         */

        {
            key: 'STC_YAM_ABJ_1',
            route: routes.STC_YAM_ABJ,
            bus: buses.STC_001,

            departureLocation: locations.YAM,
            arrivalLocation: locations.ABJ,

            departureDay: 3,
            departureHour: 15,
            departureMinute: 0,

            price: 7500
        },

        /*
         * ======================================
         * STC - Abidjan → Bouaké
         * ======================================
         */

        {
            key: 'STC_ABJ_BKE_1',
            route: routes.STC_ABJ_BKE,
            bus: buses.STC_002,

            departureLocation: locations.ABJ,
            arrivalLocation: locations.BKE,

            departureDay: 2,
            departureHour: 7,
            departureMinute: 0,

            price: 10500
        }
    ];

    const trips = {};

    for (const data of tripsData) {
        /*
         * ======================================
         * Calcul de la date de départ
         * ======================================
         */

        const departureAt = futureDate(
            data.departureDay,
            data.departureHour,
            data.departureMinute
        );

        /*
         * La durée vient de la Route.
         */
        const arrivalAt = addMinutes(
            departureAt,
            data.route.durationMin
        );

        /*
         * ======================================
         * Création du voyage
         * ======================================
         *
         * Nous n'avons pas de clé unique métier
         * sur Trip.
         *
         * On recherche donc un voyage existant
         * avec ses éléments structurants.
         */

        let trip = await prisma.trip.findFirst({
            where: {
                routeId: data.route.id,
                busId: data.bus.id,
                departureAt
            }
        });

        if (!trip) {
            trip = await prisma.trip.create({
                data: {
                    routeId: data.route.id,
                    busId: data.bus.id,

                    departureLocationId:
                        data.departureLocation.id,

                    arrivalLocationId:
                        data.arrivalLocation.id,

                    departureAt,
                    arrivalAt,

                    price: data.price,

                    status: 'SCHEDULED'
                }
            });
        } else {
            /*
             * Mise à jour utile si le seed est relancé.
             */
            trip = await prisma.trip.update({
                where: {
                    id: trip.id
                },
                data: {
                    routeId: data.route.id,
                    busId: data.bus.id,

                    departureLocationId:
                        data.departureLocation.id,

                    arrivalLocationId:
                        data.arrivalLocation.id,

                    departureAt,
                    arrivalAt,

                    price: data.price
                }
            });
        }

        /*
         * On recharge les relations nécessaires.
         */
        const finalTrip = await prisma.trip.findUnique({
            where: {
                id: trip.id
            },
            include: {
                route: {
                    include: {
                        company: true,
                        originCity: true,
                        destinationCity: true
                    }
                },
                bus: {
                    include: {
                        seatLayout: {
                            include: {
                                seats: true
                            }
                        }
                    }
                },
                departureLocation: true,
                arrivalLocation: true
            }
        });

        trips[data.key] = finalTrip;

        logSuccess(
            `${finalTrip.route.company.code} : ` +
            `${finalTrip.route.originCity.name} → ` +
            `${finalTrip.route.destinationCity.name} | ` +
            `${finalTrip.departureAt.toLocaleString('fr-FR')} | ` +
            `${finalTrip.price.toLocaleString('fr-FR')} FCFA`
        );
    }

    return trips;
};

module.exports = seedTrips;