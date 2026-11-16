const PaymentProvider = require('./payment-provider');

class WaveProvider extends PaymentProvider {
    constructor() {
        super('WAVE');
    }

    async initializePayment(data) {
        throw new Error(
            'L’intégration Wave n’est pas encore configurée'
        );
    }

    async checkPayment(data) {
        throw new Error(
            'La vérification Wave n’est pas encore configurée'
        );
    }

    async cancelPayment(data) {
        throw new Error(
            'L’annulation Wave n’est pas encore configurée'
        );
    }

    async refundPayment(data) {
        throw new Error(
            'Le remboursement Wave n’est pas encore configuré'
        );
    }
}

module.exports = new WaveProvider();