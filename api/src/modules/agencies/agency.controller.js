const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./agency.service');

class AgencyController {
    getAgencies = asyncHandler(async (req, res) => {
        const agencies =
            await service.getAgencies(
                req.query,
                req.user
            );

        return ApiResponse.success(
            res,
            agencies,
            "Agences récupérées avec succès"
        );
    });

    getAgency = asyncHandler(async (req, res) => {
        const agency =
            await service.getAgencyById(
                req.params.id,
                req.user
            );

        return ApiResponse.success(
            res,
            agency,
            "Agence récupérée avec succès"
        );
    });

    createAgency = asyncHandler(async (req, res) => {
        const agency =
            await service.createAgency(
                req.body,
                req.user
            );

        return ApiResponse.created(
            res,
            agency,
            "Agence créée avec succès"
        );
    });

    updateAgency = asyncHandler(async (req, res) => {
        const agency =
            await service.updateAgency(
                req.params.id,
                req.body
            );

        return ApiResponse.success(
            res,
            agency,
            "Agence modifiée avec succès"
        );
    });

    activateAgency = asyncHandler(async (req, res) => {
        const agency =
            await service.deactivateAgency(
                req.params.id,
                req.user
            );

        return ApiResponse.success(
            res,
            agency,
            "Agence activée avec succès"
        );
    });

    deactivateAgency = asyncHandler(async (req, res) => {
        const agency =
            await service.deactivateAgency(
                req.params.id,
                req.user
            );

        return ApiResponse.success(
            res,
            agency,
            "Agence désactivée avec succès"
        );
    });

    closeAgency = asyncHandler(async (req, res) => {
        const agency =
            await service.closeAgency(
                req.params.id,
                req.user
            );

        return ApiResponse.success(
            res,
            agency,
            "Agence fermée avec succès"
        );
    });
};

module.exports = new AgencyController();