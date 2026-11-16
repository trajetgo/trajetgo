const prisma = require('../../config/database');
const { getDayRange } = require('../../utils/dateRange');

class BoardingRepository {
    /**
    * Trouve un ticket à partir de son QR code.
    */
    findTicketByQrCode = async (qrCode) => {
        return prisma.ticket.findUnique({
            where: {
                qrCode
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
                        }
                    }
                },
                boarding: {
                    include: {
                        controller: true
                    }
                }
            }
        });
    };


    /**
     * Trouve un ticket par son numéro.
     */
    findTicketByNumber = async (ticketNumber) => {
        return prisma.ticket.findUnique({
            where: {
                ticketNumber
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
                                bus: true,
                                departureLocation: true,
                                arrivalLocation: true
                            }
                        }
                    }
                },
                boarding: {
                    include: {
                        controller: true
                    }
                }
            }
        });
    };

    /**
     * Trouve un boarding par son ID.
     */
    findById = async (id) => {
        return prisma.boarding.findUnique({
            where: {
                id
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
                                        bus: true,
                                        departureLocation: true,
                                        arrivalLocation: true
                                    }
                                }
                            }
                        }
                    }
                },
                controller: true
            }
        });
    };

    findTodayDepartures = async ({
        companyId,
        agencyId,
        startDate,
        endDate,
        limit = 20,
        offset = 0,
    }) => {

        const where = {};

        if (startDate && endDate) {
            where.departureAt = {
                gte: startDate,
                lte: endDate,      // lte, pas lt, car end = 23:59:59.999
            }
        }

        if (companyId) {
            where.route = {
                companyId
            }
        }

        if (agencyId) {
            where.departureAgencyId = {
                agencyId
            }
        }
        return prisma.trip.findMany({
            where,
            orderBy: {
                departureAt: "asc"
            },
            select: {
                id: true,
                departureAt: true,
                arrivalAt: true,
                price: true,
                status: true,

                arrivalAgency: {
                    select: {
                        id: true,
                        name: true
                    }
                },

                departureAgency: {
                    select: {
                        id: true,
                        name: true
                    }
                },

                route: {
                    select: {
                        id: true,
                        company: {
                            select: {
                                id: true,
                                name: true,
                                logo: true
                            }
                        },
                        originCity: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        destinationCity: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },

                bus: {
                    select: {
                        id: true,
                        name: true,
                        registrationNumber: true,
                        fleetNumber: true,
                        capacity: true,
                        seatLayout: true
                    }
                },

                bookings: {
                    where: {
                        status: {
                            in: ["PENDING", "CONFIRMED", "BOARDED"]
                        }
                    },
                    select: {
                        id: true,
                        status: true
                    }
                }
            },
            take: Math.min(limit, 50),
            skip: offset,
        });
    };


    findBoardingContext = async (tripId) => {
        return prisma.trip.findUnique({
            where: {
                id: tripId
            },
            select: {
                id: true,

                route: {
                    select: {
                        companyId: true
                    }
                },

                departureAgency: {
                    select: {
                        id: true
                    }
                }
            }
        });
    };

    /**
     * Trouve le boarding associé à un ticket.
     */
    findByTicketId = async (ticketId) => {
        return prisma.boarding.findUnique({
            where: {
                ticketId
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
    };

    /**
     * Crée un nouvel enregistrement de boarding.
     */
    create = async (data) => {
        return prisma.boarding.create({
            data,
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
    };

    /**
     * Met à jour le statut d'un boarding.
     */
    update = async (id, data) => {
        return prisma.boarding.update({
            where: {
                id
            },
            data,
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
    };

    /**
     * Liste les boardings d'un trajet.
     */
    findManyByTrip = async (tripId) => {
        return prisma.boarding.findMany({
            where: {
                ticket: {
                    booking: {
                        tripId
                    }
                }
            },

            include: {
                ticket: {
                    include: {
                        booking: {
                            select: {
                                id: true,
                                amount: true,
                                status: true,

                                user: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        phone: true,
                                        email: true
                                    }
                                },

                                seat: true
                            }
                        }
                    }
                },

                controller: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        phone: true
                    }
                }
            },

            orderBy: {
                scannedAt: "desc"
            }
        });
    };

    /**
     * Liste les boardings effectués par un contrôleur.
     */
    findManyByController = async (controllerId) => {
        return prisma.boarding.findMany({
            where: {
                controllerId
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
            },
            orderBy: {
                scannedAt: 'desc'
            }
        });
    };

    /**
     * Met à jour le ticket après embarquement.
     */
    markTicketAsUsed = async (ticketId, usedAt) => {
        return prisma.ticket.update({
            where: {
                id: ticketId
            },
            data: {
                status: 'USED',
                usedAt
            }
        });
    };

    /**
     * Met à jour la réservation après embarquement.
     */
    markBookingAsBoarded = async (bookingId) => {
        return prisma.booking.update({
            where: {
                id: bookingId
            },
            data: {
                status: 'BOARDED'
            }
        });
    };

    /**
     * Exécute plusieurs opérations dans une transaction.
     */
    transaction = async (callback) => {
        return prisma.$transaction(callback);
    };
};

module.exports = new BoardingRepository();
