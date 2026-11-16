
import { Clock7, Database } from "lucide-react";

const METRICS = [
    {
        id: "last-sync",
        label: "Dernière synchronisation",
        value: "Jamais",
        icon: Clock7
    },
    {
        id: "resources",
        label: "Ressources synchronisées",
        value: "0",
        icon: Database
    }
];

export default function TgtlOverview() {
    return (
        <section className="tgtl-overview">

            {METRICS.map((metric) => {
                const Icon = metric.icon;

                return (
                    <div
                        className="tgtl-overview__item"
                        key={metric.id}
                    >
                        <div className="tgtl-overview__icon">
                            <Icon size={19} />
                        </div>

                        <div className="tgtl-overview__content">
                            <span>{metric.label}</span>
                            <strong>{metric.value}</strong>
                        </div>
                    </div>
                );
            })}

        </section>
    );
}
