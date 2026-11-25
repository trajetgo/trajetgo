const prisma = require("../../config/database");

class KnowledgeRepository {
    listArticles = async ({ categorySlug, search, limit = 20, offset = 0 }) => {
        const where = {
            status: "PUBLISHED",
            publishedAt: { not: null },
        };

        if (categorySlug) {
            where.category = { slug: categorySlug };
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { excerpt: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
            ];
        }

        const [items, total] = await Promise.all([
            prisma.knowledgeArticle.findMany({
                where,
                skip: offset,
                take: limit,
                orderBy: { publishedAt: "desc" },
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    excerpt: true,
                    views: true,
                    publishedAt: true,
                    category: {
                        select: { slug: true, title: true },
                    },
                },
            }),
            prisma.knowledgeArticle.count({ where }),
        ]);

        return { items, total };
    };

    getArticleBySlug = async (slug) => {
        const article = await prisma.knowledgeArticle.findUnique({
            where: { slug },
            include: {
                category: {
                    select: { slug: true, title: true },
                },
            },
        });

        if (!article || article.status !== "PUBLISHED") {
            return null;
        }

        // Incrémenter les vues (fire-and-forget)
        prisma.knowledgeArticle
            .update({
                where: { id: article.id },
                data: { views: { increment: 1 } },
            })
            .catch(() => { });

        return article;
    };

    submitFeedback = async (slug, helpful) => {
        const article = await prisma.knowledgeArticle.findUnique({
            where: { slug },
            select: { id: true },
        });

        if (!article) return null;

        return prisma.knowledgeArticle.update({
            where: { id: article.id },
            data: helpful
                ? { helpful: { increment: 1 } }
                : { notHelpful: { increment: 1 } },
        });
    };

    search = async (query, limit = 10) => {
        // Log la recherche (pour l'IA future)
        prisma.knowledgeSearchLog
            .create({
                data: {
                    query,
                    results: 0, // mis à jour après
                },
            })
            .catch(() => { });

        const results = await prisma.knowledgeArticle.findMany({
            where: {
                status: "PUBLISHED",
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { excerpt: { contains: query, mode: "insensitive" } },
                    { content: { contains: query, mode: "insensitive" } },
                ],
            },
            take: limit,
            select: {
                slug: true,
                title: true,
                excerpt: true,
                category: { select: { slug: true, title: true } },
            },
        });

        return results;
    };
};

module.exports = new KnowledgeRepository();