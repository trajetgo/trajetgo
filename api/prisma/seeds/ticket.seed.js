const crypto = require('crypto');

const {
    prisma,
    logSeed,
    logSuccess,
    logWarning
} = require('./helpers');

const generateTicketNumber = () => {
    const random = crypto
        .randomBytes(4)
        .toString('hex')
        .toUpperCase();

    return `TG-${Date.now()}-${random}`;
};

const generateQrCode = () => {
    return crypto.randomBytes(24).toString('hex');
};

const seedTicket = async ({
    key,
    booking
}) => {
    if (!booking) {
        throw new Error(`Booking manquant pour le ticket ${key}`);
    }


    if (booking.status !== 'CONFIRMED') {
        throw new Error(
            `Le booking ${key} doit être CONFIRMED pour créer un ticket`
        );
    }

    /*
     * Un booking ne peut avoir qu'un seul ticket.
     * On utilise donc bookingId qui est @unique dans Ticket.
     */
    const existingTicket = await prisma.ticket.findUnique({
        where: {
            bookingId: booking.id
        }
    });

    if (existingTicket) {
        const ticket = await prisma.ticket.update({
            where: {
                id: existingTicket.id
            },
            data: {
                status: 'ACTIVE'
            },
            include: {
                booking: {
                    include: {
                        user: true,
                        seat: true,
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
                        }
                    }
                }
            }
        });

        logSuccess(
            `${key} → ticket existant conservé | ` +
            `${ticket.ticketNumber} | siège ${ticket.booking.seat.number}`
        );

        return ticket;
    }

    const ticket = await prisma.ticket.create({
        data: {
            bookingId: booking.id,
            ticketNumber: generateTicketNumber(),
            qrCode: generateQrCode(),
            status: 'ACTIVE'
        },
        include: {
            booking: {
                include: {
                    user: true,
                    seat: true,
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
                    }
                }
            }
        }
    });

    logSuccess(
        `${key} → ${ticket.ticketNumber} | ` +
        `${ticket.booking.user.firstName} ${ticket.booking.user.lastName} | ` +
        `${ticket.booking.trip.route.originCity.name} → ` +
        `${ticket.booking.trip.route.destinationCity.name} | ` +
        `siège ${ticket.booking.seat.number}`
    );

    return ticket;
};

const seedTickets = async (bookings) => {
    logSeed('Création des tickets...');

    const tickets = {};

    const ticketDefinitions = [
        {
            key: 'ticketOne',
            booking: bookings.confirmedBookingOne
        },
        {
            key: 'ticketTwo',
            booking: bookings.confirmedBookingTwo
        }
    ];

    for (const definition of ticketDefinitions) {
        if (!definition.booking) {
            logWarning(
                `${definition.key} ignoré : réservation inexistante.`
            );
            continue;
        }

        try {
            tickets[definition.key] = await seedTicket(definition);
        } catch (error) {
            logWarning(
                `Impossible de créer ${definition.key}: ${error.message}`
            );
        }
    }

    logSuccess(
        `${Object.keys(tickets).length} tickets créés/mis à jour.`
    );

    return tickets;
};

module.exports = seedTickets;
