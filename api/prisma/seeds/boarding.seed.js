const {
    prisma,
    logSeed,
    logSuccess,
    logWarning
} = require('./helpers');

const seedBoarding = async ({
    key,
    ticket,
    controller,
    status,
    scannedAt = null,
    boardedAt = null,
    rejectionReason = null
}) => {
    if (!ticket) {
        throw new Error(`Ticket manquant pour ${key}`);
    }

    if (!controller) {
        throw new Error(`Contrôleur manquant pour ${key}`);
    }

    if (controller.role !== 'CONTROLLER') {
        throw new Error(
            `L'utilisateur ${controller.email} n'est pas un contrôleur`
        );
    }

    const boarding = await prisma.boarding.upsert({
        where: {
            ticketId: ticket.id
        },
        update: {
            controllerId: controller.id,
            status,
            scannedAt,
            boardedAt,
            rejectionReason
        },
        create: {
            ticketId: ticket.id,
            controllerId: controller.id,
            status,
            scannedAt,
            boardedAt,
            rejectionReason
        },
        include: {
            ticket: {
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
            },
            controller: true
        }
    });

    const passenger = boarding.ticket.booking.user;
    const trip = boarding.ticket.booking.trip;
    const seat = boarding.ticket.booking.seat;

    logSuccess(
        `${key} → ${passenger.firstName} ${passenger.lastName} | ` +
        `${trip.route.originCity.name} → ` +
        `${trip.route.destinationCity.name} | ` +
        `siège ${seat.number} | ${status}`
    );

    return boarding;
};

const seedBoardings = async (tickets, users) => {
    logSeed('Création des embarquements...');


    const controller = users.utbController;

    if (!controller) {
        throw new Error(
            'Le contrôleur users.utbController est requis.'
        );
    }

    const boardings = {};

    /*
     * Ticket 1 :
     * reste ACTIVE et n'a encore jamais été scanné.
     *
     * Il servira à tester réellement :
     *
     * POST /api/v1/boarding/scan
     */
    const pendingTicket = tickets.ticketOne;

    if (pendingTicket) {
        try {
            /*
             * Si le ticket est déjà USED à cause d'un seed précédent,
             * on le remet dans un état cohérent pour les tests.
             */
            await prisma.ticket.update({
                where: {
                    id: pendingTicket.id
                },
                data: {
                    status: 'ACTIVE',
                    usedAt: null
                }
            });

            boardings.pendingBoarding = await seedBoarding({
                key: 'pendingBoarding',
                ticket: pendingTicket,
                controller,
                status: 'PENDING'
            });
        } catch (error) {
            logWarning(
                `Impossible de créer pendingBoarding: ${error.message}`
            );
        }
    } else {
        logWarning(
            'ticketOne introuvable : pendingBoarding ignoré.'
        );
    }

    /*
     * Ticket 2 :
     * exemple d'un passager déjà embarqué.
     *
     * Attention :
     * on synchronise également le Ticket et le Booking.
     */
    const boardedTicket = tickets.ticketTwo;

    if (boardedTicket) {
        try {
            const scannedAt = new Date();

            boardings.boardedBoarding = await seedBoarding({
                key: 'boardedBoarding',
                ticket: boardedTicket,
                controller,
                status: 'BOARDED',
                scannedAt,
                boardedAt: scannedAt
            });

            await prisma.ticket.update({
                where: {
                    id: boardedTicket.id
                },
                data: {
                    status: 'USED',
                    usedAt: scannedAt
                }
            });

            await prisma.booking.update({
                where: {
                    id: boardedTicket.bookingId
                },
                data: {
                    status: 'BOARDED'
                }
            });

            logSuccess(
                'Ticket et réservation synchronisés avec boardedBoarding.'
            );
        } catch (error) {
            logWarning(
                `Impossible de créer boardedBoarding: ${error.message}`
            );
        }
    } else {
        logWarning(
            'ticketTwo introuvable : boardedBoarding ignoré.'
        );
    }

    /*
     * Nous ne créons pas de rejectedBoarding avec ticketOne/ticketTwo
     * car chaque ticket ne peut avoir qu'un seul Boarding
     * (@@unique sur ticketId).
     *
     * Il faudra donc un troisième ticket si on veut tester
     * le statut REJECTED avec une vraie donnée.
     */

    logSuccess(
        `${Object.keys(boardings).length} embarquements créés/mis à jour.`
    );

    return boardings;
};

module.exports = seedBoardings;