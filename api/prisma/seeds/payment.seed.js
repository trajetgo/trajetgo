const {
    prisma,
    logSeed,
    logSuccess,
    logWarning
} = require('./helpers');

const seedPayment = async ({
    key,
    booking,
    method,
    status,
    transactionId,
    providerReference,
    paidAt = null
}) => {
    if (!booking) {
        throw new Error(`Booking manquant pour le paiement ${key}`);
    }

    const payment = await prisma.payment.upsert({
        where: {
            bookingId: booking.id
        },
        update: {
            amount: booking.amount,
            currency: 'XOF',
            method,
            status,
            transactionId,
            providerReference,
            paidAt
        },
        create: {
            bookingId: booking.id,
            amount: booking.amount,
            currency: 'XOF',
            method,
            status,
            transactionId,
            providerReference,
            paidAt
        },
        include: {
            booking: {
                include: {
                    user: true,
                    trip: {
                        include: {
                            route: {
                                include: {
                                    originCity: true,
                                    destinationCity: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    logSuccess(
        `${key} → ${payment.method} | ` +
        `${payment.status} | ${payment.amount} FCFA`
    );

    return payment;
};

const seedPayments = async (bookings) => {
    logSeed('Création des paiements...');

    const payments = {};

    const paymentDefinitions = [
        {
            key: 'pendingPaymentOne',
            booking: bookings.pendingBookingOne,
            method: 'ORANGE_MONEY',
            status: 'PENDING',
            transactionId: null,
            providerReference: 'ORANGE-PENDING-001'
        },
        {
            key: 'pendingPaymentTwo',
            booking: bookings.pendingBookingTwo,
            method: 'WAVE',
            status: 'PROCESSING',
            transactionId: null,
            providerReference: 'WAVE-PROCESSING-001'
        },
        {
            key: 'successPaymentOne',
            booking: bookings.confirmedBookingOne,
            method: 'ORANGE_MONEY',
            status: 'SUCCESS',
            transactionId: 'OM-TRX-000001',
            providerReference: 'OM-REF-000001',
            paidAt: new Date()
        },
        {
            key: 'successPaymentTwo',
            booking: bookings.confirmedBookingTwo,
            method: 'MTN_MOBILE_MONEY',
            status: 'SUCCESS',
            transactionId: 'MTN-TRX-000001',
            providerReference: 'MTN-REF-000001',
            paidAt: new Date()
        },
        {
            key: 'cancelledPayment',
            booking: bookings.cancelledBooking,
            method: 'MOOV_MONEY',
            status: 'CANCELLED',
            transactionId: 'MOOV-TRX-000001',
            providerReference: 'MOOV-REF-000001'
        },
        {
            key: 'expiredPayment',
            booking: bookings.expiredBooking,
            method: 'WAVE',
            status: 'EXPIRED',
            transactionId: null,
            providerReference: 'WAVE-EXPIRED-001'
        }
    ];

    for (const definition of paymentDefinitions) {
        if (!definition.booking) {
            logWarning(
                `${definition.key} ignoré : réservation inexistante.`
            );
            continue;
        }

        try {
            payments[definition.key] = await seedPayment(definition);
        } catch (error) {
            logWarning(
                `Impossible de créer ${definition.key}: ${error.message}`
            );
        }
    }

    logSuccess(
        `${Object.keys(payments).length} paiements créés/mis à jour.`
    );

    return payments;
};

module.exports = seedPayments;
