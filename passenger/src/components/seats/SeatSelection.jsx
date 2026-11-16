import { useEffect, useMemo, useState } from "react";
import { Zap, Armchair, Eraser } from "lucide-react";

import "../../styles/components/seats/SeatSelection.scss";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function findBestSeats(availableSeats, count) {
    if (availableSeats.length < count) return [];

    /* ---------- Grouper par rangée ---------- */

    const byRow = availableSeats.reduce((acc, seat) => {
        if (!acc[seat.row]) acc[seat.row] = [];
        acc[seat.row].push(seat);
        return acc;
    }, {});

    const sortedRows = Object.keys(byRow)
        .map(Number)
        .sort((a, b) => a - b);

    /* ---------- Chercher des sièges consécutifs ---------- */

    for (const rowNum of sortedRows) {
        // ✅ Tri numérique
        const rowSeats = [...byRow[rowNum]].sort(
            (a, b) => a.column - b.column
        );

        for (let i = 0; i <= rowSeats.length - count; i++) {
            const candidate = rowSeats.slice(i, i + count);

            // ✅ Consécutivité numérique
            const isConsecutive = candidate.every(
                (seat, idx) =>
                    idx === 0 ||
                    seat.column - candidate[idx - 1].column === 1
            );

            if (isConsecutive) return candidate;
        }
    }

    /* ---------- Fallback : premiers sièges ---------- */

    return availableSeats
        .slice()
        .sort((a, b) => {
            if (a.row !== b.row) return a.row - b.row;
            return a.column - b.column;
        })
        .slice(0, count);
}

/* ------------------------------------------------------------------ */

export default function SeatSelection({
    seatLayout,
    unavailableSeatIds = [],     // ✅ reçu
    passengers = 1,
    value = [],
    onChange,
}) {
    const [mode, setMode] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState(value);

    /* ---------- Sync avec la prop `value` ---------- */

    useEffect(() => {
        setSelectedSeats(value);
    }, [value]);

    /* ---------- Enrichir le layout avec les indisponibles ---------- */

    const enrichedLayout = useMemo(() => {
        if (!seatLayout) return null;

        const unavailableSet = new Set(unavailableSeatIds);

        /* =========================================================
           1. Construire les rangées
        ========================================================= */

        let rows = [];

        if (Array.isArray(seatLayout.rows)) {
            /* Format "rows[]" (déjà groupé) */
            rows = seatLayout.rows;
        } else if (Array.isArray(seatLayout.seats)) {
            /* Format "seats[]" plat → grouper par row */
            const byRow = new Map();

            for (const seat of seatLayout.seats) {
                if (!byRow.has(seat.row)) {
                    byRow.set(seat.row, []);
                }
                byRow.get(seat.row).push(seat);
            }

            rows = Array.from(byRow.entries())
                .sort(([a], [b]) => a - b)
                .map(([rowNum, seats]) => ({
                    id: `row-${rowNum}`,
                    number: rowNum,
                    isExitRow: false,
                    seats: [...seats].sort((a, b) => a.column - b.column),
                }));
        }

        /* =========================================================
           2. Surcharger le status (indisponibles)
        ========================================================= */


        const enrichedRows = rows.map((row) => ({
            ...row,
            seats: row.seats.map((seat) => {
                const unavailable = unavailableSet.has(seat.id);

                let status;

                if (unavailable) {
                    status = "OCCUPIED";
                } else if (
                    seat.status === "INACTIVE" ||
                    seat.status === "OCCUPIED"
                ) {
                    status = seat.status;
                } else {
                    status = "AVAILABLE";
                }

                return {
                    ...seat,
                    status,
                };
            }),
        }));


        /* =========================================================
           3. Colonnes / aisle
        ========================================================= */

        const columnsPerRow =
            seatLayout.columnsPerRow ??
            seatLayout.columns ??
            4;

        const aisleAfter =
            seatLayout.aisleAfter ??
            seatLayout.aisleAfterColumn ??
            2;

        return {
            ...seatLayout,
            rows: enrichedRows,
            columnsPerRow,
            aisleAfter,
        };
    }, [seatLayout, unavailableSeatIds]);

    /* ---------- Notifie le parent ---------- */

    const updateSelection = (next) => {
        setSelectedSeats(next);
        onChange?.(next);
    };

    /* ---------- Sièges disponibles ---------- */

    const availableSeats = useMemo(() => {
        if (!enrichedLayout?.rows) return [];

        return enrichedLayout.rows
            .flatMap((row) => row.seats)
            .filter((seat) => seat.status === "AVAILABLE");
    }, [enrichedLayout]);

    const columnsPerRow = enrichedLayout?.columnsPerRow ?? 4;
    const aisleAfter = enrichedLayout?.aisleAfter ?? 2;

    const notEnoughSeats = availableSeats.length < passengers;

    /* ---------- Auto ---------- */

    const handleAutomaticSelection = () => {
        if (notEnoughSeats) return;

        const chosen = findBestSeats(availableSeats, passengers);

        if (chosen.length < passengers) return;

        setMode("automatic");
        updateSelection(chosen);
    };

    /* ---------- Manuel ---------- */

    const handleManualSelection = () => {
        setMode("manual");
        updateSelection([]);
    };

    const toggleSeat = (seat) => {
        if (seat.status !== "AVAILABLE") return;

        const alreadySelected = selectedSeats.some((s) => s.id === seat.id);

        if (alreadySelected) {
            updateSelection(selectedSeats.filter((s) => s.id !== seat.id));
            return;
        }

        if (selectedSeats.length >= passengers) return;

        updateSelection([...selectedSeats, seat]);
    };

    const clearSelection = () => updateSelection([]);

    /* ---------- Rendu ---------- */

    const remaining = passengers - selectedSeats.length;

    return (
        <div className="seat-selection">
            {/* ---------- Choix mode ---------- */}

            <div className="seat-selection__options">
                <button
                    type="button"
                    className={`seat-selection__option ${mode === "automatic"
                        ? "seat-selection__option--active"
                        : ""
                        }`}
                    onClick={handleAutomaticSelection}
                    disabled={notEnoughSeats}
                    title={
                        notEnoughSeats
                            ? `Il ne reste que ${availableSeats.length} place(s)`
                            : undefined
                    }
                >
                    <span className="seat-selection__option-icon">
                        <Zap size={20} />
                    </span>

                    <span className="seat-selection__option-content">
                        <strong>
                            {mode === "automatic"
                                ? "Nouveau tirage"
                                : "Choix automatique"}
                        </strong>
                        <span>
                            {mode === "automatic"
                                ? "Cliquez pour changer de places."
                                : "Laissez-nous sélectionner vos places."}
                        </span>
                    </span>
                </button>

                <button
                    type="button"
                    className={`seat-selection__option ${mode === "manual"
                        ? "seat-selection__option--active"
                        : ""
                        }`}
                    onClick={handleManualSelection}
                >
                    <span className="seat-selection__option-icon">
                        <Armchair size={20} />
                    </span>

                    <span className="seat-selection__option-content">
                        <strong>Choix manuel</strong>
                        <span>Choisissez vos places dans le bus.</span>
                    </span>
                </button>
            </div>

            {/* ---------- Mode auto ---------- */}

            {mode === "automatic" && (
                <div className="seat-selection__automatic">
                    <h3>Vos places</h3>

                    <div className="seat-selection__selected-list">
                        {selectedSeats.map((seat) => (
                            <span
                                key={seat.id}
                                className="seat-selection__selected-seat"
                            >
                                {seat.number}
                            </span>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="seat-selection__retry"
                        onClick={handleAutomaticSelection}
                    >
                        <Zap size={14} />
                        Changer de places
                    </button>
                </div>
            )}

            {/* ---------- Mode manuel ---------- */}

            {mode === "manual" && (
                <div className="seat-selection__manual">
                    {/* Légende */}
                    <div className="seat-selection__legend">
                        <span>
                            <i className="seat seat--available" />
                            Disponible
                        </span>
                        <span>
                            <i className="seat seat--selected" />
                            Sélectionnée
                        </span>
                        <span>
                            <i className="seat seat--occupied" />
                            Indisponible
                        </span>
                    </div>

                    {/* Plan */}
                    <div className="seat-selection__bus">
                        <div className="seat-selection__driver">
                            <span aria-hidden="true">🚌</span>
                            Conducteur
                        </div>

                        <div className="seat-selection__layout" role="grid">
                            {enrichedLayout?.rows?.map((row) => (
                                <div
                                    key={row.id || row.number}
                                    className={`seat-selection__row ${row.isExitRow
                                        ? "seat-selection__row--exit"
                                        : ""
                                        }`}
                                    style={{
                                        gridTemplateColumns: `repeat(${columnsPerRow}, 1fr)`,
                                    }}
                                >
                                    {row.seats.map((seat, idx) => {
                                        const selected = selectedSeats.some(
                                            (s) => s.id === seat.id
                                        );

                                        const isAisle =
                                            idx === aisleAfter - 1;

                                        const disabled =
                                            seat.status !== "AVAILABLE";

                                        return (
                                            <button
                                                key={seat.id}
                                                type="button"
                                                role="gridcell"
                                                disabled={disabled}
                                                className={[
                                                    "seat",
                                                    `seat--${seat.status.toLowerCase()}`,
                                                    selected && "seat--selected",
                                                    isAisle && "seat--aisle",
                                                    seat.type === "VIP" &&
                                                    "seat--vip",
                                                ]
                                                    .filter(Boolean)
                                                    .join(" ")}
                                                onClick={() => toggleSeat(seat)}
                                                aria-label={`Siège ${seat.number}, ${seat.status.toLowerCase()}`}
                                                aria-pressed={selected}
                                            >
                                                {seat.number}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Résumé */}
                    <div className="seat-selection__summary">
                        <span className="seat-selection__summary-count">
                            {selectedSeats.length} / {passengers} place
                            {passengers > 1 ? "s" : ""} sélectionnée
                            {selectedSeats.length > 1 ? "s" : ""}
                        </span>

                        <div className="seat-selection__summary-chips">
                            {selectedSeats.map((seat) => (
                                <span
                                    key={seat.id}
                                    className="seat-selection__chip"
                                >
                                    {seat.number}
                                </span>
                            ))}

                            {selectedSeats.length > 0 && (
                                <button
                                    type="button"
                                    className="seat-selection__clear"
                                    onClick={clearSelection}
                                >
                                    <Eraser size={14} />
                                    Tout effacer
                                </button>
                            )}
                        </div>

                        {remaining > 0 && (
                            <p className="seat-selection__hint">
                                Sélectionnez encore {remaining} place
                                {remaining > 1 ? "s" : ""}.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}