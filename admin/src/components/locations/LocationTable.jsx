import { Globe2, MapPin, Map, Building2 } from "lucide-react";

import Table from "@shared/components/ui/Table";
import HighlightText from "@shared/components/ui/HighlightText";

import LocationActions from "./LocationActions";

/* ------------------------------------------------------------------ */
/* Config par type                                                     */
/* ------------------------------------------------------------------ */

const TYPE_CONFIG = {
    COUNTRY: {
        icon: Globe2,
        label: "Pays",
    },
    REGION: {
        icon: Map,
        label: "Région",
    },
    CITY: {
        icon: Building2,
        label: "Ville",
    },
    LOCATION: {
        icon: MapPin,
        label: "Point",
    },
};

/* ------------------------------------------------------------------ */

export default function LocationTable({
    type,
    items,
    search,
    sort,
    onSort,
    setSelectedAction,
    setSelectedItem,
}) {
    const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.CITY;
    const Icon = config.icon;

    const isCountry = type === "country";
    const isRegion = type === "region";
    const isCity = type === "city";

    /* ---------- Colonnes ---------- */

    const columns = [
        {
            key: "name",
            label: "Nom",
            sortable: true,
            render: (_, item) => (
                <div className="location-table__name">
                    <Icon size={18} aria-hidden="true" />
                    <HighlightText
                        text={item?.name ?? "—"}
                        as="span"
                        search={search}
                    />
                </div>
            ),
        },

        /* Code : pays, région, ville */
        ...((isCountry || isRegion || isCity)
            ? [
                {
                    key: "code",
                    label: "Code",
                    sortable: true,
                    render: (_, item) => (
                        <span className="location-table__code">
                            {item?.code ?? "—"}
                        </span>
                    ),
                },
            ]
            : []),

        /* Pays parent : région + ville */
        ...((isRegion || isCity)
            ? [
                {
                    key: "country",
                    label: "Pays",
                    sortable: true,
                    render: (_, item) => (
                        <HighlightText
                            text={item?.country?.name ?? "—"}
                            as="span"
                            search={search}
                        />
                    ),
                },
            ]
            : []),

        ...((isCountry)
            ? [
                {
                    key: 'cities',
                    label: "Villes",
                    sortable: true,
                    render: (_, item) => (
                        <span>{item?._count?.cities ?? "0"}</span>
                    ),
                },
                {
                    key: 'phoneCode',
                    label: "Indicatif",
                    sortable: false,
                    render: (_, item) => (
                        <span>{item?.phoneCode ?? "-"}</span>
                    ),
                }
            ] : []
        ),

        /* Région parente : ville uniquement */
        ...(isCity
            ? [
                {
                    key: "region",
                    label: "Région",
                    sortable: true,
                    render: (_, item) => (
                        <span>{item?.region?.name ?? "—"}</span>
                    ),
                },
            ]
            : []),

        /* Actions */
        {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (_, item) => (
                <LocationActions
                    item={item}
                    onView={(it) => {
                        setSelectedItem(it);
                        setSelectedAction("VIEW");
                    }}
                    setSelectedAction={setSelectedAction}
                    setSelectedItem={setSelectedItem}
                />
            ),
        },
    ];

    /* ---------- Rendu ---------- */

    return (
        <Table
            className="location-table"
            selectable={false}
            columns={columns}
            data={items}
            sortable
            onSort={onSort}
            defaultSort={sort}
            emptyMessage="Aucun élément trouvé."
            hoverable
            bordered
        />
    );
}