const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./boarding.service');

// Derrière un proxy (Nginx, Render...) : app.set('trust proxy', 1) pour que req.ip soit juste
const requestMeta = (req) => ({
    ip: req.ip,
    userAgent: req.get("user-agent"),
});

class BoardingController {
    /**
    * Scanne un QR code et effectue l'embarquement.
    *
    * POST /api/v1/boarding/scan
    */
    scan = asyncHandler(async (req, res) => {
        const boarding = await service.boardByQrCode(
            req.body,
            req.user,
            requestMeta(req)
        );

        return ApiResponse.success(
            res,
            boarding,
            'Embarquement effectué avec succès',
        );
    });

    getTodayDepartures = asyncHandler(async (req, res) => {
        const departures = await service.getTodayDepartures(
            req.user,
            requestMeta(req)
        );

        return ApiResponse.success(
            res,
            departures,
            "Départs du jour récupérés avec succès"
        );
    });

    /**
     * Récupère un embarquement par son ID.
     *
     * GET /api/v1/boarding/:id
     */
    getById = asyncHandler(async (req, res) => {
        const boarding = await service.getBoardingById(
            req.params.id,
            req.user
        );

        return ApiResponse.success(
            res,
            boarding,
            'Embarquement récupéré avec succès',
        );
    });

    /**
     * Liste les embarquements d'un trajet.
     *
     * GET /api/v1/boarding/trip/:tripId
     */
    getByTrip = asyncHandler(async (req, res) => {
        const boardings = await service.getTripBoardings(
            req.params.tripId,
            req.user
        );

        return ApiResponse.success(
            res,
            boardings,
            "Embarquements récupérés avec succès"
        );
    });

    /**
     * Liste les embarquements effectués par un contrôleur.
     *
     * GET /api/v1/boarding/controller/:controllerId
     */
    getByController = asyncHandler(async (req, res, next) => {
        const boardings =
            await service.getControllerBoardings(
                req.params.controllerId,
                req.user
            );

        return ApiResponse.success(
            res,
            boardings,
            "Embarquements récupérés avec succès"
        );
    });
};

module.exports = new BoardingController();
