import {
    Clock,
    Clock4,
    TrendingDown,
    TrendingUp,
    Timer,
    Sparkles,
    Wallet,
} from "lucide-react";

import Input from "@shared/components/ui/Input";
import Modal from "@shared/components/ui/Modal";

import "../../styles/components/trips/TripFiltersModal.scss";

/* ------------------------------------------------------------------ */
/* Tri                                                                 */
/* ------------------------------------------------------------------ */

const SORT_OPTIONS = [
    {
        value: "RECOMMENDED",
        label: "Recommandés",
        description: "Meilleur rapport qualité-prix",
        Icon: Sparkles,
        sortBy: "departureAt",
        sortOrder: "asc",
    },
    {
        value: "DEPARTURE_TIME_ASC",
        label: "Heure de départ",
        description: "Du plus tôt au plus tard",
        Icon: Clock,
        sortBy: "departureAt",
        sortOrder: "asc",
    },
    {
        value: "ARRIVAL_TIME_ASC",
        label: "Heure d'arrivée",
        description: "Du plus tôt au plus tard",
        Icon: Clock4,
        sortBy: "arrivalAt",
        sortOrder: "asc",
    },
    {
        value: "PRICE_ASC",
        label: "Prix le plus bas",
        description: "D'abord les moins chers",
        Icon: TrendingDown,
        sortBy: "price",
        sortOrder: "asc",
    },
    {
        value: "PRICE_DESC",
        label: "Prix le plus élevé",
        description: "D'abord les plus chers",
        Icon: TrendingUp,
        sortBy: "price",
        sortOrder: "desc",
    },
    {
        value: "DURATION_ASC",
        label: "Temps de trajet",
        description: "Du plus court au plus long",
        Icon: Timer,
        sortBy: "duration",
        sortOrder: "asc",
    },
];

/* ------------------------------------------------------------------ */

export default function TripFiltersModal({
    open,
    onClose,
    filters,
    onChange,
}) {
    /* ---------- Déterminer la clé de tri active ---------- */

    const currentSortValue =
        SORT_OPTIONS.find(
            (opt) =>
                opt.sortBy === filters.sortBy &&
                opt.sortOrder === filters.sortOrder
        )?.value ?? "RECOMMENDED";

    /* ---------- Handlers ---------- */

    const handleSortSelect = (value) => {
        const option = SORT_OPTIONS.find((o) => o.value === value);
        if (!option) return;

        // ✅ Un seul appel avec un objet
        onChange({
            sortBy: option.sortBy,
            sortOrder: option.sortOrder,
        });
    };

    const handlePriceChange = (key, value) => {
        // Valeur numérique ou ""
        const parsed = value === "" ? "" : Number(value);
        onChange(key, parsed);
    };

    const handleReset = () => {
        onChange("reset");
    };

    /* ---------- Détection du tri par défaut ---------- */

    const isDefaultSort = currentSortValue === "RECOMMENDED";
    const hasPriceFilter =
        filters.minPrice !== "" || filters.maxPrice !== "";

    const isResetDisabled = isDefaultSort && !hasPriceFilter;

    /* ---------- Rendu ---------- */

    return (
        <Modal
            title="Tri & filtres"
            isOpen={open}
            onClose={onClose}
            size="sm"
        >
            <div className="trip-filters">
                {/* =====================================================
                    TRI
                ===================================================== */}

                <section className="trip-filters__section">
                    <h3 className="trip-filters__section-title">
                        Trier par
                    </h3>

                    <ul
                        className="trip-filters__list"
                        role="radiogroup"
                        aria-label="Options de tri"
                    >
                        {SORT_OPTIONS.map((option) => {
                            const {
                                value,
                                label,
                                description,
                                Icon,
                            } = option;

                            const isActive =
                                currentSortValue === value;

                            return (
                                <li key={value}>
                                    <button
                                        type="button"
                                        role="radio"
                                        aria-checked={isActive}
                                        className={`trip-filters__option ${isActive
                                            ? "trip-filters__option--active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            handleSortSelect(value)
                                        }
                                    >
                                        <span
                                            className="trip-filters__option-icon"
                                            aria-hidden="true"
                                        >
                                            <Icon size={18} />
                                        </span>

                                        <span className="trip-filters__option-content">
                                            <strong>{label}</strong>
                                            <span>{description}</span>
                                        </span>

                                        <span
                                            className="trip-filters__option-check"
                                            aria-hidden="true"
                                        >
                                            {isActive && "✓"}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                {/* =====================================================
                    PLAGE DE PRIX
                ===================================================== */}

                <section className="trip-filters__section">
                    <h3 className="trip-filters__section-title">
                        <Wallet size={14} aria-hidden="true" />
                        Plage de prix (FCFA)
                    </h3>

                    <div className="trip-filters__price-row">
                        <Input
                            type="number"
                            name="minPrice"
                            placeholder="Min"
                            min="0"
                            step="500"
                            value={filters.minPrice}
                            onChange={(e) =>
                                handlePriceChange(
                                    "minPrice",
                                    e.target.value
                                )
                            }
                        />

                        <span
                            className="trip-filters__price-separator"
                            aria-hidden="true"
                        >
                            —
                        </span>

                        <Input
                            type="number"
                            name="maxPrice"
                            placeholder="Max"
                            min="0"
                            step="500"
                            value={filters.maxPrice}
                            onChange={(e) =>
                                handlePriceChange(
                                    "maxPrice",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                </section>

                {/* =====================================================
                    ACTIONS
                ===================================================== */}

                <footer className="trip-filters__actions">
                    <button
                        type="button"
                        className="trip-filters__reset"
                        onClick={handleReset}
                        disabled={isResetDisabled}
                    >
                        Réinitialiser
                    </button>

                    <button
                        type="button"
                        className="trip-filters__apply"
                        onClick={onClose}
                    >
                        Voir les résultats
                    </button>
                </footer>
            </div>
        </Modal>
    );
}