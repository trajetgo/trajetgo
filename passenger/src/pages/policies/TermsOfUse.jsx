import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/pages/policies/Policies.scss";

export default function TermsOfUse() {
    useEffect(() => {
        document.title = "Conditions d'utilisation | Trajet Go";
    }, []);

    return (
        <main className="legal-page">

            <div className="legal-page__container">

                <header className="legal-page__header">

                    <span className="legal-page__badge">
                        Juridique
                    </span>

                    <h1>
                        Conditions d'utilisation
                    </h1>

                    <p>
                        Dernière mise à jour :{" "}
                        <strong>25 juillet 2026</strong>
                    </p>

                </header>

                <section className="legal-page__intro">

                    <p>
                        Bienvenue sur <strong>Trajet Go</strong>, une plateforme
                        numérique dédiée à la recherche, la réservation et la
                        gestion de trajets interurbains.
                    </p>

                    <p>
                        Trajet Go permet aux voyageurs de rechercher des
                        trajets proposés par des compagnies de transport,
                        de réserver une place, d'effectuer un paiement lorsque
                        cette fonctionnalité est disponible et de recevoir un
                        billet électronique.
                    </p>

                    <p>
                        En créant un compte ou en utilisant Trajet Go, vous
                        reconnaissez avoir pris connaissance des présentes
                        Conditions d'utilisation et acceptez de les respecter.
                    </p>

                </section>

                <section>

                    <h2>1. Objet et fonctionnement de Trajet Go</h2>

                    <p>
                        Trajet Go fournit une infrastructure numérique permettant
                        aux voyageurs et aux compagnies de transport interurbain
                        d'utiliser différents services liés aux déplacements.
                    </p>

                    <p>
                        La plateforme peut notamment permettre de :
                    </p>

                    <ul>

                        <li>
                            Rechercher des trajets entre différentes villes.
                        </li>

                        <li>
                            Consulter les horaires, les places disponibles
                            et les tarifs proposés.
                        </li>

                        <li>
                            Réserver une place sur un trajet.
                        </li>

                        <li>
                            Effectuer ou initier un paiement lorsque le service
                            est disponible.
                        </li>

                        <li>
                            Recevoir un billet électronique.
                        </li>

                        <li>
                            Présenter un billet ou un QR code lors de
                            l'embarquement.
                        </li>

                        <li>
                            Consulter l'historique de ses réservations et
                            de ses voyages.
                        </li>

                        <li>
                            Recevoir des notifications relatives aux trajets,
                            réservations et paiements.
                        </li>

                        <li>
                            Participer au programme de fidélité lorsque
                            celui-ci est disponible.
                        </li>

                    </ul>

                    <p>
                        Trajet Go peut également fournir aux compagnies de
                        transport et à leurs agences des outils permettant
                        de gérer leurs véhicules, trajets, agences,
                        réservations, billets et opérations d'embarquement.
                    </p>

                </section>

                <section>

                    <h2>2. Rôle de Trajet Go</h2>

                    <p>
                        Trajet Go fournit une infrastructure technologique
                        destinée à faciliter la gestion et l'accès aux services
                        de transport interurbain.
                    </p>

                    <p>
                        Lorsqu'un trajet est proposé par une compagnie de
                        transport partenaire, cette compagnie reste responsable
                        de l'exploitation du service de transport, notamment
                        de la réalisation du trajet, du véhicule utilisé, de
                        ses horaires et des conditions d'exploitation qui lui
                        sont applicables.
                    </p>

                    <p>
                        Les informations affichées sur la plateforme peuvent
                        dépendre des données fournies ou mises à jour par les
                        compagnies de transport et leurs agences.
                    </p>

                </section>

                <section>

                    <h2>3. Création et utilisation du compte</h2>

                    <p>
                        Certaines fonctionnalités de Trajet Go nécessitent
                        la création d'un compte utilisateur.
                    </p>

                    <p>
                        Lors de l'inscription, l'utilisateur doit fournir des
                        informations exactes, complètes et à jour.
                    </p>

                    <p>
                        Selon les fonctionnalités utilisées, Trajet Go peut
                        demander notamment :
                    </p>

                    <ul>

                        <li>
                            Le nom et le prénom.
                        </li>

                        <li>
                            Une adresse email.
                        </li>

                        <li>
                            Un numéro de téléphone.
                        </li>

                        <li>
                            Des informations nécessaires à la sécurisation
                            du compte.
                        </li>

                        <li>
                            Des informations supplémentaires lorsque leur
                            collecte est nécessaire à un service particulier.
                        </li>

                    </ul>

                    <p>
                        L'utilisateur est responsable de la confidentialité
                        de ses moyens d'authentification et doit signaler
                        toute utilisation non autorisée de son compte.
                    </p>

                </section>

                <section>

                    <h2>4. Réservation d'un trajet</h2>

                    <p>
                        Lorsqu'un utilisateur sélectionne un trajet, les
                        informations affichées peuvent notamment comprendre
                        la ville de départ, la destination, la date, l'heure,
                        le tarif et les disponibilités.
                    </p>

                    <p>
                        Une réservation n'est considérée comme confirmée
                        qu'après validation par le système selon les conditions
                        applicables au trajet et, lorsque cela est requis,
                        après confirmation du paiement.
                    </p>

                    <p>
                        La disponibilité d'une place peut évoluer en fonction
                        des réservations effectuées par les utilisateurs ou
                        des modifications apportées par la compagnie de
                        transport.
                    </p>

                </section>

                <section>

                    <h2>5. Billets électroniques et QR codes</h2>

                    <p>
                        Lorsqu'une réservation est confirmée, Trajet Go peut
                        générer un billet électronique associé à la réservation.
                    </p>

                    <p>
                        Le billet peut contenir notamment un numéro de billet
                        et un QR code permettant de vérifier sa validité.
                    </p>

                    <p>
                        Le billet doit être présenté selon les modalités
                        indiquées par Trajet Go ou la compagnie de transport
                        lors de l'embarquement.
                    </p>

                    <p>
                        Un billet ne doit pas être reproduit, revendu, modifié
                        ou utilisé frauduleusement. Le partage d'un billet
                        avec une autre personne peut entraîner son utilisation
                        par cette personne et empêcher le titulaire initial
                        d'utiliser la réservation.
                    </p>

                </section>

                <section>

                    <h2>6. Embarquement et contrôle des billets</h2>

                    <p>
                        Les compagnies de transport ou les personnes autorisées
                        à effectuer le contrôle peuvent vérifier le billet,
                        le QR code, la réservation et les informations
                        nécessaires à l'embarquement.
                    </p>

                    <p>
                        Un billet peut être refusé lorsqu'il est invalide,
                        annulé, expiré, déjà utilisé ou lorsqu'une anomalie
                        est détectée.
                    </p>

                    <p>
                        Le contrôle d'un billet peut entraîner l'enregistrement
                        de données relatives à l'embarquement afin de maintenir
                        l'intégrité du système de réservation.
                    </p>

                </section>

                <section>

                    <h2>7. Paiements</h2>

                    <p>
                        Lorsque le paiement en ligne est disponible, Trajet Go
                        peut proposer différents moyens de paiement selon les
                        services disponibles et les prestataires intégrés à
                        la plateforme.
                    </p>

                    <p>
                        Le montant applicable à une réservation est celui
                        affiché au moment de la réservation, sous réserve
                        d'erreur manifeste ou de modification communiquée
                        avant la confirmation.
                    </p>

                    <p>
                        Une réservation peut rester en attente tant que le
                        paiement n'a pas été confirmé.
                    </p>

                    <p>
                        Les transactions peuvent être traitées par des
                        prestataires de paiement externes. Leur utilisation
                        peut également être soumise à leurs propres conditions.
                    </p>

                </section>

                <section>

                    <h2>8. Annulations, modifications et remboursements</h2>

                    <p>
                        Les conditions applicables aux annulations,
                        modifications et remboursements peuvent dépendre du
                        trajet, de la compagnie de transport, du type de
                        réservation et des règles applicables au moment de
                        l'achat.
                    </p>

                    <p>
                        Lorsqu'une fonctionnalité d'annulation ou de
                        remboursement est disponible, les conditions
                        applicables sont présentées à l'utilisateur ou
                        communiquées par le service concerné.
                    </p>

                    <p>
                        Une annulation peut entraîner la libération de la
                        place réservée et, selon les conditions applicables,
                        le remboursement total, partiel ou l'absence de
                        remboursement du montant payé.
                    </p>

                </section>

                <section>

                    <h2>9. Obligations de l'utilisateur</h2>

                    <p>
                        L'utilisateur s'engage notamment à :
                    </p>

                    <ul>

                        <li>
                            Fournir des informations exactes lors de
                            l'utilisation de la plateforme.
                        </li>

                        <li>
                            Utiliser uniquement son propre compte.
                        </li>

                        <li>
                            Protéger ses informations d'authentification.
                        </li>

                        <li>
                            Ne pas utiliser Trajet Go à des fins frauduleuses.
                        </li>

                        <li>
                            Ne pas tenter de contourner les mécanismes de
                            sécurité de la plateforme.
                        </li>

                        <li>
                            Ne pas manipuler, reproduire ou falsifier un
                            billet ou un QR code.
                        </li>

                        <li>
                            Respecter les instructions communiquées par la
                            compagnie de transport concernant le voyage et
                            l'embarquement.
                        </li>

                        <li>
                            Respecter les lois et réglementations applicables.
                        </li>

                    </ul>

                </section>

                <section>

                    <h2>10. Compagnies de transport et agences</h2>

                    <p>
                        Les compagnies de transport et leurs agences utilisant
                        Trajet Go doivent fournir des informations exactes
                        concernant leurs services, notamment les trajets,
                        horaires, véhicules, tarifs et disponibilités.
                    </p>

                    <p>
                        Elles sont responsables des informations et opérations
                        qu'elles saisissent ou réalisent dans leur espace
                        professionnel.
                    </p>

                    <p>
                        Trajet Go peut suspendre ou limiter l'accès d'une
                        compagnie, d'une agence ou d'un utilisateur lorsque
                        cela est nécessaire pour des raisons de sécurité,
                        de fraude, de non-respect des présentes conditions
                        ou d'utilisation abusive de la plateforme.
                    </p>

                </section>

                <section>

                    <h2>11. Programme de fidélité</h2>

                    <p>
                        Trajet Go peut proposer un programme de fidélité
                        permettant aux utilisateurs de cumuler des points
                        ou de bénéficier d'avantages selon les conditions
                        applicables.
                    </p>

                    <p>
                        Les modalités d'acquisition, d'utilisation, de
                        conversion ou d'expiration des points peuvent être
                        définies séparément et évoluer dans le temps.
                    </p>

                    <p>
                        Les points et avantages de fidélité ne constituent pas
                        nécessairement une valeur monétaire et ne peuvent être
                        cédés ou convertis en espèces sauf indication contraire.
                    </p>

                </section>

                <section>

                    <h2>12. Disponibilité du service</h2>

                    <p>
                        Trajet Go met en œuvre des moyens raisonnables pour
                        assurer la disponibilité et le bon fonctionnement
                        de ses services.
                    </p>

                    <p>
                        Toutefois, l'accès à la plateforme peut être
                        temporairement interrompu notamment en raison
                        d'opérations de maintenance, de problèmes techniques,
                        de défaillances de réseaux ou de circonstances
                        indépendantes de notre volonté.
                    </p>

                </section>

                <section>

                    <h2>13. Propriété intellectuelle</h2>

                    <p>
                        La plateforme Trajet Go, son interface, son identité
                        visuelle, ses contenus, ses logiciels, ses éléments
                        graphiques et les technologies qui la composent sont
                        protégés par les droits applicables.
                    </p>

                    <p>
                        Toute reproduction, modification, distribution ou
                        exploitation non autorisée de ces éléments est
                        interdite.
                    </p>

                </section>

                <section>

                    <h2>14. Suspension et fermeture d'un compte</h2>

                    <p>
                        Trajet Go peut suspendre ou fermer un compte lorsque
                        cela est nécessaire, notamment en cas de fraude,
                        d'utilisation abusive, de violation des présentes
                        Conditions d'utilisation ou de comportement susceptible
                        de compromettre la sécurité de la plateforme ou
                        d'autres utilisateurs.
                    </p>

                    <p>
                        L'utilisateur peut également demander la fermeture
                        de son compte, sous réserve des obligations de
                        conservation qui peuvent continuer à s'appliquer à
                        certaines données.
                    </p>

                </section>

                <section>

                    <h2>15. Protection des données personnelles</h2>

                    <p>
                        Les données personnelles utilisées dans le cadre de
                        Trajet Go sont traitées conformément à notre
                        <Link to="/legal/privacy">
                            {" "}Politique de confidentialité
                        </Link>.
                    </p>

                    <p>
                        Cette politique décrit notamment les catégories de
                        données collectées, les finalités des traitements,
                        les destinataires éventuels des données et les droits
                        des utilisateurs.
                    </p>

                </section>

                <section>

                    <h2>16. Modification des Conditions d'utilisation</h2>

                    <p>
                        Trajet Go peut faire évoluer les présentes Conditions
                        d'utilisation afin de tenir compte de l'évolution
                        de ses services, de ses fonctionnalités ou des
                        exigences applicables.
                    </p>

                    <p>
                        La date de dernière mise à jour est indiquée en haut
                        de cette page.
                    </p>

                    <p>
                        Lorsque cela est nécessaire, les utilisateurs peuvent
                        être informés des modifications importantes par les
                        moyens de communication disponibles.
                    </p>

                </section>

                <section>

                    <h2>17. Contact</h2>

                    <p>
                        Pour toute question concernant les présentes
                        Conditions d'utilisation, vous pouvez nous contacter :
                    </p>

                    <ul>

                        <li>
                            Email juridique : legal@trajet-go.com
                        </li>

                        <li>
                            Support : support@trajet-go.com
                        </li>

                        <li>
                            Site : trajet-go.com
                        </li>

                    </ul>

                </section>

                <footer className="legal-page__footer">

                    <p>
                        Pour en savoir davantage, consultez également notre{" "}
                        <Link to="/legal/privacy">
                            Politique de confidentialité
                        </Link>
                        {" "}ainsi que notre{" "}
                        <Link to="/legal/cookies">
                            Politique relative aux cookies
                        </Link>.
                    </p>

                </footer>

            </div>

        </main>
    );
}