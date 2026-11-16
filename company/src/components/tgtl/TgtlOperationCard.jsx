
import {
    Download,
    RefreshCcw,
    Upload,
    ArrowUpRight
} from "lucide-react";

const ITEMS = [
    {
        id: "import",
        label: "Importer une organisation",
        description:
            "Transférez les données de votre compagnie depuis un logiciel externe vers Trajet Go.",
        badgeLabel: "Import TGTL",
        icon: Upload,
        disabled: false
    },
    {
        id: "export",
        label: "Exporter mon organisation",
        description:
            "Générez un fichier TGTL contenant les données de votre organisation.",
        badgeLabel: "Export TGTL",
        icon: Download,
        disabled: false
    },
    {
        id: "sync",
        label: "Synchroniser les modifications",
        description:
            "Comparez les changements entre Trajet Go et votre système externe.",
        badgeLabel: "Bientôt disponible",
        icon: RefreshCcw,
        disabled: true
    }
];

export default function TgtlOperationCard({ onOperation }) {
    return (
        <section className="tgtl-operations">

            <div className="tgtl-operations__heading">
                <div>
                    <h4>Opérations</h4>
                    <p>
                        Gérez les échanges de données de votre organisation.
                    </p>
                </div>
            </div>

            <div className="tgtl-operations__grid">

                {ITEMS.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            type="button"
                            key={item.id}
                            className={`tgtl-operation ${item.disabled ? "tgtl-operation--disabled" : ""}`}
                            onClick={() => onOperation(item.id)}
                            disabled={item.disabled}
                        >
                            <div className="tgtl-operation__top">
                                <div className="tgtl-operation__icon">
                                    <Icon size={21} />
                                </div>

                                {!item.disabled && (
                                    <ArrowUpRight
                                        size={18}
                                        className="tgtl-operation__arrow"
                                    />
                                )}
                            </div>

                            <div className="tgtl-operation__content">
                                <h5>{item.label}</h5>
                                <p>{item.description}</p>
                            </div>

                            <div className="tgtl-operation__footer">
                                <span>{item.badgeLabel}</span>
                            </div>
                        </button>
                    );
                })}

            </div>

        </section>
    );
}
