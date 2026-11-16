const PaymentProvider = require('./payment-provider');

class MTNProvider extends PaymentProvider {
    constructor() {
        super('MTN');
    }

    async initializePayment(data) {
        throw new Error(
            'L’intégration MTN Money n’est pas encore configurée'
        );
    }

    async checkPayment(data) {
        throw new Error(
            'La vérification MTN Money n’est pas encore configurée'
        );
    }

    async cancelPayment(data) {
        throw new Error(
            'L’annulation MTN Money n’est pas encore configurée'
        );
    }

    async refundPayment(data) {
        throw new Error(
            'Le remboursement MTN Money n’est pas encore configuré'
        );
    }
}

module.exports = new MTNProvider();