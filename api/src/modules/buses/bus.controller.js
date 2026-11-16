const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./bus.service');

class BusController {
    getBuses = asyncHandler(async (req, res) => {
        const buses = await service.getBuses(
            req.query,
            req.user
        );

        return ApiResponse.success(
            res,
            buses,
            "Bus récupérés avec succès"
        )
    });

    getBus = asyncHandler(async (req, res) => {
        const bus = await service.getBusById(
            req.params.id,
            req.user
        );

        return ApiResponse.success(
            res,
            bus,
            "Bus récupéré avec succès"
        )
    });

    createBus = asyncHandler(async (req, res) => {

        console.log("BODY REÇU :", JSON.stringify(req.body, null, 2));

        const bus = await service.createBus(
            req.body,
            req.user
        );

        return ApiResponse.created(
            res,
            bus,
            "Bus créé avec succès"
        )
    });

    updateBus = asyncHandler(async (req, res) => {
        const bus = await service.updateBus(
            req.params.id,
            req.body
        );

        return ApiResponse.success(
            res,
            bus,
            "Bus modifié avec succès"
        )
    });

    deactivateBus = asyncHandler(async (req, res) => {
        const bus = await service.deactivateBus(
            req.params.id,
        );

        return ApiResponse.success(
            res,
            bus,
            "Bus désactivé avec succès"
        )
    });

    updateSeatLayout = asyncHandler(async (req, res) => {
        const bus = await service.updateSeatLayout(
            req.params.id,
            req.body,
            req.user
        );

        return ApiResponse.success(
            res,
            bus,
            "Sièges du bus configurés avec succès"
        )
    });

    getSeatLayout = asyncHandler(async (req, res) => {
        const layout = await service.getSeatLayout(
            req.params.id, 
            req.user
        );

        return ApiResponse.success(
            res, 
            layout, 
            "Plan récupéré."
        );
    });
};

module.exports = new BusController();