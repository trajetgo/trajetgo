const PaymentProvider = require('./payment-provider');

class MoovProvider extends PaymentProvider {
    constructor() {
        super('MOOV');
    }

    async initializePayment(data) {
        throw new Error(
            'L’intégration Moov Money n’est pas encore configurée'
        );
    }

    async checkPayment(data) {
        throw new Error(
            'La vérification Moov Money n’est pas encore configurée'
        );
    }

    async cancelPayment(data) {
        throw new Error(
            'L’annulation Moov Money n’est pas encore configurée'
        );
    }

    async refundPayment(data) {
        throw new Error(
            'Le remboursement Moov Money n’est pas encore configuré'
        );
    }
}

module.exports = new MoovProvider();