import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/pages/policies/Policies.scss";

export default function CookiePolicy() {

    useEffect(() => {
        document.title = "Politique relative aux cookies | Kilo Go";
    }, []);

    return (
        <main className="legal-page">

            <div className="legal-page__container">

                <header className="legal-page__header">

                    <span className="legal-page__badge">
                        Juridique
                    </span>

                    <h1>
                        Politique relative aux cookies
                    </h1>

                    <p>
                        Dernière mise à jour : 25 juillet 2026
                    </p>

                </header>

                <section>

                    <h2>1. Qu'est-ce qu'un cookie ?</h2>

                    <p>
                        Un cookie est un petit fichier enregistré sur votre
                        appareil lors de votre navigation afin d'améliorer votre
                        expérience utilisateur.
                    </p>

                </section>

                <section>

                    <h2>2. Les cookies utilisés</h2>

                    <ul>

                        <li>Cookies de session.</li>

                        <li>Cookies d'authentification.</li>

                        <li>Cookies de sécurité (CSRF).</li>

                        <li>Cookies de préférences.</li>

                        <li>Cookies statistiques anonymes.</li>

                    </ul>

                </section>

                <section>

                    <h2>3. Pourquoi utilisons-nous des cookies ?</h2>

                    <ul>

                        <li>Maintenir votre connexion.</li>

                        <li>Sécuriser votre compte.</li>

                        <li>Mémoriser vos préférences.</li>

                        <li>Mesurer les performances de la plateforme.</li>

                    </ul>

                </section>

                <section>

                    <h2>4. Gestion des cookies</h2>

                    <p>
                        Vous pouvez configurer votre navigateur afin
                        d'accepter, refuser ou supprimer les cookies.
                    </p>

                    <p>
                        Certaines fonctionnalités de Kilo Go peuvent toutefois
                        ne plus fonctionner correctement si les cookies sont
                        désactivés.
                    </p>

                </section>

                <section>

                    <h2>5. Cookies tiers</h2>

                    <p>
                        Kilo Go peut utiliser des services tiers pour les
                        statistiques, la sécurité ou certaines fonctionnalités.
                    </p>

                </section>

                <section>

                    <h2>6. Modification de cette politique</h2>

                    <p>
                        Cette politique peut être mise à jour afin de refléter
                        les évolutions techniques ou réglementaires.
                    </p>

                </section>

                <section>

                    <h2>7. Contact</h2>

                    <p>

                        Email : privacy@kilogo.com

                    </p>

                </section>

                <footer className="legal-page__footer">

                    <Link to="/legal/terms">
                        Conditions d'utilisation
                    </Link>

                    {" • "}

                    <Link to="/legal/privacy">
                        Politique de confidentialité
                    </Link>

                </footer>

            </div>

        </main>
    );
}