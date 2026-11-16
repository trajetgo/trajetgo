import { useMemo } from "react";

import Select from "@shared/components/ui/Select";

import { formatPrice } from "../../../utils/route.utils";

export default function StepTrip({
    formData,
    errors,
    touched,
    onChange,
    onBlur,
    trips = [],
    loading = false,
    serverError = "",
}) {
    /* ✅ Filtre : départ à venir depuis l'agence de l'utilisateur */
    const availableTrips = useMemo(() => {
        const now = new Date();
        return trips
            .filter((t) => t.status === "SCHEDULED")
            .filter((t) => new Date(t.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [trips]);

    const options = availableTrips.map((trip) => ({
        value: trip.id,
        label: `${trip.departure.city} → ${trip.arrival.city} · ${new Date(trip.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} · ${formatPrice(trip.price)}`,
    }));

    const selected = availableTrips.find((t) => t.id === formData.tripId);

    if (loading) return <p>Chargement des départs...</p>;
    if (serverError) return <p className="sell-ticket-form__error" role="alert">{serverError}</p>;
    if (options.length === 0) return <p>Aucun départ disponible à venir.</p>;

    return (
        <>
            <Select
                label="Voyage"
                name="tripId"
                value={formData.tripId}
                onChange={onChange}
                onBlur={onBlur}
                error={touched.tripId && errors.tripId}
                options={options}
                required
            />

            {selected && (
                <div className="sell-ticket-form__summary">
                    <p><strong>Départ :</strong> {new Date(selected.date).toLocaleString("fr-FR")}</p>
                    <p><strong>Durée :</strong> {selected.duration}</p>
                    <p><strong>Prix :</strong> {formatPrice(selected.price)}</p>
                </div>
            )}
        </>
    );
}