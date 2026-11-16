import { Fragment, useEffect, useMemo, useState } from "react";
import seatsService from "../../../services/seats.service";

import "../../../styles/components/ticket/StepSeat.scss";
import { Armchair } from "lucide-react";

/* ------------------------------------------------------------------ */

const AISLE_AFTER = {
  TWO_PLUS_TWO: 2,
  TWO_PLUS_ONE: 2,
  ONE_PLUS_TWO: 1,
  CUSTOM: null,
};

/* ------------------------------------------------------------------ */

export default function StepSeat({
  tripId,
  value,        // string | "" — id du siège sélectionné
  error,
  onChange,     // (seatId: string) => void
}) {
  const [layout, setLayout] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");

  /* ---------- Chargement ---------- */

  useEffect(() => {
    if (!tripId) return;

    let cancelled = false;
    setLoading(true);
    setServerError("");

    seatsService
      .getSeatsForTrip(tripId)
      .then((result) => {
        if (cancelled) return;
        if (!result.success) {
          setServerError(
            result.message || "Impossible de charger les sièges."
          );
          return;
        }
        setLayout(result.data.layout);
        setSeats(result.data.seats ?? []);
      })
      .catch((err) => {
        if (cancelled) return;
        setServerError(
          err.message || "Impossible de charger les sièges."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tripId]);

  /* ---------- Allée ---------- */

  const aisleAfter = useMemo(
    () => AISLE_AFTER[layout?.type] ?? null,
    [layout]
  );

  /* ---------- Rangées ---------- */

  const rows = useMemo(() => {
    const byRow = new Map();

    seats.forEach((seat) => {
      if (!byRow.has(seat.row)) byRow.set(seat.row, []);
      byRow.get(seat.row).push(seat);
    });

    byRow.forEach((list) =>
      list.sort((a, b) => a.column - b.column)
    );

    return Array.from(byRow.entries())
      .sort(([a], [b]) => a - b)
      .map(([rowNumber, seatsInRow]) => ({
        rowNumber,
        seats: seatsInRow,
      }));
  }, [seats]);

  /* ---------- Stats ---------- */

  const stats = useMemo(() => {
    const total = seats.length;
    const taken = seats.filter((s) => s.isTaken).length;
    return { total, taken, free: total - taken };
  }, [seats]);

  /* ---------- Handler ---------- */

  const handleSelect = (seat) => {
    if (seat.isTaken || seat.status === "INACTIVE") return;
    onChange(seat.id === value ? "" : seat.id);
  };

  /* ---------- Rendu ---------- */

  if (!tripId) {
    return (
      <p className="step-seat__hint">
        Sélectionnez d'abord un voyage.
      </p>
    );
  }

  if (loading) {
    return <p className="step-seat__loading">Chargement du plan...</p>;
  }

  if (serverError) {
    return (
      <p className="step-seat__error" role="alert">
        {serverError}
      </p>
    );
  }

  if (seats.length === 0) {
    return (
      <p className="step-seat__hint">
        Aucun siège disponible pour ce voyage.
      </p>
    );
  }

  return (
    <div className="step-seat">
      {/* ---------- Légende ---------- */}

      <div className="step-seat__legend" role="status" aria-live="polite">
        <span className="step-seat__legend-item step-seat__legend-item--free">
          <span className="step-seat__legend-dot" />
          Libre ({stats.free})
        </span>
        <span className="step-seat__legend-item step-seat__legend-item--taken">
          <span className="step-seat__legend-dot" />
          Réservé ({stats.taken})
        </span>
        <span className="step-seat__legend-item step-seat__legend-item--selected">
          <span className="step-seat__legend-dot" />
          Sélectionné
        </span>
      </div>

      {/* ---------- Plan ---------- */}

      <div
        className="step-seat__bus"
        role="group"
        aria-label="Plan des sièges du bus"
      >
        <div className="step-seat__front">
          <span>Avant du bus</span>
        </div>

        {rows.map(({ rowNumber, seats: seatsInRow }) => (
          <div className="step-seat__row" key={rowNumber}>
            {seatsInRow.map((seat, index) => {
              const isTaken = seat.isTaken;
              const isInactive = seat.status === "INACTIVE";
              const isSelected = seat.id === value;
              const disabled = isTaken || isInactive;

              const showAisle =
                aisleAfter && index === aisleAfter - 1;

              return (
                <Fragment key={seat.id}>
                  <button
                    type="button"
                    className={[
                      "step-seat__seat",
                      isTaken ? "step-seat__seat--taken" : "",
                      isInactive ? "step-seat__seat--inactive" : "",
                      isSelected ? "step-seat__seat--selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => handleSelect(seat)}
                    disabled={disabled}
                    aria-pressed={isSelected}
                    aria-label={`Siège ${seat.number}${isTaken
                        ? " (réservé)"
                        : isInactive
                          ? " (indisponible)"
                          : isSelected
                            ? " (sélectionné)"
                            : ""
                      }`}
                  >
                    <Armchair size={14} />
                    {seat.number}
                  </button>

                  {showAisle && (
                    <span
                      className="step-seat__aisle"
                      aria-hidden="true"
                    />
                  )}
                </Fragment>
              );
            })}
          </div>
        ))}

        <div className="step-seat__back">
          <span>Arrière du bus</span>
        </div>
      </div>

      {/* ---------- Erreur ---------- */}

      {error && (
        <p className="step-seat__field-error" role="alert">
          {error}
        </p>
      )}

      {/* ---------- Récap ---------- */}

      {value && (
        <p className="step-seat__selected">
          Siège sélectionné :{" "}
          <strong>
            {seats.find((s) => s.id === value)?.number ?? "—"}
          </strong>
        </p>
      )}
    </div>
  );
}