import { useEffect, useMemo, useState } from "react";
import { Plus, Minus, Armchair } from "lucide-react";

import "../../styles/components/bus/SeatLayoutBuilder.scss";

/* ------------------------------------------------------------------ */

const MIN_ROWS = 1;
const MAX_ROWS = 20;
const MIN_COLUMNS = 1;
const MAX_COLUMNS = 6;

function generateSeatLabels(rows, columns) {
    const labels = [];
    for (let r = 0; r < rows; r++) {
        const rowLetter = String.fromCharCode(65 + r);
        for (let c = 1; c <= columns; c++) {
            labels.push(`${rowLetter}${c}`);
        }
    }
    return labels;
}

/* ------------------------------------------------------------------ */

export default function SeatLayoutBuilder({
    capacity = 0,
    value = null,
    onChange,
}) {
    const [rows, setRows] = useState(value?.rows ?? 10);
    const [columns, setColumns] = useState(value?.columns ?? 4);
    const [aisleAfterColumn, setAisleAfterColumn] = useState(
        value?.aisleAfterColumn ?? 2
    );
    const [excludedSeats, setExcludedSeats] = useState(
        new Set(value?.excludedSeats ?? [])
    );

    /* ---------- Émission ---------- */

    useEffect(() => {
        onChange?.({
            rows,
            columns,
            aisleAfterColumn,
            excludedSeats: Array.from(excludedSeats),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows, columns, aisleAfterColumn, excludedSeats]);

    /* ---------- Sièges ---------- */

    const seatLabels = useMemo(
        () => generateSeatLabels(rows, columns),
        [rows, columns]
    );

    const totalSeats = seatLabels.length;
    const activeSeats = totalSeats - excludedSeats.size;

    /* ---------- Allée visible ? ---------- */

    const showAisle =
        columns >= 3 &&
        aisleAfterColumn >= 1 &&
        aisleAfterColumn < columns;

    /* ---------- Ordre des items dans la grille ---------- */

    // ✅ Chaque ligne = sièges + une allée après la N-ième colonne
    const gridItems = useMemo(() => {
        const items = [];

        for (let r = 0; r < rows; r++) {
            const rowLetter = String.fromCharCode(65 + r);

            for (let c = 1; c <= columns; c++) {
                items.push({ type: "seat", label: `${rowLetter}${c}` });

                if (showAisle && c === aisleAfterColumn) {
                    items.push({ type: "aisle" });
                }
            }
        }

        return items;
    }, [rows, columns, aisleAfterColumn, showAisle]);

    /* ---------- Template de colonnes ---------- */

    // ✅ Colonnes = columns + (1 si allée)
    const gridTemplateColumns = useMemo(() => {
        const parts = [];

        for (let c = 1; c <= columns; c++) {
            parts.push("minmax(0, 1fr)");
            if (showAisle && c === aisleAfterColumn) {
                parts.push("14px");
            }
        }

        return parts.join(" ");
    }, [columns, aisleAfterColumn, showAisle]);

    /* ---------- Handlers ---------- */

    const updateRows = (delta) =>
        setRows((prev) =>
            Math.min(MAX_ROWS, Math.max(MIN_ROWS, prev + delta))
        );

    const updateColumns = (delta) =>
        setColumns((prev) =>
            Math.min(MAX_COLUMNS, Math.max(MIN_COLUMNS, prev + delta))
        );

    const toggleSeat = (seat) => {
        setExcludedSeats((prev) => {
            const next = new Set(prev);
            if (next.has(seat)) next.delete(seat);
            else next.add(seat);
            return next;
        });
    };

    const handleAutoFill = () => {
        if (!capacity || capacity >= totalSeats) return;
        setExcludedSeats(new Set(seatLabels.slice(capacity)));
    };

    const handleClearAll = () => setExcludedSeats(new Set());

    /* ---------- Rendu ---------- */

    return (
        <div className="seat-builder">
            {/* ---------- Stats ---------- */}

            <div className="seat-builder__stats">
                <div className="seat-builder__stat">
                    <span>Capacité bus</span>
                    <strong>{capacity || "—"}</strong>
                </div>

                <div className="seat-builder__stat">
                    <span>Sièges configurés</span>
                    <strong
                        className={
                            capacity && activeSeats !== capacity
                                ? "seat-builder__stat-warning"
                                : ""
                        }
                    >
                        {activeSeats}
                    </strong>
                </div>

                <div className="seat-builder__stat">
                    <span>Sièges désactivés</span>
                    <strong>{excludedSeats.size}</strong>
                </div>
            </div>

            {/* ---------- Contrôles ---------- */}

            <div className="seat-builder__controls">
                <Counter
                    label="Rangées"
                    value={rows}
                    min={MIN_ROWS}
                    max={MAX_ROWS}
                    onChange={updateRows}
                />

                <Counter
                    label="Colonnes"
                    value={columns}
                    min={MIN_COLUMNS}
                    max={MAX_COLUMNS}
                    onChange={updateColumns}
                />

                {columns >= 3 && (
                    <div className="seat-builder__control">
                        <label htmlFor="aisle">
                            Couloir après la colonne
                        </label>

                        <select
                            id="aisle"
                            value={aisleAfterColumn}
                            onChange={(e) =>
                                setAisleAfterColumn(Number(e.target.value))
                            }
                        >
                            {Array.from(
                                { length: columns - 1 },
                                (_, i) => i + 1
                            ).map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* ---------- Actions ---------- */}

            <div className="seat-builder__actions">
                <button
                    type="button"
                    className="seat-builder__action"
                    onClick={handleAutoFill}
                    disabled={!capacity || capacity >= totalSeats}
                >
                    Ajuster à la capacité
                </button>

                <button
                    type="button"
                    className="seat-builder__action"
                    onClick={handleClearAll}
                    disabled={excludedSeats.size === 0}
                >
                    Tout réactiver
                </button>
            </div>

            {/* ---------- Aperçu ---------- */}

            <div className="seat-builder__preview-wrapper">
                <p className="seat-builder__hint">
                    Cliquez sur un siège pour l'activer / le désactiver.
                </p>

                <div
                    className="seat-builder__grid"
                    style={{ gridTemplateColumns }}
                    role="grid"
                    aria-label="Plan des sièges"
                >
                    {gridItems.map((item, index) => {
                        if (item.type === "aisle") {
                            return (
                                <span
                                    key={`aisle-${index}`}
                                    className="seat-builder__aisle"
                                    aria-hidden="true"
                                />
                            );
                        }

                        const isExcluded = excludedSeats.has(item.label);

                        return (
                            <button
                                key={item.label}
                                type="button"
                                role="gridcell"
                                className={`seat-builder__seat ${isExcluded
                                        ? "seat-builder__seat--excluded"
                                        : ""
                                    }`}
                                aria-label={`Siège ${item.label} ${isExcluded ? "désactivé" : "actif"
                                    }`}
                                aria-pressed={!isExcluded}
                                onClick={() => toggleSeat(item.label)}
                            >
                                <Armchair size={14} aria-hidden="true" />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */

function Counter({ label, value, min, max, onChange }) {
    const decrease = () => onChange(-1);
    const increase = () => onChange(1);

    return (
        <div className="seat-builder__control">
            <label>{label}</label>

            <div className="seat-builder__counter">
                <button
                    type="button"
                    onClick={decrease}
                    disabled={value <= min}
                    aria-label={`Réduire ${label.toLowerCase()}`}
                >
                    <Minus size={14} />
                </button>

                <span aria-live="polite">{value}</span>

                <button
                    type="button"
                    onClick={increase}
                    disabled={value >= max}
                    aria-label={`Augmenter ${label.toLowerCase()}`}
                >
                    <Plus size={14} />
                </button>
            </div>
        </div>
    );
}