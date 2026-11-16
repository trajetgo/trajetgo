const {
    prisma,
    logSeed,
    logSuccess,
    logWarning
} = require('./helpers');

const getActiveSeat = (trip, seatNumber) => {
    if (!trip?.bus?.seatLayout?.seats) {
        return null;
    }


    return trip.bus.seatLayout.seats.find(
        (seat) =>
            seat.number === seatNumber &&
            seat.status === 'ACTIVE'
    );


};

const seedBooking = async ({
    key,
    user,
    trip,
    seatNumber,
    status
}) => {
    if (!user) {
        throw new Error(`Utilisateur manquant pour le booking ${key}`);
    }

    if (!trip) {
        throw new Error(`Trajet manquant pour le booking ${key}`);
    }

    const seat = getActiveSeat(trip, seatNumber);

    if (!seat) {
        throw new Error(
            `Siège ${seatNumber} introuvable pour le trajet ${key}`
        );
    }

    const booking = await prisma.booking.upsert({
        where: {
            tripId_seatId: {
                tripId: trip.id,
                seatId: seat.id
            }
        },
        update: {
            userId: user.id,
            status,
            amount: trip.price
        },
        create: {
            userId: user.id,
            tripId: trip.id,
            seatId: seat.id,
            status,
            amount: trip.price
        },
        include: {
            user: true,
            trip: {
                include: {
                    route: {
                        include: {
                            originCity: true,
                            destinationCity: true
                        }
                    },
                    bus: true
                }
            },
            seat: true
        }
    });

    logSuccess(
        `${key} → ${booking.user.firstName} ${booking.user.lastName} | ` +
        `${booking.trip.route.originCity.name} → ` +
        `${booking.trip.route.destinationCity.name} | ` +
        `siège ${booking.seat.number} | ` +
        `${booking.status} | ${booking.amount} FCFA`
    );

    return booking;
};

const seedBookings = async (users, trips) => {
    logSeed('Création des réservations...');


    const passengerOne = users.passengerOne;
    const passengerTwo = users.passengerTwo;

    if (!passengerOne || !passengerTwo) {
        throw new Error(
            'Les utilisateurs passengerOne et passengerTwo sont requis.'
        );
    }

    /*
     * Réservations utilisées pour tester différents scénarios :
     *
     * PENDING
     * - réservation créée mais pas encore payée
     *
     * CONFIRMED
     * - réservation payée et confirmée
     *
     * CANCELLED
     * - réservation annulée
     *
     * EXPIRED
     * - réservation arrivée à expiration
     */

    const bookingDefinitions = [
        {
            key: 'pendingBookingOne',
            user: passengerOne,
            trip: trips.UTB_ABJ_YAM_1,
            seatNumber: '01A',
            status: 'PENDING'
        },
        {
            key: 'pendingBookingTwo',
            user: passengerTwo,
            trip: trips.UTB_ABJ_YAM_1,
            seatNumber: '01B',
            status: 'PENDING'
        },
        {
            key: 'confirmedBookingOne',
            user: passengerOne,
            trip: trips.UTB_ABJ_YAM_2,
            seatNumber: '02A',
            status: 'CONFIRMED'
        },
        {
            key: 'confirmedBookingTwo',
            user: passengerTwo,
            trip: trips.STC_ABJ_YAM_1,
            seatNumber: '03A',
            status: 'CONFIRMED'
        },
        {
            key: 'cancelledBooking',
            user: passengerTwo,
            trip: trips.UTB_ABJ_BKE_1,
            seatNumber: '04A',
            status: 'CANCELLED'
        },
        {
            key: 'expiredBooking',
            user: passengerOne,
            trip: trips.STC_ABJ_BKE_1,
            seatNumber: '05A',
            status: 'EXPIRED'
        }
    ];

    const bookings = {};

    for (const definition of bookingDefinitions) {
        try {
            bookings[definition.key] = await seedBooking(definition);
        } catch (error) {
            logWarning(
                `Impossible de créer ${definition.key}: ${error.message}`
            );
        }
    }

    logSuccess(
        `${Object.keys(bookings).length} réservations créées/mises à jour.`
    );

    return bookings;
};

module.exports = seedBookings;
