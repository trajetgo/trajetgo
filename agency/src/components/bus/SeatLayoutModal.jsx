import { useState } from "react";

import Modal from "@shared/components/ui/Modal";
import Button from "@shared/components/ui/Button";
import { useToast } from "@shared/contexts/toast.context";

import SeatLayoutBuilder from "./SeatLayoutBuilder";

import service from "../../services/buses.service";

export default function SeatLayoutModal({ open, bus, onClose, onUpdated }) {
    const { showToast } = useToast();
    const [layout, setLayout] = useState(bus?.seatLayout ?? null);
    const [saving, setSaving] = useState(false);

    if (!bus) return null;

    const handleSave = async () => {
        setSaving(true);

        try {
            const result = await service.updateSeatLayout(bus.id, layout);

            if (!result.success) {
                throw new Error(result.message || "Impossible d'enregistrer le plan.");
            }

            showToast("success", "Plan enregistré", "Les sièges ont été configurés.");
            onUpdated?.(result.data);
            onClose?.();
        } catch (err) {
            showToast("error", "Erreur", err.message);
        } finally {
            setSaving(false);
        }
    };

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
                onChange={setLayout}
            />

            <footer className="seat-layout-modal__actions">
                <Button variant="secondary" onClick={onClose} disabled={saving}>
                    Annuler
                </Button>
                <Button variant="primary" onClick={handleSave} loading={saving}>
                    Enregistrer
                </Button>
            </footer>
        </Modal>
    );
}