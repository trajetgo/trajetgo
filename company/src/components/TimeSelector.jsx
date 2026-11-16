import { useState } from 'react';
import TimePicker from 'react-time-picker';

import "../styles/components/TimeSelector.scss";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { Timer } from 'lucide-react';

export default function TimeSelector({
    initialHour = "",
    onSelect,
    onConfirm
}) {
    const [hour, setHour] = useState(
        initialHour ? new Date(initialHour) : null
    );

    const handleSubmit = () => {
        if (!hour) return;

        const iso = hour.toISOString();

        onSelect?.(iso);
        onConfirm?.();
    };

    return (
        <div className="timer-selector">

            {/* Header */}
            <div className="timer-selector__header">

                <div
                    className="timer-selector__icon"
                    aria-hidden="true"
                >
                    <Timer size={24} />
                </div>

                <div>
                    <h2>A quelle heure le départ ?</h2>

                    <p>
                        Sélectionnez votre heure de départ.
                    </p>
                </div>

                <div className="timer-selector__hour">

                    <TimePicker
                        value={hour}
                        onChange={setHour}
                    />

                </div>

                {/* Selected hour */}
                {hour && (
                    <div className="timer-selector__selected">

                        <Timer size={18} />

                        <div>
                            <span>Heure de départ</span>

                            <strong>
                                {hour.toLocaleTimeString()}
                            </strong>
                        </div>

                    </div>
                )}

                {/* Submit */}
                <button
                    type="button"
                    className="timer-selector__submit"
                    disabled={!hour}
                    onClick={handleSubmit}
                >
                    Continuer
                </button>

            </div>

        </div>
    )
}
