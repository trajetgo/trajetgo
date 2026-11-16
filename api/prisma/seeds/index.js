
const {
    prisma,
    logSeed,
    logSuccess
} = require('./helpers');

const seedLocations = require('./location.seed');
const seedCompanies = require('./company.seed');
const seedAgencies = require('./agency.seed');
const seedUsers = require('./user.seed');
const seedRoutes = require('./route.seed');
const seedBuses = require('./bus.seed');
const seedSeatLayouts = require('./seat-layout.seed');
const seedTrips = require('./trip.seed');
const seedBookings = require('./booking.seed');
const seedPayments = require('./payment.seed');
const seedTickets = require('./ticket.seed');
const seedBoardings = require('./boarding.seed');
const enrichCities = require('./enrich-cities.seed');
const superAdminSeed = require('./super-admin.seed');

const main = async () => {
    console.log('');
    console.log('========================================');
    console.log('       TRAJET GO - DATABASE SEED        ');
    console.log('========================================');
    console.log('');

    try {
        /* * 1. Locations */
        const { cities } = await seedLocations();

        // 🆕 Enrichir avec lat/lng
        await enrichCities();

        await superAdminSeed();

        /* * 2. Companies */
        // const companies = await seedCompanies();

        /* * 3. Agencies */
        // const agencies = await seedAgencies(
        //     companies,
        //     cities
        // );

        /* * 4. Users */
        // const users = await seedUsers(
        //     companies,
        //     agencies
        // );

        /* * 5. Routes */
        // const routes = await seedRoutes(
        //     companies,
        //     cities
        // );

        /* * 6. Buses */
        // const buses = await seedBuses(
        //     companies,
        // );

        /* * 7. Seat layouts */
        // const seatLayouts = await seedSeatLayouts(buses);

        /* * 8. Trips */
        // const trips = await seedTrips(routes, buses, cities);

        /* * 9. Bookings */
        // const bookings = await seedBookings(users, trips);

        /* * 10. Payments */
        // const payments = await seedPayments(bookings);

        /* * 11. Tickets */
        // const tickets = await seedTickets(bookings);

        /** 11. Boarding */
        // const boardings = await seedBoardings(tickets, users);

        console.log('');
        logSuccess('Seeds terminés avec succès');
        console.log('');

        return {
            // cities,
            // companies,
            // agencies,
            // users,
            // routes,
            // buses,
            // seatLayouts,
            // trips,
            // bookings,
            // payments,
            // tickets,
            // boardings
        };
    } catch (error) {
        console.error('');
        console.error('❌ Erreur pendant les seeds');
        console.error(error);
        console.error('');

        throw error;
    }
};

main()
    .catch(() => {
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });