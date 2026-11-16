const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./seatLayout.service');

class SeatLayoutController {
    getLayoutByBus = asyncHandler(async (req, res) => {
        const layout =
            await service.getLayoutByBus(
                req.params.busId
            );

        return ApiResponse.success(
            res,
            layout,
            "Layout récupéré"
        )
    });

    createLayout = asyncHandler(async (req, res) => {
        const layout =
            await service.createLayout(
                req.body
            );

        return ApiResponse.created(
            res,
            layout,
            'Configuration des sièges créée avec succès'
        )
    });

    updateSeatStatus = asyncHandler(async (req, res) => {
        const seat =
            await service.updateSeatStatus(
                req.params.seatId,
                req.body.status
            );

        return ApiResponse.success(
            res,
            seat,
            'Statut du siège modifié avec succès'
        )
    })
};

module.exports = new SeatLayoutController();