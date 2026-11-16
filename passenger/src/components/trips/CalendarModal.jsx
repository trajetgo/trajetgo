import { useState } from "react";

import DatePicker from "react-datepicker";
import { fr } from "date-fns/locale";

import Modal from "@shared/components/ui/Modal";
import Button from "@shared/components/ui/Button";

import "react-datepicker/dist/react-datepicker.css";
import "../../styles/components/trips/CalendarModal.scss";

/* ------------------------------------------------------------------ */

export default function CalendarModal({
    open,
    initialDate,
    minDate,
    onClose,
    onConfirm,
}) {
    const [date, setDate] = useState(
        initialDate ? new Date(`${initialDate}T00:00:00`) : new Date()
    );

    const handleConfirm = () => {
        if (!date) return;

        const isoDate = date.toISOString().split("T")[0];
        onConfirm(isoDate);
        onClose();
    };

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title="Choisir une date"
            size="sm"
        >
            <div className="calendar-modal">
                <DatePicker
                    inline
                    selected={date}
                    onChange={setDate}
                    minDate={minDate ? new Date(minDate) : new Date()}
                    locale={fr}
                    calendarStartDay={1}
                />

                <footer className="calendar-modal__actions">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                    >
                        Annuler
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleConfirm}
                    >
                        Voir les trajets
                    </Button>
                </footer>
            </div>
        </Modal>
    );
}