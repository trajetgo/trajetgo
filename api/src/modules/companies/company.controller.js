const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const requestMeta = require('../../utils/requestMeta');
const service = require('./company.service');

class CompanyController {
    getCompanies = asyncHandler(async (req, res) => {
        const companies =
            await service.getCompanies(
                req.query,
                req.user
            );

        return ApiResponse.success(
            res,
            companies,
            "Companies de transport récupérées avec succès"
        )
    });

    getTeams = asyncHandler(async (req, res) => {
        const members = await service.getTeams(
            req.query,
            req.user,
            requestMeta(req)
        );

        return ApiResponse.success(
            res,
            members,
            "Personnel de la compagnie récupéré avec succès"
        );
    });

    getCompany = asyncHandler(async (req, res) => {
        const company =
            await service.getCompanyById(
                req.params.id,
                req.user
            );

        return ApiResponse.success(
            res,
            company,
            "Companie de transport récupérées avec succès"
        )
    });

    createCompany = asyncHandler(async (req, res) => {
        const company =
            await service.createCompany(
                req.user.id,
                req.body,
                requestMeta(req)
            );

        return ApiResponse.created(
            res,
            company,
            "Companie de transport créee avec succès"
        )
    });

    updateCompany = asyncHandler(async (req, res) => {
        const company =
            await service.updateCompany(
                req.params.id,
                req.body
            );

        return ApiResponse.success(
            res,
            company,
            "Companie de transport modifiée avec succès"
        )
    });

    deactivateCompany = asyncHandler(async (req, res) => {
        const company =
            await service.deactivateCompany(
                req.params.id,
            );

        return ApiResponse.success(
            res,
            company,
            "Companie de transport désactivée avec succès"
        )
    });
};

module.exports = new CompanyController();