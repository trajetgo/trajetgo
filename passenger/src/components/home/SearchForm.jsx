import { MapPin, CalendarDays, Users, Search, ArrowDownUp } from "lucide-react";

import { formatDate } from "@shared/utils/date.utils";
import ActivityIndicator from "@shared/components/ui/ActivityIndicator";

import useSearchTrips from "../../hooks/useSearchTrips";
import TripSearchModal from "../modal/TripSearchModal";
import useLocations from "../../hooks/useLocations";

export default function SearchForm() {
    /* ---------- Villes ---------- */

    const {
        loading: citiesLoading,
        serverError: citiesError,
        search: citiesSearch,
        setSearch: setCitiesSearch,
        filtered: cities,
    } = useLocations("city");

    /* ---------- Form ---------- */

    const {
        loading,
        serverError,
        formData,
        openModal,
        openSearchModal,
        closeSearchModal,
        selectCity,
        selectDate,
        selectPassengers,
        handleSwap,
        handleSearch,
    } = useSearchTrips();

    const { adults, children } = formData.passengers;
    const totalPassengers = adults + children.length;

    const passengerLabel = () => {
        const parts = [];

        if (adults > 0) {
            parts.push(`${adults} ${adults > 1 ? "adultes" : "adulte"}`);
        }

        if (children.length > 0) {
            parts.push(
                `${children.length} ${children.length > 1 ? "enfants" : "enfant"}`
            );
        }

        return parts.join(", ");
    };

    return (
        <form
            className="trip-search"
            onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
            }}
        >
            <div className="trip-search__fields">
                {/* Départ */}
                <button
                    type="button"
                    className="trip-search__field"
                    onClick={() => openSearchModal("departure")}
                >
                    <MapPin size={20} className="trip-search__icon" />
                    <span className="trip-search__field-body">
                        <span className="trip-search__field-label">Départ</span>
                        <span
                            className={
                                formData.departure
                                    ? "trip-search__field-value"
                                    : "trip-search__field-value trip-search__field-value--placeholder"
                            }
                        >
                            {formData.departure
                                ? formData.departure.name
                                : "D'où partez-vous ?"}
                        </span>
                    </span>
                </button>

                {/* Inversion */}
                <button
                    type="button"
                    className="trip-search__swap"
                    aria-label="Inverser le trajet"
                    onClick={handleSwap}
                >
                    <ArrowDownUp size={18} />
                </button>

                {/* Arrivée */}
                <button
                    type="button"
                    className="trip-search__field"
                    onClick={() => openSearchModal("arrival")}
                >
                    <MapPin size={20} className="trip-search__icon" />
                    <span className="trip-search__field-body">
                        <span className="trip-search__field-label">Arrivée</span>
                        <span
                            className={
                                formData.arrival
                                    ? "trip-search__field-value"
                                    : "trip-search__field-value trip-search__field-value--placeholder"
                            }
                        >
                            {formData.arrival
                                ? formData.arrival.name
                                : "Où allez-vous ?"}
                        </span>
                    </span>
                </button>

                {/* Date */}
                <button
                    type="button"
                    className="trip-search__field"
                    onClick={() => openSearchModal("date")}
                >
                    <CalendarDays size={20} className="trip-search__icon" />
                    <span className="trip-search__field-body">
                        <span className="trip-search__field-label">Date</span>
                        <span
                            className={
                                formData.date
                                    ? "trip-search__field-value"
                                    : "trip-search__field-value trip-search__field-value--placeholder"
                            }
                        >
                            {formData.date
                                ? formatDate(formData.date, "dd MMM yyyy")
                                : "Choisir une date"}
                        </span>
                    </span>
                </button>

                {/* Passagers */}
                <button
                    type="button"
                    className="trip-search__field"
                    onClick={() => openSearchModal("passengers")}
                >
                    <Users size={20} className="trip-search__icon" />
                    <span className="trip-search__field-body">
                        <span className="trip-search__field-label">
                            Passagers
                        </span>
                        <span className="trip-search__field-value">
                            {passengerLabel()}
                        </span>
                    </span>
                </button>
            </div>

            <button
                type="submit"
                className="trip-search__submit"
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size={14} type="digital" color="white" />
                ) : (
                    <>
                        <Search size={20} /> Rechercher
                    </>
                )}
            </button>

            {/* Erreur de recherche OU d'agences */}
            {(serverError || citiesError) && (
                <p className="trip-search__error" role="alert">
                    {serverError || citiesError}
                </p>
            )}

            <TripSearchModal
                show={openModal.show}
                type={openModal.type}
                cities={cities}
                citiesLoading={citiesLoading}
                search={citiesSearch}
                onSearchChange={setCitiesSearch}
                formData={formData}
                onClose={closeSearchModal}
                onSelectCity={selectCity}
                onSelectDate={selectDate}
                onSelectPassengers={selectPassengers}
            />
        </form>
    );
}