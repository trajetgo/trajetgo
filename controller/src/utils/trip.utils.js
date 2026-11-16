function parsePositiveInt(value, fallback = 1) {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
}

function parseChildren(value) {
    if (!value) return [];
    return value
        .split(",")
        .map((v) => Number.parseInt(v, 10))
        .filter((n) => Number.isFinite(n) && n >= 0);
}

function isValidDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value ?? "");
}

export {
    isValidDate,
    parseChildren,
    parsePositiveInt,
}