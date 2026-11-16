const prisma = require('../../config/database');

class PaymentRepository {

    /**
     * Recherche un paiement par son ID.
     */
    findById = async (id) => {
        return prisma.payment.findUnique({
            where: {
                id
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
                        ticket: true
                    }
                }
            }
        });
    };


    /**
     * Recherche le paiement associé à une réservation.
     */
    findByBookingId = async (bookingId) => {
        return prisma.payment.findUnique({
            where: {
                bookingId
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
                    }
                }
            }
        });
    };

    /**
     * Recherche une réservation par son ID.
     */
    findBookingById = async (bookingId) => {
        return prisma.booking.findUnique({
            where: {
                id: bookingId
            },
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
                seat: true
            }
        });
    };


    /**
     * Recherche un paiement à partir
     * de la référence du prestataire.
     */
    findByProviderReference = async (providerReference) => {
        return prisma.payment.findFirst({
            where: {
                providerReference
            },
            include: {
                booking: true
            }
        });
    };


    /**
     * Recherche une transaction.
     */
    findByTransactionId = async (transactionId) => {
        return prisma.payment.findFirst({
            where: {
                transactionId
            },
            include: {
                booking: true
            }
        });
    };


    /**
     * Crée un paiement.
     */
    create = async (data) => {
        return prisma.payment.create({
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
                        seat: true
                    }
                }
            }
        });
    };


    /**
     * Met à jour un paiement.
     */
    update = async (id, data) => {
        return prisma.payment.update({
            where: {
                id
            },
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
                        seat: true
                    }
                }
            }
        });
    };


    /**
     * Met à jour le statut du paiement.
     */
    updateStatus = async (
        id,
        status,
        data = {}
    ) => {
        return prisma.payment.update({
            where: {
                id
            },
            data: {
                status,
                ...data
            },
            include: {
                booking: true
            }
        });
    };


    /**
     * Recherche les paiements d'un utilisateur.
     */
    findManyByUser = async (userId) => {
        return prisma.payment.findMany({
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
                                        destinationCity: true
                                    }
                                },
                                bus: true
                            }
                        },
                        seat: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    };


    /**
     * Recherche les paiements d'une compagnie.
     */
    findManyByCompany = async (companyId) => {
        return prisma.payment.findMany({
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
                                phone: true
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
                        seat: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    };


    simulateSuccess = async (
        paymentId,
        ticketData,
        notificationData
    ) => {
        return prisma.$transaction(async (tx) => {

            /*
             * 1. Vérifier le paiement dans la transaction
             */
            const payment = await tx.payment.findUnique({
                where: {
                    id: paymentId
                },
                include: {
                    booking: true
                }
            });

            if (!payment) {
                const error = new Error('Paiement introuvable');
                error.code = 'PAYMENT_NOT_FOUND';
                throw error;
            }

            if (payment.status !== 'PENDING') {
                const error = new Error(
                    'Ce paiement ne peut plus être confirmé'
                );
                error.code = 'PAYMENT_NOT_PENDING';
                throw error;
            }

            /*
             * 2. Vérifier la réservation
             */
            if (payment.booking.status !== 'PENDING') {
                const error = new Error(
                    'Cette réservation ne peut plus être confirmée'
                );
                error.code = 'BOOKING_NOT_PENDING';
                throw error;
            }

            /*
             * 3. Vérifier qu'un ticket n'existe pas déjà
             */
            const existingTicket = await tx.ticket.findUnique({
                where: {
                    bookingId: payment.bookingId
                }
            });

            if (existingTicket) {
                const error = new Error(
                    'Un ticket existe déjà pour cette réservation'
                );
                error.code = 'TICKET_ALREADY_EXISTS';
                throw error;
            }

            /*
             * 4. Payment → SUCCESS
             */
            const updatedPayment = await tx.payment.update({
                where: {
                    id: payment.id
                },
                data: {
                    status: 'SUCCESS',
                    transactionId:
                        payment.transactionId ||
                        `SIM-${Date.now()}`,
                    providerReference:
                        payment.providerReference ||
                        `SIM-${payment.id}`,
                    paidAt: new Date()
                }
            });

            /*
             * 5. Booking → CONFIRMED
             */
            const updatedBooking = await tx.booking.update({
                where: {
                    id: payment.bookingId
                },
                data: {
                    status: 'CONFIRMED'
                }
            });

            /*
             * 6. Créer le ticket
             */
            const ticket = await tx.ticket.create({
                data: {
                    bookingId: updatedBooking.id,
                    ticketNumber: ticketData.ticketNumber,
                    qrCode: ticketData.qrCode,
                    status: 'ACTIVE',
                    issuedAt: new Date()
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

            /*
             * 7. Créer la notification
             *
             * La notification est créée dans la même
             * transaction que Payment, Booking et Ticket.
             */
            let notification = null;

            if (notificationData) {
                notification = await tx.notification.create({
                    data: {
                        userId: notificationData.userId,
                        type: notificationData.type,
                        channel: notificationData.channel,
                        status: notificationData.status || 'SENT',
                        title: notificationData.title,
                        message: notificationData.message,
                        url: `/tickets/${ticket.id}`,
                        data: {
                            ...notificationData.data,
                            ticketId: ticket.id
                        },
                        sentAt: new Date()
                    }
                });
            }

            return {
                payment: updatedPayment,
                booking: updatedBooking,
                ticket,
                notification
            };
        });
    };
}

module.exports = new PaymentRepository();