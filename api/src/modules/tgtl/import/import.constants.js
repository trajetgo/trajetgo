const EXPECTED_SHEETS = [
    "LISEZ_MOI",
    "Compagnie",
    "Villes",
    "Agences",
    "Bus",
    "Plans_Sieges",
    "Lignes",
    "Programmations",
    "Personnel"
];

const SHEET_SCHEMAS = {
    Compagnie: {
        headers: [
            "external_id",
            "name",
            "legal_name",
            "registration_number (RCCM)",
            "taxId (DFE)",
            "country_code",
            "address (siège)",
            "currency",
            "phone",
            "email",
            "logo",
            "website"
        ],
        required: [
            "external_id",
            "name",
            "country_code",
            "currency"
        ]
    },

    Villes: {
        headers: [
            "external_id",
            "country_code",
            "city_name",
            "region_name",
            "latitude",
            "longitude"
        ],
        required: [
            "external_id",
            "country_code",
            "city_name"
        ]
    },

    Agences: {
        headers: [
            "external_id",
            "name",
            "city_external_id",
            "address",
            "phone",
            "latitude",
            "longitude",
            "status"
        ],
        defaultColumns: ["status"],
        required: [
            "external_id",
            "name",
            "city_external_id"
        ]
    },

    Bus: {
        headers: [
            "external_id",
            "name",
            "registration_number",
            "fleet_number",
            "brand_name",
            "capacity",
            "seat_layout_type",
            "aisle_after_column",
            "status",
            "amenities"
        ],
        defaultColumns: ["status", "amenities"],
        required: [
            "external_id",
            "registration_number",
            "capacity"
        ]
    },

    Plans_Sieges: {
        headers: [
            "bus_external_id",
            "seat_number",
            "row_number",
            "column_number",
            "position",
            "status"
        ],
        required: [
            "bus_external_id",
            "seat_number",
            "row_number",
            "column_number"
        ]
    },

    Lignes: {
        headers: [
            "external_id",
            "name",
            "origin_city_external_id",
            "destination_city_external_id",
            "departure_agency_external_id",
            "arrival_agency_external_id",
            "status"
        ],
        required: [
            "external_id",
            "name",
            "origin_city_external_id",
            "destination_city_external_id"
        ]
    },

    Programmations: {
        headers: [
            "external_id",
            "route_external_id",
            "departure_agency_external_id",
            "arrival_agency_external_id",
            "bus_external_id",
            "departure_time",
            "arrival_time",
            "days_of_week",
            "start_date",
            "end_date",
            "status"
        ],
        required: [
            "external_id",
            "route_external_id",
            "departure_time",
            "days_of_week",
            "start_date"
        ]
    },

    Personnel: {
        headers: [
            "external_id",
            "first_name",
            "last_name",
            "phone",
            "email",
            "role",
            "agency_external_id",
            "status"
        ],
        required: [
            "external_id",
            "first_name",
            "last_name",
            "phone",
            "role"
        ]
    }
};

const ENUMS = {
    status: ["ACTIVE", "INACTIVE"],

    roles: [
        "COMPANY_ADMIN",
        "AGENCY_AGENT",
        "CONTROLLER"
    ],

    daysOfWeek: [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY"
    ]
};

module.exports = {
    EXPECTED_SHEETS,
    SHEET_SCHEMAS,
    ENUMS
};