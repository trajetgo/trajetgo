import { LoaderCircle } from "lucide-react";

import MDEditor from "@uiw/react-md-editor";

import Input from "@shared/components/ui/Input";
import Select from "@shared/components/ui/Select";
import Button from "@shared/components/ui/Button";

import "../../styles/components/knowledge/ArticleEditor.scss";

/* ------------------------------------------------------------------ */

export default function ArticleEditor({
    formData,
    errors,
    touched,
    isSubmitting,
    serverError,
    categories = [],
    categoriesLoading,
    onChange,
    onBlur,
    onSubmit,
    onCancel,
    submitLabel = "Enregistrer",
}) {
    return (
        <form
            className="article-editor"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            {/* ---------- Champs principaux ---------- */}

            <div className="article-editor__fields">
                <Input
                    label="Titre"
                    name="title"
                    value={formData.title}
                    onChange={(e) => onChange("title", e.target.value)}
                    onBlur={() => onBlur("title")}
                    placeholder="Ex. Comment annuler une réservation ?"
                    error={touched.title ? errors.title : ""}
                    required
                />

                <Input
                    label="Slug (URL)"
                    name="slug"
                    value={formData.slug}
                    onChange={(e) =>
                        onChange(
                            "slug",
                            e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9-]+/g, "-")
                                .replace(/^-+|-+$/g, "")
                        )
                    }
                    onBlur={() => onBlur("slug")}
                    placeholder="comment-annuler-reservation"
                    error={touched.slug ? errors.slug : ""}
                    hint="Identifiant unique dans l'URL. Laissez vide pour générer depuis le titre."
                />

                <Input
                    label="Extrait"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => onChange("excerpt", e.target.value)}
                    onBlur={() => onBlur("excerpt")}
                    placeholder="Résumé court affiché dans la liste et les résultats de recherche."
                    error={touched.excerpt ? errors.excerpt : ""}
                />

                <div className="article-editor__row">
                    <Select
                        label="Catégorie"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={(e) => onChange("categoryId", e.target.value)}
                        onBlur={() => onBlur("categoryId")}
                        disabled={categoriesLoading}
                        error={touched.categoryId ? errors.categoryId : ""}
                        required
                        options={categories.map((c) => ({
                            value: c.id,
                            label: c.title,
                        }))}
                    />

                    <Select
                        label="Statut"
                        name="status"
                        value={formData.status}
                        onChange={(e) => onChange("status", e.target.value)}
                        onBlur={() => onBlur("status")}
                        options={[
                            { value: "DRAFT", label: "Brouillon" },
                            { value: "PUBLISHED", label: "Publié" },
                        ]}
                    />
                </div>
            </div>

            {/* ---------- Contenu Markdown ---------- */}

            <div className="article-editor__content">
                <label className="article-editor__label">
                    Contenu
                </label>

                <div
                    className="article-editor__md"
                    data-color-mode="light"
                >
                    <MDEditor
                        value={formData.content}
                        onChange={(value) => onChange("content", value ?? "")}
                        onBlur={() => onBlur("content")}
                        preview="live"
                        height={500}
                        visibleDragbar={false}
                        textareaProps={{
                            placeholder:
                                "# Titre de l'article\n\nÉcrivez votre contenu en Markdown...",
                        }}
                    />
                </div>

                {touched.content && errors.content && (
                    <small className="article-editor__error">
                        {errors.content}
                    </small>
                )}
            </div>

            {/* ---------- Erreur serveur ---------- */}

            {serverError && (
                <div className="article-editor__server-error" role="alert">
                    {serverError}
                </div>
            )}

            {/* ---------- Actions ---------- */}

            <div className="article-editor__actions">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Annuler
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <LoaderCircle size={14} className="is-spinning" />
                            Enregistrement...
                        </>
                    ) : (
                        submitLabel
                    )}
                </Button>
            </div>
        </form>
    );
}