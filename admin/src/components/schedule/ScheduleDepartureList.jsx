import { Plus, Trash2 } from "lucide-react";

import Input from "@shared/components/ui/Input";
import Select from "@shared/components/ui/Select";
import Button from "@shared/components/ui/Button";

import "../../styles/components/schedule/ScheduleDepartureList.scss";

/* ------------------------------------------------------------------ */

export default function ScheduleDepartureList({
    departures = [],
    buses = [],
    companyId,
    errors,
    onAdd,
    onUpdate,
    onRemove,
}) {
    const busOptions = buses
        .filter(
            (bus) =>
                bus.status === "ACTIVE" &&
                bus.companyId === companyId
        )
        .map((bus) => ({
            value: bus.id,
            label: `${bus.name ?? bus.registrationNumber} · ${bus.capacity} places`,
        }));

    return (
        <div className="departure-list">
            <header className="departure-list__header">
                <div>
                    <h3>Départs quotidiens</h3>
                    <p>
                        Ajoutez chaque départ avec son bus et son heure.
                        Le prix et la durée sont définis par la ligne.
                    </p>
                </div>

                <Button type="button" variant="secondary" onClick={onAdd}>
                    <Plus size={16} />
                    Ajouter un départ
                </Button>
            </header>

            {departures.length === 0 && (
                <div className="departure-list__empty">
                    Aucun départ. Cliquez sur « Ajouter un départ ».
                </div>
            )}

            <ul className="departure-list__items">
                {departures.map((dep, index) => {
                    const prefix = `departure-${dep.id}`;

                    return (
                        <li key={dep.id} className="departure-item">
                            <header className="departure-item__header">
                                <span className="departure-item__number">
                                    Départ #{index + 1}
                                </span>

                                <button
                                    type="button"
                                    className="departure-item__remove"
                                    onClick={() => onRemove(dep.id)}
                                    aria-label={`Supprimer le départ ${index + 1}`}
                                    disabled={departures.length === 1}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </header>

                            <div className="departure-item__grid">
                                <Select
                                    label="Bus"
                                    name={`${prefix}-busId`}
                                    value={dep.busId}
                                    onChange={(e) =>
                                        onUpdate(
                                            dep.id,
                                            "busId",
                                            e.target.value
                                        )
                                    }
                                    error={errors[`${prefix}-busId`]}
                                    options={busOptions}
                                    required
                                />

                                <Input
                                    label="Heure de départ"
                                    type="time"
                                    name={`${prefix}-departureTime`}
                                    value={dep.departureTime}
                                    onChange={(e) =>
                                        onUpdate(
                                            dep.id,
                                            "departureTime",
                                            e.target.value
                                        )
                                    }
                                    error={
                                        errors[`${prefix}-departureTime`]
                                    }
                                    required
                                />
                            </div>
                        </li>
                    );
                })}
            </ul>

            {errors.departures && (
                <p className="departure-list__error" role="alert">
                    {errors.departures}
                </p>
            )}
        </div>
    );
}