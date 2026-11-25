import { useCallback, useEffect, useState } from "react";

import service from "../services/knowledge.service";

const INITIAL_FORM = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    categoryId: "",
    status: "DRAFT",
};

function slugify(text) {
    return String(text)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function useArticleEditor({ articleId } = {}) {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    /* ---------- Catégories ---------- */

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const result = await service.listCategories();

                if (!cancelled) {
                    setCategories(result.data ?? []);
                }
            } catch {
                // silencieux : le formulaire affichera une liste vide
            } finally {
                if (!cancelled) setCategoriesLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    /* ---------- Chargement de l'article (édition) ---------- */

    useEffect(() => {
        if (!articleId) return;

        let cancelled = false;

        const load = async () => {
            try {
                const result = await service.getArticle(articleId);

                if (!cancelled && result.data) {
                    setFormData({
                        title: result.data.title ?? "",
                        slug: result.data.slug ?? "",
                        excerpt: result.data.excerpt ?? "",
                        content: result.data.content ?? "",
                        categoryId: result.data.categoryId ?? "",
                        status: result.data.status ?? "DRAFT",
                    });
                }
            } catch (error) {
                if (!cancelled) {
                    setServerError(
                        error.message || "Impossible de charger l'article."
                    );
                }
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [articleId]);

    /* ---------- Handlers ---------- */

    const onChange = useCallback((field, value) => {
        setFormData((prev) => {
            const next = { ...prev, [field]: value };

            // Auto-génération du slug depuis le titre
            if (field === "title" && !prev.slug) {
                next.slug = slugify(value);
            }

            return next;
        });

        setErrors((prev) => ({ ...prev, [field]: "" }));
        setServerError("");
    }, []);

    const onBlur = useCallback((field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    }, []);

    /* ---------- Validation ---------- */

    const validate = () => {
        const next = {};

        if (!formData.title.trim()) {
            next.title = "Le titre est obligatoire.";
        }

        if (!formData.slug.trim()) {
            next.slug = "Le slug est obligatoire.";
        } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
            next.slug = "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets.";
        }

        if (!formData.categoryId) {
            next.categoryId = "La catégorie est obligatoire.";
        }

        if (!formData.content.trim()) {
            next.content = "Le contenu est obligatoire.";
        }

        setErrors(next);

        return Object.keys(next).length === 0;
    };

    /* ---------- Submit ---------- */

    const submit = async () => {
        setServerError("");

        setTouched({
            title: true,
            slug: true,
            categoryId: true,
            content: true,
        });

        if (!validate()) {
            return { success: false, validation: true };
        }

        setIsSubmitting(true);

        try {
            const payload = {
                title: formData.title.trim(),
                slug: formData.slug.trim(),
                excerpt: formData.excerpt.trim() || null,
                content: formData.content,
                categoryId: formData.categoryId,
                status: formData.status,
            };

            const result = articleId
                ? await service.updateArticle(articleId, payload)
                : await service.createArticle(payload);

            return { success: true, data: result.data };
        } catch (error) {
            setServerError(
                error.message || "Impossible d'enregistrer l'article."
            );
            return { success: false, error };
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM);
        setErrors({});
        setTouched({});
        setServerError("");
    };

    return {
        formData,
        errors,
        touched,
        isSubmitting,
        serverError,
        categories,
        categoriesLoading,
        onChange,
        onBlur,
        submit,
        resetForm,
    };
}