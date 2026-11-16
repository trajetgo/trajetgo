const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./payment.service');

class PaymentService {
    create = asyncHandler(async (req, res) => {
        const payment = await service.createPayment(
            req.body,
            req.user
        );

        return ApiResponse.created(
            res,
            payment,
            "Paiement initialisé avec succès"
        );
    });

    getMyPayments = asyncHandler(async (req, res) => {
        const payments = await service.getMyPayments(req.user);

        return ApiResponse.success(
            res,
            payments,
            "Paiements de l'utilisateur récupérés avec succès"
        );
    });

    getById = asyncHandler(async (req, res) => {
        const payment = await service.getPaymentById(
            req.params.id,
            req.user
        );

        return ApiResponse.success(
            res,
            payment,
            "Paiement récupéré avec succès"
        );
    });

    // À utiliser plus tard pour les webhooks des opérateurs de paiement
    confirm = asyncHandler(async (req, res) => {
        const payment = await service.confirmPayment(req.body);

        return ApiResponse.success(
            res,
            payment,
            "Paiement confirmé avec succès"
        );
    });

    // À utiliser plus tard pour les webhooks des opérateurs de paiement
    fail = asyncHandler(async (req, res) => {
        const payment = await service.failPayment(req.body);

        return ApiResponse.success(
            res,
            payment,
            "Paiement marqué comme échoué"
        );
    });

    simulateSuccess = asyncHandler(async (req, res) => {
        const result = await service.simulatePaymentSuccess(
            req.params.id,
            req.user
        );

        return ApiResponse.success(
            res,
            result,
            'Paiement simulé avec succès',
        );
    });
};

module.exports = new PaymentService();