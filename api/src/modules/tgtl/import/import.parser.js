const ExcelJS = require("exceljs");

const {
    EXPECTED_SHEETS,
    SHEET_SCHEMAS
} = require("./import.constants");

function normalizeValue(value) {
    if (value === null || value === undefined) {
        return null;
    }

    if (value instanceof Date) {
        return value;
    }

    if (typeof value === "object") {
        // rich text: { richText: [{ text }, ...] }
        if (Array.isArray(value.richText)) {
            return normalizeValue(value.richText.map((part) => part.text).join(""));
        }

        // hyperlink (e.g. an email typed as a link): { text, hyperlink }
        if (value.text !== undefined) {
            return normalizeValue(value.text);
        }

        // formula: { formula, result }
        if (value.result !== undefined) {
            return normalizeValue(value.result);
        }

        // error cell (#N/A...) -> keep as an invalid string so validators flag it
        if (value.error !== undefined) {
            return String(value.error);
        }
    }

    if (typeof value === "string") {
        const normalized = value.trim();

        return normalized === "" ? null : normalized;
    }

    return value;
}

// A row is "empty" when every column except the template's pre-filled
// defaults (e.g. status = ACTIVE) is blank.
function isEmptyRow(values, headers, ignoredColumns) {
    return values.every((value, index) => {
        if (ignoredColumns.includes(headers[index])) return true;

        return value === null || value === undefined || value === "";
    });
}

function parseSheet(worksheet, schema) {
    const headerRow = worksheet.getRow(1);

    // row.values is 1-based and sparse: use an index loop, not slice/map
    const headers = [];

    for (let col = 1; col <= headerRow.cellCount; col++) {
        headers.push(String(normalizeValue(headerRow.getCell(col).value) ?? ""));
    }

    const ignoredColumns = schema.defaultColumns || [];
    const data = [];

    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber);

        const values = headers.map((_, index) => {
            return normalizeValue(row.getCell(index + 1).value);
        });

        if (isEmptyRow(values, headers, ignoredColumns)) continue;

        const record = {};

        headers.forEach((header, index) => {
            if (header) {
                record[header] = values[index];
            }
        });

        data.push({
            rowNumber,
            data: record
        });
    }

    return {
        headers,
        data
    };
}

async function parseWorkbook(buffer) {
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.load(buffer);

    const workbookSheets = workbook.worksheets.map(
        (worksheet) => worksheet.name
    );

    const missingSheets = EXPECTED_SHEETS.filter(
        (name) => !workbookSheets.includes(name)
    );

    const unexpectedSheets = workbookSheets.filter(
        (name) => !EXPECTED_SHEETS.includes(name)
    );

    const parsedSheets = {};

    for (const sheetName of Object.keys(SHEET_SCHEMAS)) {
        const worksheet = workbook.getWorksheet(sheetName);

        if (!worksheet) continue;

        parsedSheets[sheetName] = parseSheet(worksheet, SHEET_SCHEMAS[sheetName]);
    }

    return {
        sheetNames: workbookSheets,
        missingSheets,
        unexpectedSheets,
        sheets: parsedSheets
    };
}

module.exports = {
    parseWorkbook
};