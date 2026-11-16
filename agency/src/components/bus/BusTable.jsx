import {
    BusFront,
} from "lucide-react";

import Table from "@shared/components/ui/Table";
import HighlightText from "@shared/components/ui/HighlightText";
import { formatDate } from "@shared/utils/date.utils";

import BusActions from "./BusActions";

import {
    AMENITY_OPTIONS,
    getBusStatus,
} from "../../utils/bus.utils";

import "../../styles/components/bus/BusTable.scss";

/* ------------------------------------------------------------------ */

const MAX_VISIBLE_AMENITIES = 4;

/* ------------------------------------------------------------------ */

export default function BusTable({
    buses,
    search,
    sort,
    onSort,
    setSelectedAction,
    setSelectedBus,
}) {
    const columns = [
        /* -------- Bus -------- */
        {
            key: "name",
            label: "Bus",
            sortable: true,
            render: (_, bus) => (
                <div className="bus-table__bus">
                    <div className="bus-table__icon">
                        <BusFront size={24} aria-hidden="true" />
                    </div>

                    <div className="bus-table__bus-info">
                        <HighlightText
                            text={bus.name || "Bus sans nom"}
                            search={search}
                            as="strong"
                        />

                        {bus.fleetNumber && (
                            <span>ID : {bus.fleetNumber}</span>
                        )}
                    </div>
                </div>
            ),
        },

        /* -------- Immatriculation -------- */
        {
            key: "registrationNumber",
            label: "Immatriculation",
            sortable: true,
            render: (_, bus) => (
                <span className="bus-table__registration">
                    <HighlightText
                        text={bus.registrationNumber || "—"}
                        search={search}
                    />
                </span>
            ),
        },

        /* -------- Capacité -------- */
        {
            key: "capacity",
            label: "Capacité",
            sortable: true,
            render: (_, bus) => (
                <span className="bus-table__capacity">
                    <strong>{bus.capacity ?? 0}</strong>
                    <small>places</small>
                </span>
            ),
        },

        /* -------- Sièges -------- */
        {
            key: "seatLayout",
            label: "Sièges",
            sortable: false,
            render: (_, bus) => {
                const hasSeatLayout = Boolean(bus.seatLayout);

                return (
                    <span
                        className={`bus-table__badge bus-table__badge--layout-${hasSeatLayout ? "configured" : "missing"
                            }`}
                    >
                        <span className="bus-table__badge-dot" />
                        {hasSeatLayout ? "Configurés" : "Non configurés"}
                    </span>
                );
            },
        },

        /* -------- Confort -------- */
        {
            key: "amenities",
            label: "Confort",
            sortable: false,
            render: (_, bus) => {
                const amenities = bus?.amenities ?? [];

                if (amenities.length === 0) {
                    return (
                        <span className="bus-table__empty">
                            Aucun
                        </span>
                    );
                }

                const visible = amenities.slice(
                    0,
                    MAX_VISIBLE_AMENITIES
                );

                const remaining =
                    amenities.length - visible.length;

                return (
                    <div className="bus-table__amenities">
                        {visible.map((amenity) => {
                            /* ✅ Indexation correcte */
                            const config = AMENITY_OPTIONS[amenity];

                            if (!config) return null;

                            const Icon = config.icon;

                            return (
                                <span
                                    key={amenity}
                                    className="bus-table__amenity"
                                    title={config.label}
                                >
                                    <Icon size={14} />
                                </span>
                            );
                        })}

                        {remaining > 0 && (
                            <span
                                className="bus-table__amenity bus-table__amenity--more"
                                title={`${remaining} équipement${remaining > 1 ? "s" : ""
                                    } supplémentaire${remaining > 1 ? "s" : ""}`}
                            >
                                +{remaining}
                            </span>
                        )}
                    </div>
                );
            },
        },

        /* -------- Statut -------- */
        {
            key: "status",
            label: "Statut",
            sortable: true,
            render: (_, bus) => {
                const status = getBusStatus(bus.status);

                return (
                    <span
                        className={`bus-table__badge bus-table__badge--status-${status.className}`}
                    >
                        <span className="bus-table__badge-dot" />
                        {status.label}
                    </span>
                );
            },
        },

        /* -------- Ajouté le -------- */
        {
            key: "createdAt",
            label: "Ajouté le",
            sortable: true,
            render: (_, bus) => (
                <span className="bus-table__date">
                    {formatDate(bus.createdAt, "dd MMM yyyy")}
                </span>
            ),
        },

        /* -------- Actions -------- */
        {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (_, bus) => (
                <BusActions
                    bus={bus}
                    onView={(b) => {
                        setSelectedBus(b);
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