import { useEffect, useState } from "react";

import Modal from "@shared/components/ui/Modal";
import Input from "@shared/components/ui/Input";
import Button from "@shared/components/ui/Button";
import ActivityIndicator from "@shared/components/ui/ActivityIndicator";
import { useToast } from "@shared/contexts/toast.context";

import service from "../../services/buses.service";

export default function EditBusModal({ open, bus, onClose, onUpdated }) {
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        registrationNumber: "",
        name: "",
        capacity: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    /* ---------- Sync avec le bus ---------- */

    useEffect(() => {
        if (!bus) return;

        setFormData({
            registrationNumber: bus.registrationNumber ?? "",
            name: bus.name ?? "",
            capacity: bus.capacity ?? "",
        });
        setServerError("");
    }, [bus]);

    if (!bus) return null;

    /* ---------- Change ---------- */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
        setServerError("");
    };

    /* ---------- Submit ---------- */

    const handleSubmit = async (e) => {
        e.preventDefault();

        const capacity = Number(formData.capacity);

        if (!formData.registrationNumber.trim()) {
            setServerError("Le numéro d'immatriculation est obligatoire.");
            return;
        }

        if (!Number.isInteger(capacity) || capacity < 1 || capacity > 100) {
            setServerError("La capacité doit être un entier entre 1 et 100.");
            return;
        }

        setIsSubmitting(true);
        setServerError("");

        try {
            const result = await service.updateBus(bus.id, {
                registrationNumber: formData.registrationNumber.trim().toUpperCase(),
                name: formData.name.trim() || null,
                capacity,
            });

            if (!result.success) {
                throw new Error(result.message || "Impossible de modifier le bus.");
            }

            showToast("success", "Bus modifié", "Les modifications ont été enregistrées.");
            onUpdated?.(result.data);
            onClose?.();
        } catch (err) {
            setServerError(err.message || "Impossible de modifier le bus.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title="Modifier le bus"
            size="md"
        >
            <form onSubmit={handleSubmit} className="bus-form" noValidate>
                {serverError && (
                    <div className="server-error" role="alert">
                        <span className="error-icon">⚠️</span>
                        <span>{serverError}</span>
                    </div>
                )}

                <Input
                    label="Immatriculation"
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    required
                />

                <Input
                    label="Nom (optionnel)"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <Input
                    label="Capacité (places)"
                    type="number"
                    name="capacity"
                    min="1"
                    max="100"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                />

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={isSubmitting}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator size={14} type="dots" color="white" />
                    ) : (
                        <span>Enregistrer</span>
                    )}
                </Button>
            </form>
        </Modal>
    );
}