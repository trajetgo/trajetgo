const prisma = require('../../config/database');

class BookingRepository {

    /**
     * Recherche un voyage avec les informations
     * nécessaires pour créer une réservation.
     */
    findTripForBooking = async (tripId) => {
        return prisma.trip.findUnique({
            where: {
                id: tripId
            },
            include: {
                route: true,
                bus: {
                    include: {
                        seatLayout: {
                            include: {
                                seats: true
                            }
                        }
                    }
                }
            }
        });
    };


    /**
     * Recherche un siège.
     */
    findSeatById = async (seatId) => {
        return prisma.seat.findUnique({
            where: {
                id: seatId
            },
            include: {
                layout: {
                    include: {
                        bus: true
                    }
                }
            }
        });
    };


    /**
     * Vérifie si une place est déjà réservée
     * pour un voyage donné.
     */
    findByTripAndSeat = async (tripId, seatId) => {
        return prisma.booking.findUnique({
            where: {
                tripId_seatId: {
                    tripId,
                    seatId
                }
            },
            select: {
                id: true,
                user: true,
            }
        });
    };


    /**
     * Crée une réservation.
     */
    create = async (data) => {
        return prisma.booking.create({
            data,
            include: {
                trip: {
                    include: {
                        route: {
                            include: {
                                originCity: true,
                                destinationCity: true,
                                company: true
                            }
                        },
                        bus: true,
                        departureLocation: true,
                        arrivalLocation: true
                    }
                },
                seat: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                        email: true
                    }
                }
            }
        });
    };


    /**
     * Recherche une réservation par son ID.
     */
    findById = async (id) => {
        return prisma.booking.findUnique({
            where: {
                id
            },
            include: {
                trip: {
                    include: {
                        route: {
                            include: {
                                originCity: true,
                                destinationCity: true,
                                company: true
                            }
                        },
                        bus: true,
                        departureLocation: true,
                        arrivalLocation: true
                    }
                },
                seat: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                        email: true
                    }
                }
            }
        });
    };


    /**
     * Liste les réservations d'un utilisateur.
     */
    findManyByUser = async (userId) => {
        return prisma.booking.findMany({
            where: {
                userId
            },
            include: {
                trip: {
                    include: {
                        route: {
                            include: {
                                originCity: true,
                                destinationCity: true,
                                company: true
                            }
                        },
                        bus: true,
                        departureLocation: true,
                        arrivalLocation: true
                    }
                },
                seat: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    };


    /**
     * Liste les réservations d'une compagnie.
     */
    findManyByCompany = async (companyId) => {
        return prisma.booking.findMany({
            where: {
                trip: {
                    route: {
                        companyId
                    }
                }
            },
            include: {
                trip: {
                    include: {
                        route: {
                            include: {
                                originCity: true,
                                destinationCity: true
                            }
                        },
                        bus: true,
                        departureLocation: true,
                        arrivalLocation: true
                    }
                },
                seat: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        phone: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    };


    /**
     * Annule une réservation.
     */
    cancel = async (id) => {
        return prisma.booking.update({
            where: {
                id
            },
            data: {
                status: 'CANCELLED'
            },
            include: {
                trip: true,
                seat: true
            }
        });
    };

    reactivate = async (id, data) => {
        return prisma.booking.update({
            where: {
                id
            },
            data,
            include: {
                trip: {
                    include: {
                        route: {
                            include: {
                                originCity: true,
                                destinationCity: true,
                                company: true
                            }
                        },
                        bus: true,
                        departureLocation: true,
                        arrivalLocation: true
                    }
                },
                seat: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                        email: true
                    }
                }
            }
        });
    };

    getReservedSeatNumbersByBus = async (busId) => {
        const bookings = await prisma.booking.findMany({
            where: {
                trip: { busId },
                status: { in: ["PENDING", "CONFIRMED", "BOARDED"] },
            },
            select: {
                seat: {
                    select: { number: true },
                },
            },
        });

        return new Set(
            bookings
                .map((b) => b.seat?.number)
                .filter(Boolean)
        );
    };
}

module.exports = new BookingRepository();