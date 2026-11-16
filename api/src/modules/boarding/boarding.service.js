const repository = require('./boarding.repository');
const ApiError = require('../../utils/ApiError');
const tripRepository = require('../trips/trip.repository');
const { getDayRange } = require('../../utils/dateRange');

class BoardingService {
    /**
    * Valide un ticket et effectue l'embarquement.
    *
    * Le contrôleur doit être :
    * - CONTROLLER
    * - ou SUPER_ADMIN
    */
    boardByQrCode = async (data, user) => {
        const { tripId, qrCode } = data;

        if (!user) {
            throw new ApiError(
                401,
                'Authentification requise'
            );
        }


        if (!['CONTROLLER', 'SUPER_ADMIN'].includes(user.role)) {
            throw new ApiError(
                403,
                'Seuls les contrôleurs peuvent effectuer un embarquement'
            );
        }

        if (!qrCode || typeof qrCode !== 'string') {
            throw new ApiError(
                400,
                'QR code requis'
            );
        }

        const ticket = await repository.findTicketByQrCode(
            qrCode.trim()
        );

        if (!ticket) {
            throw new ApiError(
                404,
                'Ticket introuvable'
            );
        }

        const booking = ticket.booking;
        const trip = await tripRepository.findById(booking.tripId);

        if (!booking || !trip) {
            throw new ApiError(
                400,
                'Les données du ticket sont incomplètes'
            );
        }

        if (trip.id !== tripId) {
            throw new ApiError(
                409,
                "Ce billet n'appartient pas au voyage en cours d'embarquement."
            );
        }

        const isAgencyTrip = trip.departureLocation?.agencies?.some(
            (agency) => agency.id === user.agencyId
        );

        if (!isAgencyTrip) {
            throw new ApiError(
                403,
                "Ce voyage n'est pas accessible à votre agence."
            );
        }

        /*
         * Vérification du statut du ticket.
         */
        if (ticket.status !== 'ACTIVE') {
            if (ticket.status === 'USED') {
                throw new ApiError(
                    409,
                    'Ce ticket a déjà été utilisé'
                );
            }

            if (ticket.status === 'CANCELLED') {
                throw new ApiError(
                    409,
                    'Ce ticket a été annulé'
                );
            }

            if (ticket.status === 'EXPIRED') {
                throw new ApiError(
                    409,
                    'Ce ticket a expiré'
                );
            }

            throw new ApiError(
                409,
                'Ce ticket ne peut pas être utilisé'
            );
        }

        /*
         * Une réservation doit être confirmée
         * avant de pouvoir embarquer.
         */
        if (booking.status !== 'CONFIRMED') {
            throw new ApiError(
                409,
                'La réservation n’est pas confirmée'
            );
        }

        /*
         * Le trajet ne doit pas être annulé.
         */
        if (trip.status === 'CANCELLED') {
            throw new ApiError(
                409,
                'Ce trajet a été annulé'
            );
        }

        /*
         * Vérification du trajet.
         *
         * On accepte l'embarquement pendant la phase
         * SCHEDULED ou BOARDING.
         */
        if (!['SCHEDULED', 'BOARDING'].includes(trip.status)) {
            throw new ApiError(
                409,
                `L’embarquement n’est pas disponible pour un trajet ${trip.status}`
            );
        }

        const now = new Date();

        /*
         * On ne doit pas pouvoir embarquer un passager
         * plusieurs jours avant son départ.
         *
         * On autorise l'embarquement à partir de 2 heures
         * avant le départ.
         */
        const boardingWindowStart = new Date(
            trip.departureAt.getTime() - 2 * 60 * 60 * 1000
        );

        if (now < boardingWindowStart) {
            throw new ApiError(
                409,
                'La période d’embarquement n’est pas encore ouverte'
            );
        }

        /*
         * Si l'heure de départ est dépassée de plus de 30 minutes,
         * on considère que l'embarquement est fermé.
         */
        const boardingWindowEnd = new Date(
            trip.departureAt.getTime() + 30 * 60 * 1000
        );

        if (now > boardingWindowEnd) {
            throw new ApiError(
                409,
                'La période d’embarquement est terminée'
            );
        }

        /*
         * Si un boarding existe déjà, on refuse le second scan.
         */
        if (ticket.boarding) {
            if (ticket.boarding.status === 'BOARDED') {
                throw new ApiError(
                    409,
                    'Ce passager est déjà embarqué'
                );
            }

            if (ticket.boarding.status === 'REJECTED') {
                throw new ApiError(
                    409,
                    'L’embarquement de ce ticket a été rejeté'
                );
            }

            if (ticket.boarding.status === 'CANCELLED') {
                throw new ApiError(
                    409,
                    'Cet enregistrement d’embarquement a été annulé'
                );
            }
        }

        const scannedAt = new Date();

        /*
         * Les trois opérations doivent être atomiques :
         *
         * 1. créer le boarding
         * 2. passer le ticket à USED
         * 3. passer la réservation à BOARDED
         *
         * Si une opération échoue, tout est annulé.
         */
        const boarding = await repository.transaction(
            async (tx) => {
                const createdBoarding = await tx.boarding.create({
                    data: {
                        ticketId: ticket.id,
                        controllerId: user.id,
                        status: 'BOARDED',
                        scannedAt,
                        boardedAt: scannedAt
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

                await tx.ticket.update({
                    where: {
                        id: ticket.id
                    },
                    data: {
                        status: 'USED',
                        usedAt: scannedAt
                    }
                });

                await tx.booking.update({
                    where: {
                        id: booking.id
                    },
                    data: {
                        status: 'BOARDED'
                    }
                });

                return createdBoarding;
            }
        );

        return boarding;
    };


    getTodayDepartures = async (user, meta = {}) => {
        if (!user) {
            throw new ApiError(401, "Authentification requise");
        }

        let companyId = null;
        let agencyId = null;

        if (user.role === "COMPANY_ADMIN") {
            if (!user.companyId) {
                throw new ApiError(403, "Aucune compagnie associée");
            }
            companyId = user.companyId;
        } else if (user.role === "CONTROLLER") {
            if (!user.companyId) {
                throw new ApiError(403, "Aucune compagnie associée");
            }
            if (!user.agencyId) {
                throw new ApiError(403, "Aucune agence associée");
            }
            companyId = user.companyId;
            agencyId = user.agencyId;
        } else if (user.role !== "SUPER_ADMIN") {
            throw new ApiError(403, "Accès non autorisé");
        }

        /* ---------- Plage de la journée (inclut les départs passés) ---------- */

        const now = new Date();
        const { start, end } = getDayRange(now, { excludePast: false, now });

        const trips = await repository.findTodayDepartures({
            companyId,
            agencyId,
            startDate: start,
            endDate: end,
        });

        return trips.map((trip) => {
            const totalSeats = trip.bus?.capacity ?? 0;

            const activeBookings = (trip.bookings ?? []).filter((b) =>
                ["CONFIRMED", "BOARDED"].includes(b.status)
            );

            const passengers = activeBookings.length;
            const boarded = activeBookings.filter(
                (b) => b.status === "BOARDED"
            ).length;

            return {
                id: trip.id,

                time: trip.departureAt,
                originCity: trip.route?.originCity?.name ?? null,
                destinationCity: trip.route?.destinationCity?.name ?? null,
                busName: trip.bus?.name ?? trip.bus?.registrationNumber ?? null,
                driverName: trip.driver?.firstName
                    ? `${trip.driver.firstName} ${trip.driver.lastName}`
                    : null,

                departure: {
                    city: trip.departureLocation?.city?.name ?? null,
                    location: trip.departureLocation?.name ?? null,
                    time: trip.departureAt,
                },
                arrival: {
                    city: trip.arrivalLocation?.city?.name ?? null,
                    location: trip.arrivalLocation?.name ?? null,
                    time: trip.arrivalAt,
                },
                route: {
                    origin: trip.route?.originCity?.name ?? null,
                    destination: trip.route?.destinationCity?.name ?? null,
                },
                bus: {
                    id: trip.bus?.id ?? null,
                    name: trip.bus?.name ?? null,
                    registrationNumber: trip.bus?.registrationNumber ?? null,
                    capacity: totalSeats,
                },
                seats: {
                    total: totalSeats,
                    booked: passengers,
                    available: Math.max(0, totalSeats - passengers),
                },
                boarding: {
                    total: passengers,
                    boarded,
                },
                price: trip.price,
                status: trip.status,

                company: {
                    name: trip.route.company.name,
                    logo: trip.route.company.logo,
                },
            };
        });
    };
    /**
     * Récupère un boarding par son ID.
     */
    getBoardingById = async (id, user) => {
        if (!user) {
            throw new ApiError(
                401,
                'Authentification requise'
            );
        }

        const boarding = await repository.findById(id);

        if (!boarding) {
            throw new ApiError(
                404,
                'Embarquement introuvable'
            );
        }

        /*
         * SUPER_ADMIN peut tout consulter.
         */
        if (user.role === 'SUPER_ADMIN') {
            return boarding;
        }

        /*
         * Un contrôleur peut consulter ses propres contrôles.
         */
        if (user.role === 'CONTROLLER') {
            if (boarding.controllerId !== user.id) {
                throw new ApiError(
                    403,
                    'Vous n’avez pas accès à cet embarquement'
                );
            }

            return boarding;
        }

        /*
         * Les COMPANY_ADMIN peuvent consulter les embarquements
         * de leur compagnie.
         */
        if (user.role === 'COMPANY_ADMIN') {
            const companyId =
                boarding.ticket?.booking?.trip?.route?.companyId;

            if (!companyId || companyId !== user.companyId) {
                throw new ApiError(
                    403,
                    'Vous n’avez pas accès à cet embarquement'
                );
            }

            return boarding;
        }

        throw new ApiError(
            403,
            'Vous n’avez pas accès à cet embarquement'
        );
    };

    /**
     * Liste les embarquements d'un trajet.
     */
    getTripBoardings = async (tripId, user) => {
        if (!user) {
            throw new ApiError(
                401,
                "Authentification requise"
            );
        }

        if (
            ![
                "CONTROLLER",
                "COMPANY_ADMIN",
                "SUPER_ADMIN"
            ].includes(user.role)
        ) {
            throw new ApiError(
                403,
                "Accès interdit"
            );
        }

        const trip =
            await tripRepository.findBoardingContext(
                tripId
            );

        if (!trip) {
            throw new ApiError(
                404,
                "Voyage introuvable"
            );
        }

        // =====================================================
        // SUPER ADMIN
        // =====================================================

        if (user.role === "SUPER_ADMIN") {
            return repository.findManyByTrip(
                tripId
            );
        }

        // =====================================================
        // COMPANY ADMIN
        // =====================================================

        if (user.role === "COMPANY_ADMIN") {
            if (!user.companyId) {
                throw new ApiError(
                    403,
                    "Aucune compagnie associée à cet utilisateur"
                );
            }

            if (
                trip.route.companyId !==
                user.companyId
            ) {
                throw new ApiError(
                    403,
                    "Ce voyage n'appartient pas à votre compagnie"
                );
            }

            return repository.findManyByTrip(
                tripId
            );
        }

        // =====================================================
        // CONTROLLER
        // =====================================================

        if (user.role === "CONTROLLER") {
            if (!user.companyId) {
                throw new ApiError(
                    403,
                    "Aucune compagnie associée à cet utilisateur"
                );
            }

            if (
                trip.route.companyId !==
                user.companyId
            ) {
                throw new ApiError(
                    403,
                    "Ce voyage n'appartient pas à votre compagnie"
                );
            }

            if (!user.agencyId) {
                throw new ApiError(
                    403,
                    "Aucune agence associée à cet utilisateur"
                );
            }

            const isAgencyTrip =
                trip.departureLocation?.agencies?.some(
                    (agency) =>
                        agency.id === user.agencyId
                );

            if (!isAgencyTrip) {
                throw new ApiError(
                    403,
                    "Ce voyage n'est pas accessible à votre agence"
                );
            }

            return repository.findManyByTrip(
                tripId
            );
        }

        return [];
    };

    /**
     * Liste les embarquements effectués par un contrôleur.
     */
    getControllerBoardings = async (controllerId, user) => {
        if (!user) {
            throw new ApiError(
                401,
                'Authentification requise'
            );
        }

        if (user.role === 'SUPER_ADMIN') {
            return repository.findManyByController(
                controllerId
            );
        }

        if (user.role === 'CONTROLLER') {
            if (controllerId !== user.id) {
                throw new ApiError(
                    403,
                    'Vous ne pouvez consulter que vos propres embarquements'
                );
            }

            return repository.findManyByController(
                controllerId
            );
        }

        throw new ApiError(
            403,
            'Accès interdit'
        );
    };
};

module.exports = new BoardingService();
