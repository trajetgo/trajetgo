const crypto = require("crypto");
const prisma = require('../../config/database');
const ApiError = require("../../utils/ApiError");


function generateTicketNumber() {
    const random = crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase();

    return `TG-${Date.now()}-${random}`;
}

function generateQrCode() {
    return crypto.randomBytes(32).toString("hex");
}

class TicketRepository {

    findById = async (id) => {
        return prisma.ticket.findUnique({
            where: { id },
            include: {
                booking: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                phone: true,
                                email: true
                            }
                        },
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
                        payment: true
                    }
                }
            }
        });
    };


    findByBookingId = async (bookingId) => {
        return prisma.ticket.findUnique({
            where: { bookingId },
            include: {
                booking: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                phone: true,
                                email: true
                            }
                        },
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
                        payment: true
                    }
                }
            }
        });
    };


    findByTicketNumber = async (ticketNumber) => {
        return prisma.ticket.findUnique({
            where: { ticketNumber },
            include: {
                booking: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                phone: true,
                                email: true
                            }
                        },
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
                        payment: true
                    }
                }
            }
        });
    };


    findByQrCode = async (qrCode) => {
        return prisma.ticket.findUnique({
            where: { qrCode },
            include: {
                booking: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                phone: true,
                                email: true
                            }
                        },
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
                        payment: true
                    }
                }
            }
        });
    };


    findBookingById = async (bookingId) => {
        return prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                        email: true
                    }
                },
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
                payment: true,
                ticket: true
            }
        });
    };


    create = async (data) => {
        return prisma.ticket.create({
            data,
            include: {
                booking: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                phone: true,
                                email: true
                            }
                        },
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
                        payment: true
                    }
                }
            }
        });
    };


    update = async (id, data) => {
        return prisma.ticket.update({
            where: { id },
            data,
            include: {
                booking: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                phone: true,
                                email: true
                            }
                        },
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
                        payment: true
                    }
                }
            }
        });
    };


    updateStatus = async (id, status, data = {}) => {
        return prisma.ticket.update({
            where: { id },
            data: {
                status,
                ...data
            },
            include: {
                booking: true
            }
        });
    };

    findTickets = async ({
        companyId,
        agencyId,
        status,
        tripId,
        ticketNumber,
        bookingId,
        userId,
        startDate,
        endDate,
        page,
        limit
    }) => {
        const bookingWhere = {
            ...(companyId && {
                trip: {
                    route: {
                        companyId
                    }
                }
            }),

            ...(agencyId && {
                agencyId
            }),

            ...(tripId && {
                tripId
            }),

            ...(userId && {
                userId
            })
        };

        const where = {
            ...(Object.keys(bookingWhere).length > 0 && {
                booking: bookingWhere
            }),

            ...(status && {
                status
            }),

            ...(ticketNumber && {
                ticketNumber: {
                    contains: ticketNumber,
                    mode: 'insensitive'
                }
            }),

            ...(bookingId && {
                bookingId
            }),

            ...(startDate || endDate
                ? {
                    issuedAt: {
                        ...(startDate && {
                            gte: new Date(startDate)
                        }),

                        ...(endDate && {
                            lte: new Date(endDate)
                        })
                    }
                }
                : {})
        };

        const skip = (page - 1) * limit;

        const [tickets, total] = await prisma.$transaction([
            prisma.ticket.findMany({
                where,
                skip,
                take: limit,

                orderBy: {
                    issuedAt: 'desc'
                },

                include: {
                    booking: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    phone: true,
                                    email: true
                                }
                            },
                            seat: true,

                            agency: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            },

                            trip: {
                                include: {
                                    route: {
                                        include: {
                                            company: true,
                                            originCity: true,
                                            destinationCity: true
                                        }
                                    },

                                    bus: true,

                                    departureAgency: {
                                        select: {
                                            id: true,
                                            name: true,
                                            city: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    },

                                    arrivalAgency: {
                                        select: {
                                            id: true,
                                            name: true,
                                            city: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    },

                                    departureLocation: {
                                        include: {
                                            city: true
                                        }
                                    },

                                    arrivalLocation: {
                                        include: {
                                            city: true
                                        }
                                    }
                                }
                            }
                        }
                    },

                    boarding: true
                }
            }),

            prisma.ticket.count({
                where
            })
        ]);

        return {
            tickets,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    };

    findFirst = async (tripId, seatId) => {
        return prisma.ticket.findFirst({
            where: {
                s
            }
        })
    }


    findManyByUser = async (userId) => {
        return prisma.ticket.findMany({
            where: {
                booking: {
                    userId
                }
            },
            include: {
                booking: {
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
                        payment: true
                    }
                }
            },
            orderBy: {
                issuedAt: 'desc'
            }
        });
    };


    findManyByCompany = async (companyId) => {
        return prisma.ticket.findMany({
            where: {
                booking: {
                    trip: {
                        route: {
                            companyId
                        }
                    }
                }
            },
            include: {
                booking: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                phone: true,
                                email: true
                            }
                        },
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
                        seat: true,
                        payment: true
                    }
                }
            },
            orderBy: {
                issuedAt: 'desc'
            }
        });
    };

    sellTicket = async ({
        tripId,
        seatId,
        agencyId,
        passenger,
        paymentMethod
    }) => {
        try {
            return await prisma.$transaction(
                async (tx) => {
                    // ==========================================
                    // 1. Vérifier encore le Trip dans la transaction
                    // ==========================================

                    const trip =
                        await tx.trip.findUnique({
                            where: {
                                id: tripId
                            }
                        });

                    if (!trip) {
                        throw new ApiError(
                            404,
                            "Voyage introuvable."
                        );
                    }

                    // ==========================================
                    // 2. Vérifier l'utilisateur/passager
                    // ==========================================

                    let passengerUser =
                        await tx.user.findUnique({
                            where: {
                                phone: passenger.phone
                            }
                        });

                    if (!passenger) {
                        passengerUser =
                            await tx.user.create({
                                data: {
                                    firstName:
                                        passenger.firstName,

                                    lastName:
                                        passenger.lastName,

                                    phone:
                                        passenger.phone,

                                    email:
                                        passenger.email,

                                    role: "PASSENGER",

                                    status: "ACTIVE"
                                }
                            });
                    }

                    // ==========================================
                    // 3. Créer le Booking
                    // ==========================================

                    let booking;

                    try {
                        booking =
                            await tx.booking.create({
                                data: {
                                    userId: passengerUser.id,
                                    tripId,
                                    seatId,
                                    agencyId,
                                    amount: trip.price,
                                    status: "CONFIRMED"
                                }
                            })
                    } catch (error) {
                        // @@unique([tripId, seatId])
                        if (
                            error.code === "P2002"
                        ) {
                            throw new ApiError(
                                409,
                                "Ce siège est déjà réservé pour ce voyage."
                            );
                        }

                        throw error;
                    }

                    // ==========================================
                    // 4. Créer le paiement CASH
                    // ==========================================

                    await tx.payment.create({
                        data: {
                            bookingId: booking.id,
                            amount: booking.amount,
                            method: "CASH",
                            status: "SUCCESS",
                            paidAt: new Date(),
                            transactionId: null,
                            providerReference: null,
                            expiresAt: null,
                            metadata: {
                                source: "AGENCY",
                                paymentType: "CASH",
                                channel: "AGENCY_APP",
                            }
                        },
                    });

                    // ==========================================
                    // 5. Créer le Ticket
                    // ==========================================

                    const ticket = await tx.ticket.create({
                        data: {
                            bookingId: booking.id,
                            ticketNumber: generateTicketNumber(),
                            qrCode: generateQrCode(),
                            status: "ACTIVE",
                        },

                        include: {
                            booking: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            phone: true,
                                            email: true
                                        }
                                    },

                                    agency: {
                                        select: {
                                            id: true,
                                            name: true,
                                            code: true
                                        }
                                    },

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

                                            departureLocation: {
                                                include: {
                                                    city: true
                                                }
                                            },

                                            arrivalLocation: {
                                                include: {
                                                    city: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });

                    return ticket;
                }
            )
        } catch (error) {
            throw error;
        }
    };
}

module.exports = new TicketRepository();