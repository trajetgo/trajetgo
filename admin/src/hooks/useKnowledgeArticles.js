import React from 'react';

import service from "../services/knowledge.service";
import { useMemo } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const SORT_ACCESSORS = {
    title: (a) => (a.title ?? "").toLowerCase(),
    category: (a) => (a.category?.title ?? "").toLowerCase(),
    status: (a) => a.status ?? "",
    views: (a) => a.views ?? 0,
    publishedAt: (a) => new Date(a.publishedAt ?? 0).getTime(),
    updatedAt: (a) => new Date(a.updatedAt ?? 0).getTime(),
};

export default function useKnowledgeArticles() {

    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState("");
    const [articles, setArticles] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [categoryFilter, setCategoryFilter] = useState("ALL");

    const [sort, setSort] = useState({
        key: "updatedAt",
        direction: "desc",
    });

    /* ---------- Chargement ---------- */

    const loadArticles = useCallback(async () => {
        setLoading(true);
        setServerError("");

        try {
            const result = await service.listArticles();

            if (!result.success) {
                setServerError(
                    result.message || "Impossible de charger les articles."
                );
                setArticles([]);
                return;
            }

            setArticles(result.data?.items ?? []);
        } catch (error) {
            setServerError(
                error.message || "Impossible de charger les articles."
            );
            setArticles([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadArticles();
    }, [loadArticles]);

    /* ---------- Tri ---------- */

    const handleSort = useCallback((key) => {
        setSort((prev) => ({
            key,
            direction:
                prev.key === key && prev.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    }, []);

    /* ---------- Filtrage + tri ---------- */

    const filteredArticles = useMemo(() => {
        let data = [...articles];

        if (statusFilter !== "ALL") {
            data = data.filter((a) => a.status === statusFilter);
        }

        if (categoryFilter !== "ALL") {
            data = data.filter((a) => a.category?.slug === categoryFilter);
        }

        const term = search.trim().toLowerCase();

        if (term) {
            data = data.filter((a) =>
                [a.title, a.excerpt, a.category?.title]
                    .filter(Boolean)
                    .some((v) => String(v).toLowerCase().includes(term))
            );
        }

        const accessor =
            SORT_ACCESSORS[sort.key] ?? ((a) => a[sort.key]);

        data.sort((a, b) => {
            const aVal = accessor(a);
            const bVal = accessor(b);

            if (aVal == null) return 1;
            if (bVal == null) return -1;

            if (aVal < bVal) return sort.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sort.direction === "asc" ? 1 : -1;
            return 0;
        });

        return data;
    }, [articles, search, statusFilter, categoryFilter, sort]);

    /* ---------- Compteurs ---------- */

    const counts = useMemo(
        () => ({
            all: articles.length,
            draft: articles.filter((a) => a.status === "DRAFT").length,
            published: articles.filter((a) => a.status === "PUBLISHED").length,
            archived: articles.filter((a) => a.status === "ARCHIVED").length,
        }),
        [articles]
    );

    /* ---------- Actions ---------- */

    const publishArticle = async (id) => {
        const result = await service.publishArticle(id);

        setArticles((prev) =>
            prev.map((a) =>
                a.id === id
                    ? { ...a, status: "PUBLISHED", publishedAt: new Date() }
                    : a
            )
        );

        return result;
    };

    const archiveArticle = async (id) => {
        const result = await service.archiveArticle(id);

        setArticles((prev) =>
            prev.map((a) =>
                a.id === id ? { ...a, status: "ARCHIVED" } : a
            )
        );

        return result;
    };

    const deleteArticle = async (id) => {
        await service.deleteArticle(id);
        setArticles((prev) => prev.filter((a) => a.id !== id));
    };

    return {
        loading,
        serverError,
        articles,
        filteredArticles,
        counts,

        search,
        setSearch,

        statusFilter,
        setStatusFilter,

        categoryFilter,
        setCategoryFilter,

        sort,
        handleSort,

        publishArticle,
        archiveArticle,
        deleteArticle,

        refresh: loadArticles,
    };
}
