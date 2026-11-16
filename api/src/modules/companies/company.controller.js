const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./company.service');

// Derrière un proxy (Nginx, Render...) : app.set('trust proxy', 1) pour que req.ip soit juste
const requestMeta = (req) => ({
    ip: req.ip,
    userAgent: req.get("user-agent"),
});

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