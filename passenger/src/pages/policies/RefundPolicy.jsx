import {
    AlertTriangle,
    CheckCircle,
    Clock,
    CreditCard,
    XCircle
} from "lucide-react";

import "../../styles/pages/policies/Policies.scss";

export default function RefundPolicy() {
    const refundCategories = [
        {
            icon: <CheckCircle size={22} />,
            title: "Remboursement accepté",
            items: [
                "Annulation d'une réservation dans les conditions prévues par le transporteur",
                "Trajet annulé par la compagnie de transport",
                "Paiement effectué mais réservation non confirmée",
                "Paiement débité alors que le billet n'a pas été généré",
                "Double paiement identifié pour une même réservation"
            ]
        },
        {
            icon: <Clock size={22} />,
            title: "Délais de remboursement",
            items: [
                "Le délai dépend du moyen de paiement utilisé",
                "Le remboursement peut nécessiter un délai de traitement par le prestataire de paiement",
                "Trajet Go peut afficher le statut du remboursement dans l'espace utilisateur",
                "Un remboursement peut apparaître plus tard sur le compte mobile money ou bancaire"
            ]
        },
        {
            icon: <XCircle size={22} />,
            title: "Remboursement non garanti",
            items: [
                "Billet non utilisé après le départ du véhicule",
                "Absence du passager au moment de l'embarquement",
                "Annulation effectuée après le délai autorisé",
                "Conditions particulières prévues par la compagnie de transport",
                "Frais ou services déjà consommés lorsque ceux-ci ne sont pas remboursables"
            ]
        }
    ];

    return (
        <section className="legal-page">

            <div className="legal-page__container">

                <div className="legal-page__hero">

                    <CreditCard
                        size={60}
                        className="legal-page__icon"
                    />

                    <h1>
                        Politique de remboursement
                    </h1>

                    <p>
                        Cette politique explique les conditions dans
                        lesquelles une réservation ou un paiement effectué
                        via Trajet Go peut donner lieu à un remboursement.
                    </p>

                </div>

                <div className="legal-warning">

                    <strong>Important</strong>

                    <p>
                        Les conditions d'annulation et de remboursement
                        peuvent varier selon la compagnie de transport,
                        le trajet et le type de billet. Les conditions
                        applicables sont présentées à l'utilisateur avant
                        la confirmation de sa réservation.
                    </p>

                </div>

                <div className="legal-grid">

                    {refundCategories.map((category) => (

                        <article
                            key={category.title}
                            className="legal-card"
                        >

                            <div className="legal-card__icon">
                                {category.icon}
                            </div>

                            <h2>
                                {category.title}
                            </h2>

                            <ul>

                                {category.items.map((item) => (

                                    <li key={item}>
                                        {item}
                                    </li>

                                ))}

                            </ul>

                        </article>

                    ))}

                </div>

                <section className="legal-section">

                    <h2>
                        Annulation d'une réservation
                    </h2>

                    <p>
                        Une réservation peut être annulée conformément
                        aux conditions applicables au billet et à la
                        compagnie de transport concernée.
                    </p>

                    <p>
                        Lorsque l'annulation est autorisée, le montant
                        remboursable et les éventuels frais applicables
                        sont déterminés selon les conditions affichées
                        lors de la réservation.
                    </p>

                </section>

                <section className="legal-section">

                    <h2>
                        Annulation par la compagnie
                    </h2>

                    <p>
                        Lorsqu'un trajet est annulé par la compagnie de
                        transport, les passagers concernés peuvent être
                        éligibles à un remboursement conformément aux
                        conditions applicables au trajet.
                    </p>

                    <p>
                        Selon la situation, la compagnie peut également
                        proposer un report du voyage ou une autre solution.
                    </p>

                </section>

                <section className="legal-section">

                    <h2>
                        Paiement effectué mais réservation non confirmée
                    </h2>

                    <p>
                        Si le paiement a été débité mais que la réservation
                        n'a pas été correctement confirmée, Trajet Go peut
                        procéder à une vérification de la transaction.
                    </p>

                    <p>
                        Lorsqu'un remboursement est nécessaire, celui-ci
                        est effectué selon le moyen de paiement utilisé et
                        les procédures du prestataire de paiement concerné.
                    </p>

                </section>

                <section className="legal-section">

                    <h2>
                        Demande de remboursement
                    </h2>

                    <p>
                        Lorsqu'une demande de remboursement est nécessaire,
                        l'utilisateur peut contacter le support Trajet Go
                        en indiquant notamment son numéro de réservation,
                        son billet ou les informations de la transaction
                        concernée.
                    </p>

                    <p>
                        Des informations supplémentaires peuvent être
                        demandées afin de vérifier la transaction et
                        déterminer son éligibilité au remboursement.
                    </p>

                </section>

                <section className="legal-section">

                    <h2>
                        Mode de remboursement
                    </h2>

                    <p>
                        Lorsque cela est possible, le remboursement est
                        effectué vers le même moyen de paiement que celui
                        utilisé lors de la transaction initiale.
                    </p>

                    <p>
                        Le délai d'apparition des fonds peut varier selon
                        le prestataire de paiement, notamment pour les
                        paiements par Mobile Money ou carte bancaire.
                    </p>

                </section>

                <section className="legal-section">

                    <h2>
                        Billets non utilisés
                    </h2>

                    <p>
                        Le fait de ne pas utiliser un billet ne constitue
                        pas automatiquement un droit au remboursement.
                        Les conditions applicables dépendent notamment de
                        la date et de l'heure du départ ainsi que des
                        conditions définies par la compagnie.
                    </p>

                </section>

                <div className="legal-note">

                    <strong>
                        À retenir
                    </strong>

                    <p>
                        Avant de confirmer une réservation, vérifiez
                        attentivement les conditions d'annulation et de
                        remboursement affichées pour votre trajet. En cas
                        de difficulté concernant un paiement ou une
                        réservation, contactez le support Trajet Go.
                    </p>

                </div>

            </div>

        </section>
    );
}