import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import DatePicker from "react-datepicker";
import { fr } from "date-fns/locale";

import "../styles/components/DateSelector.scss";
import "react-datepicker/dist/react-datepicker.css";

export default function DateSelector({
    initialDate = "",
    onSelect,
    onConfirm
}) {
    const [date, setDate] = useState(
        initialDate ? new Date(initialDate) : null
    );

    useEffect(() => {
        setDate(initialDate ? new Date(initialDate) : null);
    }, [initialDate]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const handleSubmit = () => {
        if (!date) return;

        // YYYY-MM-DD
        const iso = date.toISOString().split("T")[0];

        onSelect?.(iso);
        onConfirm?.();
    };

    return (
        <div className="date-selector">

            {/* Header */}
            <div className="date-selector__header">

                <div
                    className="date-selector__icon"
                    aria-hidden="true"
                >
                    <CalendarDays size={24} />
                </div>

                <div>
                    <h2>Quand voyagez-vous ?</h2>

                    <p>
                        Sélectionnez votre date de départ.
                    </p>
                </div>

            </div>

            {/* Calendar */}
            <div className="date-selector__calendar">

                <DatePicker
                    selected={date}
                    onChange={(selectedDate) => {
                        setDate(selectedDate);
                    }}
                    minDate={today}
                    dateFormat="dd/MM/yyyy"
                    locale={fr}
                    calendarStartDay={1}
                    inline
                />

            </div>

            {/* Selected date */}
            {date && (
                <div className="date-selector__selected">

                    <CalendarDays size={18} />

                    <div>
                        <span>Date de départ</span>

                        <strong>
                            {date.toLocaleDateString("fr-FR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            })}
                        </strong>
                    </div>

                </div>
            )}

            {/* Submit */}
            <button
                type="button"
                className="date-selector__submit"
                disabled={!date}
                onClick={handleSubmit}
            >
                Continuer
            </button>

        </div>
    );
}