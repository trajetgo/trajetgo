import { 
    Building2, 
    Bus, 
    CalendarClock, 
    Clock7, 
    Database, 
    Route, 
    Users 
} from "lucide-react";

function formatDate(value) {
    if (!value) return "Jamais";

    return new Date(value).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function TgtlOverview({ status, loading }) {

    const resources = status?.resources ?? {};

    const metrics = [
        {
            id: "last-sync",
            label: "Dernière synchronisation",
            value: loading ? "…" : formatDate(status?.lastSyncAt),
            icon: Clock7,
        },
        {
            id: "total",
            label: "Ressources synchronisées",
            value: loading ? "…" : (resources.total ?? 0),
            icon: Database,
        },
        {
            id: "agencies",
            label: "Agences",
            value: loading ? "…" : (resources.agencies ?? 0),
            icon: Building2,
        },
        {
            id: "buses",
            label: "Bus",
            value: loading ? "…" : (resources.buses ?? 0),
            icon: Bus,
        },
        {
            id: "routes",
            label: "Lignes",
            value: loading ? "…" : (resources.routes ?? 0),
            icon: Route,
        },
        {
            id: "schedules",
            label: "Programmations",
            value: loading ? "…" : (resources.schedules ?? 0),
            icon: CalendarClock,
        },
        {
            id: "staff",
            label: "Personnel invité",
            value: loading ? "…" : (resources.staff ?? 0),
            icon: Users,
        },
    ];

    return (
        <section className="tgtl-overview">
            {metrics.map((metric) => {
                const Icon = metric.icon;

                return (
                    <div className="tgtl-overview__item" key={metric.id}>
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
