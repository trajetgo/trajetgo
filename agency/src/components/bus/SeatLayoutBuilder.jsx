import { useEffect, useMemo, useState } from "react";
import { Plus, Minus, Armchair } from "lucide-react";

import "../../styles/components/bus/SeatLayoutBuilder.scss";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const MIN_ROWS = 1;
const MAX_ROWS = 20;
const MIN_COLUMNS = 1;
const MAX_COLUMNS = 6;

/**
 * Génère la liste des sièges à partir de la config.
 * @returns {string[]} ex: ["A1","A2","A3","B1",...]
 */
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
    /* ---------- État ---------- */

    const [rows, setRows] = useState(value?.rows ?? 10);
    const [columns, setColumns] = useState(value?.columns ?? 4);
    const [aisleAfterColumn, setAisleAfterColumn] = useState(
        value?.aisleAfterColumn ?? 2
    );
    const [excludedSeats, setExcludedSeats] = useState(
        new Set(value?.excludedSeats ?? [])
    );

    /* ---------- Synchronisation ---------- */

    useEffect(() => {
        if (!value) return;

        setRows(value.rows ?? 10);
        setColumns(value.columns ?? 4);
        setAisleAfterColumn(value.aisleAfterColumn ?? 2);
        setExcludedSeats(new Set(value.excludedSeats ?? []));
    }, [value]);

    /* ---------- Émission des changements ---------- */

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

            if (next.has(seat)) {
                next.delete(seat);
            } else {
                next.add(seat);
            }

            return next;
        });
    };

    const handleAutoFill = () => {
        // Désactiver les sièges excédentaires pour correspondre à `capacity`
        if (!capacity || capacity >= totalSeats) return;

        const toExclude = seatLabels.slice(capacity);
        setExcludedSeats(new Set(toExclude));
    };

    const handleClearAll = () => {
        setExcludedSeats(new Set());
    };

    /* ---------- Rendu ---------- */

    return (
        <div className="seat-builder">
            {/* ---------- Barre de stats ---------- */}

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

            {/* ---------- Actions rapides ---------- */}

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
                    style={{
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                    }}
                    role="grid"
                    aria-label="Plan des sièges"
                >
                    {seatLabels.map((seat) => {
                        const colIdx = Number(seat.slice(1)) - 1;

                        const isAisle =
                            aisleAfterColumn !== undefined &&
                            colIdx === aisleAfterColumn - 1;

                        const isExcluded = excludedSeats.has(seat);

                        return (
                            <button
                                key={seat}
                                type="button"
                                role="gridcell"
                                className={`seat-builder__seat ${
                                    isExcluded
                                        ? "seat-builder__seat--excluded"
                                        : ""
                                } ${
                                    isAisle
                                        ? "seat-builder__seat--aisle-after"
                                        : ""
                                }`}
                                aria-label={`Siège ${seat} ${
                                    isExcluded ? "désactivé" : "actif"
                                }`}
                                aria-pressed={!isExcluded}
                                onClick={() => toggleSeat(seat)}
                            >
                                <Armchair size={14} aria-hidden="true" />
                                <span>{seat}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Sous-composant : compteur +/-                                       */
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