import { useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";

import {
    isValidDate,
    parseChildren,
    parsePositiveInt,
} from "../../utils/trip.utils";
import Loading from "@shared/components/Loading";
import { formatDate } from "@shared/utils/date.utils";

import useTrips from "../../hooks/useTrips";
import TripCard from "../../components/trips/TripCard";
import TripFiltersModal from "../../components/trips/TripFiltersModal";

import DateStrip from "../../components/trips/DateStrip";
import useTripsPrices from "../../hooks/useTripsPrices";
import CalendarModal from "../../components/trips/CalendarModal";

import "../../styles/pages/public/Trips.scss";

/* ------------------------------------------------------------------ */

export default function Trips() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [openFilters, setOpenFilters] = useState(false);
    const [openCalendar, setOpenCalendar] = useState(false);

    /* ---------- Params ---------- */

    const search = useMemo(() => {
        const from = searchParams.get("from");
        const to = searchParams.get("to");
        const fromName = searchParams.get("fromName");   // ✅
        const toName = searchParams.get("toName");        // ✅
        const date = searchParams.get("date");

        return {
            from,
            to,
            fromName,
            toName,
            date: isValidDate(date) ? date : null,
            adults: parsePositiveInt(searchParams.get("adults"), 1),
            children: parseChildren(searchParams.get("children")),
        };
    }, [searchParams]);

    /* ---------- Rich state ---------- */

    const richState = location.state ?? null;

    const departureLabel =
        richState?.departure?.name ?? search.fromName ?? "Départ";
    const arrivalLabel =
        richState?.arrival?.name ?? search.toName ?? "Arrivée";


    const totalPassengers = search.adults + search.children.length;

    const isSearchValid = Boolean(
        search.from &&
        search.to &&
        search.from !== search.to &&
        search.date
    );

    /* =========================================================
      Prix par date (J-2 → J+2)
   ========================================================= */

    const {
        prices,
        minPrice,
        loading: pricesLoading,
    } = useTripsPrices({
        from: search.from,
        to: search.to,
        date: search.date,
        range: 2,
        enabled: isSearchValid,
    });

    /* =========================================================
       Trips
    ========================================================= */

    const {
        loading,
        trips,
        filteredTrips,
        filters,
        handleFilterChange,
        activeFiltersCount,
        serverError,
    } = useTrips({
        from: search.from,
        to: search.to,
        date: search.date,
        adults: search.adults,
        children: search.children,
        enabled: isSearchValid,
    });

    /* =========================================================
      Handlers
   ========================================================= */

    const handleDateChange = (newDate) => {
        if (!newDate) return;

        /* ✅ Mise à jour de l'URL */
        const params = new URLSearchParams(searchParams);
        params.set("date", newDate);

        navigate(
            { search: params.toString() },
            { replace: true, state: location.state }
        );
    };

    /* ---------- État invalide ---------- */

    if (!isSearchValid) {
        return (
            <div className="trips trips--empty">
                <h1>Recherche incomplète</h1>
                <p>
                    Veuillez renseigner une ville de départ, une ville
                    d'arrivée et une date.
                </p>
            </div>
        );
    }

    /* ---------- Rendu ---------- */

    return (
        <div className="trips">
            {/* ---------- Header ---------- */}

            <header className="trips__header">
                <h1 className="trips__title">
                    <span>{departureLabel.toUpperCase()}</span>
                    <span className="trips__arrow" aria-hidden="true">
                        →
                    </span>
                    <span>{arrivalLabel.toUpperCase()}</span>
                </h1>

                <p className="trips__meta">
                    <span>{formatDate(search.date, "dd MMM yyyy")}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                        {totalPassengers}{" "}
                        {totalPassengers > 1 ? "voyageurs" : "voyageur"}
                    </span>
                </p>
            </header>

            <DateStrip
                prices={prices}
                selectedDate={search.date}
                minPrice={minPrice}
                loading={pricesLoading}
                onSelectDate={handleDateChange}
                onOpenCalendar={() => setOpenCalendar(true)}
            />

            {/* ---------- Toolbar (tri + filtres) ---------- */}

            {!loading && !serverError && trips.length > 0 && (
                <div className="trips__toolbar">
                    <div
                        className="trips__results-count"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {filteredTrips?.length}{" "}
                        {filteredTrips?.length > 1
                            ? "trajets trouvés"
                            : "trajet trouvé"}

                        {activeFiltersCount > 0 && (
                            <span className="trips__results-total">
                                {" "}
                                sur {trips.length}
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        className={`trips__filter-btn ${activeFiltersCount > 0
                            ? "trips__filter-btn--active"
                            : ""
                            }`}
                        onClick={() => setOpenFilters(true)}
                        aria-label={
                            activeFiltersCount > 0
                                ? `Ouvrir les filtres (${activeFiltersCount} actif${activeFiltersCount > 1 ? "s" : ""})`
                                : "Ouvrir les filtres de tri"
                        }
                    >
                        <SlidersHorizontal size={16} aria-hidden="true" />
                        <span className="trips__filter-btn-label">
                            Tri & filtres
                        </span>

                        {activeFiltersCount > 0 && (
                            <span
                                className="trips__filter-badge"
                                aria-hidden="true"
                            >
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>
                </div>
            )}

            {/* ---------- Résultats ---------- */}

            <section className="trips__results">
                {loading && <Loading message="Chargement des trajets..." />}

                {!loading && serverError && (
                    <p className="trips__error" role="alert">
                        {serverError}
                    </p>
                )}

                {!loading && !serverError && trips.length === 0 && (
                    <div className="trips__empty">
                        <p>Aucun trajet trouvé pour cette recherche.</p>
                        <p className="trips__empty-hint">
                            Essayez une autre date ou un autre itinéraire.
                        </p>
                    </div>
                )}

                {!loading && !serverError && trips?.length > 0 && (
                    <>
                        {filteredTrips?.length === 0 ? (
                            <div className="trips__empty">
                                <p>
                                    Aucun trajet ne correspond à vos filtres.
                                </p>
                                <p className="trips__empty-hint">
                                    Modifiez vos critères pour voir plus de
                                    trajets.
                                </p>

                                <button
                                    type="button"
                                    className="trips__reset-filters"
                                    onClick={() => {
                                        handleFilterChange("reset");
                                    }}
                                >
                                    Réinitialiser les filtres
                                </button>
                            </div>
                        ) : (
                            <ul className="trips__list">
                                {filteredTrips?.map((trip) => (
                                    <TripCard
                                        key={trip.id}
                                        trip={trip}
                                        adults={search.adults}
                                        children={search.children}
                                    />
                                ))}
                            </ul>
                        )}

                    </>
                )}
            </section>

            {/* ---------- Modal tri ---------- */}

            <TripFiltersModal
                open={openFilters}
                onClose={() => setOpenFilters(false)}
                filters={filters}
                onChange={handleFilterChange}
            />

            <CalendarModal
                open={openCalendar}
                initialDate={search.date}
                minDate={new Date().toISOString().split("T")[0]}
                onClose={() => setOpenCalendar(false)}
                onConfirm={handleDateChange}
            />
        </div>
    );
}