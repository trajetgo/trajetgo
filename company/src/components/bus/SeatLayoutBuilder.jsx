import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Minus, Armchair } from "lucide-react";

import "../../styles/components/bus/SeatLayoutBuilder.scss";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const MIN_ROWS = 1;
const MAX_ROWS = 20;
const MIN_COLUMNS = 1;
const MAX_COLUMNS = 6;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

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

/** Compare deux Sets (valeur par valeur) */
function setsEqual(a, b) {
    if (a.size !== b.size) return false;

    for (const item of a) {
        if (!b.has(item)) return false;
    }

    return true;
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
        () => new Set(value?.excludedSeats ?? [])
    );

    /* ---------- Ref pour éviter la boucle ---------- */

    // On mémorise la dernière valeur émise pour ne pas la réémettre.
    const lastEmittedRef = useRef(null);

    // On mémorise si le changement vient de l'extérieur (prop `value`)
    // pour éviter d'écraser les modifs locales par un sync.
    const lastSyncedValueRef = useRef(null);

    /* ---------- Synchronisation depuis les props ---------- */

    useEffect(() => {
        if (!value) return;

        // Comparer par VALEUR, pas par référence
        const isSameAsLastEmit =
            lastEmittedRef.current &&
            lastEmittedRef.current.rows === value.rows &&
            lastEmittedRef.current.columns === value.columns &&
            lastEmittedRef.current.aisleAfterColumn === value.aisleAfterColumn &&
            setsEqual(
                new Set(lastEmittedRef.current.excludedSeats),
                new Set(value.excludedSeats ?? [])
            );

        if (isSameAsLastEmit) return;

        // Sinon, c'est une vraie mise à jour externe
        setRows(value.rows ?? 10);
        setColumns(value.columns ?? 4);
        setAisleAfterColumn(value.aisleAfterColumn ?? 2);
        setExcludedSeats(new Set(value.excludedSeats ?? []));
    }, [value]);

    /* ---------- Émission vers le parent ---------- */

    const seatLabels = useMemo(
        () => generateSeatLabels(rows, columns),
        [rows, columns]
    );

    useEffect(() => {
        const next = {
            rows,
            columns,
            aisleAfterColumn,
            excludedSeats: Array.from(excludedSeats),
        };

        // ✅ Comparer avec la dernière émission pour éviter la boucle
        const prev = lastEmittedRef.current;

        const isSame =
            prev &&
            prev.rows === next.rows &&
            prev.columns === next.columns &&
            prev.aisleAfterColumn === next.aisleAfterColumn &&
            setsEqual(
                new Set(prev.excludedSeats),
                new Set(next.excludedSeats)
            );

        if (isSame) return;

        // Mémoriser avant d'appeler pour éviter tout re-déclenchement
        lastEmittedRef.current = next;

        onChange?.(next);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows, columns, aisleAfterColumn, excludedSeats]);

    const gridColumns = useMemo(() => {
        if (!aisleAfterColumn || columns < 2) {
            return `repeat(${columns}, minmax(0, 1fr))`;
        }

        const leftCols = aisleAfterColumn;
        const rightCols = columns - leftCols;

        return [
            `repeat(${leftCols}, minmax(0, 1fr))`,
            `20px`,   // largeur du couloir
            `repeat(${rightCols}, minmax(0, 1fr))`,
        ].join(" ");
    }, [columns, aisleAfterColumn]);

    /* ---------- Statistiques ---------- */

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
                    style={{ gridTemplateColumns: gridColumns }}
                    role="grid"
                    aria-label="Plan des sièges"
                >
                    {seatLabels.map((seat, idx) => {
                        const colIdx = Number(seat.slice(1)) - 1;
                        const isExcluded = excludedSeats.has(seat);

                        // Si on est à la 1ère colonne après le couloir, insérer un spacer
                        const needAisleSpacer =
                            aisleAfterColumn &&
                            columns >= 2 &&
                            colIdx === aisleAfterColumn;

                        return (
                            <Fragment key={seat}>
                                {needAisleSpacer && (
                                    <span
                                        className="seat-builder__aisle-spacer"
                                        aria-hidden="true"
                                    />
                                )}

                                <button
                                    type="button"
                                    role="gridcell"
                                    className={`seat-builder__seat ${isExcluded ? "seat-builder__seat--excluded" : ""
                                        }`}
                                    aria-label={`Siège ${seat} ${isExcluded ? "désactivé" : "actif"}`}
                                    aria-pressed={!isExcluded}
                                    onClick={() => toggleSeat(seat)}
                                >
                                    <Armchair size={14} aria-hidden="true" />
                                    <span>{seat}</span>
                                </button>
                            </Fragment>
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