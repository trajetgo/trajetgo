import { useCallback, useState } from "react";

import Modal from "@shared/components/ui/Modal";
import Button from "@shared/components/ui/Button";
import { useToast } from "@shared/contexts/toast.context";

import SeatLayoutBuilder from "./SeatLayoutBuilder";
import service from "../../services/buses.service";

import "../../styles/components/bus/SeatLayoutModal.scss";

export default function SeatLayoutModal({
    open,
    bus,
    onClose,
    onUpdated,
}) {
    const { showToast } = useToast();

    const [layout, setLayout] = useState(bus?.seatLayout ?? null);
    const [saving, setSaving] = useState(false);

    /* ---------- Handler stable ---------- */

    const handleLayoutChange = useCallback((nextLayout) => {
        setLayout(nextLayout);
    }, []);

    /* ---------- Save ---------- */

    const handleSave = async () => {
        if (!layout) {
            showToast(
                "warning",
                "Aucun plan",
                "Veuillez configurer au moins un siège."
            );
            return;
        }

        // ✅ Construire la liste des sièges
        const seats = buildSeatsFromLayout(layout);

        const payload = {
            name: "Configuration standard",
            type: inferLayoutType(layout),
            rows: layout.rows,
            columns: layout.columns,
            aisleAfterColumn: layout.aisleAfterColumn,
            seats,
        };

        setSaving(true);

        try {
            const result = await service.updateSeatLayout(bus.id, payload);

            if (!result.success) {
                throw new Error(
                    result.message || "Impossible d'enregistrer le plan."
                );
            }

            showToast(
                "success",
                "Plan enregistré",
                "Les sièges ont été configurés avec succès."
            );

            onUpdated?.(result.data);
            onClose?.();
        } catch (err) {
            showToast(
                "error",
                "Erreur",
                err.message || "Impossible d'enregistrer."
            );
        } finally {
            setSaving(false);
        }
    };

    function buildSeatsFromLayout(layout) {
        const { rows, columns, aisleAfterColumn, excludedSeats } = layout;

        const excludedSet = new Set(excludedSeats ?? []);
        const seats = [];

        for (let r = 0; r < rows; r++) {
            const rowNumber = r + 1;
            const rowLetter = String.fromCharCode(65 + r);

            for (let c = 1; c <= columns; c++) {
                const number = `${rowLetter}${c}`;

                const position = computePosition(c, columns, aisleAfterColumn);

                seats.push({
                    number,
                    row: rowNumber,
                    column: c,
                    position,
                    status: excludedSet.has(number) ? "INACTIVE" : "ACTIVE",
                });
            }
        }

        return seats;
    }

    function computePosition(colIdx, totalColumns, aisleAfterColumn) {
        const aisle = aisleAfterColumn ?? Math.ceil(totalColumns / 2);

        // Couloir = colonne virtuelle après `aisle`
        const effectiveCol =
            colIdx > aisle ? colIdx - 1 : colIdx;

        const leftCols = aisle;
        const rightCols = totalColumns - aisle;

        // Côté gauche
        if (colIdx <= leftCols) {
            if (colIdx === 1) return "WINDOW";
            if (colIdx === leftCols) return "AISLE";
            return "MIDDLE";
        }

        // Côté droit
        if (colIdx === aisle + 1) return "AISLE";
        if (colIdx === totalColumns) return "WINDOW";
        return "MIDDLE";
    }

    function inferLayoutType(layout) {
        const { columns, aisleAfterColumn } = layout;

        if (!aisleAfterColumn) return "CUSTOM";

        const left = aisleAfterColumn;
        const right = columns - aisleAfterColumn;

        if (left === 2 && right === 2) return "TWO_PLUS_TWO";
        if (left === 2 && right === 1) return "TWO_PLUS_ONE";
        if (left === 1 && right === 2) return "ONE_PLUS_TWO";

        return "CUSTOM";
    }

    if (!bus) return null;

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={`Sièges · ${bus.name || bus.registrationNumber}`}
            size="lg"
        >
            <SeatLayoutBuilder
                capacity={bus.capacity}
                value={layout}
                onChange={handleLayoutChange}   /* ✅ stable */
            />

            <footer className="seat-layout-modal__actions">
                <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={saving}
                >
                    Annuler
                </Button>

                <Button
                    variant="primary"
                    onClick={handleSave}
                    loading={saving}
                    disabled={saving}
                >
                    Enregistrer
                </Button>
            </footer>
        </Modal>
    );
}