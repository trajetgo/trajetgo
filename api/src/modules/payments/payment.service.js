const crypto = require('crypto');
const ApiError = require('../../utils/ApiError');
const repository = require('./payment.repository');

const BOOKING_PAYABLE_STATUSES = [
    'PENDING'
];

const PAYMENT_METHODS = [
    'ORANGE_MONEY',
    'MTN_MOBILE_MONEY',
    'MOOV_MONEY',
    'WAVE',
    'CARD'
];

const generateTicketNumber = () => {
    const date = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '');

    const random = crypto
        .randomBytes(4)
        .toString('hex')
        .toUpperCase();

    return `TG-${date}-${random}`;
};

const generateQrCode = () => {
    return `TKT_${crypto.randomBytes(16).toString('hex')}`;
};

class PaymentService {

    /**
     * Créer un paiement pour une réservation.
     */
    createPayment = async (data, user) => {
        const {
            bookingId,
            method
        } = data;

        if (!user) {
            throw new ApiError(
                401,
                'Authentification requise'
            );
        }

        if (user.role !== 'PASSENGER') {
            throw new ApiError(
                403,
                'Seuls les passagers peuvent initier un paiement'
            );
        }

        /**
         * Vérifier la méthode de paiement.
         */
        if (!PAYMENT_METHODS.includes(method)) {
            throw new ApiError(
                400,
                'Méthode de paiement invalide'
            );
        }

        /**
         * Récupérer le paiement existant.
         */
        const existingPayment =
            await repository.findByBookingId(bookingId);

        if (existingPayment) {

            if (
                [
                    'PENDING',
                    'PROCESSING'
                ].includes(existingPayment.status)
            ) {
                throw new ApiError(
                    409,
                    'Un paiement est déjà en cours pour cette réservation'
                );
            }

            if (existingPayment.status === 'SUCCESS') {
                throw new ApiError(
                    409,
                    'Cette réservation est déjà payée'
                );
            }

            /**
             * Pour FAILED / EXPIRED / CANCELLED,
             * on pourra permettre une nouvelle tentative.
             *
             * Comme bookingId est unique dans Payment,
             * on réutilisera cette ligne.
             */
        }

        /**
         * Récupérer la réservation via le paiement
         * existant ou via le repository Booking.
         *
         * Pour éviter de mélanger les responsabilités,
         * le repository Payment devra exposer la réservation.
         */
        const paymentBooking = existingPayment
            ? existingPayment.booking
            : await repository.findBookingById(bookingId);

        if (!paymentBooking) {
            throw new ApiError(
                404,
                'Réservation introuvable'
            );
        }

        return this.initializePayment(
            paymentBooking,
            method,
            user,
            existingPayment
        );
    };


    /**
     * Initialiser un paiement.
     *
     * Cette méthode sera appelée après récupération
     * de la réservation.
     */
    initializePayment = async (
        booking,
        method,
        user,
        existingPayment = null
    ) => {

        /**
         * Vérifier que la réservation appartient
         * bien au passager connecté.
         */
        if (booking.userId !== user.id) {
            throw new ApiError(
                403,
                'Vous n’avez pas accès à cette réservation'
            );
        }

        /**
         * Vérifier le statut de la réservation.
         */
        if (
            !BOOKING_PAYABLE_STATUSES.includes(
                booking.status
            )
        ) {
            throw new ApiError(
                400,
                'Cette réservation ne peut pas être payée'
            );
        }

        /**
         * Vérifier que le voyage n'est pas déjà parti.
         */
        if (
            new Date(booking.trip.departureAt) <= new Date()
        ) {
            throw new ApiError(
                400,
                'Impossible de payer une réservation pour un voyage déjà commencé'
            );
        }

        /**
         * Le montant vient du Booking.
         *
         * Jamais du frontend.
         */
        const amount = booking.amount;

        /**
         * Le paiement expire après 15 minutes.
         *
         * Cette durée pourra être déplacée dans
         * une configuration plus tard.
         */
        const expiresAt = new Date(
            Date.now() + 15 * 60 * 1000
        );

        /**
         * Réutiliser un paiement FAILED / EXPIRED /
         * CANCELLED existant.
         */
        if (existingPayment) {

            return repository.update(
                existingPayment.id,
                {
                    amount,
                    method,
                    status: 'PENDING',
                    transactionId: null,
                    providerReference: null,
                    paidAt: null,
                    expiresAt,
                    metadata: null
                }
            );
        }

        /**
         * Création du paiement.
         */
        try {

            return await repository.create({
                bookingId: booking.id,
                amount,
                currency: 'XOF',
                method,
                status: 'PENDING',
                expiresAt
            });

        } catch (error) {

            /**
             * Protection contre une création
             * concurrente.
             */
            if (error.code === 'P2002') {
                throw new ApiError(
                    409,
                    'Un paiement existe déjà pour cette réservation'
                );
            }

            throw error;
        }
    };


    /**
     * Récupérer un paiement.
     */
    getPaymentById = async (id, user) => {

        if (!user) {
            throw new ApiError(
                401,
                'Authentification requise'
            );
        }

        const payment =
            await repository.findById(id);

        if (!payment) {
            throw new ApiError(
                404,
                'Paiement introuvable'
            );
        }

        /**
         * SUPER_ADMIN
         */
        if (user.role === 'SUPER_ADMIN') {
            return payment;
        }

        /**
         * PASSENGER
         */
        if (user.role === 'PASSENGER') {

            if (
                payment.booking.userId !== user.id
            ) {
                throw new ApiError(
                    403,
                    'Vous n’avez pas accès à ce paiement'
                );
            }

            return payment;
        }

        /**
         * Utilisateurs compagnie.
         */
        if (
            [
                'COMPANY_ADMIN',
                'AGENCY_AGENT',
                'CONTROLLER'
            ].includes(user.role)
        ) {

            if (!user.companyId) {
                throw new ApiError(
                    403,
                    'Aucune compagnie associée à cet utilisateur'
                );
            }

            const companyId =
                payment.booking.trip.route.companyId;

            if (companyId !== user.companyId) {
                throw new ApiError(
                    403,
                    'Vous n’avez pas accès à ce paiement'
                );
            }

            return payment;
        }

        throw new ApiError(
            403,
            'Accès interdit'
        );
    };


    /**
     * Historique des paiements du passager.
     */
    getMyPayments = async (user) => {

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

        return repository.findManyByUser(
            user.id
        );
    };


    /**
     * Traitement d'un paiement réussi.
     *
     * Cette méthode sera utilisée par le webhook
     * du fournisseur de paiement.
     */
    confirmPayment = async ({
        providerReference,
        transactionId
    }) => {

        if (!providerReference && !transactionId) {
            throw new ApiError(
                400,
                'Une référence de paiement est requise'
            );
        }

        let payment = null;

        if (providerReference) {
            payment =
                await repository.findByProviderReference(
                    providerReference
                );
        }

        if (!payment && transactionId) {
            payment =
                await repository.findByTransactionId(
                    transactionId
                );
        }

        if (!payment) {
            throw new ApiError(
                404,
                'Paiement introuvable'
            );
        }

        /**
         * Idempotence :
         *
         * Si le provider renvoie deux fois
         * le même webhook SUCCESS, on ne doit
         * pas retraiter le paiement.
         */
        if (payment.status === 'SUCCESS') {
            return payment;
        }

        /**
         * Un paiement déjà annulé ou remboursé
         * ne doit pas être confirmé.
         */
        if (
            [
                'CANCELLED',
                'REFUNDED'
            ].includes(payment.status)
        ) {
            throw new ApiError(
                400,
                'Ce paiement ne peut plus être confirmé'
            );
        }

        /**
         * Vérifier l'expiration.
         */
        if (
            payment.expiresAt &&
            new Date(payment.expiresAt) <= new Date()
        ) {
            await repository.updateStatus(
                payment.id,
                'EXPIRED'
            );

            throw new ApiError(
                400,
                'Ce paiement a expiré'
            );
        }

        /**
         * Le paiement est confirmé.
         *
         * Pour l'instant nous mettons seulement
         * à jour Payment.
         *
         * La transition Booking -> CONFIRMED
         * devra être faite dans une transaction
         * avec la création du Ticket.
         */
        return repository.updateStatus(
            payment.id,
            'SUCCESS',
            {
                transactionId:
                    transactionId || payment.transactionId,

                providerReference:
                    providerReference ||
                    payment.providerReference,

                paidAt: new Date()
            }
        );
    };


    /**
     * Marquer un paiement comme échoué.
     */
    failPayment = async ({
        providerReference,
        transactionId,
        reason
    }) => {

        if (!providerReference && !transactionId) {
            throw new ApiError(
                400,
                'Une référence de paiement est requise'
            );
        }

        let payment = null;

        if (providerReference) {
            payment =
                await repository.findByProviderReference(
                    providerReference
                );
        }

        if (!payment && transactionId) {
            payment =
                await repository.findByTransactionId(
                    transactionId
                );
        }

        if (!payment) {
            throw new ApiError(
                404,
                'Paiement introuvable'
            );
        }

        if (payment.status === 'SUCCESS') {
            throw new ApiError(
                400,
                'Un paiement déjà réussi ne peut pas être marqué comme échoué'
            );
        }

        if (payment.status === 'FAILED') {
            return payment;
        }

        return repository.updateStatus(
            payment.id,
            'FAILED',
            {
                metadata: reason
                    ? { reason }
                    : undefined
            }
        );
    };

    simulatePaymentSuccess = async (paymentId, user) => {
        if (!user) {
            throw new ApiError(
                401,
                'Authentification requise'
            );
        }

        if (user.role !== 'PASSENGER') {
            throw new ApiError(
                403,
                'Seuls les passagers peuvent simuler un paiement'
            );
        }

        const payment = await repository.findById(paymentId);

        if (!payment) {
            throw new ApiError(
                404,
                'Paiement introuvable'
            );
        }

        /*
         * Vérification de propriété
         */
        if (payment.booking.userId !== user.id) {
            throw new ApiError(
                403,
                'Vous n’avez pas accès à ce paiement'
            );
        }

        /*
         * Le paiement doit être PENDING
         */
        if (payment.status !== 'PENDING') {
            throw new ApiError(
                400,
                'Ce paiement ne peut plus être simulé'
            );
        }

        /*
         * La réservation doit être PENDING
         */
        if (payment.booking.status !== 'PENDING') {
            throw new ApiError(
                400,
                'Cette réservation ne peut plus être confirmée'
            );
        }

        /*
         * Vérifier l'expiration du paiement
         */
        if (
            payment.expiresAt &&
            new Date(payment.expiresAt) <= new Date()
        ) {
            await repository.updateStatus(
                payment.id,
                'EXPIRED'
            );

            throw new ApiError(
                400,
                'Ce paiement a expiré'
            );
        }

        /*
         * Vérifier que le voyage n'a pas commencé
         */
        if (
            new Date(payment.booking.trip.departureAt) <= new Date()
        ) {
            throw new ApiError(
                400,
                'Le voyage a déjà commencé'
            );
        }

        /*
         * Génération des informations du ticket
         */
        const ticketData = {
            ticketNumber: generateTicketNumber(),
            qrCode: generateQrCode()
        };

        const notificationData = {
            userId: payment.booking.userId,
            type: 'TICKET',
            channel: 'IN_APP',
            status: 'SENT',
            title: 'Votre billet est disponible 🎫',
            message:
                `Votre trajet ${payment.booking.trip.route.originCity.name} → ` +
                `${payment.booking.trip.route.destinationCity.name} est confirmé.`,
            data: {
                bookingId: payment.booking.id,
                paymentId: payment.id,
                tripId: payment.booking.tripId
            }
        };

        try {
            return await repository.simulateSuccess(
                payment.id,
                ticketData,
                notificationData
            );
        } catch (error) {

            if (error.code === 'PAYMENT_NOT_FOUND') {
                throw new ApiError(
                    404,
                    'Paiement introuvable'
                );
            }

            if (error.code === 'PAYMENT_NOT_PENDING') {
                throw new ApiError(
                    409,
                    'Ce paiement ne peut plus être confirmé'
                );
            }

            if (error.code === 'BOOKING_NOT_PENDING') {
                throw new ApiError(
                    409,
                    'Cette réservation ne peut plus être confirmée'
                );
            }

            if (error.code === 'TICKET_ALREADY_EXISTS') {
                throw new ApiError(
                    409,
                    'Un ticket existe déjà pour cette réservation'
                );
            }

            if (error.code === 'P2002') {
                throw new ApiError(
                    409,
                    'Le ticket existe déjà'
                );
            }

            throw error;
        }
    };
}


module.exports = new PaymentService();