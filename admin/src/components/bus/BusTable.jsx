import { BusFront } from "lucide-react";

import Avatar from "@shared/components/ui/Avatar";
import Table from "@shared/components/ui/Table";
import HighlightText from "@shared/components/ui/HighlightText";
import { formatDate } from "@shared/utils/date.utils";

import BusActions from "./BusActions";

import "../../styles/components/bus/BusTable.scss";

const STATUS_LABELS = {
    ACTIVE: "Actif",
    INACTIVE: "Inactif",
    RETIRED: "Retiré",
};

const STATUS_CLASSES = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    RETIRED: "retired",
};

export default function BusTable({
    buses,
    search,
    sort,
    onSort,
    setSelectedAction,
    setSelectedBus,
}) {
    const columns = [
        {
            key: "name",
            label: "Bus",
            sortable: true,
            render: (_, bus) => (
                <div className="bus-table__bus">
                    <div className="bus-table__icon">
                        <BusFront size={24} />
                    </div>

                    <div className="bus-table__bus-info">
                        <HighlightText
                            text={
                                bus.name ||
                                "Bus sans nom"
                            }
                            search={search}
                            as="strong"
                        />

                        <span>
                            ID : {bus.fleetNumber}
                        </span>
                    </div>
                </div>
            ),
        },

        {
            key: "registrationNumber",
            label: "Immatriculation",
            sortable: true,
            render: (_, bus) => (
                <span className="bus-table__registration">
                    <HighlightText
                        text={
                            bus.registrationNumber ||
                            "—"
                        }
                        search={search}
                    />
                </span>
            ),
        },

        {
            key: "capacity",
            label: "Capacité",
            sortable: true,
            render: (_, bus) => (
                <span className="bus-table__capacity">
                    <strong>
                        {bus.capacity ?? 0}
                    </strong>

                    <small>
                        places
                    </small>
                </span>
            ),
        },

        {
            key: "seatLayout",
            label: "Sièges",
            sortable: false,
            render: (_, bus) => {
                const hasSeatLayout =
                    Boolean(bus.seatLayout);

                return (
                    <span
                        className={
                            `bus-table__badge ` +
                            `bus-table__badge--layout-` +
                            (hasSeatLayout
                                ? "configured"
                                : "missing")
                        }
                    >
                        <span className="bus-table__badge-dot" />

                        {hasSeatLayout
                            ? "Configurés"
                            : "Non configurés"}
                    </span>
                );
            },
        },

        {
            key: "status",
            label: "Statut",
            sortable: true,
            render: (_, bus) => (
                <span
                    className={
                        `bus-table__badge ` +
                        `bus-table__badge--status-` +
                        (
                            STATUS_CLASSES[
                            bus.status
                            ] || "unknown"
                        )
                    }
                >
                    <span className="bus-table__badge-dot" />

                    {
                        STATUS_LABELS[
                        bus.status
                        ] ||
                        bus.status ||
                        "—"
                    }
                </span>
            ),
        },

        {
            key: "company",
            label: "Entrprise",
            sortable: true,
            render: (_, bus) => (
                <div className="bus-table__company">
                    <Avatar
                        size="sm"
                        src={bus.company?.logo}
                        name={bus.company?.name}
                    />

                    <span> {bus.company?.name}  </span>
                </div>
            )
        },

        {
            key: "createdAt",
            label: "Ajouté le",
            sortable: true,
            render: (_, bus) => (
                <span className="bus-table__date">
                    {formatDate(
                        bus.createdAt,
                       "dd MMMM yyyy à HH:mm"
                    )}
                </span>
            ),
        },

        {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (_, bus) => (
                <BusActions
                    bus={bus}
                    onView={(bus) => {
                        setSelectedBus(bus);
                        setSelectedAction("VIEW");
                    }}
                    setSelectedAction={setSelectedAction}
                    setSelectedBus={setSelectedBus}
                />
            ),
        },
    ];

    return (
        <Table
            className="bus-table"
            selectable={false}
            columns={columns}
            data={buses}
            sortable
            onSort={onSort}
            defaultSort={sort}
            emptyMessage="Aucun bus trouvé."
            hoverable
            bordered
        />
    );
}