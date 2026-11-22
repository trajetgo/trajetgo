
const EXPECTED_SHEETS = [
    "LISEZ_MOI",
    "Compagnie",
    "Villes",
    "Agences",
    "Bus",
    "Chauffeurs",
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
            "registration_number",
            "taxId",
            "country_code",
            "address",
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

    Chauffeurs: {
        headers: [
            "external_id",
            "first_name",
            "last_name",
            "phone",
            "email",
            "license_number",
            "license_category",
            "status"
        ],
        defaultColumns: ["status"],
        required: [
            "external_id",
            "first_name",
            "last_name"
        ]
    },

    Plans_Sieges: {
        headers: [
            "external_id",
            "bus_external_id",
            "seat_number",
            "row_number",
            "column_number",
            "position",
            "status"
        ],
        defaultColumns: ["position", "status"],
        required: [
            "external_id",
            "bus_external_id",
            "seat_number",
            "row_number",
            "column_number"
        ]
    },

    Lignes: {
        headers: [
            "external_id",
            "origin_city_external_id",
            "destination_city_external_id",
            "distance",
            "duration",
            "base_price",
            "status"
        ],
        defaultColumns: ["status"],
        required: [
            "external_id",
            "origin_city_external_id",
            "destination_city_external_id",
            "distance",
            "duration",
            "base_price"
        ]
    },

    Programmations: {
        headers: [
            "external_id",
            "route_external_id",
            "departure_agency_external_id",
            "arrival_agency_external_id",
            "price",
            "duration_minutes",
            "days_of_week",
            "start_date",
            "end_date",
            "auto_generate",
            "schedule_status",
            "departure_external_id",
            "departure_time",
            "bus_external_id",
            "driver_external_id",
            "departure_status"
        ],
        defaultColumns: [
            "duration_minutes",
            "end_date",
            "auto_generate",
            "schedule_status",
            "driver_external_id",
            "departure_status"
        ],
        required: [
            "external_id",
            "route_external_id",
            "departure_agency_external_id",
            "arrival_agency_external_id",
            "price",
            "days_of_week",
            "start_date",
            "departure_external_id",
            "departure_time",
            "bus_external_id"
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
        defaultColumns: ["email", "agency_external_id", "status"],
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
    status: [
        "ACTIVE",
        "INACTIVE"
    ],

    busStatus: [
        "ACTIVE",
        "INACTIVE",
        "RETIRED"
    ],

    driverStatus: [
        "ACTIVE",
        "INACTIVE",
        "ON_LEAVE",
        "SUSPENDED"
    ],

    seatStatus: [
        "ACTIVE",
        "INACTIVE"
    ],

    seatLayoutTypes: [
        "TWO_PLUS_TWO",
        "TWO_PLUS_ONE",
        "ONE_PLUS_TWO",
        "CUSTOM"
    ],

    seatPositions: [
        "WINDOW",
        "AISLE",
        "MIDDLE"
    ],

    busAmenities: [
        "AIR_CONDITIONING",
        "WIFI",
        "USB_CHARGING",
        "POWER_OUTLET",
        "TOILET",
        "TV",
        "RECLINING_SEATS",
        "READING_LIGHT",
        "LUGGAGE_SPACE"
    ],

    roles: [
        "COMPANY_ADMIN",
        "AGENCY_AGENT",
        "CONTROLLER"
    ],

    licenseCategories: [
        "A",
        "B",
        "C",
        "D",
        "E"
    ],

    daysOfWeek: [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY"
    ],

    boolean: [
        "TRUE",
        "FALSE"
    ]
};

module.exports = {
    EXPECTED_SHEETS,
    SHEET_SCHEMAS,
    ENUMS
};
