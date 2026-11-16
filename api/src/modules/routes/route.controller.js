const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./route.service');

class RouteController {
    getRoutes = asyncHandler(async (req, res) => {
        const routes = await service.getRoutes(
            req.query,
            req.user
        );

        return ApiResponse.success(
            res,
            routes,
            "Routes récupérées avec succès"
        )
    });

    getLocationsByCity = asyncHandler(async (req, res) => {
        const city = await service.getLocationsByCity(req.params.cityId);

        return ApiResponse.success(
            res,
            city,
            "Ville récupérée avec succès"
        )
    });

    getCities = asyncHandler(async (req, res) => {
        const cities = await service.getCities(
            req.query
        );

        return ApiResponse.success(
            res,
            cities,
            "Villes récupérées avec succès"
        )
    });

    getRoute = asyncHandler(async (req, res) => {
        const route = await service.getRouteById(
            req.params.id,
            req.user
        );

        return ApiResponse.success(
            res,
            route,
            "Route récupérée avec succès"
        )
    });

    createRoute = asyncHandler(async (req, res) => {
        const route = await service.createRoute(
            req.body,
            req.user
        );

        return ApiResponse.created(
            res,
            route,
            "Route créée avec succès"
        )
    });

    updateRoute = asyncHandler(async (req, res) => {
        const route = await service.updateRoute(
            req.params.id,
            req.body
        );

        return ApiResponse.success(
            res,
            route,
            "Route modifiée avec succès"
        )
    });

    deleteRoute = asyncHandler(async (req, res) => {
        await service.deleteRoute(req.params.id);

        return ApiResponse.success(
            res,
            "Route désactivée avec succès"
        )
    });
};

module.exports = new RouteController();