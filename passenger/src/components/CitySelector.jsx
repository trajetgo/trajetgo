import { MapPin, Search, Loader2 } from "lucide-react";

import HighlightText from "@shared/components/ui/HighlightText";

import "../styles/components/CitySelector.scss";

export default function CitySelector({
    cities = [],
    loading = false,
    selectedCity,
    onSelect,
    search = "",
    onSearchChange,
}) {
    /* ---------- Handlers ---------- */

    const handleChange = (e) => {
        onSearchChange?.(e.target.value);
    };

    const handleSelect = (city) => {
        onSearchChange?.("");
        onSelect(city);
    };

    /* ---------- Rendu ---------- */

    return (
        <div className="city-selector">
            <div className="city-selector__header">
                <h2>Villes</h2>
                <p>Recherchez et sélectionnez une ville.</p>
            </div>

            <div className="city-selector__search">
                <Search size={19} aria-hidden="true" />

                <input
                    type="text"
                    value={search}
                    onChange={handleChange}
                    placeholder="Rechercher une ville..."
                    autoFocus
                />
            </div>

            <div className="city-selector__list">
                {loading && (
                    <div className="city-selector__state">
                        <Loader2
                            size={22}
                            className="city-selector__spinner"
                        />
                        <span>Chargement des villes...</span>
                    </div>
                )}

                {!loading && cities.length === 0 && (
                    <div className="city-selector__state">
                        <MapPin size={24} />

                        <span>
                            {search
                                ? "Aucune ville trouvée."
                                : "Aucune ville disponible."}
                        </span>
                    </div>
                )}

                {!loading &&
                    cities.map((city) => {
                        const isSelected = selectedCity?.id === city.id;

                        return (
                            <button
                                key={city.id}
                                type="button"
                                className={`city-selector__item ${isSelected
                                        ? "city-selector__item--selected"
                                        : ""
                                    }`}
                                onClick={() => handleSelect(city)}
                            >
                                <span className="city-selector__icon">
                                    <MapPin size={19} />
                                </span>

                                <span className="city-selector__info">
                                    <HighlightText
                                        as="strong"
                                        text={city.name}
                                        search={search}
                                    />

                                    {city.code && (
                                        <small>{city.code}</small>
                                    )}
                                </span>
                            </button>
                        );
                    })}
            </div>
        </div>
    );
}