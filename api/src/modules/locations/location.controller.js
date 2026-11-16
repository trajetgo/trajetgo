const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const service = require('./location.service');

class LocationController {
    getById = asyncHandler(async (req, res) => {
        const location = await service.getById(
            req.params.id,
            req.user
        );

        return ApiResponse.success(
            res,
            location,
            "Localisation récupérée avec succès"
        )
    });

    getByType = asyncHandler(async (req, res) => {
        const location = await service.getByType(
            req.query.type,
        );

        return ApiResponse.success(
            res,
            location,
            "Localisation récupérée avec succès"
        )
    });

    searchCities = asyncHandler(async (req, res) => {
        const cities = await service.searchCities(
            req.query.search
        );

        return ApiResponse.success(
            res,
            cities,
            "Villes récupérées avec succès"
        );
    });
};

module.exports = new LocationController();