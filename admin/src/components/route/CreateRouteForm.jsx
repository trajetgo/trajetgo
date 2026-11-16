import { ArrowRight, MapPin, Route as RouteIcon } from "lucide-react";

import Input from "@shared/components/ui/Input";
import SearchableSelect from "@shared/components/ui/SearchableSelect";
import Button from "@shared/components/ui/Button";
import ActivityIndicator from "@shared/components/ui/ActivityIndicator";
import Checkbox from "@shared/components/ui/Checkbox";

import { formatDuration } from "../../utils/route.utils";


import "../../styles/components/route/CreateRouteForm.scss";

/* ------------------------------------------------------------------ */

export default function CreateRouteForm({
    handleFormSubmit,

    formData,
    errors,
    touched,

    handleChange,
    handleBlur,

    isSubmitting,
    serverError,

    locations = [],
    citiesLoading = false,
    citySearch = "",
    setCitySearch,

    originCity,
    destinationCity,

    companies=[],
    companiesLoading=false,
    companySearch="",
    setCompanySearch
}) {
    /* ---------- Résumé dynamique ---------- */

    const showSummary = originCity && destinationCity;

    /* ---------- Rendu ---------- */

    return (
        <form
            onSubmit={handleFormSubmit}
            className="route-form"
            noValidate
        >
            {/* ---------- Erreur serveur ---------- */}

            {serverError && (
                <div className="server-error" role="alert">
                    <span className="error-icon" aria-hidden="true">⚠️</span>
                    <span>{serverError}</span>
                </div>
            )}

            {/* ------------ Companie -------- */}
            <div className="route-form__company">
                <SearchableSelect
                    label="Compagnie"
                    name="companyId"
                    id="companyId"
                    value={formData.companyId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                        touched.companyId && errors.companyId
                    }
                    placeholder="Sélectionner une companie"
                    searchPlaceholder="Rechercher une companie..."
                    options={
                        companies
                            .map((c) => ({
                                value: c.id,
                                label: `${c.name}`,
                            }))
                    }
                    search={companySearch}
                    onSearchChange={setCompanySearch}
                    loading={companiesLoading}
                    required
                    autoFocus
                />
            </div>

            {/* ---------- Villes ---------- */}

            <div className="route-form__cities">
                <SearchableSelect
                    label="Ville de départ"
                    name="originCityId"
                    id="originCityId"
                    value={formData.originCityId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                        touched.originCityId && errors.originCityId
                    }
                    placeholder="Sélectionner une ville"
                    searchPlaceholder="Rechercher une ville..."
                    options={
                        locations
                            .filter((loc) => loc.id !== formData.destinationCityId)
                            .map((city) => ({
                                value: city.id,
                                label: `${city.name}${city.country?.name
                                    ? ` · ${city.country.name}`
                                    : ""
                                    }`,
                            }))
                    }
                    search={citySearch}
                    onSearchChange={setCitySearch}
                    loading={citiesLoading}
                    required
                    autoFocus
                />

                <div className="route-form__cities-arrow" aria-hidden="true">
                    <ArrowRight size={18} />
                </div>

                <SearchableSelect
                    label="Ville d'arrivée"
                    name="destinationCityId"
                    id="destinationCityId"
                    value={formData.destinationCityId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                        touched.destinationCityId &&
                        errors.destinationCityId
                    }
                    placeholder="Sélectionner une ville"
                    searchPlaceholder="Rechercher une ville..."
                    options={
                        locations
                            .filter((loc) => loc.id !== formData.originCityId)
                            .map((city) => ({
                                value: city.id,
                                label: `${city.name}${city.country?.name
                                    ? ` · ${city.country.name}`
                                    : ""
                                    }`,
                            }))
                    }
                    search={citySearch}
                    onSearchChange={setCitySearch}
                    loading={citiesLoading}
                    required
                />
            </div>

            {/* ---------- Résumé ---------- */}

            {showSummary && (
                <div className="route-form__summary">
                    <div className="route-form__summary-icon">
                        <RouteIcon size={18} aria-hidden="true" />
                    </div>

                    <div className="route-form__summary-content">
                        <strong>
                            {originCity.name}
                            <span aria-hidden="true"> → </span>
                            {destinationCity.name}
                        </strong>

                        {formData.distanceKm && (
                            <span>
                                Distance estimée :{" "}
                                {formData.distanceKm} km
                            </span>
                        )}

                        {formData.durationMin && (
                            <span>
                                Durée :{" "}
                                {formatDuration(
                                    Number(formData.durationMin)
                                )}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* ---------- Distance & Durée ---------- */}

            <div className="route-form__row">
                <Input
                    label="Distance (km) — optionnel"
                    type="number"
                    name="distanceKm"
                    id="distanceKm"
                    min="1"
                    max="3000"
                    step="1"
                    placeholder="Ex : 350"
                    value={formData.distanceKm}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.distanceKm && errors.distanceKm}
                    hint="Laissez vide pour un calcul automatique."
                />

                <Input
                    label="Durée (minutes) — optionnel"
                    type="number"
                    name="durationMin"
                    id="durationMin"
                    min="5"
                    max="2880"
                    step="5"
                    placeholder="Ex : 240"
                    value={formData.durationMin}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.durationMin && errors.durationMin}
                    hint="Ex : 240 = 4 heures"
                />
            </div>

            {/* ---------- Prix de base ---------- */}

            <Input
                label="Prix de base (FCFA)"
                type="number"
                name="basePrice"
                id="basePrice"
                min="100"
                max="1000000"
                step="50"
                placeholder="Ex : 7500"
                value={formData.basePrice}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.basePrice && errors.basePrice}
                hint="Le tarif de référence pour cette ligne."
                required
            />

            {/* ---------- Actif ---------- */}

            <Checkbox
                name="active"
                checked={formData.active}
                onChange={handleChange}
                onBlur={handleBlur}
                label={"Activer la ligne"}
                helperText={" Une ligne inactive ne peut pas être utilisée pour planifier des voyages."}
            />

            {/* ---------- Actions ---------- */}

            <footer className="route-form__actions">
                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={isSubmitting}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator
                            size={14}
                            type="dots"
                            color="white"
                        />
                    ) : (
                        <>
                            <MapPin size={16} />
                            Créer la ligne
                        </>
                    )}
                </Button>
            </footer>
        </form>
    );
}