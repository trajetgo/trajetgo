import {
    CheckCircle2,
    Eye,
    XCircle,
    Ban,
} from "lucide-react";

export default function AgencyActions({
    agency,
    onView,
    setSelectedAction,
}) {
    const handleAction = (status) => {
        setSelectedAction({
            agency,
            status,
        });
    };

    return (
        <div className="agency-actions">

            {/* Voir */}
            <button
                type="button"
                className="
                    agency-actions__btn
                    agency-actions__btn--neutral
                "
                title="Voir les détails"
                aria-label={`Voir les détails de ${agency.name}`}
                onClick={() => onView?.(agency)}
            >
                <Eye size={16} />
            </button>


            {/* ACTIVE → Désactiver */}
            {agency.status === "ACTIVE" && (
                <button
                    type="button"
                    className="
                        agency-actions__btn
                        agency-actions__btn--warning
                    "
                    title="Désactiver l'agence"
                    aria-label={`Désactiver ${agency.name}`}
                    onClick={() =>
                        handleAction("DEACTIVATE")
                    }
                >
                    <XCircle size={16} />
                </button>
            )}


            {/* INACTIVE → Activer */}
            {agency.status === "INACTIVE" && (
                <button
                    type="button"
                    className="
                        agency-actions__btn
                        agency-actions__btn--primary
                    "
                    title="Activer l'agence"
                    aria-label={`Activer ${agency.name}`}
                    onClick={() =>
                        handleAction("ACTIVATE")
                    }
                >
                    <CheckCircle2 size={16} />
                </button>
            )}


            {/* ACTIVE ou INACTIVE → Fermer */}
            {agency.status !== "CLOSED" && (
                <button
                    type="button"
                    className="
                        agency-actions__btn
                        agency-actions__btn--danger
                    "
                    title="Fermer l'agence"
                    aria-label={`Fermer ${agency.name}`}
                    onClick={() =>
                        handleAction("CLOSE")
                    }
                >
                    <Ban size={16} />
                </button>
            )}

        </div>
    );
}