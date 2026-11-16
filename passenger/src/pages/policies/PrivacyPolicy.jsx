import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/pages/policies/Policies.scss";

export default function PrivacyPolicy() {
    useEffect(() => {
        document.title = "Politique de confidentialité | Trajet Go";
    }, []);

    return (
        <main className="legal-page">

            <div className="legal-page__container">

                <header className="legal-page__header">

                    <span className="legal-page__badge">
                        Juridique
                    </span>

                    <h1>
                        Politique de confidentialité
                    </h1>

                    <p>
                        Dernière mise à jour : 25 juillet 2026
                    </p>

                </header>

                <section>

                    <h2>1. Notre engagement</h2>

                    <p>
                        Chez Trajet Go, nous accordons une grande importance
                        à la protection de vos données personnelles et au
                        respect de votre vie privée.
                    </p>

                    <p>
                        Cette politique de confidentialité explique quelles
                        données nous pouvons collecter lorsque vous utilisez
                        Trajet Go, pourquoi nous les utilisons, comment nous
                        les protégeons et quels sont vos droits.
                    </p>

                </section>

                <section>

                    <h2>2. Données que nous pouvons collecter</h2>

                    <p>
                        Selon les fonctionnalités que vous utilisez, Trajet Go
                        peut collecter différentes catégories de données :
                    </p>

                    <ul>

                        <li>
                            Nom et prénom
                        </li>

                        <li>
                            Adresse email
                        </li>

                        <li>
                            Numéro de téléphone
                        </li>

                        <li>
                            Informations nécessaires à la création et à la
                            gestion de votre compte
                        </li>

                        <li>
                            Informations relatives à vos réservations et
                            billets
                        </li>

                        <li>
                            Informations relatives à vos trajets et voyages
                        </li>

                        <li>
                            Informations relatives aux paiements et aux
                            transactions
                        </li>

                        <li>
                            Informations relatives à l'utilisation de votre
                            billet et à l'embarquement
                        </li>

                        <li>
                            Données nécessaires au programme de fidélité,
                            lorsque cette fonctionnalité est utilisée
                        </li>

                        <li>
                            Données techniques telles que l'adresse IP,
                            le navigateur, le type d'appareil et les journaux
                            de connexion
                        </li>

                        <li>
                            Données relatives à vos interactions avec la
                            plateforme
                        </li>

                    </ul>

                </section>

                <section>

                    <h2>3. Utilisation de vos données</h2>

                    <p>
                        Nous utilisons vos données notamment pour :
                    </p>

                    <ul>

                        <li>
                            Créer et gérer votre compte Trajet Go.
                        </li>

                        <li>
                            Vous permettre de rechercher des trajets.
                        </li>

                        <li>
                            Traiter vos réservations et vos billets.
                        </li>

                        <li>
                            Faciliter et sécuriser les paiements.
                        </li>

                        <li>
                            Générer et vérifier les billets électroniques
                            et leurs QR codes.
                        </li>

                        <li>
                            Permettre le contrôle des embarquements.
                        </li>

                        <li>
                            Vous envoyer des notifications relatives à vos
                            réservations, paiements, trajets et billets.
                        </li>

                        <li>
                            Gérer le programme de fidélité et les avantages
                            associés.
                        </li>

                        <li>
                            Sécuriser la plateforme et prévenir les activités
                            frauduleuses.
                        </li>

                        <li>
                            Diagnostiquer les problèmes techniques et
                            améliorer nos services.
                        </li>

                        <li>
                            Respecter nos obligations légales et
                            réglementaires.
                        </li>

                    </ul>

                </section>

                <section>

                    <h2>4. Réservations et données de voyage</h2>

                    <p>
                        Lorsque vous effectuez une réservation, certaines
                        informations nécessaires à l'organisation de votre
                        voyage peuvent être associées à votre compte ou à votre
                        réservation.
                    </p>

                    <p>
                        Ces informations peuvent notamment comprendre le
                        trajet choisi, la date et l'heure du départ, la place
                        réservée, le billet, le statut de la réservation et
                        les informations nécessaires au contrôle de
                        l'embarquement.
                    </p>

                    <p>
                        Lorsque cela est nécessaire à l'exécution du service,
                        certaines informations peuvent être accessibles à la
                        compagnie de transport, à ses agences ou aux personnes
                        chargées du contrôle des billets.
                    </p>

                </section>

                <section>

                    <h2>5. Paiements</h2>

                    <p>
                        Les paiements effectués sur Trajet Go peuvent être
                        traités par des prestataires de paiement ou des
                        institutions financières partenaires.
                    </p>

                    <p>
                        Trajet Go peut conserver certaines informations
                        relatives à une transaction, telles que son montant,
                        son statut, son moyen de paiement et les références
                        nécessaires au suivi de la transaction.
                    </p>

                    <p>
                        Les informations sensibles permettant d'effectuer
                        directement une transaction sont traitées selon les
                        mécanismes de sécurité mis en place par les
                        prestataires concernés.
                    </p>

                </section>

                <section>

                    <h2>6. Notifications et communications</h2>

                    <p>
                        Trajet Go peut utiliser vos coordonnées pour vous
                        transmettre des informations nécessaires au
                        fonctionnement du service.
                    </p>

                    <p>
                        Ces communications peuvent notamment concerner :
                    </p>

                    <ul>

                        <li>
                            la création ou la modification de votre compte ;
                        </li>

                        <li>
                            vos réservations ;
                        </li>

                        <li>
                            vos paiements ;
                        </li>

                        <li>
                            vos billets ;
                        </li>

                        <li>
                            vos départs et trajets ;
                        </li>

                        <li>
                            les informations relatives à l'embarquement ;
                        </li>

                        <li>
                            les annulations ou remboursements ;
                        </li>

                        <li>
                            la sécurité de votre compte.
                        </li>

                    </ul>

                </section>

                <section>

                    <h2>7. Partage des données</h2>

                    <p>
                        Trajet Go ne vend pas vos données personnelles.
                    </p>

                    <p>
                        Certaines données peuvent toutefois être communiquées
                        à des tiers lorsque cela est nécessaire au
                        fonctionnement de la plateforme.
                    </p>

                    <p>
                        Cela peut notamment inclure les compagnies de
                        transport utilisant Trajet Go, leurs agences, les
                        prestataires de paiement, les prestataires techniques
                        et les fournisseurs de services de communication,
                        ainsi que les autorités compétentes lorsque la loi
                        l'exige.
                    </p>

                    <p>
                        Nous cherchons à limiter les informations communiquées
                        à celles qui sont nécessaires à la finalité concernée.
                    </p>

                </section>

                <section>

                    <h2>8. Sécurité des données</h2>

                    <p>
                        Nous mettons en œuvre des mesures techniques et
                        organisationnelles destinées à protéger vos données
                        contre les accès non autorisés, la perte,
                        l'altération, la divulgation ou l'utilisation
                        abusive.
                    </p>

                    <p>
                        L'accès aux données peut notamment être contrôlé selon
                        le rôle de l'utilisateur et les besoins liés au
                        fonctionnement de Trajet Go.
                    </p>

                </section>

                <section>

                    <h2>9. Conservation des données</h2>

                    <p>
                        Nous conservons les données personnelles pendant la
                        durée nécessaire aux finalités pour lesquelles elles
                        ont été collectées, au fonctionnement de nos services,
                        à la sécurité de la plateforme et au respect de nos
                        obligations légales.
                    </p>

                    <p>
                        Certaines données liées aux réservations, paiements,
                        billets ou opérations effectuées sur la plateforme
                        peuvent être conservées pendant une période plus
                        longue lorsque cela est nécessaire pour répondre à
                        des obligations légales, comptables ou à la gestion
                        de litiges.
                    </p>

                </section>

                <section>

                    <h2>10. Vos droits</h2>

                    <p>
                        Selon la réglementation applicable, vous pouvez
                        notamment disposer des droits suivants concernant vos
                        données personnelles :
                    </p>

                    <ul>

                        <li>
                            accéder à vos données personnelles ;
                        </li>

                        <li>
                            demander la rectification de données inexactes ;
                        </li>

                        <li>
                            demander la suppression de certaines données ;
                        </li>

                        <li>
                            demander la limitation de certains traitements ;
                        </li>

                        <li>
                            demander une copie de certaines données ;
                        </li>

                        <li>
                            vous opposer à certains traitements lorsque les
                            conditions applicables sont réunies.
                        </li>

                    </ul>

                    <p>
                        L'exercice de certains droits peut être limité lorsque
                        la conservation ou le traitement des données est
                        nécessaire au respect d'une obligation légale ou à la
                        protection de nos droits.
                    </p>

                </section>

                <section>

                    <h2>11. Cookies et technologies similaires</h2>

                    <p>
                        Trajet Go peut utiliser des cookies et des technologies
                        similaires pour assurer le fonctionnement de la
                        plateforme, maintenir les sessions utilisateurs,
                        renforcer la sécurité et, lorsque cela est applicable,
                        mesurer l'utilisation de nos services.
                    </p>

                    <p>
                        Pour plus d'informations, consultez notre
                        <Link to="/legal/cookies">
                            {" "}politique relative aux cookies
                        </Link>.
                    </p>

                </section>

                <section>

                    <h2>12. Modifications de cette politique</h2>

                    <p>
                        Nous pouvons mettre à jour cette politique de
                        confidentialité afin de tenir compte de l'évolution
                        de Trajet Go, de nos services ou des exigences
                        applicables.
                    </p>

                    <p>
                        La date de dernière mise à jour affichée en haut de
                        cette page permet d'identifier la version actuellement
                        applicable.
                    </p>

                </section>

                <section>

                    <h2>13. Contact</h2>

                    <p>
                        Pour toute question relative à la protection de vos
                        données personnelles ou pour exercer vos droits, vous
                        pouvez nous contacter à l'adresse :
                    </p>

                    <p>
                        <strong>
                            privacy@trajet-go.com
                        </strong>
                    </p>

                </section>

                <footer className="legal-page__footer">

                    <Link to="/legal/terms">
                        Conditions d'utilisation
                    </Link>

                    {" • "}

                    <Link to="/legal/cookies">
                        Politique relative aux cookies
                    </Link>

                </footer>

            </div>

        </main>
    );
}