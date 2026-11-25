const ApiError = require("../../utils/ApiError");
const repository = require("./knowledge.repository");

class KnowledgeService {
    listArticles = async (query) => {
        const { categorySlug, search, limit = 20, offset = 0 } = query;

        const articles = await repository.listArticles({
            categorySlug,
            search,
            limit,
            offset
        });

        return articles
    };

    getArticleBySlug = async (slug) => {
        const article = repository.getArticleBySlug(slug);

        if (!article) {
            throw new ApiError(
                401,
                "Article non trouvé"
            );
        }

        return article;
    };

    submitFeedback = async (slug, helpful) => {
        await this.getArticleBySlug(slug);

        await repository.submitFeedback(slug, helpful);

        return true;
    };

    search = async (query, limit) => {
        return await repository.search(query, limit);
    }
};

module.exports = new KnowledgeService();