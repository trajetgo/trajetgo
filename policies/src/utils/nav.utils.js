import { Link } from "react-router-dom";
import {
    ShieldCheck,
    Handshake,
    Cookie,
    Building2,
    Home,
} from "lucide-react";

export const NAV_ITEMS = [
    {
        path: "/",
        label: "Aperçu",
        icon: Home,
    },
    {
        path: "/terms/passengers",
        label: "Voyageurs",
        icon: Handshake,
    },
    {
        path: "/terms/companies",
        label: "Compagnies",
        icon: Building2,
    },
    {
        path: "/privacy",
        label: "Confidentialité",
        icon: ShieldCheck,
    },
    {
        path: "/cookies",
        label: "Cookies",
        icon: Cookie,
    },
];

export const POLICY_ITEMS = [
    {
        id: "terms-passengers",
        path: "/terms/passengers",
        label: "Conditions voyageurs",
        description:
            "Consultez les règles applicables à la recherche de voyages, aux réservations, aux achats de billets et aux déplacements.",
        icon: Handshake,
    },
    {
        id: "terms-companies",
        path: "/terms/companies",
        label: "Conditions des compagnies",
        description:
            "Découvrez les conditions d'accès et d'utilisation des services professionnels Trajet Go par les compagnies de transport et leurs équipes.",
        icon: Building2,
    },
    {
        id: "privacy",
        path: "/privacy",
        label: "Politique de confidentialité",
        description:
            "Découvrez comment Trajet Go collecte, utilise, conserve et protège vos données personnelles.",
        icon: ShieldCheck,
    },
    {
        id: "cookies",
        path: "/cookies",
        label: "Politique relative aux cookies",
        description:
            "Comprenez comment les cookies et technologies similaires sont utilisés sur nos plateformes.",
        icon: Cookie,
    },
];

export const PRIVACY_SECTIONS = [
    {
        id: "intro",
        title: "1. Introduction",
        content: (
            <>
                <p>
                    La présente politique de confidentialité décrit la manière
                    dont Trajet Go collecte, utilise, conserve et protège les
                    données à caractère personnel des personnes qui utilisent
                    ses services.
                </p>
                <p>
                    Trajet Go est une plateforme numérique dédiée à la
                    digitalisation du transport interurbain. Elle met à
                    disposition des passagers, des compagnies de transport et
                    de leurs collaborateurs différents outils permettant
                    notamment de rechercher des voyages, effectuer des
                    réservations, acheter des billets, gérer des agences,
                    organiser les opérations de transport et contrôler les
                    embarquements.
                </p>
                <p>
                    La protection des données personnelles constitue un
                    engagement important de Trajet Go. Nous nous efforçons de
                    traiter les informations personnelles de manière
                    transparente, confidentielle et sécurisée, conformément à
                    la réglementation applicable.
                </p>
            </>
        ),
    },
    {
        id: "responsible",
        title: "2. Responsable du traitement",
        content: (
            <>
                <p>
                    Les traitements de données réalisés dans le cadre des
                    services propres à Trajet Go sont mis en œuvre par la
                    société exploitant la plateforme sous le nom commercial
                    Trajet Go.
                </p>
                <ul>
                    <li><strong>Dénomination sociale :</strong> TRAJETGO</li>
                    <li><strong>Nom commercial :</strong> Trajet Go</li>
                    <li><strong>Forme juridique :</strong> SARL</li>
                    <li style={{ color: "red", background: "#FFFF00" }}><strong>Adresse du siège social :</strong> [À compléter]</li>
                    <li><strong>Pays :</strong> Côte d'Ivoire</li>
                    <li><strong>Email :</strong> info@trajetgo.net</li>
                    <li><strong>Site web :</strong> https://trajetgo.net</li>
                </ul>
                <p>
                    Certaines compagnies de transport utilisant Trajet Go
                    peuvent également agir en qualité de responsables de
                    traitement indépendants pour les données qu'elles
                    collectent et utilisent dans le cadre de leurs propres
                    activités.
                </p>
                <p>
                    Selon les traitements concernés, Trajet Go peut intervenir
                    en qualité de sous-traitant pour le compte de ces
                    compagnies, notamment lorsqu'elle héberge et traite leurs
                    données conformément à leurs instructions.
                </p>
            </>
        ),
    },
    {
        id: "persons-concerned",
        title: "3. Personnes concernées",
        content: (
            <>
                <p>La présente politique concerne notamment :</p>
                <ul>
                    <li>Les passagers et utilisateurs de l'application Trajet Go ;</li>
                    <li>Les visiteurs du site web ;</li>
                    <li>Les représentants des compagnies de transport ;</li>
                    <li>Les administrateurs et gestionnaires de compagnies ;</li>
                    <li>Les agents travaillant dans les agences ;</li>
                    <li>Les contrôleurs et membres du personnel autorisés ;</li>
                    <li>Les personnes qui contactent Trajet Go pour obtenir une assistance.</li>
                </ul>
            </>
        ),
    },
    {
        id: "data-collected",
        title: "4. Catégories de données collectées",
        content: (
            <>
                <p>
                    Selon les services utilisés et les fonctionnalités activées,
                    Trajet Go peut collecter les catégories de données suivantes.
                </p>

                <h3>4.1. Données d'identification</h3>
                <ul>
                    <li>Nom et prénom ;</li>
                    <li>Numéro de téléphone ;</li>
                    <li>Adresse électronique ;</li>
                    <li>Photo de profil, lorsque cette fonctionnalité est utilisée ;</li>
                    <li>Identifiant de compte ;</li>
                    <li>Rôle ou fonction dans une organisation.</li>
                </ul>

                <h3>4.2. Données relatives aux réservations et aux voyages</h3>
                <ul>
                    <li>Villes de départ et de destination ;</li>
                    <li>Dates et heures de voyage ;</li>
                    <li>Informations relatives aux billets ;</li>
                    <li>Numéros de sièges réservés ;</li>
                    <li>Historique des réservations ;</li>
                    <li>Statut des réservations et des billets ;</li>
                    <li>Informations nécessaires à l'identification du passager lors de l'embarquement.</li>
                </ul>

                <h3>4.3. Données relatives aux paiements</h3>
                <p>
                    Les paiements effectués par l'intermédiaire de Trajet Go
                    sont traités par des prestataires de paiement externes.
                </p>
                <p>
                    Trajet Go peut traiter certaines informations nécessaires
                    à la gestion et au suivi des transactions :
                </p>
                <ul>
                    <li>Montant et devise de la transaction ;</li>
                    <li>Moyen de paiement utilisé ;</li>
                    <li>Référence de transaction ;</li>
                    <li>Date et statut du paiement.</li>
                </ul>
                <p>
                    Les données confidentielles de paiement, telles que les
                    codes secrets, mots de passe ou codes de validation, sont
                    destinées à être traitées par les prestataires de paiement
                    concernés.
                </p>

                <h3>4.4. Données relatives aux compagnies et à leur personnel</h3>
                <ul>
                    <li>Les noms et coordonnées des collaborateurs ;</li>
                    <li>Les fonctions et rôles attribués ;</li>
                    <li>Les informations relatives aux agences ;</li>
                    <li>Les informations relatives aux opérations de transport ;</li>
                    <li>Les historiques d'activité sur la plateforme ;</li>
                    <li>Les informations nécessaires à la gestion des accès.</li>
                </ul>

                <h3>4.5. Données techniques et de connexion</h3>
                <ul>
                    <li>Adresse IP ;</li>
                    <li>Type d'appareil et système d'exploitation ;</li>
                    <li>Type et version du navigateur ;</li>
                    <li>Journaux de connexion ;</li>
                    <li>Dates et heures d'accès ;</li>
                    <li>Informations relatives aux erreurs et incidents techniques.</li>
                </ul>

                <h3>4.6. Données de localisation</h3>
                <p>
                    Certaines fonctionnalités de Trajet Go peuvent nécessiter
                    l'accès à la localisation de votre appareil, notamment
                    pour faciliter l'identification d'une agence ou l'utilisation
                    de fonctionnalités géographiques.
                </p>
                <p>
                    L'accès à la localisation est facultatif et intervient
                    uniquement pour les fonctionnalités qui le nécessitent,
                    sous réserve de l'autorisation accordée depuis votre appareil.
                </p>
                <p>
                    Vous pouvez gérer ou retirer cette autorisation à tout
                    moment depuis les paramètres de votre appareil. Le refus
                    de cette autorisation peut empêcher l'utilisation de
                    certaines fonctionnalités dépendant de la localisation.
                </p>
            </>
        ),
    },
    {
        id: "purposes",
        title: "5. Finalités du traitement",
        content: (
            <>
                <p>Les données personnelles sont traitées notamment pour :</p>
                <ul>
                    <li>Créer et gérer les comptes utilisateurs ;</li>
                    <li>Authentifier les utilisateurs et sécuriser les accès ;</li>
                    <li>Permettre la recherche de voyages ;</li>
                    <li>Gérer les réservations et l'émission des billets ;</li>
                    <li>Faciliter le traitement et le suivi des paiements ;</li>
                    <li>Permettre le contrôle des billets et des embarquements ;</li>
                    <li>Assurer la gestion des compagnies, agences, véhicules et collaborateurs ;</li>
                    <li>Fournir une assistance aux utilisateurs ;</li>
                    <li>Prévenir les fraudes et les utilisations abusives ;</li>
                    <li>Détecter et résoudre les incidents techniques ;</li>
                    <li>Améliorer les performances et la qualité des services ;</li>
                    <li>Respecter les obligations légales et réglementaires applicables.</li>
                </ul>
            </>
        ),
    },
    {
        id: "legal-bases",
        title: "6. Fondements des traitements",
        content: (
            <>
                <p>Selon la nature du traitement, les données peuvent être utilisées sur la base :</p>
                <ul>
                    <li>De l'exécution d'un contrat ou de mesures précontractuelles ;</li>
                    <li>Du consentement de la personne concernée, lorsque celui-ci est requis ;</li>
                    <li>Du respect d'une obligation légale ou réglementaire ;</li>
                    <li>De l'intérêt légitime de Trajet Go ou de ses partenaires, dans les limites autorisées.</li>
                </ul>
                <p>
                    Lorsque le traitement repose sur le consentement, la personne
                    concernée peut le retirer dans les conditions prévues par
                    la réglementation, sans remettre en cause la licéité des
                    traitements effectués avant ce retrait.
                </p>
            </>
        ),
    },
    {
        id: "sharing",
        title: "7. Partage et destinataires des données",
        content: (
            <>
                <p>
                    Les données personnelles peuvent être communiquées, dans
                    la limite de ce qui est nécessaire, aux catégories de
                    destinataires suivantes.
                </p>

                <h3>7.1. Compagnies de transport</h3>
                <p>
                    Lorsqu'un passager réserve un voyage auprès d'une compagnie,
                    les informations nécessaires à la gestion de cette réservation
                    peuvent être communiquées à la compagnie concernée.
                </p>

                <h3>7.2. Agents et contrôleurs autorisés</h3>
                <p>
                    Les collaborateurs habilités par une compagnie peuvent
                    accéder aux informations nécessaires à l'exercice de leurs
                    fonctions, notamment pour la gestion des réservations,
                    la billetterie et le contrôle des embarquements.
                </p>

                <h3>7.3. Prestataires techniques et de paiement</h3>
                <p>Trajet Go peut faire appel à des prestataires externes pour :</p>
                <ul>
                    <li>L'hébergement et le stockage des données ;</li>
                    <li>La maintenance et l'exploitation des infrastructures ;</li>
                    <li>Le traitement des paiements ;</li>
                    <li>L'envoi de notifications et de communications ;</li>
                    <li>La sécurité et la surveillance technique ;</li>
                    <li>L'assistance et le support.</li>
                </ul>

                <h3>7.4. Autorités compétentes</h3>
                <p>
                    Certaines informations peuvent être communiquées aux
                    autorités administratives, judiciaires ou réglementaires
                    lorsque la loi l'exige ou lorsqu'une demande légalement
                    valable est formulée.
                </p>

                <p>
                    <strong>
                        Trajet Go ne vend pas les données personnelles de ses
                        utilisateurs à des tiers à des fins commerciales.
                    </strong>
                </p>
            </>
        ),
    },
    {
        id: "conservation",
        title: "8. Durée de conservation",
        content: (
            <>
                <p>
                    Trajet Go conserve les données personnelles pendant une
                    durée proportionnée aux finalités de leur traitement et
                    conformément aux obligations légales et réglementaires
                    applicables.
                </p>
                <p>Les durées de conservation peuvent varier selon :</p>
                <ul>
                    <li>La nature des données ;</li>
                    <li>La finalité du traitement ;</li>
                    <li>La durée d'utilisation du compte ;</li>
                    <li>Les obligations légales et comptables applicables ;</li>
                    <li>Les nécessités de prévention et de gestion des litiges.</li>
                </ul>
                <p>
                    Lorsque les données ne sont plus nécessaires, elles ont
                    vocation à être supprimées, anonymisées ou archivées lorsque
                    leur conservation demeure légalement justifiée.
                </p>
            </>
        ),
    },
    {
        id: "security",
        title: "9. Sécurité des données",
        content: (
            <>
                <p>
                    Trajet Go met en œuvre des mesures techniques et
                    organisationnelles destinées à préserver la confidentialité,
                    l'intégrité et la disponibilité des données personnelles.
                </p>
                <p>Ces mesures peuvent notamment comprendre :</p>
                <ul>
                    <li>L'authentification et le contrôle des accès ;</li>
                    <li>La gestion des rôles et des autorisations ;</li>
                    <li>La sécurisation des communications ;</li>
                    <li>La protection des systèmes et des infrastructures ;</li>
                    <li>La journalisation de certaines opérations ;</li>
                    <li>La réalisation de sauvegardes ;</li>
                    <li>La surveillance et la correction des vulnérabilités ;</li>
                    <li>La limitation des accès aux seules personnes autorisées.</li>
                </ul>
                <p>
                    Malgré les mesures mises en œuvre, aucun système
                    informatique ne peut garantir une sécurité absolue.
                </p>
            </>
        ),
    },
    {
        id: "transferts",
        title: "10. Hébergement et transfert des données",
        content: (
            <>
                <p>
                    Les données personnelles sont traitées au moyen
                    d'infrastructures et de services techniques nécessaires
                    au fonctionnement de Trajet Go.
                </p>
                <p>
                    Les informations relatives aux prestataires d'hébergement,
                    à la localisation des serveurs et aux éventuels transferts
                    internationaux de données seront précisées dans la présente
                    politique ou dans des informations complémentaires lorsque
                    ces choix techniques auront été définitivement établis.
                </p>
                <p>
                    Lorsqu'un transfert international de données est nécessaire,
                    Trajet Go veille à ce qu'il soit réalisé conformément aux
                    exigences de la réglementation applicable.
                </p>
            </>
        ),
    },
    {
        id: "rights",
        title: "11. Droits des personnes concernées",
        content: (
            <>
                <p>
                    Conformément à la réglementation applicable, notamment la
                    loi ivoirienne n° 2013-450 du 19 juin 2013, les personnes
                    concernées disposent de droits relatifs à leurs données
                    personnelles.
                </p>
                <ul>
                    <li><strong>Droit à l'information :</strong> être informées des traitements réalisés sur leurs données ;</li>
                    <li><strong>Droit d'accès :</strong> obtenir la confirmation que leurs données sont traitées et accéder aux informations les concernant ;</li>
                    <li><strong>Droit de rectification :</strong> demander la correction de données inexactes ou incomplètes ;</li>
                    <li><strong>Droit d'opposition :</strong> s'opposer à certains traitements dans les conditions prévues par la loi ;</li>
                    <li><strong>Droit de suppression :</strong> demander la suppression de données lorsque les conditions légales sont réunies ;</li>
                    <li><strong>Droit de retrait du consentement :</strong> retirer un consentement précédemment donné lorsque le traitement repose sur celui-ci ;</li>
                    <li><strong>Droit à la portabilité :</strong> obtenir certaines données dans un format électronique structuré lorsque les conditions légales sont réunies.</li>
                </ul>
                <p>
                    L'exercice de ces droits peut être soumis à une vérification
                    raisonnable de l'identité de la personne concernée.
                </p>
            </>
        ),
    },
    {
        id: "exercise-rights",
        title: "12. Exercice des droits et contact",
        content: (
            <>
                <p>
                    Pour toute question concernant la présente politique ou
                    pour exercer vos droits relatifs aux données personnelles,
                    vous pouvez contacter Trajet Go par l'intermédiaire de
                    ses coordonnées officielles.
                </p>
                <ul>
                    <li><strong>Email :</strong> privacy@trajetgo.net</li>
                    <li><strong>Objet :</strong> Demande relative aux données personnelles</li>
                    <li style={{ color: "red", background: "#FFFF00" }}><strong>Adresse postale :</strong> [Adresse officielle de l'entreprise]</li>
                </ul>
                <p>
                    Votre demande devra préciser, dans la mesure nécessaire,
                    les informations permettant de vous identifier et de
                    comprendre son objet.
                </p>
                <p>
                    Vous pouvez également vous rapprocher de l'Autorité de
                    protection des données personnelles compétente en
                    Côte d'Ivoire lorsque vous estimez que vos droits ne
                    sont pas respectés.
                </p>
            </>
        ),
    },
    {
        id: "cookies",
        title: "13. Cookies et technologies similaires",
        content: (
            <>
                <p>
                    Les sites et applications de Trajet Go peuvent utiliser
                    des cookies ou technologies similaires afin de :
                </p>
                <ul>
                    <li>Assurer le fonctionnement des services ;</li>
                    <li>Maintenir les sessions des utilisateurs ;</li>
                    <li>Renforcer la sécurité ;</li>
                    <li>Mémoriser certaines préférences ;</li>
                    <li>Mesurer l'utilisation et les performances des services, lorsque de tels outils sont utilisés.</li>
                </ul>
                <p>
                    Les modalités d'utilisation de ces technologies, ainsi que
                    les possibilités de gestion des préférences, sont détaillées
                    dans notre{" "}
                    <Link to="/cookies">Politique relative aux cookies</Link>.
                </p>
            </>
        ),
    },
    {
        id: "minors",
        title: "14. Protection des données des mineurs",
        content: (
            <p>
                Les services de Trajet Go ne sont pas conçus pour collecter
                directement des données personnelles de mineurs sans les
                garanties et autorisations requises par la réglementation
                applicable.
                Lorsqu'un mineur utilise un service de transport, les
                informations nécessaires à la réservation ou à l'organisation
                du voyage peuvent être traitées dans le respect des règles
                applicables et, lorsque nécessaire, sous la responsabilité
                de son représentant légal.
            </p>
        ),
    },
    {
        id: "modifications",
        title: "15. Modifications de la politique",
        content: (
            <>
                <p>
                    Trajet Go peut modifier la présente politique afin de tenir
                    compte des évolutions de ses services, de ses pratiques ou
                    de la réglementation applicable.
                </p>
                <p>
                    La version actualisée sera publiée sur cette page avec sa
                    date de mise à jour.
                </p>
                <p>
                    Lorsque les modifications nécessitent une information
                    particulière des utilisateurs, Trajet Go mettra en œuvre
                    les moyens appropriés pour les en informer.
                </p>
            </>
        ),
    },
    {
        id: "contact",
        title: "16. Contact",
        content: (
            <>
                <p>
                    Pour toute question relative à la confidentialité et à
                    la protection des données personnelles :
                </p>
                <ul>
                    <li><strong>Trajet Go</strong></li>
                    <li>Site web : https://trajetgo.net</li>
                    <li>Centre de politiques : https://policies.trajetgo.net</li>
                    <li>Email : dpo@trajetgo.net</li>
                </ul>
            </>
        ),
    },
];

export const TERMS_SECTIONS_PASSENGER = [
    {
        id: "intro",
        title: "1. Présentation et objet",
        content: (
            <>
                <p>
                    Trajet Go est une plateforme numérique dédiée à la
                    digitalisation du transport interurbain. Elle permet
                    notamment aux voyageurs de rechercher des trajets,
                    consulter les offres des compagnies de transport,
                    réserver des places et acheter des billets lorsque
                    ces fonctionnalités sont disponibles.
                </p>

                <p>
                    Les présentes Conditions générales d'utilisation,
                    ci-après « CGU », définissent les règles applicables
                    aux voyageurs qui accèdent à la plateforme ou utilisent
                    ses services.
                </p>

                <p>
                    Elles encadrent notamment la création du compte,
                    la recherche de voyages, les réservations, les
                    paiements, l'utilisation des billets et les
                    conditions d'embarquement.
                </p>
            </>
        ),
    },
    {
        id: "definitions",
        title: "2. Définitions",
        content: (
            <>
                <p>
                    Pour l'interprétation des présentes CGU, les termes
                    suivants ont la signification indiquée ci-dessous :
                </p>

                <ul>
                    <li>
                        <strong>Trajet Go :</strong> désigne la plateforme
                        numérique et les services associés permettant
                        notamment la recherche, la réservation et l'achat
                        de billets de transport.
                    </li>
                    <li>
                        <strong>Voyageur :</strong> toute personne qui
                        utilise les services Trajet Go pour rechercher,
                        réserver ou acheter un trajet.
                    </li>
                    <li>
                        <strong>Compagnie :</strong> toute entreprise de
                        transport proposant des voyages par l'intermédiaire
                        de Trajet Go.
                    </li>
                    <li>
                        <strong>Utilisateur :</strong> toute personne
                        accédant à la plateforme, qu'elle dispose ou non
                        d'un compte.
                    </li>
                    <li>
                        <strong>Compte :</strong> l'espace personnel
                        permettant à un voyageur d'accéder à certaines
                        fonctionnalités de Trajet Go.
                    </li>
                    <li>
                        <strong>Voyage :</strong> une prestation de
                        transport proposée par une compagnie, définie
                        notamment par un itinéraire, une date, une heure
                        et un véhicule.
                    </li>
                    <li>
                        <strong>Réservation :</strong> une demande
                        d'attribution d'une ou plusieurs places sur un
                        voyage donné.
                    </li>
                    <li>
                        <strong>Billet :</strong> le justificatif
                        numérique ou physique attestant du droit
                        du voyageur à effectuer un trajet, selon
                        les modalités de la compagnie.
                    </li>
                    <li>
                        <strong>Prestataire de paiement :</strong>
                        toute entité externe intervenant dans le
                        traitement des transactions financières.
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: "acceptance",
        title: "3. Acceptation des conditions",
        content: (
            <>
                <p>
                    L'accès et l'utilisation des services Trajet Go
                    impliquent la prise de connaissance et l'acceptation
                    des présentes CGU.
                </p>

                <p>
                    Lorsqu'une fonctionnalité nécessite une acceptation
                    expresse, notamment lors de la création d'un compte
                    ou de la confirmation d'une réservation, le voyageur
                    doit valider les conditions applicables avant
                    de poursuivre.
                </p>

                <p>
                    Si le voyageur n'accepte pas les présentes conditions,
                    il doit s'abstenir d'utiliser les services concernés.
                </p>
            </>
        ),
    },
    {
        id: "account",
        title: "4. Création et gestion du compte voyageur",
        content: (
            <>
                <p>
                    Certaines fonctionnalités de Trajet Go nécessitent
                    la création d'un compte personnel.
                </p>

                <p>
                    Lors de son inscription, le voyageur s'engage à
                    communiquer des informations exactes, complètes
                    et à jour.
                </p>

                <p>
                    Le voyageur est responsable de la confidentialité
                    de ses identifiants et des activités effectuées
                    depuis son compte. Il doit prendre les mesures
                    nécessaires pour empêcher tout accès non autorisé.
                </p>

                <p>
                    En cas de perte de ses identifiants, de suspicion
                    d'accès frauduleux ou d'utilisation non autorisée,
                    le voyageur doit contacter Trajet Go par les moyens
                    de contact mis à disposition.
                </p>

                <p>
                    Le voyageur peut être amené à mettre à jour ses
                    informations personnelles afin de garantir
                    l'exactitude des données associées à son compte.
                </p>
            </>
        ),
    },
    {
        id: "search",
        title: "5. Recherche et consultation des voyages",
        content: (
            <>
                <p>
                    Trajet Go permet au voyageur de rechercher les
                    voyages proposés par les compagnies référencées
                    sur la plateforme.
                </p>

                <p>
                    Les résultats peuvent présenter différentes
                    informations, notamment :
                </p>

                <ul>
                    <li>Les villes ou lieux de départ et d'arrivée ;</li>
                    <li>La date et l'heure du voyage ;</li>
                    <li>La compagnie de transport ;</li>
                    <li>Le tarif communiqué ;</li>
                    <li>Les places disponibles ;</li>
                    <li>Les caractéristiques du véhicule et les services proposés.</li>
                </ul>

                <p>
                    Les informations relatives aux voyages sont
                    communiquées à partir des données fournies ou
                    actualisées par les compagnies.
                </p>

                <p>
                    Le voyageur doit vérifier les informations
                    affichées avant de procéder à une réservation
                    ou à un achat.
                </p>
            </>
        ),
    },
    {
        id: "bookings",
        title: "6. Réservation et sélection des sièges",
        content: (
            <>
                <p>
                    Le voyageur peut sélectionner un voyage et,
                    lorsque cette fonctionnalité est disponible,
                    choisir une ou plusieurs places parmi celles
                    proposées.
                </p>

                <p>
                    La sélection d'une place ou le démarrage
                    d'une réservation ne constitue pas nécessairement
                    une confirmation définitive du droit au transport.
                </p>

                <p>
                    Une réservation peut être soumise à des étapes
                    de validation, notamment la confirmation des
                    informations du voyageur et le règlement
                    du montant demandé.
                </p>

                <p>
                    Les places disponibles peuvent évoluer en fonction
                    des réservations et des opérations effectuées
                    par la compagnie.
                </p>

                <p>
                    Le voyageur doit vérifier le statut de sa réservation
                    dans la plateforme avant son déplacement.
                </p>
            </>
        ),
    },
    {
        id: "tickets",
        title: "7. Achat et émission des billets",
        content: (
            <>
                <p>
                    Lorsqu'un achat est proposé sur Trajet Go, le voyageur
                    peut procéder au règlement du montant indiqué afin
                    d'obtenir un billet pour le voyage sélectionné.
                </p>

                <p>
                    L'émission ou la confirmation du billet dépend
                    de la validation de la transaction et du traitement
                    de la réservation.
                </p>

                <p>
                    Le billet peut comporter différentes informations,
                    notamment :
                </p>

                <ul>
                    <li>L'identité ou les informations du voyageur ;</li>
                    <li>La compagnie de transport ;</li>
                    <li>Les informations du voyage ;</li>
                    <li>La place attribuée, lorsqu'elle est applicable ;</li>
                    <li>Une référence ou un code de vérification.</li>
                </ul>

                <p>
                    Le voyageur doit conserver son billet et être
                    en mesure de le présenter à la compagnie ou
                    au personnel chargé du contrôle à l'embarquement.
                </p>

                <p>
                    Le billet est personnel lorsque les informations
                    qu'il contient identifient un voyageur déterminé.
                    Il ne doit pas être utilisé par une autre personne
                    sans autorisation de la compagnie.
                </p>
            </>
        ),
    },
    {
        id: "payments",
        title: "8. Paiements et transactions",
        content: (
            <>
                <p>
                    Les moyens de paiement disponibles sont présentés
                    au voyageur au moment de l'achat. Ils peuvent
                    notamment inclure des services de paiement mobile
                    ou d'autres moyens proposés par les prestataires
                    partenaires.
                </p>

                <p>
                    Les transactions financières peuvent être traitées
                    par des prestataires de paiement externes.
                    Leur traitement est également soumis aux conditions
                    applicables de ces prestataires.
                </p>

                <p>
                    Une transaction peut présenter différents statuts,
                    notamment en attente, confirmée, échouée ou annulée.
                    Un paiement n'est considéré comme confirmé qu'après
                    validation de la transaction par le système concerné.
                </p>

                <p>
                    En cas de débit sans confirmation du billet,
                    le voyageur doit conserver la référence de
                    transaction et contacter le service d'assistance
                    de Trajet Go.
                </p>

                <p>
                    Le voyageur s'engage à ne pas utiliser de moyen
                    de paiement frauduleux ou dont il n'est pas
                    autorisé à faire usage.
                </p>
            </>
        ),
    },
    {
        id: "cancellation",
        title: "9. Annulation, modification et remboursement",
        content: (
            <>
                <p>
                    Les conditions d'annulation, de modification
                    et de remboursement peuvent varier selon
                    la compagnie, le voyage et les conditions
                    commerciales applicables.
                </p>

                <p>
                    Avant de confirmer son achat, le voyageur doit
                    prendre connaissance des conditions spécifiques
                    communiquées pour le voyage concerné.
                </p>

                <p>
                    Les demandes d'annulation, de modification
                    ou de remboursement doivent être effectuées
                    selon la procédure indiquée par la compagnie
                    ou par Trajet Go, selon le service concerné.
                </p>

                <p>
                    La possibilité d'obtenir un remboursement,
                    son montant et son délai dépendent des conditions
                    applicables, de la situation du voyage et du
                    traitement de la transaction.
                </p>

                <p>
                    Trajet Go ne garantit pas le remboursement
                    automatique de toute réservation ou de tout
                    billet acheté.
                </p>
            </>
        ),
    },
    {
        id: "boarding",
        title: "10. Conditions d'embarquement",
        content: (
            <>
                <p>
                    Le voyageur doit se présenter au lieu de départ
                    communiqué par la compagnie et respecter les
                    horaires et consignes d'embarquement.
                </p>

                <p>
                    Il doit être en mesure de présenter son billet
                    ou son justificatif de réservation ainsi que
                    toute information nécessaire à la vérification
                    de son droit au transport.
                </p>

                <p>
                    La compagnie peut procéder à la vérification
                    du billet et de l'identité du voyageur selon
                    ses procédures et les règles applicables.
                </p>

                <p>
                    Le voyageur est responsable de son arrivée
                    dans les délais communiqués. Les conséquences
                    d'un retard, d'une absence ou d'un défaut
                    de présentation du billet sont déterminées
                    par les conditions de la compagnie et les
                    règles applicables au voyage.
                </p>

                <p>
                    Le voyageur doit respecter les consignes
                    de sécurité, les règles de transport des
                    bagages et les instructions du personnel
                    de la compagnie.
                </p>
            </>
        ),
    },
    {
        id: "obligations",
        title: "11. Obligations du voyageur",
        content: (
            <>
                <p>Le voyageur s'engage à :</p>

                <ul>
                    <li>Fournir des informations exactes lors de son inscription et de ses réservations ;</li>
                    <li>Vérifier les informations relatives à son voyage avant toute confirmation ;</li>
                    <li>Utiliser uniquement ses propres identifiants ou ceux dont il est autorisé à faire usage ;</li>
                    <li>Ne pas utiliser Trajet Go à des fins frauduleuses ou illicites ;</li>
                    <li>Ne pas tenter de perturber le fonctionnement ou la sécurité de la plateforme ;</li>
                    <li>Ne pas falsifier, reproduire frauduleusement ou utiliser abusivement un billet ;</li>
                    <li>Respecter les conditions de transport et les consignes de la compagnie.</li>
                </ul>

                <p>
                    Tout comportement frauduleux ou toute violation
                    des présentes CGU peut entraîner des restrictions
                    d'accès aux services, sans préjudice des recours
                    prévus par la réglementation applicable.
                </p>
            </>
        ),
    },
    {
        id: "responsibility",
        title: "12. Responsabilités de Trajet Go et des compagnies",
        content: (
            <>
                <h3>12.1. Rôle de Trajet Go</h3>

                <p>
                    Trajet Go fournit une infrastructure numérique
                    permettant notamment de consulter les offres
                    de transport, de gérer les réservations et
                    de faciliter l'achat de billets.
                </p>

                <p>
                    Trajet Go met en œuvre des moyens raisonnables
                    pour assurer le bon fonctionnement de ses
                    services, sans garantir une disponibilité
                    permanente ou l'absence de toute erreur.
                </p>

                <h3>12.2. Responsabilité des compagnies</h3>

                <p>
                    Les compagnies sont responsables des prestations
                    de transport qu'elles proposent et réalisent.
                    Elles demeurent notamment responsables de
                    l'exécution du voyage, des véhicules utilisés,
                    de la sécurité des passagers, des horaires
                    communiqués et de la prise en charge des voyageurs.
                </p>

                <h3>12.3. Limites</h3>

                <p>
                    Trajet Go ne peut être tenu responsable des
                    manquements imputables à une compagnie dans
                    l'exécution matérielle d'un transport, sous
                    réserve de ses propres obligations légales
                    et contractuelles.
                </p>
            </>
        ),
    },
    {
        id: "disponibility",
        title: "13. Disponibilité des services",
        content: (
            <>
                <p>
                    Trajet Go s'efforce de rendre ses services
                    accessibles dans des conditions normales
                    d'utilisation.
                </p>

                <p>
                    Toutefois, des interruptions temporaires
                    peuvent survenir, notamment en raison
                    d'opérations de maintenance, de mises à jour,
                    de difficultés techniques, de problèmes
                    de connectivité ou d'événements indépendants
                    de la volonté de Trajet Go.
                </p>

                <p>
                    Trajet Go peut faire évoluer, suspendre
                    ou retirer certaines fonctionnalités
                    lorsque cela est nécessaire au fonctionnement,
                    à la sécurité ou à l'amélioration de la plateforme.
                </p>
            </>
        ),
    },
    {
        id: "suspension",
        title: "14. Suspension et fermeture du compte",
        content: (
            <>
                <p>
                    Trajet Go peut restreindre ou suspendre
                    l'accès à un compte en cas de violation
                    des présentes CGU, d'utilisation frauduleuse,
                    de risque pour la sécurité de la plateforme
                    ou de comportement portant atteinte aux
                    droits d'autres utilisateurs.
                </p>

                <p>
                    Lorsque les circonstances le permettent,
                    le voyageur peut être informé de la mesure
                    prise et de ses motifs.
                </p>

                <p>
                    Le voyageur peut demander la fermeture
                    de son compte selon les modalités proposées
                    par Trajet Go. Cette fermeture ne supprime
                    pas nécessairement les données qui doivent
                    être conservées en application d'une
                    obligation légale ou pour la gestion
                    de litiges et de transactions antérieures.
                </p>
            </>
        ),
    },
    {
        id: "property",
        title: "15. Propriété intellectuelle",
        content: (
            <>
                <p>
                    La plateforme Trajet Go, son nom, ses logos,
                    ses interfaces, ses éléments graphiques,
                    ses textes, ses logiciels et ses composants
                    techniques sont protégés par les règles
                    applicables en matière de propriété intellectuelle.
                </p>

                <p>
                    Sauf autorisation préalable, toute reproduction,
                    modification, distribution ou exploitation
                    non autorisée de ces éléments est interdite.
                </p>

                <p>
                    L'utilisation de la plateforme ne confère
                    au voyageur aucun droit de propriété sur
                    les éléments qui la composent.
                </p>
            </>
        ),
    },
    {
        id: "disputes",
        title: "16. Réclamations, litiges et droit applicable",
        content: (
            <>
                <h3>16.1. Réclamations</h3>

                <p>
                    Pour toute difficulté concernant une recherche,
                    une réservation, un paiement ou l'utilisation
                    de la plateforme, le voyageur peut contacter
                    le service d'assistance Trajet Go par les
                    moyens de contact officiellement communiqués.
                </p>

                <p>
                    Pour une réclamation portant sur l'exécution
                    matérielle d'un voyage, notamment un retard,
                    une annulation ou les conditions de transport,
                    le voyageur peut également devoir contacter
                    directement la compagnie concernée.
                </p>

                <h3>16.2. Droit applicable</h3>

                <p>
                    Les présentes CGU sont soumises au droit
                    applicable en Côte d'Ivoire, sous réserve
                    des dispositions impératives éventuellement
                    applicables.
                </p>

                <h3>16.3. Règlement des différends</h3>

                <p>
                    En cas de différend relatif à l'interprétation
                    ou à l'exécution des présentes CGU, les parties
                    sont invitées à rechercher une solution amiable,
                    sans préjudice du droit de saisir les juridictions
                    compétentes.
                </p>
            </>
        ),
    },
    {
        id: "contact",
        title: "17. Contact",
        content: (
            <p>
                Pour toute question concernant les présentes
                Conditions générales d'utilisation ou les services
                Trajet Go, le voyageur peut contacter l'équipe
                Trajet Go par les moyens de contact officiellement
                communiqués sur la plateforme.
            </p>
        ),
    },
];

export const TERMS_SECTIONS_COMPANY = [
    {
        id: "intro",
        title: "1. Présentation et objet",
        content: (
            <>
                <p>
                    Trajet Go est une plateforme numérique SaaS destinée
                    notamment aux entreprises de transport interurbain.
                    Elle met à leur disposition des outils permettant
                    de digitaliser et de gérer différentes opérations
                    liées à leurs activités de transport.
                </p>

                <p>
                    Les services proposés peuvent notamment inclure
                    la gestion des agences, des véhicules, des plans
                    de sièges, des itinéraires, des voyages, des
                    réservations, de la billetterie, des équipes
                    et du contrôle d'embarquement.
                </p>

                <p>
                    Les présentes Conditions générales de service,
                    ci-après « CGS », définissent les conditions
                    d'accès et d'utilisation des services professionnels
                    Trajet Go par les compagnies de transport.
                </p>
            </>
        ),
    },
    {
        id: "definitions",
        title: "2. Définitions",
        content: (
            <>
                <p>
                    Dans les présentes CGS, les termes suivants
                    ont la signification indiquée ci-dessous :
                </p>

                <ul>
                    <li>
                        <strong>Trajet Go :</strong> désigne la plateforme
                        numérique, ses applications, ses interfaces
                        et ses services professionnels.
                    </li>
                    <li>
                        <strong>Compagnie :</strong> désigne toute
                        entreprise de transport ayant souscrit ou
                        obtenu un accès aux services professionnels
                        Trajet Go.
                    </li>
                    <li>
                        <strong>Administrateur :</strong> désigne
                        la personne autorisée à administrer le compte
                        professionnel de la compagnie.
                    </li>
                    <li>
                        <strong>Personnel :</strong> désigne les
                        collaborateurs auxquels la compagnie
                        attribue un accès à la plateforme, notamment
                        les agents d'agence et les contrôleurs.
                    </li>
                    <li>
                        <strong>Agence :</strong> désigne un établissement
                        ou un point de vente ou de départ rattaché
                        à une compagnie.
                    </li>
                    <li>
                        <strong>Voyage :</strong> désigne une prestation
                        de transport programmée par la compagnie.
                    </li>
                    <li>
                        <strong>Réservation :</strong> désigne une demande
                        d'attribution d'une ou plusieurs places sur
                        un voyage.
                    </li>
                    <li>
                        <strong>Billetterie :</strong> désigne l'ensemble
                        des fonctionnalités permettant la gestion
                        des billets et des ventes.
                    </li>
                    <li>
                        <strong>Services :</strong> désigne les
                        fonctionnalités et outils professionnels
                        mis à disposition par Trajet Go.
                    </li>
                    <li>
                        <strong>Compte professionnel :</strong> désigne
                        l'espace numérique attribué à une compagnie
                        pour gérer ses activités sur Trajet Go.
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: "formation",
        title: "3. Acceptation et formation du contrat",
        content: (
            <>
                <p>
                    L'accès aux services professionnels Trajet Go
                    est soumis à l'acceptation des présentes CGS
                    et, le cas échéant, à la conclusion d'un accord
                    commercial spécifique entre Trajet Go et la compagnie.
                </p>

                <p>
                    La création ou l'activation d'un compte professionnel,
                    la souscription à une offre ou l'utilisation des
                    services peuvent constituer des étapes de formation
                    de la relation contractuelle, selon les modalités
                    convenues entre les parties.
                </p>

                <p>
                    La compagnie déclare que la personne qui accepte
                    les présentes CGS dispose des pouvoirs ou
                    autorisations nécessaires pour l'engager.
                </p>

                <p>
                    En cas de contradiction entre les présentes CGS
                    et un accord commercial particulier signé entre
                    les parties, les dispositions de cet accord
                    prévalent pour les sujets qu'il traite expressément.
                </p>
            </>
        ),
    },
    {
        id: "access",
        title: "4. Conditions d'accès à la plateforme",
        content: (
            <>
                <p>
                    L'accès aux services professionnels est réservé
                    aux compagnies autorisées par Trajet Go et ayant
                    satisfait aux éventuelles formalités d'inscription
                    et de vérification.
                </p>

                <p>
                    La compagnie doit fournir les informations et
                    documents nécessaires à l'identification de son
                    entreprise et à l'activation de son espace
                    professionnel, lorsque ceux-ci sont demandés.
                </p>

                <p>
                    Trajet Go peut refuser ou différer l'activation
                    d'un compte lorsque les informations fournies
                    sont insuffisantes, incohérentes ou nécessitent
                    des vérifications complémentaires.
                </p>

                <p>
                    La compagnie doit disposer des équipements,
                    de la connexion Internet et des moyens techniques
                    nécessaires à l'utilisation des services.
                </p>
            </>
        ),
    },
    {
        id: "account",
        title: "5. Création et administration du compte compagnie",
        content: (
            <>
                <p>
                    Chaque compagnie dispose d'un espace professionnel
                    permettant de configurer et de gérer les éléments
                    liés à ses activités sur Trajet Go.
                </p>

                <p>
                    La compagnie désigne un ou plusieurs administrateurs
                    autorisés à gérer les paramètres de son compte,
                    les accès du personnel et les opérations disponibles.
                </p>

                <p>
                    Elle est responsable de l'exactitude des informations
                    relatives à son entreprise et de leur mise à jour.
                </p>

                <p>
                    La compagnie doit protéger ses identifiants
                    d'administration et s'assurer que seuls les
                    collaborateurs autorisés disposent d'un accès.
                </p>

                <p>
                    Elle doit informer Trajet Go dans les meilleurs
                    délais de toute compromission, utilisation
                    non autorisée ou suspicion d'accès frauduleux
                    à son compte professionnel.
                </p>
            </>
        ),
    },
    {
        id: "agencies-teams",
        title: "6. Gestion des agences et du personnel",
        content: (
            <>
                <p>
                    Les services Trajet Go peuvent permettre à la
                    compagnie de créer et de gérer ses agences,
                    ainsi que les membres de son personnel.
                </p>

                <p>
                    La compagnie est responsable de l'attribution
                    des rôles et des autorisations correspondant
                    aux fonctions de chaque collaborateur.
                </p>

                <p>
                    Elle doit notamment veiller à ce que les agents
                    d'agence et les contrôleurs utilisent uniquement
                    les accès qui leur ont été attribués.
                </p>

                <p>
                    La compagnie est responsable de la gestion
                    des départs et des arrivées de ses collaborateurs,
                    notamment de la désactivation des accès lorsqu'un
                    membre du personnel quitte ses fonctions ou
                    n'est plus autorisé à utiliser la plateforme.
                </p>

                <p>
                    Elle demeure responsable des opérations réalisées
                    par les membres de son personnel dans le cadre
                    des autorisations qu'elle leur a accordées,
                    sous réserve des responsabilités propres de
                    chaque partie.
                </p>
            </>
        ),
    },
    {
        id: "vehicles",
        title: "7. Gestion des véhicules et des plans de sièges",
        content: (
            <>
                <p>
                    La compagnie peut utiliser Trajet Go pour
                    enregistrer et gérer les véhicules affectés
                    à ses activités de transport.
                </p>

                <p>
                    Elle est responsable de l'exactitude des
                    informations communiquées concernant ses
                    véhicules, notamment leur identification,
                    leur capacité et leurs caractéristiques.
                </p>

                <p>
                    Lorsqu'elle configure un plan de sièges,
                    la compagnie doit s'assurer que celui-ci
                    correspond à la configuration réelle du véhicule.
                </p>

                <p>
                    La compagnie demeure seule responsable de
                    l'état, de la conformité, de l'entretien
                    et de l'exploitation des véhicules utilisés
                    pour effectuer les transports.
                </p>
            </>
        ),
    },
    {
        id: "trips",
        title: "8. Création et programmation des voyages",
        content: (
            <>
                <p>
                    Trajet Go peut permettre à la compagnie de créer,
                    programmer, modifier et suivre ses voyages.
                </p>

                <p>
                    La compagnie est responsable des informations
                    qu'elle publie, notamment :
                </p>

                <ul>
                    <li>Les lieux de départ et d'arrivée ;</li>
                    <li>Les dates et heures prévues ;</li>
                    <li>Les véhicules affectés ;</li>
                    <li>Les capacités et les places disponibles ;</li>
                    <li>Les tarifs appliqués ;</li>
                    <li>Les agences associées au voyage ;</li>
                    <li>Les éventuelles informations complémentaires destinées aux voyageurs.</li>
                </ul>

                <p>
                    La compagnie doit actualiser les informations
                    relatives à ses voyages en cas de modification,
                    d'annulation ou de perturbation.
                </p>

                <p>
                    La programmation d'un voyage dans Trajet Go
                    ne dispense pas la compagnie de respecter
                    les obligations réglementaires applicables
                    à son activité de transport.
                </p>
            </>
        ),
    },
    {
        id: "bookings-ticketing",
        title: "9. Gestion des réservations et de la billetterie",
        content: (
            <>
                <p>
                    Les outils professionnels Trajet Go peuvent
                    permettre à la compagnie de consulter et
                    de gérer les réservations effectuées par
                    les voyageurs, ainsi que les opérations
                    de billetterie réalisées sur la plateforme.
                </p>

                <p>
                    La compagnie s'engage à traiter les réservations
                    conformément aux informations qu'elle a publiées
                    et aux conditions applicables aux voyages.
                </p>

                <p>
                    Elle doit veiller à la cohérence entre les
                    disponibilités affichées, les places réellement
                    attribuables et les opérations réalisées
                    dans ses agences ou par ses équipes.
                </p>

                <p>
                    La compagnie est responsable de la gestion
                    commerciale des prestations de transport
                    qu'elle propose, notamment de l'application
                    de ses tarifs et des conditions de vente
                    communiquées aux voyageurs.
                </p>
            </>
        ),
    },
    {
        id: "control",
        title: "10. Contrôle et embarquement",
        content: (
            <>
                <p>
                    Trajet Go peut mettre à disposition des
                    fonctionnalités permettant au personnel
                    autorisé de vérifier les billets et de
                    suivre les opérations d'embarquement.
                </p>

                <p>
                    La compagnie est responsable de l'organisation
                    de ses opérations de contrôle et de la désignation
                    des personnes habilitées à effectuer ces opérations.
                </p>

                <p>
                    Les agents chargés du contrôle doivent utiliser
                    les outils mis à leur disposition conformément
                    aux procédures définies par la compagnie
                    et aux instructions de Trajet Go.
                </p>

                <p>
                    La compagnie reste responsable de la décision
                    opérationnelle d'autoriser ou de refuser
                    l'embarquement, dans le respect des droits
                    des voyageurs et des règles applicables.
                </p>
            </>
        ),
    },
    {
        id: "commercial-conditions",
        title: "11. Tarification, abonnements et commissions",
        content: (
            <>
                <p>
                    L'accès aux services professionnels Trajet Go
                    peut être soumis à une tarification comprenant,
                    selon l'offre souscrite, un abonnement,
                    des commissions sur les transactions ou
                    d'autres frais liés aux services utilisés.
                </p>

                <p>
                    Les tarifs applicables, leur périodicité,
                    les modalités de facturation et les éventuelles
                    commissions sont communiqués à la compagnie
                    dans l'offre commerciale ou l'accord conclu
                    entre les parties.
                </p>

                <p>
                    La compagnie s'engage à régler les sommes
                    dues selon les modalités et échéances
                    convenues.
                </p>

                <p>
                    Toute modification tarifaire doit être
                    communiquée à la compagnie dans les conditions
                    prévues par l'accord commercial applicable.
                </p>

                <p>
                    Les modalités de calcul des commissions,
                    les éventuels frais de transaction et les
                    conditions de reversement des sommes encaissées
                    doivent être précisés dans les documents
                    commerciaux ou contractuels applicables.
                </p>
            </>
        ),
    },
    {
        id: "company-obligations",
        title: "12. Obligations et responsabilités de la compagnie",
        content: (
            <>
                <p>La compagnie s'engage notamment à :</p>

                <ul>
                    <li>Fournir des informations exactes concernant son entreprise et ses activités ;</li>
                    <li>Maintenir à jour les informations relatives à ses agences, véhicules, voyages et tarifs ;</li>
                    <li>Disposer des autorisations nécessaires à l'exercice de son activité de transport ;</li>
                    <li>Respecter les réservations et les billets confirmés conformément aux conditions applicables ;</li>
                    <li>Assurer la sécurité des voyageurs pendant les prestations de transport ;</li>
                    <li>Veiller à la compétence et à l'autorisation de son personnel ;</li>
                    <li>Respecter les règles applicables en matière de transport, de consommation et de protection des données ;</li>
                    <li>Régler les sommes dues à Trajet Go conformément à l'accord commercial.</li>
                </ul>

                <p>
                    La compagnie demeure responsable de l'exécution
                    des prestations de transport qu'elle propose,
                    ainsi que des actes et omissions de son personnel
                    dans le cadre de ses activités.
                </p>
            </>
        ),
    },
    {
        id: "trajetgo-obligations",
        title: "13. Obligations de Trajet Go",
        content: (
            <>
                <p>
                    Trajet Go s'engage à mettre à disposition
                    de la compagnie les fonctionnalités comprises
                    dans l'offre ou les services convenus.
                </p>

                <p>
                    Trajet Go met en œuvre des moyens raisonnables
                    pour assurer le fonctionnement, la sécurité
                    et l'évolution de la plateforme.
                </p>

                <p>
                    Trajet Go peut également fournir une assistance
                    technique selon les modalités prévues dans
                    l'offre commerciale ou les accords conclus
                    avec la compagnie.
                </p>

                <p>
                    Trajet Go n'est pas tenue de garantir une
                    disponibilité permanente des services ni
                    l'absence de toute interruption technique.
                </p>
            </>
        ),
    },
    {
        id: "data",
        title: "14. Données et confidentialité",
        content: (
            <>
                <p>
                    Dans le cadre de l'utilisation des services,
                    différentes données peuvent être traitées,
                    notamment les informations relatives à la
                    compagnie, à son personnel, à ses voyages
                    et aux réservations des voyageurs.
                </p>

                <p>
                    Chaque partie s'engage à respecter les
                    obligations qui lui incombent en matière
                    de protection des données personnelles.
                </p>

                <p>
                    Selon la nature des traitements réalisés,
                    Trajet Go peut agir en qualité de responsable
                    du traitement ou intervenir pour le compte
                    de la compagnie, conformément aux rôles
                    effectivement exercés par chaque partie.
                </p>

                <p>
                    La compagnie s'engage à n'accéder qu'aux
                    données nécessaires à ses activités et
                    à veiller à ce que son personnel respecte
                    les règles de confidentialité et de sécurité.
                </p>

                <p>
                    Les modalités détaillées relatives aux
                    traitements de données personnelles sont
                    présentées dans la Politique de confidentialité
                    de Trajet Go et, si nécessaire, dans un
                    accord spécifique de traitement des données.
                </p>
            </>
        ),
    },
    {
        id: "disponibility",
        title: "15. Disponibilité, maintenance et support",
        content: (
            <>
                <p>
                    Trajet Go s'efforce d'assurer l'accessibilité
                    de ses services dans des conditions normales
                    d'utilisation.
                </p>

                <p>
                    Des interruptions peuvent néanmoins survenir
                    notamment en raison d'opérations de maintenance,
                    de mises à jour, de difficultés techniques,
                    de problèmes de connectivité ou d'événements
                    indépendants de sa volonté.
                </p>

                <p>
                    Trajet Go peut effectuer des opérations
                    de maintenance et faire évoluer les services
                    afin d'en améliorer la sécurité, la stabilité
                    ou les fonctionnalités.
                </p>

                <p>
                    Les modalités d'assistance, les délais
                    de réponse et les éventuels engagements
                    de disponibilité sont ceux définis dans
                    l'offre commerciale ou dans un accord
                    spécifique lorsqu'il en existe un.
                </p>
            </>
        ),
    },
    {
        id: "suspension",
        title: "16. Suspension et résiliation du service",
        content: (
            <>
                <p>
                    Trajet Go peut suspendre temporairement
                    ou restreindre l'accès aux services
                    professionnels notamment en cas :
                </p>

                <ul>
                    <li>De violation des présentes CGS ;</li>
                    <li>D'utilisation frauduleuse ou abusive de la plateforme ;</li>
                    <li>De risque pour la sécurité des services ou des utilisateurs ;</li>
                    <li>De non-respect des obligations financières convenues ;</li>
                    <li>D'utilisation susceptible de porter atteinte aux droits de tiers.</li>
                </ul>

                <p>
                    Lorsque les circonstances le permettent,
                    Trajet Go informe la compagnie de la mesure
                    prise et de ses motifs.
                </p>

                <p>
                    Les conditions de résiliation, les éventuels
                    préavis, les conséquences financières et
                    les modalités de récupération des données
                    sont définis dans l'accord commercial
                    applicable.
                </p>

                <p>
                    La résiliation ne libère pas les parties
                    des obligations nées avant sa prise d'effet.
                </p>
            </>
        ),
    },
    {
        id: "property",
        title: "17. Propriété intellectuelle",
        content: (
            <>
                <p>
                    Trajet Go demeure titulaire ou licenciée
                    des droits de propriété intellectuelle
                    relatifs à la plateforme, notamment son
                    logiciel, son architecture, ses interfaces,
                    ses marques, ses logos et ses éléments graphiques.
                </p>

                <p>
                    La compagnie bénéficie uniquement d'un
                    droit d'accès et d'utilisation des services
                    pendant la durée et dans les limites
                    prévues par son accord.
                </p>

                <p>
                    La compagnie conserve ses droits sur
                    les éléments, marques, documents et contenus
                    dont elle est propriétaire et qu'elle
                    communique à Trajet Go pour l'utilisation
                    des services.
                </p>

                <p>
                    Aucune disposition des présentes CGS
                    ne transfère à la compagnie la propriété
                    de la plateforme ou de ses composants.
                </p>
            </>
        ),
    },
    {
        id: "responsibility",
        title: "18. Responsabilité et garanties",
        content: (
            <>
                <h3>18.1. Responsabilité de Trajet Go</h3>

                <p>
                    Trajet Go est responsable de ses propres
                    obligations relatives à la fourniture
                    des services numériques, dans les limites
                    prévues par la réglementation applicable
                    et les accords conclus avec la compagnie.
                </p>

                <h3>18.2. Responsabilité de la compagnie</h3>

                <p>
                    La compagnie demeure responsable de son
                    activité de transport, de ses véhicules,
                    de son personnel, de ses tarifs, des
                    informations publiées et de l'exécution
                    des voyages proposés.
                </p>

                <h3>18.3. Utilisation des services</h3>

                <p>
                    Chaque partie s'engage à prendre les mesures
                    raisonnables nécessaires pour prévenir
                    les dommages résultant de ses propres
                    actes ou manquements.
                </p>

                <p>
                    Aucune disposition des présentes CGS
                    ne saurait exclure une responsabilité
                    qui ne peut légalement être écartée.
                </p>
            </>
        ),
    },
    {
        id: "disputes",
        title: "19. Réclamations, litiges et droit applicable",
        content: (
            <>
                <h3>19.1. Réclamations</h3>

                <p>
                    Toute réclamation relative à l'utilisation
                    des services professionnels peut être
                    adressée à Trajet Go par les moyens
                    de contact officiellement communiqués.
                </p>

                <p>
                    Les parties s'engagent à collaborer
                    de bonne foi afin de rechercher une
                    solution aux difficultés rencontrées.
                </p>

                <h3>19.2. Règlement des différends</h3>

                <p>
                    En cas de différend relatif à l'interprétation
                    ou à l'exécution des présentes CGS,
                    les parties privilégient une résolution
                    amiable avant toute procédure judiciaire,
                    sous réserve des mesures urgentes ou
                    conservatoires nécessaires.
                </p>

                <h3>19.3. Droit applicable</h3>

                <p>
                    Les présentes CGS sont soumises au droit
                    applicable en Côte d'Ivoire, sous réserve
                    des dispositions impératives éventuellement
                    applicables.
                </p>
            </>
        ),
    },
    {
        id: "contact",
        title: "20. Contact",
        content: (
            <p>
                Pour toute question concernant les présentes
                Conditions générales de service, la compagnie
                peut contacter l'équipe Trajet Go par les
                moyens de contact professionnels officiellement
                communiqués sur la plateforme ou dans son
                accord commercial.
            </p>
        ),
    },
];

export const COOKIES_SECTIONS = [
    {
        id: "intro",
        title: "1. Présentation et objet",
        content: (
            <>
                <p>
                    La présente Politique relative aux cookies explique
                    comment Trajet Go utilise les cookies et autres
                    technologies similaires sur ses sites web et
                    interfaces numériques.
                </p>

                <p>
                    Elle a pour objectif d'informer les utilisateurs
                    sur la nature de ces technologies, leurs finalités,
                    leur durée de conservation et les moyens dont
                    ils disposent pour gérer leurs préférences.
                </p>

                <p>
                    Cette politique complète la Politique de
                    confidentialité de Trajet Go, notamment
                    concernant les informations techniques
                    susceptibles d'être collectées lors de
                    l'utilisation de nos services.
                </p>
            </>
        ),
    },
    {
        id: "definition",
        title: "2. Qu'est-ce qu'un cookie ?",
        content: (
            <>
                <p>
                    Un cookie est un petit fichier ou identifiant
                    enregistré sur le terminal d'un utilisateur
                    lorsqu'il consulte un site web. Il peut être
                    utilisé pour reconnaître un navigateur,
                    mémoriser certaines préférences ou faciliter
                    le fonctionnement d'un service.
                </p>

                <p>
                    Les cookies peuvent être temporaires, c'est-à-dire
                    supprimés à la fermeture du navigateur, ou
                    persistants, c'est-à-dire conservés pendant
                    une durée déterminée.
                </p>

                <p>
                    Le terme « cookies » utilisé dans cette politique
                    couvre également, lorsque cela est pertinent,
                    les technologies similaires permettant de
                    stocker des informations sur un terminal ou
                    d'y accéder.
                </p>

                <p>
                    Ces technologies peuvent notamment inclure
                    les cookies HTTP, le stockage local du navigateur
                    (localStorage), le stockage de session
                    (sessionStorage) et certains identifiants
                    techniques.
                </p>
            </>
        ),
    },
    {
        id: "use",
        title: "3. Pourquoi Trajet Go utilise des cookies",
        content: (
            <>
                <p>
                    Les cookies et technologies similaires peuvent
                    être utilisés pour assurer le fonctionnement
                    de Trajet Go et améliorer l'expérience
                    des utilisateurs.
                </p>

                <p>Selon les fonctionnalités effectivement déployées, ils peuvent notamment servir à :</p>

                <ul>
                    <li>Assurer le fonctionnement technique des services ;</li>
                    <li>Maintenir une session utilisateur et sécuriser les accès ;</li>
                    <li>Mémoriser certaines préférences de navigation ;</li>
                    <li>Faciliter la navigation entre les différentes pages ;</li>
                    <li>Mesurer l'utilisation des services et améliorer leur fonctionnement, lorsque des outils de mesure sont utilisés et autorisés.</li>
                </ul>

                <p>
                    Les technologies utilisées dépendent des
                    fonctionnalités activées sur le site ou
                    l'application concernée.
                </p>
            </>
        ),
    },
    {
        id: "categories",
        title: "4. Catégories de cookies",
        content: (
            <>
                <h3>4.1. Cookies strictement nécessaires</h3>

                <p>
                    Ces cookies sont indispensables au fonctionnement
                    technique ou à la fourniture d'un service
                    expressément demandé par l'utilisateur.
                </p>

                <p>Ils peuvent notamment permettre :</p>

                <ul>
                    <li>La gestion de l'authentification et des sessions ;</li>
                    <li>La sécurisation des accès et la prévention des abus ;</li>
                    <li>Le maintien de certaines informations nécessaires à une opération en cours ;</li>
                    <li>La mémorisation du choix relatif aux cookies.</li>
                </ul>

                <p>
                    Ces cookies ne sont pas utilisés à des fins
                    publicitaires. Lorsqu'ils sont strictement
                    nécessaires, leur fonctionnement ne dépend
                    pas d'un consentement facultatif.
                </p>

                <h3>4.2. Cookies de préférence</h3>

                <p>
                    Ces technologies permettent de mémoriser
                    certains choix de l'utilisateur, comme
                    la langue ou d'autres préférences d'interface,
                    lorsque ces fonctionnalités sont proposées.
                </p>

                <h3>4.3. Cookies de mesure d'audience</h3>

                <p>
                    Ces cookies peuvent permettre de comprendre
                    comment les utilisateurs consultent les
                    services, quelles pages sont visitées
                    et quelles fonctionnalités sont utilisées.
                </p>

                <p>
                    Leur utilisation dépend de la présence
                    effective d'outils de mesure d'audience.
                    Lorsqu'un consentement est requis, ils
                    ne sont activés qu'après le choix positif
                    de l'utilisateur.
                </p>

                <h3>4.4. Cookies publicitaires et de marketing</h3>

                <p>
                    Ces cookies peuvent être utilisés pour
                    mesurer l'efficacité de campagnes ou
                    proposer des contenus publicitaires adaptés.
                </p>

                <p>
                    Leur éventuelle utilisation par Trajet Go
                    devra faire l'objet d'une information
                    spécifique et, lorsque nécessaire,
                    d'un consentement préalable.
                </p>
            </>
        ),
    },
    {
        id: "third-parties",
        title: "5. Cookies et technologies de tiers",
        content: (
            <>
                <p>
                    Certaines fonctionnalités de Trajet Go
                    peuvent éventuellement faire appel à des
                    services fournis par des prestataires externes.
                </p>

                <p>
                    Selon les services effectivement intégrés,
                    ces prestataires peuvent utiliser leurs
                    propres cookies ou technologies similaires.
                </p>

                <p>
                    Les prestataires concernés, les finalités
                    de leurs technologies et les éventuels
                    transferts de données doivent être
                    communiqués aux utilisateurs lorsque
                    ces outils sont déployés.
                </p>

                <p>
                    Trajet Go ne considère pas qu'un service
                    tiers est utilisé simplement parce qu'il
                    pourrait techniquement être intégré à
                    la plateforme. Seuls les outils réellement
                    activés doivent figurer dans l'inventaire
                    des traceurs.
                </p>
            </>
        ),
    },
    {
        id: "conservation",
        title: "6. Durée de conservation",
        content: (
            <>
                <p>
                    La durée de conservation des cookies
                    dépend de leur nature, de leur finalité
                    et de leur configuration technique.
                </p>

                <p>
                    Certains cookies sont supprimés à la
                    fermeture du navigateur. D'autres
                    peuvent rester enregistrés sur le
                    terminal pendant une période définie.
                </p>

                <p>
                    Les durées applicables doivent être
                    précisées dans l'inventaire des cookies
                    effectivement utilisés par Trajet Go.
                </p>

                <p>
                    Les préférences exprimées par l'utilisateur
                    peuvent également être conservées afin
                    de respecter son choix lors de ses
                    prochaines visites.
                </p>
            </>
        ),
    },
    {
        id: "preferences",
        title: "7. Gestion des préférences et retrait du consentement",
        content: (
            <>
                <p>
                    Lorsque Trajet Go utilise des cookies
                    ou technologies nécessitant un
                    consentement, l'utilisateur doit pouvoir
                    exprimer son choix avant leur activation.
                </p>

                <p>
                    Selon les fonctionnalités de gestion
                    des préférences mises à disposition,
                    l'utilisateur peut notamment :
                </p>

                <ul>
                    <li>Accepter les cookies facultatifs ;</li>
                    <li>Refuser les cookies facultatifs ;</li>
                    <li>Choisir les catégories de cookies qu'il autorise ;</li>
                    <li>Modifier ultérieurement ses préférences ;</li>
                    <li>Retirer son consentement pour les catégories concernées.</li>
                </ul>

                <p>
                    Le refus des cookies facultatifs ne doit
                    pas empêcher l'accès aux fonctionnalités
                    qui ne nécessitent pas ces cookies.
                    Certaines fonctionnalités optionnelles
                    peuvent toutefois être limitées.
                </p>

                <p>
                    Le retrait du consentement n'affecte pas
                    la licéité des traitements effectués
                    avant ce retrait.
                </p>

                <p>
                    Les cookies strictement nécessaires
                    au fonctionnement d'un service ne peuvent
                    pas être désactivés au moyen des préférences
                    facultatives lorsque leur utilisation
                    est indispensable.
                </p>
            </>
        ),
    },
    {
        id: "browser",
        title: "8. Désactivation des cookies dans le navigateur",
        content: (
            <>
                <p>
                    L'utilisateur peut également configurer
                    son navigateur pour bloquer ou supprimer
                    certains cookies.
                </p>

                <p>
                    Les paramètres disponibles varient selon
                    le navigateur utilisé. Les instructions
                    peuvent notamment être consultées dans
                    les rubriques d'aide de :
                </p>

                <ul>
                    <li>
                        <a
                            href="https://support.google.com/chrome/answer/95647"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Google Chrome
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Mozilla Firefox
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Apple Safari
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://support.microsoft.com/fr-fr/microsoft-edge"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Microsoft Edge
                        </a>
                    </li>
                </ul>

                <p>
                    La désactivation de certains cookies
                    peut entraîner des difficultés de
                    navigation, empêcher le maintien d'une
                    session ou limiter le fonctionnement
                    de certaines fonctionnalités.
                </p>

                <p>
                    La suppression des cookies depuis
                    le navigateur peut également effacer
                    les préférences précédemment enregistrées.
                </p>
            </>
        ),
    },
    {
        id: "data",
        title: "9. Protection des données personnelles",
        content: (
            <>
                <p>
                    Certaines informations collectées au
                    moyen des cookies ou technologies
                    similaires peuvent constituer des
                    données personnelles lorsqu'elles
                    permettent d'identifier directement
                    ou indirectement un utilisateur.
                </p>

                <p>
                    Le traitement de ces informations
                    est réalisé conformément aux règles
                    applicables en matière de protection
                    des données personnelles, notamment
                    la loi ivoirienne n° 2013-450 du
                    19 juin 2013.
                </p>

                <p>
                    Pour obtenir davantage d'informations
                    sur les données collectées, leurs
                    finalités, leurs destinataires et
                    les droits des personnes concernées,
                    l'utilisateur peut consulter notre
                    Politique de confidentialité.
                </p>

                <p>
                    <a href="/privacy">
                        Consulter la Politique de confidentialité
                    </a>
                </p>
            </>
        ),
    },
    {
        id: "modifications",
        title: "10. Modification et contact",
        content: (
            <>
                <h3>10.1. Modification de la politique</h3>

                <p>
                    Trajet Go peut modifier la présente
                    Politique relative aux cookies afin
                    de tenir compte de l'évolution de ses
                    services, des technologies utilisées
                    ou de la réglementation applicable.
                </p>

                <p>
                    La date de dernière mise à jour est
                    indiquée en haut de cette page.
                </p>

                <h3>10.2. Contact</h3>

                <p>
                    Pour toute question relative à
                    l'utilisation des cookies ou à la
                    gestion des préférences, l'utilisateur
                    peut contacter Trajet Go par les
                    moyens de contact officiellement
                    communiqués sur la plateforme.
                </p>
            </>
        ),
    },
];