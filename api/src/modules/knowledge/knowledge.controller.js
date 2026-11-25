const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const requestMeta = require("../../utils/requestMeta");
const service = require("./knowledge.service");

class KnowledgeController {
    listArticles = asyncHandler(async (req, res) => {
        const result = await service.listArticles(
            req.query,
            requestMeta(req)
        );

        return ApiResponse.success(
            res,
            result,
            "Articles récupérés avec succès"
        );
    });

    getArticleBySlug = asyncHandler(async (req, res) => {
        const result = await service.getArticleBySlug(
            req.params.slug,
            requestMeta(req)
        );

        return ApiResponse.success(
            res,
            result,
            "Article récupéré avec succès"
        );
    });

    submitFeedback = asyncHandler(async (req, res) => {
        const result = await service.submitFeedback(
            req.params.slug,
            req.body.helpful,
            requestMeta(req)
        );

        return ApiResponse.success(
            res,
            result,
            "Feedback envoyé avec succès"
        );
    });

    search = asyncHandler(async (req, res) => {
        const result = await service.search(
            req.query,
            requestMeta(req)
        );

        return ApiResponse.success(
            res,
            result,
            "Recherche enregistrée avec succès"
        );
    });
};

module.exports = new KnowledgeController();