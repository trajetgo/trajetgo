const {
    EXPECTED_SHEETS,
    SHEET_SCHEMAS,
    ENUMS
} = require("./import.constants");

function createIssue(message, row, column, code, sheet = null) {
    return {
        message,
        row: row || null,
        column: column || null,
        code: code || "INVALID_VALUE",
        sheet
    };
}

function getRows(parsedSheets, sheetName) {
    return parsedSheets[sheetName]?.data || [];
}

function getValue(record, field) {
    const value = record.data[field];

    if (value === null || value === undefined) {
        return null;
    }

    return typeof value === "string" ? value.trim() : value;
}

function isBlank(value) {
    return value === null || value === undefined || value === "";
}

function isPositiveInteger(value) {
    return Number.isInteger(Number(value)) && Number(value) > 0;
}

function isValidCoordinate(value, min, max) {
    if (isBlank(value)) return true;

    const number = Number(value);

    return Number.isFinite(number) && number >= min && number <= max;
}

function isValidDate(value) {
    if (value instanceof Date) {
        return !Number.isNaN(value.getTime());
    }

    if (typeof value !== "string") return false;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
    );
}

function isValidTime(value) {
    if (value instanceof Date) return true;

    if (typeof value === "number") {
        return value >= 0 && value < 1;
    }

    return (
        typeof value === "string" &&
        /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
    );
}

function validateRequiredFields(sheet, records, errors) {
    const requiredFields = SHEET_SCHEMAS[sheet].required;

    records.forEach((record) => {
        requiredFields.forEach((field) => {
            if (isBlank(getValue(record, field))) {
                errors.push(
                    createIssue(
                        `Le champ "${field}" est obligatoire.`,
                        record.rowNumber,
                        field,
                        "REQUIRED_FIELD",
                        sheet
                    )
                );
            }
        });
    });
}

function validateHeaders(sheet, parsed, errors, warnings) {
    const schema = SHEET_SCHEMAS[sheet];

    if (!parsed) return;

    const headers = parsed.headers;

    const duplicatedHeaders = headers.filter(
        (header, index) =>
            header && headers.indexOf(header) !== index
    );

    [...new Set(duplicatedHeaders)].forEach((header) => {
        errors.push(
            createIssue(
                `L'en-tête "${header}" apparaît plusieurs fois.`,
                1,
                header,
                "DUPLICATE_HEADER"
            )
        );
    });

    schema.headers.forEach((expectedHeader) => {
        if (!headers.includes(expectedHeader)) {
            errors.push(
                createIssue(
                    `La colonne "${expectedHeader}" est absente.`,
                    1,
                    expectedHeader,
                    "MISSING_HEADER"
                )
            );
        }
    });

    headers.forEach((header) => {
        if (header && !schema.headers.includes(header)) {
            warnings.push(
                createIssue(
                    `La colonne "${header}" n'est pas reconnue par le standard TGTL.`,
                    1,
                    header,
                    "UNKNOWN_HEADER"
                )
            );
        }
    });
}

function validateUniqueIds(sheet, records, errors) {
    const idField =
        sheet === "Programmations"
            ? "departure_external_id"
            : "external_id";

    const seen = new Map();

    records.forEach((record) => {
        const id = getValue(record, idField);

        if (isBlank(id)) return;

        const normalizedId = String(id).trim().toUpperCase();

        if (seen.has(normalizedId)) {
            errors.push(
                createIssue(
                    `L'identifiant "${id}" est utilisé plusieurs fois dans cette feuille.`,
                    record.rowNumber,
                    idField,
                    "DUPLICATE_EXTERNAL_ID"
                )
            );
            return;
        }

        seen.set(normalizedId, record.rowNumber);
    });
}

function validateEnum(records, field, allowedValues, errors) {
    records.forEach((record) => {
        const value = getValue(record, field);

        if (isBlank(value)) return;

        if (!allowedValues.includes(String(value).toUpperCase())) {
            errors.push(
                createIssue(
                    `Valeur "${value}" invalide. Valeurs autorisées : ${allowedValues.join(", ")}.`,
                    record.rowNumber,
                    field,
                    "INVALID_ENUM"
                )
            );
        }
    });
}


function validateListEnum(records, field, allowedValues, errors) {
    records.forEach((record) => {
        const value = getValue(record, field);

        if (isBlank(value)) return;

        const values = String(value)
            .split(",")
            .map((item) => item.trim().toUpperCase())
            .filter(Boolean);

        const invalidValues = values.filter(
            (item) => !allowedValues.includes(item)
        );

        if (invalidValues.length > 0) {
            errors.push(
                createIssue(
                    `Valeurs invalides : ${invalidValues.join(", ")}. Valeurs autorisées : ${allowedValues.join(", ")}.`,
                    record.rowNumber,
                    field,
                    "INVALID_ENUM"
                )
            );
        }

        if (new Set(values).size !== values.length) {
            errors.push(
                createIssue(
                    "Un même équipement ne doit pas apparaître plusieurs fois.",
                    record.rowNumber,
                    field,
                    "DUPLICATE_ENUM"
                )
            );
        }
    });
}

function validateBasicValues(sheets, errors, warnings) {
    const cities = getRows(sheets, "Villes");
    const agencies = getRows(sheets, "Agences");
    const buses = getRows(sheets, "Bus");
    const seats = getRows(sheets, "Plans_Sieges");
    const routes = getRows(sheets, "Lignes");
    const drivers = getRows(sheets, "Chauffeurs");
    const schedules = getRows(sheets, "Programmations");
    const personnel = getRows(sheets, "Personnel");

    cities.forEach((record) => {
        const latitude = getValue(record, "latitude");
        const longitude = getValue(record, "longitude");

        if (!isValidCoordinate(latitude, -90, 90)) {
            errors.push(
                createIssue(
                    "La latitude doit être comprise entre -90 et 90.",
                    record.rowNumber,
                    "latitude",
                    "INVALID_COORDINATE"
                )
            );
        }

        if (!isValidCoordinate(longitude, -180, 180)) {
            errors.push(
                createIssue(
                    "La longitude doit être comprise entre -180 et 180.",
                    record.rowNumber,
                    "longitude",
                    "INVALID_COORDINATE"
                )
            );
        }
    });

    agencies.forEach((record) => {
        const latitude = getValue(record, "latitude");
        const longitude = getValue(record, "longitude");

        if (!isValidCoordinate(latitude, -90, 90)) {
            errors.push(
                createIssue(
                    "La latitude de l'agence est invalide.",
                    record.rowNumber,
                    "latitude",
                    "INVALID_COORDINATE"
                )
            );
        }

        if (!isValidCoordinate(longitude, -180, 180)) {
            errors.push(
                createIssue(
                    "La longitude de l'agence est invalide.",
                    record.rowNumber,
                    "longitude",
                    "INVALID_COORDINATE"
                )
            );
        }
    });

    buses.forEach((record) => {
        const capacity = getValue(record, "capacity");

        if (!isBlank(capacity) && !isPositiveInteger(capacity)) {
            errors.push(
                createIssue(
                    "La capacité doit être un nombre entier positif.",
                    record.rowNumber,
                    "capacity",
                    "INVALID_CAPACITY"
                )
            );
        }
    });

    seats.forEach((record) => {
        ["row_number", "column_number"].forEach((field) => {
            const value = getValue(record, field);

            if (!isBlank(value) && !isPositiveInteger(value)) {
                errors.push(
                    createIssue(
                        `${field} doit être un entier positif.`,
                        record.rowNumber,
                        field,
                        "INVALID_SEAT_POSITION"
                    )
                );
            }
        });
    });

    routes.forEach((record) => {
        /* ---------- base_price ---------- */

        const basePrice = getValue(record, "base_price");

        if (!isBlank(basePrice) && !isPositiveInteger(basePrice)) {
            errors.push(
                createIssue(
                    "Le prix de base doit être un entier positif en FCFA.",
                    record.rowNumber,
                    "base_price",
                    "INVALID_AMOUNT"
                )
            );
        }

        /* ---------- distance ---------- */

        const distance = getValue(record, "distance");

        if (!isBlank(distance)) {
            const n = Number(distance);

            if (!Number.isFinite(n) || n <= 0) {
                errors.push(
                    createIssue(
                        "La distance doit être un nombre positif (km).",
                        record.rowNumber,
                        "distance",
                        "INVALID_DISTANCE"
                    )
                );
            }
        }

        /* ---------- duration ---------- */

        const duration = getValue(record, "duration");

        if (!isBlank(duration)) {
            const n = Number(duration);

            if (!Number.isInteger(n) || n <= 0) {
                errors.push(
                    createIssue(
                        "La durée doit être un entier positif (minutes).",
                        record.rowNumber,
                        "duration",
                        "INVALID_DURATION"
                    )
                );
            }
        }
    });

    drivers.forEach((record) => {
        const email = getValue(record, "email");

        if (!isBlank(email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
            errors.push(
                createIssue(
                    "L'adresse e-mail du chauffeur n'est pas valide.",
                    record.rowNumber,
                    "email",
                    "INVALID_EMAIL"
                )
            );
        }

        const licenseCategory = getValue(record, "license_category");

        if (!isBlank(licenseCategory) && !ENUMS.licenseCategories.includes(String(licenseCategory).toUpperCase())) {
            errors.push(
                createIssue(
                    `Catégorie de permis "${licenseCategory}" invalide.`,
                    record.rowNumber,
                    "license_category",
                    "INVALID_LICENSE_CATEGORY"
                )
            );
        }
    });

    schedules.forEach((record) => {
        // Heure de départ
        const departureTime = getValue(record, "departure_time");

        if (!isBlank(departureTime) && !isValidTime(departureTime)) {
            errors.push(
                createIssue(
                    "L'heure de départ doit respecter le format HH:MM.",
                    record.rowNumber,
                    "departure_time",
                    "INVALID_TIME"
                )
            );
        }

        // Dates
        ["start_date", "end_date"].forEach((field) => {
            const value = getValue(record, field);

            if (!isBlank(value) && !isValidDate(value)) {
                errors.push(
                    createIssue(
                        "La date doit respecter le format YYYY-MM-DD.",
                        record.rowNumber,
                        field,
                        "INVALID_DATE"
                    )
                );
            }
        });

        const start = getValue(record, "start_date");
        const end = getValue(record, "end_date");

        if (
            isValidDate(start) &&
            isValidDate(end) &&
            new Date(end) < new Date(start)
        ) {
            errors.push(
                createIssue(
                    "La date de fin doit être postérieure ou égale à la date de début.",
                    record.rowNumber,
                    "end_date",
                    "INVALID_DATE_RANGE"
                )
            );
        }

        // Jours de circulation
        const days = getValue(record, "days_of_week");

        if (!isBlank(days)) {
            const values = String(days)
                .split(",")
                .map((day) => day.trim().toUpperCase())
                .filter(Boolean);

            const invalidDays = values.filter(
                (day) => !ENUMS.daysOfWeek.includes(day)
            );

            if (invalidDays.length > 0) {
                errors.push(
                    createIssue(
                        `Jours invalides : ${invalidDays.join(", ")}.`,
                        record.rowNumber,
                        "days_of_week",
                        "INVALID_DAYS"
                    )
                );
            }

            if (new Set(values).size !== values.length) {
                errors.push(
                    createIssue(
                        "Un même jour ne doit pas apparaître plusieurs fois.",
                        record.rowNumber,
                        "days_of_week",
                        "DUPLICATE_DAY"
                    )
                );
            }
        }

        // Prix
        const price = getValue(record, "price");

        if (!isBlank(price) && !isPositiveInteger(price)) {
            errors.push(
                createIssue(
                    "Le prix de programmation doit être un entier positif en FCFA.",
                    record.rowNumber,
                    "price",
                    "INVALID_AMOUNT"
                )
            );
        }

        // Durée facultative : le fallback Route.durationMin
        // sera appliqué lors de la génération des voyages.
        const duration = getValue(record, "duration_minutes");

        if (!isBlank(duration)) {
            const minutes = Number(duration);

            if (!Number.isInteger(minutes) || minutes <= 0) {
                errors.push(
                    createIssue(
                        "La durée doit être un entier positif exprimé en minutes.",
                        record.rowNumber,
                        "duration_minutes",
                        "INVALID_DURATION"
                    )
                );
            }
        }

        // auto_generate : ExcelJS peut retourner un booléen natif
        const autoGenerate = getValue(record, "auto_generate");

        if (
            !isBlank(autoGenerate) &&
            ![true, false, "TRUE", "FALSE"].includes(
                typeof autoGenerate === "string"
                    ? autoGenerate.toUpperCase()
                    : autoGenerate
            )
        ) {
            errors.push(
                createIssue(
                    "La valeur doit être TRUE ou FALSE.",
                    record.rowNumber,
                    "auto_generate",
                    "INVALID_BOOLEAN"
                )
            );
        }
    });

    personnel.forEach((record) => {
        const email = getValue(record, "email");

        if (
            !isBlank(email) &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))
        ) {
            errors.push(
                createIssue(
                    "L'adresse e-mail n'est pas valide.",
                    record.rowNumber,
                    "email",
                    "INVALID_EMAIL"
                )
            );
        }
    });
}

function createIdMap(records) {
    return new Map(
        records
            .map((record) => [
                String(getValue(record, "external_id") || "").toUpperCase(),
                record
            ])
            .filter(([id]) => id)
    );
}

function validateReference({
    records,
    field,
    targetMap,
    targetLabel,
    errors
}) {
    records.forEach((record) => {
        const reference = getValue(record, field);

        if (isBlank(reference)) return;

        const key = String(reference).toUpperCase();

        if (!targetMap.has(key)) {
            errors.push(
                createIssue(
                    `La référence "${reference}" ne correspond à aucun élément de la feuille ${targetLabel}.`,
                    record.rowNumber,
                    field,
                    "INVALID_REFERENCE"
                )
            );
        }
    });
}

function validateRelationships(sheets, errors) {
    const cities = createIdMap(getRows(sheets, "Villes"));
    const agencies = createIdMap(getRows(sheets, "Agences"));
    const buses = createIdMap(getRows(sheets, "Bus"));
    const routes = createIdMap(getRows(sheets, "Lignes"));

    const agencyRows = getRows(sheets, "Agences");
    const routeRows = getRows(sheets, "Lignes");
    const drivers = getRows(sheets, "Chauffeurs");
    const scheduleRows = getRows(sheets, "Programmations");

    validateReference({
        records: agencyRows,
        field: "city_external_id",
        targetMap: cities,
        targetLabel: "Villes",
        errors
    });

    validateReference({
        records: getRows(sheets, "Plans_Sieges"),
        field: "bus_external_id",
        targetMap: buses,
        targetLabel: "Bus",
        errors
    });

    routeRows.forEach((record) => {
        const originCity = getValue(record, "origin_city_external_id");
        const destinationCity = getValue(record, "destination_city_external_id");
        const departureAgency = getValue(record, "departure_agency_external_id");
        const arrivalAgency = getValue(record, "arrival_agency_external_id");

        if (originCity && destinationCity && originCity === destinationCity) {
            errors.push(
                createIssue(
                    "La ville de départ et la ville d'arrivée doivent être différentes.",
                    record.rowNumber,
                    "destination_city_external_id",
                    "INVALID_ROUTE"
                )
            );
        }

        if (departureAgency && agencies.has(String(departureAgency).toUpperCase())) {
            const agencyCity = getValue(
                agencies.get(String(departureAgency).toUpperCase()),
                "city_external_id"
            );

            if (
                originCity &&
                String(agencyCity).toUpperCase() !== String(originCity).toUpperCase()
            ) {
                errors.push(
                    createIssue(
                        "L'agence de départ doit appartenir à la ville d'origine de la ligne.",
                        record.rowNumber,
                        "departure_agency_external_id",
                        "AGENCY_CITY_MISMATCH"
                    )
                );
            }
        }

        if (arrivalAgency && agencies.has(String(arrivalAgency).toUpperCase())) {
            const agencyCity = getValue(
                agencies.get(String(arrivalAgency).toUpperCase()),
                "city_external_id"
            );

            if (
                destinationCity &&
                String(agencyCity).toUpperCase() !== String(destinationCity).toUpperCase()
            ) {
                errors.push(
                    createIssue(
                        "L'agence d'arrivée doit appartenir à la ville de destination de la ligne.",
                        record.rowNumber,
                        "arrival_agency_external_id",
                        "AGENCY_CITY_MISMATCH"
                    )
                );
            }
        }
    });

    validateReference({
        records: scheduleRows,
        field: "route_external_id",
        targetMap: routes,
        targetLabel: "Lignes",
        errors
    });

    validateReference({
        records: scheduleRows,
        field: "bus_external_id",
        targetMap: buses,
        targetLabel: "Bus",
        errors
    });

    validateReference({
        records: scheduleRows,
        field: "departure_agency_external_id",
        targetMap: agencies,
        targetLabel: "Agences",
        errors
    });

    validateReference({
        records: scheduleRows,
        field: "arrival_agency_external_id",
        targetMap: agencies,
        targetLabel: "Agences",
        errors
    });

    validateReference({
        records: getRows(sheets, "Personnel"),
        field: "agency_external_id",
        targetMap: agencies,
        targetLabel: "Agences",
        errors
    });
}


function validateSheetEnums(sheets, errors) {
    // Agences
    validateEnum(
        getRows(sheets, "Agences"),
        "status",
        ENUMS.status,
        errors
    );

    // Bus
    validateEnum(
        getRows(sheets, "Bus"),
        "status",
        ENUMS.busStatus,
        errors
    );

    validateEnum(
        getRows(sheets, "Bus"),
        "seat_layout_type",
        ENUMS.seatLayoutTypes,
        errors
    );

    // Lignes
    validateEnum(
        getRows(sheets, "Lignes"),
        "status",
        ENUMS.status,
        errors
    );

    // Chauffeurs
    validateEnum(
        getRows(sheets, "Chauffeurs"),
        "status",
        ENUMS.driverStatus,
        errors
    );

    validateEnum(
        getRows(sheets, "Chauffeurs"),
        "license_category",
        ENUMS.licenseCategories,
        errors
    );

    // Sièges
    validateEnum(
        getRows(sheets, "Plans_Sieges"),
        "position",
        ENUMS.seatPositions,
        errors
    );

    validateEnum(
        getRows(sheets, "Plans_Sieges"),
        "status",
        ENUMS.seatStatus,
        errors
    );

    // Programmations
    validateEnum(
        getRows(sheets, "Programmations"),
        "schedule_status",
        ENUMS.status,
        errors
    );

    validateEnum(
        getRows(sheets, "Programmations"),
        "departure_status",
        ENUMS.status,
        errors
    );

    // Personnel
    validateEnum(
        getRows(sheets, "Personnel"),
        "status",
        ENUMS.status,
        errors
    );

    validateEnum(
        getRows(sheets, "Personnel"),
        "role",
        ENUMS.roles,
        errors
    );

    // Équipements du bus
    validateListEnum(
        getRows(sheets, "Bus"),
        "amenities",
        ENUMS.busAmenities,
        errors
    );
}

function buildSheetReports(parsedWorkbook, sheetIssues) {
    return Object.keys(SHEET_SCHEMAS).map((sheetName) => {
        const records = getRows(parsedWorkbook.sheets, sheetName);
        const issues = sheetIssues[sheetName];

        const errors = issues.errors;
        const warnings = issues.warnings;

        const errorRows = new Set(
            errors
                .map((issue) => issue.row)
                .filter((row) => row !== null)
        );

        const warningRows = new Set(
            warnings
                .map((issue) => issue.row)
                .filter((row) => row !== null)
        );

        const status = errors.length > 0
            ? "ERROR"
            : warnings.length > 0
                ? "WARNING"
                : "SUCCESS";

        return {
            name: sheetName,
            label: sheetName,
            status,
            totalRows: records.length,
            validRows: Math.max(0, records.length - errorRows.size),
            errorRows: errorRows.size,
            warningRows: warningRows.size,
            errors,
            warnings
        };
    });
}

function validateWorkbook(parsedWorkbook) {
    const globalErrors = [];
    const globalWarnings = [];

    parsedWorkbook.missingSheets.forEach((sheetName) => {
        globalErrors.push(
            createIssue(
                `La feuille obligatoire "${sheetName}" est absente du classeur.`,
                null,
                null,
                "MISSING_SHEET"
            )
        );
    });

    parsedWorkbook.unexpectedSheets.forEach((sheetName) => {
        globalWarnings.push(
            createIssue(
                `La feuille "${sheetName}" ne fait pas partie du standard TGTL.`,
                null,
                null,
                "UNKNOWN_SHEET"
            )
        );
    });

    const sheetIssues = {};

    Object.keys(SHEET_SCHEMAS).forEach((sheetName) => {
        sheetIssues[sheetName] = {
            errors: [],
            warnings: []
        };

        const parsed = parsedWorkbook.sheets[sheetName];

        if (!parsed) return;

        validateHeaders(
            sheetName,
            parsed,
            sheetIssues[sheetName].errors,
            sheetIssues[sheetName].warnings
        );

        const records = getRows(parsedWorkbook.sheets, sheetName);

        validateRequiredFields(
            sheetName,
            records,
            sheetIssues[sheetName].errors
        );

        validateUniqueIds(
            sheetName,
            records,
            sheetIssues[sheetName].errors
        );
    });

    validateBasicValues(
        parsedWorkbook.sheets,
        Object.values(sheetIssues).flatMap((item) => item.errors),
        globalWarnings
    );

    // Les validations transversales sont centralisées ici.
    const crossReferenceErrors = [];

    validateRelationships(
        parsedWorkbook.sheets,
        crossReferenceErrors
    );

    validateSheetEnums(
        parsedWorkbook.sheets,
        crossReferenceErrors
    );

    // Les erreurs transversales sont rattachées à leur feuille.
    crossReferenceErrors.forEach((issue) => {
        const targetSheet = Object.keys(SHEET_SCHEMAS).find(
            (sheetName) => {
                const records = getRows(parsedWorkbook.sheets, sheetName);

                return records.some(
                    (record) => record.rowNumber === issue.row
                ) && SHEET_SCHEMAS[sheetName].headers.includes(issue.column);
            }
        );

        if (targetSheet) {
            sheetIssues[targetSheet].errors.push(issue);
        } else {
            globalErrors.push(issue);
        }
    });

    const sheets = buildSheetReports(
        parsedWorkbook,
        sheetIssues
    );

    const errors = [
        ...globalErrors,
        ...sheets.flatMap((sheet) => sheet.errors)
    ];

    const warnings = [
        ...globalWarnings,
        ...sheets.flatMap((sheet) => sheet.warnings)
    ];

    const totalRows = sheets.reduce(
        (total, sheet) => total + sheet.totalRows,
        0
    );

    const validRows = sheets.reduce(
        (total, sheet) => total + sheet.validRows,
        0
    );

    const errorRows = sheets.reduce(
        (total, sheet) => total + sheet.errorRows,
        0
    );

    const warningRows = sheets.reduce(
        (total, sheet) => total + sheet.warningRows,
        0
    );

    const status = errors.length > 0
        ? "ERROR"
        : warnings.length > 0
            ? "WARNING"
            : "SUCCESS";

    return {
        status,

        summary: {
            totalSheets: parsedWorkbook.sheetNames.length,
            validSheets: sheets.filter(
                (sheet) => sheet.status === "SUCCESS"
            ).length,
            totalRows,
            validRows,
            errorRows,
            warningRows
        },

        sheets,
        errors: globalErrors,
        warnings: globalWarnings
    };
}

module.exports = {
    validateWorkbook
};