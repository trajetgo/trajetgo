const crypto = require('crypto');

const ApiError = require('../../utils/ApiError');
const repository = require('./ticket.repository');
const tripRepository = require('../trips/trip.repository');
const seatLayoutRepository = require('../seats/seatLayout.repository');

const generateTicketNumber = () => {
    const date = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '');

    const random = crypto
        .randomBytes(4)
        .toString('hex')
        .toUpperCase();

    return `TG - ${date} -${random} `;

};

const generateQrCode = () => {
    const random = crypto.randomBytes(16).toString('hex');

    return `TKT_${random}`;
};

class TicketService {
    /**
     * Créer un ticket à partir d'une réservation confirmée.
     */
    createTicket = async (bookingId) => {
        const booking = await repository.findBookingById(bookingId);

        if (!booking) {
            throw new ApiError(
                404,
                'Réservation introuvable'
            );
        }

        if (booking.status !== 'CONFIRMED') {
            throw new ApiError(
                400,
                'La réservation doit être confirmée avant de générer le ticket'
            );
        }

        // Une réservation ne peut avoir qu'un seul ticket.
        if (booking.ticket) {
            return booking.ticket;
        }

        // Le voyage ne doit pas être déjà terminé ou annulé.
        if (booking.trip.status === 'CANCELLED') {
            throw new ApiError(
                400,
                'Impossible de générer un ticket pour un voyage annulé'
            );
        }

        if (new Date(booking.trip.departureAt) <= new Date()) {
            throw new ApiError(
                400,
                'Impossible de générer un ticket pour un voyage déjà commencé'
            );
        }

        const ticketNumber = generateTicketNumber();
        const qrCode = generateQrCode();

        try {
            return await repository.create({
                bookingId: booking.id,
                ticketNumber,
                qrCode,
                status: 'ACTIVE',
                issuedAt: new Date()
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ApiError(
                    409,
                    'Un ticket existe déjà pour cette réservation'
                );
            }

            throw error;
        }
    };


    /**
     * Récupérer un ticket.
     */
    getTicketById = async (id, user) => {
        if (!user) {
            throw new ApiError(
                401,
                'Authentification requise'
            );
        }

        const ticket = await repository.findById(id);

        if (!ticket) {
            throw new ApiError(
                404,
                'Ticket introuvable'
            );
        }

        // SUPER_ADMIN peut tout consulter.
        if (user.role === 'SUPER_ADMIN') {
            return ticket;
        }

        // PASSENGER : uniquement ses propres tickets.
        if (user.role === 'PASSENGER') {
            if (ticket.booking.userId !== user.id) {
                throw new ApiError(
                    403,
                    'Vous n’avez pas accès à ce ticket'
                );
            }

            return ticket;
        }

        // Utilisateurs liés à une compagnie.
        if (
            ['COMPANY_ADMIN', 'AGENCY_AGENT', 'CONTROLLER'].includes(
                user.role
            )
        ) {
            if (!user.companyId) {
                throw new ApiError(
                    403,
                    'Aucune compagnie associée à cet utilisateur'
                );
            }

            const companyId = ticket.booking.trip.route.companyId;

            if (companyId !== user.companyId) {
                throw new ApiError(
                    403,
                    'Vous n’avez pas accès à ce ticket'
                );
            }

            return ticket;
        }

        throw new ApiError(
            403,
            'Accès interdit'
        );
    };

    getTickets = (filters, user) => {
        if (!user) {
            throw new ApiError(
                401,
                'Authentification requise'
            );
        }

        const {
            status,
            tripId,
            ticketNumber,
            bookingId,
            userId,
            startDate,
            endDate,
            page = 1,
            limit = 20
        } = filters;

        const normalizedPage = Math.max(
            Number(page) || 1,
            1
        );

        const normalizedLimit = Math.min(
            Math.max(Number(limit) || 20, 1),
            100
        );

        let companyId = null;
        let agencyId = null;

        if (user.role === 'SUPER_ADMIN') {
            companyId = filters.companyId || null;
        } else {
            if (!user.companyId) {
                throw new ApiError(
                    403,
                    'Aucune compagnie associée à cet utilisateur'
                );
            }

            companyId = user.companyId;
        }

        if (user.role === 'AGENCY_AGENT') {
            if (!user.agencyId) {
                throw new ApiError(
                    403,
                    'Aucune agence associée à cet utilisateur'
                );
            }

            agencyId = user.agencyId;
        }

        return repository.findTickets({
            companyId,
            agencyId,
            status,
            tripId,
            ticketNumber,
            bookingId,
            userId,
            startDate,
            endDate,
            page: normalizedPage,
            limit: normalizedLimit
        });
    };


    /**
     * Récupérer les tickets du passager connecté.
     */
    getMyTickets = async (user) => {
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

    sellTicket = async (data, user) => {
        if (!user) {
            throw new ApiError(
                401,
                "Authentification requise"
            );
        }

        if (user.role !== "AGENCY_AGENT") {
            throw new ApiError(
                403,
                "Seuls les agents d'agence peuvent vendre des billets."
            );
        }

        if (!user.companyId) {
            throw new ApiError(
                403,
                "Aucune compagnie associée à cet utilisateur."
            );
        }

        if (!user.agencyId) {
            throw new ApiError(
                403,
                "Aucune agence associée à cet utilisateur."
            );
        }

        if (data.paymentMethod !== "CASH") {
            throw new ApiError(
                400,
                "Cette opération accepte uniquement le paiement en espèces."
            );
        }

        if (!data.tripId) {
            throw new ApiError(
                400,
                "Le voyage est obligatoire."
            );
        }

        if (!data.seatId) {
            throw new ApiError(
                400,
                "Le siège est obligatoire."
            );
        }

        const trip = await tripRepository.findById(
            data.tripId
        );

        if (!trip) {
            throw new ApiError(
                404,
                "Voyage introuvable."
            );
        }

        if (
            !["SCHEDULED", "BOARDING"].includes(
                trip.status
            )
        ) {
            throw new ApiError(
                400,
                "Ce voyage n'accepte plus de nouvelles ventes."
            );
        }

        // Sécurité compagnie
        if (
            trip.route.companyId !==
            user.companyId
        ) {
            throw new ApiError(
                403,
                "Ce voyage n'appartient pas à votre compagnie."
            );
        }

        // Sécurité agence
        const agencyServesTrip =
            trip.departureLocation?.agencies?.some(
                (agency) =>
                    agency.id === user.agencyId
            );

        if (!agencyServesTrip) {
            throw new ApiError(
                403,
                "Ce voyage n'est pas accessible à votre agence."
            );
        }

        const seat =
            await seatLayoutRepository.findSeatById(
                data.seatId
            );

        if (!seat) {
            throw new ApiError(
                404,
                "Siège introuvable."
            );
        }

        if (seat.status !== "ACTIVE") {
            throw new ApiError(
                400,
                "Ce siège n'est pas disponible."
            );
        }

        if (
            seat.layout.busId !==
            trip.busId
        ) {
            throw new ApiError(
                400,
                "Ce siège n'appartient pas au bus de ce voyage."
            );
        }

        return repository.sellTicket({
            tripId: data.tripId,
            seatId: data.seatId,

            companyId: user.companyId,
            agencyId: user.agencyId,

            passenger: {
                firstName: data.passenger.firstName,
                lastName: data.passenger.lastName,
                phone: data.passenger.phone,
                email: data.passenger.email || null,
            },

            paymentMethod: "CASH",
            sellerId: user.id,
        });
    };


    /**
     * Rechercher un ticket par son numéro.
     */
    getTicketByNumber = async (ticketNumber, user) => {
        if (!user) {
            throw new ApiError(
                401,
                'Authentification requise'
            );
        }

        const ticket = await repository.findByTicketNumber(
            ticketNumber
        );

        if (!ticket) {
            throw new ApiError(
                404,
                'Ticket introuvable'
            );
        }

        return this.checkTicketAccess(ticket, user);
    };


    /**
     * Rechercher un ticket via son QR Code.
     */
    getTicketByQrCode = async (qrCode, user) => {
        if (!user) {
            throw new ApiError(
                401,
                'Authentification requise'
            );
        }

        const ticket = await repository.findByQrCode(qrCode);

        if (!ticket) {
            throw new ApiError(
                404,
                'Ticket introuvable'
            );
        }

        return this.checkTicketAccess(ticket, user);
    };


    /**
     * Vérifie l'accès d'un utilisateur à un ticket.
     */
    checkTicketAccess = async (ticket, user) => {
        if (user.role === 'SUPER_ADMIN') {
            return ticket;
        }

        if (user.role === 'PASSENGER') {
            if (ticket.booking.userId !== user.id) {
                throw new ApiError(
                    403,
                    'Vous n’avez pas accès à ce ticket'
                );
            }

            return ticket;
        }

        if (
            ['COMPANY_ADMIN', 'AGENCY_AGENT', 'CONTROLLER'].includes(
                user.role
            )
        ) {
            if (!user.companyId) {
                throw new ApiError(
                    403,
                    'Aucune compagnie associée à cet utilisateur'
                );
            }

            const companyId = ticket.booking.trip.route.companyId;

            if (companyId !== user.companyId) {
                throw new ApiError(
                    403,
                    'Vous n’avez pas accès à ce ticket'
                );
            }

            return ticket;
        }

        throw new ApiError(
            403,
            'Accès interdit'
        );
    };


    /**
     * Annuler un ticket.
     */
    cancelTicket = async (id, user) => {
        const ticket = await this.getTicketById(id, user);

        if (ticket.status === 'CANCELLED') {
            throw new ApiError(
                400,
                'Ce ticket est déjà annulé'
            );
        }

        if (ticket.status === 'USED') {
            throw new ApiError(
                400,
                'Un ticket déjà utilisé ne peut pas être annulé'
            );
        }

        if (ticket.status === 'EXPIRED') {
            throw new ApiError(
                400,
                'Ce ticket a déjà expiré'
            );
        }

        return repository.updateStatus(
            ticket.id,
            'CANCELLED',
            {
                cancelledAt: new Date()
            }
        );
    };


    /**
     * Marquer un ticket comme utilisé.
     *
     * Cette méthode sera principalement utilisée par le module Boarding.
     */
    useTicket = async (id, user) => {
        const ticket = await this.getTicketById(id, user);

        if (ticket.status === 'USED') {
            throw new ApiError(
                400,
                'Ce ticket a déjà été utilisé'
            );
        }

        if (ticket.status === 'CANCELLED') {
            throw new ApiError(
                400,
                'Ce ticket a été annulé'
            );
        }

        if (ticket.status === 'EXPIRED') {
            throw new ApiError(
                400,
                'Ce ticket a expiré'
            );
        }

        if (new Date(ticket.booking.trip.departureAt) <= new Date()) {
            throw new ApiError(
                400,
                'Le voyage associé à ce ticket a déjà commencé'
            );
        }

        return repository.updateStatus(
            ticket.id,
            'USED',
            {
                usedAt: new Date()
            }
        );
    };
}

module.exports = new TicketService();
