const ApiResponse = require("../../../utils/ApiResponse");
const asyncHandler = require("../../../utils/asyncHandler");
const pushService = require("../channels/push/push.service");

class SubscriptionController {
    subscribe = asyncHandler(async (req, res) => {
        const subscription = await pushService.subscribe({
            userId: req.user.id,
            subscription: req.body.subscription,
            application: req.body.application,
            deviceLabel: req.body.deviceLabel,
            userAgent: req.headers["user-agent"]
        });

        return ApiResponse.success(
            res,
            subscription,
            "Abonnement Push enregistré.",
        );
    });

    unsubscribe = asyncHandler(async (req, res) => {
        const result = await pushService.unsubscribe({
            userId: req.user.id,
            subscriptionId: req.params.id
        });

        return ApiResponse.success(
            res,
            result,
            "Abonnement Push révoqué."
        );
    });
}

module.exports = new SubscriptionController();