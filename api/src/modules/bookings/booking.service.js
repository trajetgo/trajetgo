const ApiError = require('../../utils/ApiError');
const notificationService = require('../notifications/notification.service');
const repository = require('./booking.repository');

const BOOKABLE_TRIP_STATUSES = [
    'SCHEDULED'
];

const CANCELLABLE_BOOKING_STATUSES = [
    'PENDING',
    'CONFIRMED'
];

class BookingService {

    /**
     * Créer une réservation
     */
    createBooking = async (data, user, meta = {}) => {
        const {
            tripId,
            seatId
        } = data;

        if (!user) {
            throw new ApiError(
                401,
                'Authentification requise'
            );
        }

        /**
         * Uniquement les passagers peuvent
         * créer directement une réservation.
         */
        if (user.role !== 'PASSENGER') {
            throw new ApiError(
                403,
                'Seuls les passagers peuvent créer une réservation'
            );
        }

        /**
         * Vérification du voyage
         */
        const trip = await repository.findTripForBooking(tripId);

        if (!trip) {
            throw new ApiError(
                404,
                'Voyage introuvable'
            );
        }

        /**
         * Vérification du statut du voyage
         */
        if (!BOOKABLE_TRIP_STATUSES.includes(trip.status)) {
            throw new ApiError(
                400,
                'Ce voyage n’est plus disponible à la réservation'
            );
        }

        /**
         * Le départ doit encore être dans le futur.
         */
        if (new Date(trip.departureAt) <= new Date()) {
            throw new ApiError(
                400,
                'Impossible de réserver un voyage déjà commencé'
            );
        }

        /**
         * Vérification du siège
         */
        const seat = await repository.findSeatById(seatId);

        if (!seat) {
            throw new ApiError(
                404,
                'Siège introuvable'
            );
        }

        /**
         * Le siège doit être actif.
         */
        if (seat.status !== 'ACTIVE') {
            throw new ApiError(
                400,
                'Ce siège n’est pas disponible'
            );
        }

        /**
         * Le siège doit appartenir au bus
         * utilisé pour ce voyage.
         */
        if (seat.layout.busId !== trip.busId) {
            throw new ApiError(
                400,
                'Ce siège n’appartient pas au bus de ce voyage'
            );
        }

        /**
         * Vérification de la réservation existante.
         */
        const existingBooking =
            await repository.findByTripAndSeat(
                tripId,
                seatId
            );

        if (existingBooking) {

            /**
             * Une réservation annulée peut être réutilisée.
             */
            if (existingBooking.status === 'CANCELLED') {

                return repository.reactivate(
                    existingBooking.id,
                    {
                        userId: user.id,
                        amount: trip.price,
                        status: 'PENDING'
                    }
                );
            }

            /**
             * Une réservation expirée peut également
             * être réutilisée.
             */
            if (existingBooking.status === 'EXPIRED') {

                return repository.reactivate(
                    existingBooking.id,
                    {
                        userId: user.id,
                        amount: trip.price,
                        status: 'PENDING'
                    }
                );
            }

            /**
             * Tous les autres statuts bloquent
             * la réservation de la place.
             */
            throw new ApiError(
                409,
                'Ce siège est déjà réservé pour ce voyage'
            );
        }

        /**
         * Le prix est toujours déterminé
         * par le serveur.
         */
        const amount = trip.price;

        await notificationService.notify({
            userId: existingBooking.userId,
            category: "BOOKING",
            eventKey: "BOOKING_CONFIRMED",
            title: "Réservation confirmée",
            body: "Votre réservation a été confirmée.",
            data: {
                bookingId: existingBooking.id
            },
            actionUrl: `/bookings/${existingBooking.id}`
        });

        try {

            return await repository.create({
                userId: user.id,
                tripId,
                seatId,
                amount,
                status: 'PENDING'
            });

        } catch (error) {

            /**
             * Protection contre une réservation
             * concurrente.
             *
             * Grâce à :
             *
             * @@unique([tripId, seatId])
             *
             * Prisma/PostgreSQL empêchera deux
             * réservations simultanées de la même place.
             */
            if (error.code === 'P2002') {
                throw new ApiError(
                    409,
                    'Ce siège vient d’être réservé par un autre passager'
                );
            }

            throw error;
        }
    };


    /**
     * Récupérer une réservation par son ID.
     */
    getBookingById = async (id, user) => {

        if (!user) {
            throw new ApiError(
                401,
                'Authentification requise'
            );
        }

        const booking = await repository.findById(id);

        if (!booking) {
            throw new ApiError(
                404,
                'Réservation introuvable'
            );
        }

        /**
         * SUPER_ADMIN peut accéder à toutes
         * les réservations.
         */
        if (user.role === 'SUPER_ADMIN') {
            return booking;
        }

        /**
         * Le passager ne peut consulter
         * que ses propres réservations.
         */
        if (user.role === 'PASSENGER') {

            if (booking.userId !== user.id) {
                throw new ApiError(
                    403,
                    'Vous n’avez pas accès à cette réservation'
                );
            }

            return booking;
        }

        /**
         * Les utilisateurs d'une compagnie
         * doivent appartenir à la même compagnie
         * que le voyage.
         */
        if (
            [
                'COMPANY_ADMIN',
                'AGENCY_AGENT',
                'CONTROLLER'
            ].includes(user.role)
        ) {

            const companyId =
                booking.trip.route.companyId;

            if (!user.companyId) {
                throw new ApiError(
                    403,
                    'Aucune compagnie associée à cet utilisateur'
                );
            }

            if (companyId !== user.companyId) {
                throw new ApiError(
                    403,
                    'Vous n’avez pas accès à cette réservation'
                );
            }

            return booking;
        }

        throw new ApiError(
            403,
            'Accès interdit'
        );
    };


    /**
     * Récupérer les réservations du passager connecté.
     */
    getMyBookings = async (user) => {

        if (!user) {
            throw new ApiError(
                401,
                'Authentification requise'
            );
        }

        if (user.role !== 'PASSENGER') {
            throw new ApiError(
                403,
                'Cette fonctionnalité est réservée aux passagers'
            );
        }

        return repository.findManyByUser(user.id);
    };


    /**
     * Récupérer les réservations d'une compagnie.
     */
    getCompanyBookings = async (user) => {

        if (!user) {
            throw new ApiError(
                401,
                'Authentification requise'
            );
        }

        if (user.role === 'SUPER_ADMIN') {

            /**
             * Pour SUPER_ADMIN, on pourra plus tard
             * ajouter un filtre companyId.
             */
            throw new ApiError(
                400,
                'Un companyId est requis pour cette opération'
            );
        }

        if (
            ![
                'COMPANY_ADMIN',
                'AGENCY_AGENT',
                'CONTROLLER'
            ].includes(user.role)
        ) {
            throw new ApiError(
                403,
                'Accès interdit'
            );
        }

        if (!user.companyId) {
            throw new ApiError(
                403,
                'Aucune compagnie associée à cet utilisateur'
            );
        }

        return repository.findManyByCompany(
            user.companyId
        );
    };


    /**
     * Annuler une réservation.
     */
    cancelBooking = async (id, user) => {

        const booking = await this.getBookingById(
            id,
            user
        );

        /**
         * Vérifier que la réservation
         * peut encore être annulée.
         */
        if (
            !CANCELLABLE_BOOKING_STATUSES.includes(
                booking.status
            )
        ) {
            throw new ApiError(
                400,
                'Cette réservation ne peut plus être annulée'
            );
        }

        /**
         * Le voyage ne doit pas avoir commencé.
         */
        if (
            new Date(booking.trip.departureAt) <= new Date()
        ) {
            throw new ApiError(
                400,
                'Impossible d’annuler une réservation après le départ'
            );
        }

        return repository.cancel(id);
    };

    checkReservedSeats = async (busId, incomingSeats) => {
        // Récupère les sièges réservés du bus
        const reservedNumbers = await repository.getReservedSeatNumbersByBus(busId);

        // Sièges qui passent de ACTIVE à INACTIVE alors qu'ils sont réservés
        return incomingSeats
            .filter(
                (s) =>
                    s.status === "INACTIVE" &&
                    reservedNumbers.has(s.number)
            )
            .map((s) => s.number);
    }
}

module.exports = new BookingService();