const ROW_LETTERS = "ABCDEFGH".split("");

function resolvePosition(colIdx, columnsPerSide, side) {
    const isFirst = colIdx === 0;
    const isLast = colIdx === columnsPerSide - 1;

    if (columnsPerSide === 1) return "WINDOW";

    if (side === "LEFT") {
        if (isFirst) return "WINDOW";
        if (isLast) return "AISLE";
        return "MIDDLE";
    } else {
        if (isFirst) return "AISLE";
        if (isLast) return "WINDOW";
        return "MIDDLE";
    }
}

export function generateSeatLayout({
    type = "2x2",
    rowsCount = 12,
    exitRows = [],
    vipRows = [],
    randomize = false,
    occupancy = 0.6,
} = {}) {
    const config = {
        "2x2": { left: 2, right: 2 },
        "2x1": { left: 2, right: 1 },
        "1x1": { left: 1, right: 1 },
    }[type] ?? { left: 2, right: 2 };

    const rows = [];

    for (let r = 0; r < rowsCount; r++) {
        const rowNumber = r + 1;
        const seats = [];

        /* Côté gauche */
        for (let c = 0; c < config.left; c++) {
            const letter = ROW_LETTERS[c];
            seats.push(
                buildSeat({
                    number: `${rowNumber}${letter}`,
                    row: rowNumber,
                    column: letter,
                    side: "LEFT",
                    position: resolvePosition(c, config.left, "LEFT"),
                    isVip: vipRows.includes(rowNumber),
                    randomize,
                    occupancy,
                })
            );
        }

        /* Côté droit */
        for (let c = 0; c < config.right; c++) {
            const letter = ROW_LETTERS[config.left + c];
            seats.push(
                buildSeat({
                    number: `${rowNumber}${letter}`,
                    row: rowNumber,
                    column: letter,
                    side: "RIGHT",
                    position: resolvePosition(c, config.right, "RIGHT"),
                    isVip: vipRows.includes(rowNumber),
                    randomize,
                    occupancy,
                })
            );
        }

        rows.push({
            id: `row-${rowNumber}`,
            number: rowNumber,
            isExitRow: exitRows.includes(rowNumber),
            seats,
        });
    }

    const allSeats = rows.flatMap((r) => r.seats);

    return {
        type,
        aisleAfter: config.left,
        columnsPerRow: config.left + config.right,
        rows,
        totals: {
            total: allSeats.length,
            available: allSeats.filter((s) => s.status === "AVAILABLE").length,
            occupied: allSeats.filter((s) => s.status === "OCCUPIED").length,
            reserved: allSeats.filter((s) => s.status === "RESERVED").length,
            blocked: allSeats.filter((s) => s.status === "BLOCKED").length,
        },
    };
}

function buildSeat({
    number,
    row,
    column,
    side,
    position,
    isVip,
    randomize,
    occupancy,
}) {
    let status = "AVAILABLE";

    if (randomize) {
        const r = Math.random();
        if (r < occupancy * 0.85) status = "OCCUPIED";
        else if (r < occupancy * 0.95) status = "RESERVED";
        else if (r < occupancy * 0.98) status = "BLOCKED";
    }

    return {
        id: `seat-${number.toLowerCase()}`,
        number,
        row,
        column,
        side,
        position, // WINDOW | AISLE | MIDDLE
        status,   // AVAILABLE | OCCUPIED | RESERVED | BLOCKED
        type: isVip ? "VIP" : "STANDARD",
        priceModifier: isVip ? 1000 : 0,
    };
}