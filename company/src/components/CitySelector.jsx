import { useMemo, useState } from "react";
import { MapPin, Search, Loader2 } from "lucide-react";
import HighlightText from '../components/ui/HighlightText';
import '../styles/components/CitySelector.scss';

export default function CitySelector({
    title,
    cities = [],
    loading,
    onSelect
}) {
    const [search, setSearch] = useState("");

    const filteredCities = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return cities;
        }

        return cities.filter((city) =>
            city.name.toLowerCase().includes(query)
        );
    }, [cities, search]);

    return (
        <div className="city-selector">

            <div className="city-selector__header">
                <h2>{title}</h2>

                <p>
                    Recherchez et sélectionnez une ville.
                </p>
            </div>

            <div className="city-selector__search">
                <Search size={19} />

                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
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

                        <span>
                            Chargement des villes...
                        </span>
                    </div>
                )}

                {!loading && filteredCities.length === 0 && (
                    <div className="city-selector__state">
                        <MapPin size={24} />

                        <span>
                            Aucune ville trouvée.
                        </span>
                    </div>
                )}

                {!loading &&
                    filteredCities.map((city) => (
                        <button
                            key={city.id}
                            type="button"
                            className="city-selector__item"
                            onClick={() => onSelect(city)}
                        >
                            <span className="city-selector__icon">
                                <MapPin size={19} />
                            </span>

                            <span className="city-selector__info">
                                <HighlightText as="strong" text={city.name} search={search} />

                                {city.code && (
                                    <small>{city.code}</small>
                                )}
                            </span>
                        </button>
                    ))
                }

            </div>
        </div>
    );
}