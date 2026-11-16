const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./trip.service');

class TripController {
    getTrips = asyncHandler(async (req, res) => {
        const trips = await service.getTrips(
            req.query,
            req.user
        );

        return ApiResponse.success(
            res,
            trips,
            "Trajets récupérés avec succès"
        );
    });

    getTrip = asyncHandler(async (req, res) => {
        const trip = await service.getTripById(
            req.params.id,
            req.user
        );

        return ApiResponse.success(
            res,
            trip,
            "Trajet récupéré avec succès"
        );
    });

    getSeatsForTrip = asyncHandler(async (req, res) => {
        const seats = await service.getSeatsForTrip(
            req.params.id,
            req.user
        );

        return ApiResponse.success(
            res,
            seats,
            "Sièges récupéré avec succès"
        );
    });

    searchTrips = asyncHandler(async (req, res) => {
        const trips = await service.searchTrips(
            req.query
        );

        return ApiResponse.success(
            res,
            trips,
            "Trajets trouvés avec succès"
        )
    });

    getPricesAroundDate = asyncHandler(async (req, res) => {
        const prices = await service.getPricesAroundDate(req.query);

        return ApiResponse.success(
            res,
            prices,
            "Prix récupérés avec succès."
        );
    });

    createTrip = asyncHandler(async (req, res) => {
        const trip = await service.createTrip(
            req.body,
            req.user
        );

        return ApiResponse.created(
            res,
            trip,
            "Trajet créé avec succès"
        );
    });

    updateTrip = asyncHandler(async (req, res) => {
        const trip = await service.updateTrip(
            req.params.id,
            req.body,
            req.user
        );

        return ApiResponse.success(
            res,
            trip,
            "Trajet modifié avec succès"
        );
    });

    cancelTrip = asyncHandler(async (req, res) => {
        const trip = await service.cancelTrip(
            req.params.id,
            req.user
        );

        return ApiResponse.success(
            res,
            trip,
            "Trajet annulé avec succès"
        );
    });
};

module.exports = new TripController();