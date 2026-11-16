const ApiError = require("../../../utils/ApiError");

class PaymentProvider {
    constructor(name) {
        this.name = name;
    }

    initializePayment = async () => {
        throw new ApiError(
            501,
            `initializePayment() n'est pas implémenté pour ${this.name}`
        )
    }

    checkPayment = async () => {
        throw new ApiError(
            501,
            `checkPayment() n'est pas implémenté pour ${this.name}`)
        ;
    }

    cancelPayment = async () => {
        throw new ApiError(
            501,
            `cancelPayment() n'est pas implémenté pour ${this.name}`
        );
    }

    refundPayment = async () => {
        throw new ApiError(
            501,
            `refundPayment() n'est pas implémenté pour ${this.name}`
        );
    }
};

module.exports = PaymentProvider;