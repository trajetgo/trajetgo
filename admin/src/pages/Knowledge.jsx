import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    Search,
    X,
    FileText,
    Pencil,
    Trash2,
    Eye,
    Archive,
    Send,
    AlertTriangle,
} from "lucide-react";

import Loading from "@shared/components/Loading";
import Confirm from "@shared/components/feedback/Confirm";
import { useToast } from "@shared/contexts/toast.context";

import useKnowledgeArticles from "../hooks/useKnowledgeArticles";
import { getStatusConfig, getStatusFilters } from "../constants/knowledge.constants";

import "../styles/pages/Knowledge.scss";
import CreateArticleModal from "../components/knowledge/CreateArticleModal";

/* ------------------------------------------------------------------ */

export default function Knowledge() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const {
        loading,
        serverError,
        articles,
        filteredArticles,
        counts,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        sort,
        handleSort,
        publishArticle,
        archiveArticle,
        deleteArticle,
    } = useKnowledgeArticles();

    const [createModal, setCreateModal] = useState(false);

    const [confirmAction, setConfirmAction] = useState(null);
    // { type: "delete" | "archive", article }

    const [actionLoading, setActionLoading] = useState(false);

    if (loading) {
        return <Loading message="Chargement des articles..." />;
    }

    const isEmpty = articles.length === 0;
    const hasActiveFilters = Boolean(search) || statusFilter !== "ALL";

    const handleResetFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
    };

    /* ---------- Actions ---------- */

    const handlePublish = async (article) => {
        try {
            await publishArticle(article.id);
            showToast("success", "Article publié", `"${article.title}" est maintenant en ligne.`);
        } catch (error) {
            showToast("error", "Erreur", error.message || "Impossible de publier l'article.");
        }
    };

    const handleConfirmAction = async () => {
        if (!confirmAction) return;

        setActionLoading(true);

        try {
            if (confirmAction.type === "delete") {
                await deleteArticle(confirmAction.article.id);
                showToast("success", "Article supprimé", "");
            } else if (confirmAction.type === "archive") {
                await archiveArticle(confirmAction.article.id);
                showToast("success", "Article archivé", "");
            }

            setConfirmAction(null);
        } catch (error) {
            showToast("error", "Erreur", error.message || "Action impossible.");
        } finally {
            setActionLoading(false);
        }
    };

    /* ---------- Rendu ---------- */

    return (
        <div className="knowledge">
            {/* ---------- Header ---------- */}

            <header className="knowledge__header">
                <div>
                    <h1>Base de connaissances</h1>
                    <p>
                        Rédigez et gérez les articles du centre d'aide.
                    </p>
                </div>

                <button
                    type="button"
                    className="knowledge__create-button"
                    onClick={() => setCreateModal(true)}
                >
                    <Plus size={18} />
                    Nouvel article
                </button>
            </header>

            {/* ---------- Erreur ---------- */}

            {serverError && (
                <div className="knowledge__error" role="alert">
                    <AlertTriangle size={18} />
                    {serverError}
                </div>
            )}

            {/* ---------- Vide ---------- */}

            {isEmpty ? (
                <section className="knowledge__empty">
                    <FileText size={42} />
                    <h2>Aucun article</h2>
                    <p>
                        Commencez par rédiger un article pour votre centre d'aide.
                    </p>
                    <button
                        type="button"
                        className="knowledge__create-button"
                        onClick={() => setCreateModal(true)}
                    >
                        <Plus size={18} />
                        Créer le premier article
                    </button>
                </section>
            ) : (
                <>
                    {/* ---------- Toolbar ---------- */}

                    <section className="knowledge__toolbar">
                        <div className="knowledge__search">
                            <Search size={16} />
                            <input
                                type="search"
                                placeholder="Rechercher un article..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    aria-label="Effacer"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        <div className="knowledge__filter">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                {getStatusFilters().map((f) => (
                                    <option key={f.value} value={f.value}>
                                        {f.label} ({counts[f.countKey]})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </section>

                    {/* ---------- Résultats ---------- */}

                    {hasActiveFilters && (
                        <div className="knowledge__result-info">
                            {filteredArticles.length} article
                            {filteredArticles.length > 1 ? "s" : ""} trouvé
                            {filteredArticles.length > 1 ? "s" : ""}
                        </div>
                    )}

                    {/* ---------- Table ---------- */}

                    {filteredArticles.length === 0 ? (
                        <section className="knowledge__empty">
                            <Search size={42} />
                            <h3>Aucun article trouvé</h3>
                            <p>Aucun article ne correspond aux filtres.</p>
                            <button
                                type="button"
                                onClick={handleResetFilters}
                            >
                                Réinitialiser les filtres
                            </button>
                        </section>
                    ) : (
                        <div className="knowledge__table-wrap">
                            <table className="knowledge-table">
                                <thead>
                                    <tr>
                                        <th
                                            className="is-sortable"
                                            onClick={() => handleSort("title")}
                                        >
                                            Titre
                                            {sort.key === "title" && (
                                                <span>{sort.direction === "asc" ? "↑" : "↓"}</span>
                                            )}
                                        </th>

                                        <th
                                            className="is-sortable"
                                            onClick={() => handleSort("category")}
                                        >
                                            Catégorie
                                        </th>

                                        <th
                                            className="is-sortable"
                                            onClick={() => handleSort("status")}
                                        >
                                            Statut
                                        </th>

                                        <th
                                            className="is-sortable"
                                            onClick={() => handleSort("views")}
                                        >
                                            Vues
                                        </th>

                                        <th
                                            className="is-sortable"
                                            onClick={() => handleSort("updatedAt")}
                                        >
                                            Modifié
                                        </th>

                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredArticles.map((article) => {
                                        const statusConfig = getStatusConfig(article.status);

                                        return (
                                            <tr key={article.id}>
                                                <td>
                                                    <div className="knowledge-table__title">
                                                        <strong>{article.title}</strong>
                                                        {article.excerpt && (
                                                            <span>{article.excerpt}</span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td>
                                                    {article.category?.title ?? "—"}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`knowledge-table__status knowledge-table__status--${statusConfig.class}`}
                                                    >
                                                        {statusConfig.label}
                                                    </span>
                                                </td>

                                                <td>
                                                    {article.views ?? 0}
                                                </td>

                                                <td>
                                                    {article.updatedAt
                                                        ? new Date(article.updatedAt).toLocaleDateString("fr-FR", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        })
                                                        : "—"}
                                                </td>

                                                <td>
                                                    <div className="knowledge-table__actions">
                                                        <button
                                                            type="button"
                                                            onClick={() => navigate(`/knowledge/${article.id}`)}
                                                            title="Éditer"
                                                        >
                                                            <Pencil size={14} />
                                                        </button>

                                                        {article.status === "PUBLISHED" && (
                                                            <a
                                                                href={`https://support.trajetgo.org/articles/${article.slug}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                title="Voir sur le site"
                                                            >
                                                                <Eye size={14} />
                                                            </a>
                                                        )}

                                                        {article.status === "DRAFT" && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handlePublish(article)}
                                                                title="Publier"
                                                            >
                                                                <Send size={14} />
                                                            </button>
                                                        )}

                                                        {article.status !== "ARCHIVED" && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setConfirmAction({
                                                                        type: "archive",
                                                                        article,
                                                                    })
                                                                }
                                                                title="Archiver"
                                                            >
                                                                <Archive size={14} />
                                                            </button>
                                                        )}

                                                        <button
                                                            type="button"
                                                            className="is-danger"
                                                            onClick={() =>
                                                                setConfirmAction({
                                                                    type: "delete",
                                                                    article,
                                                                })
                                                            }
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            <CreateArticleModal
                isOpen={createModal}
                onClose={() => setCreateModal(false)}
                // onCreated={ }
            />

            {/* ---------- Confirmation ---------- */}

            <Confirm
                open={Boolean(confirmAction)}
                title={
                    confirmAction?.type === "delete"
                        ? "Supprimer l'article"
                        : "Archiver l'article"
                }
                message={
                    confirmAction?.type === "delete"
                        ? `Voulez-vous vraiment supprimer "${confirmAction.article.title}" ? Cette action est irréversible.`
                        : `Archiver "${confirmAction?.article.title}" ? Il ne sera plus visible sur le site, mais restera accessible par lien direct.`
                }
                onConfirm={handleConfirmAction}
                onCancel={() => setConfirmAction(null)}
                loading={actionLoading}
                variant={confirmAction?.type === "delete" ? "danger" : "warning"}
            />
        </div>
    );
}