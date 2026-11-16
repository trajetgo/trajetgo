const ApiError = require("../../../utils/ApiError");
const ApiResponse = require("../../../utils/ApiResponse");
const asyncHandler = require("../../../utils/asyncHandler");
const service = require("./import.service");

const requestMeta = (req) => ({
    ip: req.ip,
    userAgent: req.userAgent
})

class ImportController {
    analyze = asyncHandler(async (req, res) => {
        if (!req.file) {
            throw new ApiError(400, "Veuillez fournir un fichier Excel.");
        }

        const report = await service.analyze(
            req.file
        );

        return ApiResponse.success(
            res,
            report,
            "Analyse du fichier terminée."
        );
    });

    confirm = asyncHandler(async (req, res) => {
        if (!req.file) {
            throw new ApiError(400, "Veuillez fournir un fichier Excel.");
        }

        const report = await service.confirm(
            req.file, 
            req.user,
            requestMeta(req)
        );

        return ApiResponse.success(
            res,
            report,
            "Importation terminée avec succès."
        );
    });
};

module.exports = new ImportController();