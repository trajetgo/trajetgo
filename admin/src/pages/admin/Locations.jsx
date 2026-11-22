import { useState } from "react";
import {
    Plus,
    Globe2,
    Map,
    Building2,
    MapPin,
    AlertTriangle,
    Search,
    X,
} from "lucide-react";

import Loading from "@shared/components/Loading";

import useLocations from "../../hooks/useLocations";
import CreateLocationModal from "../../components/locations/CreateLocationModal";
import LocationTable from "../../components/locations/LocationTable";

import "../../styles/pages/admin/Locations.scss";
import { LOCATION_TYPES } from "../../constants/location.constants";

/* ------------------------------------------------------------------ */

const TABS = [
    { key: "country", label: "Pays", icon: Globe2 },
    { key: "region", label: "Régions", icon: Map },
    { key: "city", label: "Villes", icon: Building2 },
    { key: "location", label: "Points", icon: MapPin },
];

const CREATE_LABELS = {
    country: "un pays",
    region: "une région",
    city: "une ville",
    location: "un point d'arrêt",
};

/* ------------------------------------------------------------------ */

export default function Locations() {
    const [activeTab, setActiveTab] = useState(LOCATION_TYPES.COUNTRY);
    const [openModal, setOpenModal] = useState({
        show: false,
        type: null,
    });

    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);

    /* ---------- Chargement ---------- */

    const {
        loading,
        locations,
        filtered,
        search,
        setSearch,
        sort,
        handleSort,
        serverError,
        refresh,
    } = useLocations(activeTab);

    /* ---------- Pays, pour le sélecteur du modal ---------- */

    const {
        locations: countries,
        loading: countriesLoading,
    } = useLocations(LOCATION_TYPES.COUNTRY);

    const currentTab = TABS.find((t) => t.key === activeTab);

    /* ---------- Handlers ---------- */

    const handleTabChange = (tab) => {
        if (tab === activeTab) return;
        setActiveTab(tab);
        setSearch("");       // reset recherche au changement d'onglet
    };

    const handleModalOpen = () =>
        setOpenModal({ show: true, type: activeTab });

    const handleModalClose = () =>
        setOpenModal({ show: false, type: null });

    const handleCreated = async () => {
        await refresh();
    };

    /* ---------- États dérivés ---------- */

    const isEmpty = locations.length === 0;
    const hasNoResults = !isEmpty && filtered.length === 0;

    /* ---------- Rendu ---------- */

    return (
        <div className="locations">
            {/* ---------- Header ---------- */}

            <header className="locations__header">
                <div>
                    <h1>Localisations</h1>
                    <p>
                        Gérez les pays, régions, villes et points
                        d'arrêt disponibles pour les compagnies.
                    </p>
                </div>

                <button
                    type="button"
                    className="locations__create-button"
                    onClick={handleModalOpen}
                >
                    <Plus size={18} />
                    Ajouter {CREATE_LABELS[activeTab] ?? "un élément"}
                </button>
            </header>

            {/* ---------- Tabs ---------- */}

            <nav
                className="locations__tabs"
                role="tablist"
                aria-label="Types de localisations"
            >
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;

                    return (
                        <button
                            key={tab.key}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`panel-${tab.key}`}
                            className={`locations__tab ${isActive
                                ? "locations__tab--active"
                                : ""
                                }`}
                            onClick={() => handleTabChange(tab.key)}
                        >
                            <Icon size={16} aria-hidden="true" />
                            {tab.label}
                        </button>
                    );
                })}
            </nav>

            {/* ---------- Erreur ---------- */}

            {serverError && (
                <div className="locations__error" role="alert">
                    <AlertTriangle size={18} aria-hidden="true" />
                    {serverError}
                </div>
            )}

            {/* ---------- Barre de recherche ---------- */}

            {!isEmpty && (
                <div className="locations__search">
                    <Search size={16} aria-hidden="true" />

                    <input
                        type="search"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Rechercher une localisation"
                    />

                    {search && (
                        <button
                            type="button"
                            className="locations__search-clear"
                            onClick={() => setSearch("")}
                            aria-label="Effacer la recherche"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            )}

            {/* ---------- Résultat filtres ---------- */}

            {search && (
                <div className="locations__result-info">
                    {filtered.length} résultat
                    {filtered.length > 1 ? "s" : ""}
                </div>
            )}

            {/* ---------- Contenu ---------- */}

            <section
                id={`panel-${activeTab}`}
                role="tabpanel"
                aria-label={currentTab?.label}
                className="locations__content"
            >
                {loading ? (
                    <Loading message="Chargement..." />
                ) : isEmpty ? (
                    <EmptyState
                        type={activeTab}
                        onCreate={handleModalOpen}
                    />
                ) : hasNoResults ? (
                    <NoResultsState
                        onClear={() => setSearch("")}
                    />
                ) : (
                    <LocationTable
                        items={filtered}
                        type={activeTab}
                        search={search}
                        sort={sort}
                        onSort={handleSort}
                        setSelectedAction={setSelectedAction}
                        setSelectedItem={setSelectedItem}
                    />
                )}
            </section>

            {/* ---------- Modal ---------- */}

            <CreateLocationModal
                open={openModal.show}
                type={openModal.type}
                onClose={handleModalClose}
                onCreated={handleCreated}

                countries={countries}
                countriesLoading={countriesLoading}
                locationsError={serverError}
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Sous-composants                                                     */
/* ------------------------------------------------------------------ */

function EmptyState({ type, onCreate }) {
    const config = TABS.find((t) => t.key === type);
    const Icon = config?.icon ?? MapPin;

    return (
        <div className="locations__empty">
            <Icon size={42} aria-hidden="true" />

            <h3>Aucun élément enregistré</h3>

            <p>
                Commencez par ajouter{" "}
                {CREATE_LABELS[type] ?? "un élément"} à la liste.
            </p>

            <button
                type="button"
                className="locations__create-button"
                onClick={onCreate}
            >
                <Plus size={18} />
                Ajouter
            </button>
        </div>
    );
}

function NoResultsState({ onClear }) {
    return (
        <div className="locations__empty">
            <Search size={42} aria-hidden="true" />

            <h3>Aucun résultat</h3>

            <p>
                Aucun élément ne correspond à votre recherche.
            </p>

            <button
                type="button"
                className="locations__clear-button"
                onClick={onClear}
            >
                Effacer la recherche
            </button>
        </div>
    );
}