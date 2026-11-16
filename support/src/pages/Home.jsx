import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Search,
    Ticket,
    CreditCard,
    Bus,
    User,
    ArrowRight,
} from "lucide-react";

// import "../styles/pages/Home.scss";

/* ------------------------------------------------------------------ */
/* Données — à remplacer par un fetch API                              */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
    {
        slug: "reservations",
        title: "Réservations",
        description: "Modifier, annuler ou retrouver une réservation.",
        icon: Ticket,
        articles: 12,
    },
    {
        slug: "paiements",
        title: "Paiements",
        description: "Moyens de paiement, remboursements, factures.",
        icon: CreditCard,
        articles: 8,
    },
    {
        slug: "voyages",
        title: "Voyages & bus",
        description: "Horaires, bagages, retards, changements de bus.",
        icon: Bus,
        articles: 15,
    },
    {
        slug: "compte",
        title: "Mon compte",
        description: "Connexion, mot de passe, vérification du téléphone.",
        icon: User,
        articles: 9,
    },
];

const POPULAR_ARTICLES = [
    {
        slug: "comment-annuler-reservation",
        title: "Comment annuler une réservation ?",
        category: "Réservations",
    },
    {
        slug: "obtenir-remboursement",
        title: "Comment obtenir un remboursement ?",
        category: "Paiements",
    },
    {
        slug: "retrouver-mon-billet",
        title: "Où retrouver mon billet et mon QR code ?",
        category: "Voyages & bus",
    },
    {
        slug: "verifier-telephone",
        title: "Comment vérifier mon numéro de téléphone ?",
        category: "Mon compte",
    },
];

/* ------------------------------------------------------------------ */

export default function Home() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const handleSearch = (event) => {
        event.preventDefault();

        const term = query.trim();
        if (!term) return;

        navigate(`/search?q=${encodeURIComponent(term)}`);
    };

    return (
        <div className="support-home">
            {/* ---------- Hero ---------- */}

            <section className="support-home__hero">
                <h1>Comment pouvons-nous vous aider ?</h1>

                <p>
                    Trouvez une réponse dans notre centre d'aide, ou
                    contactez notre équipe.
                </p>

                <form className="support-home__search" onSubmit={handleSearch}>
                    <Search size={18} aria-hidden="true" />
                    <input
                        type="search"
                        placeholder="Rechercher un article, une question..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Rechercher dans le centre d'aide"
                    />
                </form>
            </section>

            {/* ---------- Catégories ---------- */}

            <section className="support-home__section">
                <h2>Parcourir par catégorie</h2>

                <div className="support-home__categories">
                    {CATEGORIES.map(({ slug, title, description, icon: Icon, articles }) => (
                        <Link
                            key={slug}
                            to={`/categories/${slug}`}
                            className="support-home__category"
                        >
                            <div className="support-home__category-icon">
                                <Icon size={22} />
                            </div>

                            <div>
                                <strong>{title}</strong>
                                <p>{description}</p>
                                <span>{articles} articles</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ---------- Articles populaires ---------- */}

            <section className="support-home__section">
                <h2>Articles populaires</h2>

                <ul className="support-home__articles">
                    {POPULAR_ARTICLES.map((article) => (
                        <li key={article.slug}>
                            <Link
                                to={`/articles/${article.slug}`}
                                className="support-home__article"
                            >
                                <div>
                                    <span>{article.category}</span>
                                    <strong>{article.title}</strong>
                                </div>
                                <ArrowRight size={16} />
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            {/* ---------- Contact ---------- */}

            <section className="support-home__cta">
                <div>
                    <h2>Vous ne trouvez pas de réponse ?</h2>
                    <p>Notre équipe vous répond sous 24h ouvrées.</p>
                </div>

                <Link to="/contact" className="support-home__cta-btn">
                    Nous contacter
                    <ArrowRight size={16} />
                </Link>
            </section>
        </div>
    );
}