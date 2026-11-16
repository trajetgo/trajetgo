const PaymentProvider = require('./payment-provider');

class CinetPayProvider extends PaymentProvider {
    constructor() {
        super('CINETPAY');
    }

    async initializePayment(data) {
        throw new Error(
            'L’intégration CinetPay n’est pas encore configurée'
        );
    }

    async checkPayment(data) {
        throw new Error(
            'La vérification CinetPay n’est pas encore configurée'
        );
    }

    async cancelPayment(data) {
        throw new Error(
            'L’annulation CinetPay n’est pas encore configurée'
        );
    }

    async refundPayment(data) {
        throw new Error(
            'Le remboursement CinetPay n’est pas encore configuré'
        );
    }
}

module.exports = new CinetPayProvider();