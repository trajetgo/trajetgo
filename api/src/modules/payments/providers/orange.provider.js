const PaymentProvider = require('./payment-provider');

class OrangeProvider extends PaymentProvider {
    constructor() {
        super('ORANGE');
    }

    async initializePayment(data) {
        throw new Error(
            'L’intégration Orange Money n’est pas encore configurée'
        );
    }

    async checkPayment(data) {
        throw new Error(
            'La vérification Orange Money n’est pas encore configurée'
        );
    }

    async cancelPayment(data) {
        throw new Error(
            'L’annulation Orange Money n’est pas encore configurée'
        );
    }

    async refundPayment(data) {
        throw new Error(
            'Le remboursement Orange Money n’est pas encore configuré'
        );
    }
}

module.exports = new OrangeProvider();