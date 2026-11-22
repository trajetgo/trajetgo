const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const service = require("./dashboard.service");

class DashboardController {
    getSummary = asyncHandler(async (req, res) => {
        const summary = await service.getSummary(
            req.user
        );

        return ApiResponse.success(
            res, 
            summary, 
            "Tableau de bord chargé."
        );
    });
};

module.exports = new DashboardController();