import { Route as RouteIcon, ArrowRight } from "lucide-react";

import Table from "@shared/components/ui/Table";
import HighlightText from "@shared/components/ui/HighlightText";

import RouteActions from "./RouteActions";
import { formatDuration, formatPrice, getRouteStatus } from "../../utils/route.utils";

import "../../styles/components/route/RouteTable.scss";

/* ------------------------------------------------------------------ */

export default function RouteTable({
    routes,
    search,
    sort,
    onSort,
    setSelectedRoute,
    setSelectedAction,
}) {
    /* ---------- Colonnes ---------- */

    const columns = [
        /* -------- Ligne (origine → destination) -------- */
        {
            key: "route",
            label: "Ligne",
            sortable: true,
            render: (_, route) => (
                <div className="route-table__route">
                    <div className="route-table__route-icon">
                        <RouteIcon size={18} aria-hidden="true" />
                    </div>

                    <div className="route-table__route-info">
                        <HighlightText
                            text={route.originCity?.name ?? "—"}
                            search={search}
                            as="strong"
                        />

                        <span
                            className="route-table__route-arrow"
                            aria-hidden="true"
                        >
                            <ArrowRight size={14} />
                        </span>

                        <HighlightText
                            text={route.destinationCity?.name ?? "—"}
                            search={search}
                            as="strong"
                        />
                    </div>
                </div>
            ),
        },

        /* -------- Distance -------- */
        {
            key: "distanceKm",
            label: "Distance",
            sortable: true,
            render: (_, route) =>
                route.distanceKm ? (
                    <span className="route-table__value">
                        {route.distanceKm} km
                    </span>
                ) : (
                    <span className="route-table__empty">—</span>
                ),
        },

        /* -------- Durée -------- */
        {
            key: "durationMin",
            label: "Durée",
            sortable: true,
            render: (_, route) =>
                route.durationMin ? (
                    <span className="route-table__value">
                        {formatDuration(route.durationMin)}
                    </span>
                ) : (
                    <span className="route-table__empty">—</span>
                ),
        },

        /* -------- Prix de base -------- */
        {
            key: "basePrice",
            label: "Prix de base",
            sortable: true,
            render: (_, route) => (
                <span className="route-table__price">
                    {formatPrice(route.basePrice)}
                </span>
            ),
        },

        /* -------- Statut -------- */
        {
            key: "active",
            label: "Statut",
            sortable: true,
            render: (_, route) => {
                const status = getRouteStatus(route.active);

                return (
                    <span
                        className={`route-table__status route-table__status--${status.className}`}
                    >
                        {status.label}
                    </span>
                );
            },
        },

        /* -------- Actions -------- */
        {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (_, route) => (
                <RouteActions
                    route={route}
                    onView={(r) => {
                        setSelectedRoute?.(r);
                        setSelectedAction?.("VIEW");
                    }}
                    setSelectedRoute={setSelectedRoute}
                    setSelectedAction={setSelectedAction}
                />
            ),
        },
    ];

    /* ---------- Rendu ---------- */

    return (
        <Table
            className="route-table"
            selectable={false}
            columns={columns}
            data={routes}
            sortable
            onSort={onSort}
            defaultSort={sort}
            emptyMessage="Aucune ligne trouvée."
            hoverable
            bordered
        />
    );
}