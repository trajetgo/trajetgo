import { Route as RouteIcon, MapPin, Clock, Wallet, Save } from "lucide-react";

import Input from "@shared/components/ui/Input";
import Select from "@shared/components/ui/Select";
import Button from "@shared/components/ui/Button";
import ActivityIndicator from "@shared/components/ui/ActivityIndicator";

import CreateTripStepper from "./CreateTripStepper";

import { formatDuration, formatPrice } from "../../utils/trip.utils";

import "../../styles/components/trip/CreateTripForm.scss";

/* ------------------------------------------------------------------ */

const STEP_ICONS = {
    route: RouteIcon,
    agencies: MapPin,
    schedule: Clock,
    price: Wallet,
};

/* ------------------------------------------------------------------ */

export default function CreateTripForm({
    handleFormSubmit,

    formData,
    errors,
    touched,

    handleChange,
    handleBlur,

    isSubmitting,
    serverError,

    /* Options */
    routes = [],
    buses = [],
    departureAgencies = [],
    arrivalAgencies = [],

    routesLoading = false,
    busesLoading = false,
    agenciesLoading = false,

    selectedRoute = null,
    durationMin,

    /* Steps */
    STEPS,
    currentStep,
    step,
    isFirstStep,
    isLastStep,
    goNext,
    goPrev,
    goTo,
}) {
    const StepIcon = STEP_ICONS[step?.key] ?? RouteIcon;

    /* ---------- Rendu des champs par étape ---------- */

    const renderStep = () => {
        switch (step?.key) {
            /* =====================================================
               Étape 0 : Ligne + Bus
            ===================================================== */
            case "route":
                return (
                    <>
                        <Select
                            label="Ligne"
                            name="routeId"
                            id="routeId"
                            placeholder={
                                routesLoading
                                    ? "Chargement des lignes..."
                                    : "Sélectionner une ligne"
                            }
                            value={formData.routeId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.routeId && errors.routeId}
                            options={routes}
                            required
                            disabled={routesLoading}
                        />

                        {/* Résumé de la route sélectionnée */}
                        {selectedRoute?.durationMin > 0 && (
                            <div className="trip-form__duration">
                                <span>Durée estimée du trajet</span>

                                <strong>
                                    {formatDuration(selectedRoute.durationMin)}
                                </strong>
                            </div>
                        )}

                        <Select
                            label="Bus"
                            name="busId"
                            id="busId"
                            placeholder={
                                busesLoading
                                    ? "Chargement des bus..."
                                    : "Sélectionner un bus"
                            }
                            value={formData.busId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.busId && errors.busId}
                            options={buses}
                            required
                            disabled={busesLoading}
                        />
                    </>
                );

            /* =====================================================
               Étape 1 : Agences
            ===================================================== */
            case "agencies":
                return (
                    <>
                        <Select
                            label="Agence de départ"
                            name="departureLocationId"
                            id="departureLocationId"
                            placeholder={
                                !formData.routeId
                                    ? "Sélectionnez d'abord une ligne"
                                    : agenciesLoading
                                        ? "Chargement des agences..."
                                        : departureAgencies.length === 0
                                            ? "Aucune agence dans cette ville"
                                            : "Sélectionner l'agence de départ"
                            }
                            value={formData.departureLocationId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                touched.departureLocationId &&
                                errors.departureLocationId
                            }
                            options={departureAgencies}
                            required
                            disabled={!formData.routeId || agenciesLoading}
                        />

                        <Select
                            label="Agence d'arrivée"
                            name="arrivalLocationId"
                            id="arrivalLocationId"
                            placeholder={
                                !formData.routeId
                                    ? "Sélectionnez d'abord une ligne"
                                    : agenciesLoading
                                        ? "Chargement des agences..."
                                        : arrivalAgencies.length === 0
                                            ? "Aucune agence dans cette ville"
                                            : "Sélectionner l'agence d'arrivée"
                            }
                            value={formData.arrivalLocationId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                touched.arrivalLocationId &&
                                errors.arrivalLocationId
                            }
                            options={arrivalAgencies}
                            required
                            disabled={!formData.routeId || agenciesLoading}
                        />
                    </>
                );

            /* =====================================================
               Étape 2 : Horaires
            ===================================================== */
            case "schedule":
                return (
                    <>
                        <div className="trip-form__row">
                            <Input
                                locale="fr"
                                label="Date de départ"
                                type="date"
                                name="departureDate"
                                id="departureDate"
                                min={new Date().toISOString().split("T")[0]}
                                value={formData.departureDate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                    touched.departureDate &&
                                    errors.departureDate
                                }
                                required
                            />

                            <Input
                                label="Heure de départ"
                                type="time"
                                name="departureTime"
                                id="departureTime"
                                value={formData.departureTime}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                    touched.departureTime &&
                                    errors.departureTime
                                }
                                required
                            />
                        </div>

                        <div className="trip-form__row">
                            <Input
                                label="Date d'arrivée"
                                type="date"
                                name="arrivalDate"
                                id="arrivalDate"
                                value={formData.arrivalDate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.arrivalDate && errors.arrivalDate}
                                readOnly={Boolean(durationMin)}
                            />

                            <Input
                                label="Heure d'arrivée"
                                type="time"
                                name="arrivalTime"
                                id="arrivalTime"
                                value={formData.arrivalTime}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.arrivalTime && errors.arrivalTime}
                                readOnly={Boolean(durationMin)}
                            />
                        </div>
                    </>
                );

            /* =====================================================
               Étape 3 : Prix
            ===================================================== */
            case "price":
                return (
                    <>
                        <Input
                            label="Prix du voyage (FCFA)"
                            type="number"
                            name="price"
                            id="price"
                            placeholder="Ex : 7500"
                            min="100"
                            max="1000000"
                            step="50"
                            value={formData.price}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.price && errors.price}
                            hint={
                                selectedRoute?.basePrice
                                    ? `Prix de base de la ligne : ${formatPrice(
                                        selectedRoute.basePrice
                                    )}`
                                    : undefined
                            }
                            required
                            readOnly
                        />

                        {/* Récapitulatif avant validation */}
                        {/* <div className="trip-form__summary">
                            <h4>Récapitulatif</h4>

                            <ul>
                                <li>
                                    <span>Ligne</span>
                                    <strong>
                                        {selectedRoute?.originCity?.name} →{" "}
                                        {selectedRoute?.destinationCity?.name}
                                    </strong>
                                </li>

                                {formData.departureDate && (
                                    <li>
                                        <span>Départ</span>
                                        <strong>
                                            {formData.departureDate}{" "}
                                            {formData.departureTime}
                                        </strong>
                                    </li>
                                )}

                                {formData.arrivalDate && (
                                    <li>
                                        <span>Arrivée</span>
                                        <strong>
                                            {formData.arrivalDate}{" "}
                                            {formData.arrivalTime}
                                        </strong>
                                    </li>
                                )}

                                <li className="trip-form__summary-total">
                                    <span>Prix</span>
                                    <strong>
                                        {formatPrice(formData.price)}
                                    </strong>
                                </li>
                            </ul>
                        </div> */}
                    </>
                );

            default:
                return null;
        }
    };

    /* ---------- Submit local ---------- */

    const handleFormLocalSubmit = (e) => {
        e.preventDefault();

        if (isLastStep) {
            return handleFormSubmit(e);
        }

        return goNext();
    };

    /* ---------- Rendu ---------- */

    return (
        <form
            onSubmit={handleFormLocalSubmit}
            className="trip-form"
            noValidate
        >
            {/* Stepper */}
            <CreateTripStepper
                steps={STEPS}
                currentStep={currentStep}
                onStepClick={goTo}
            />

            {/* En-tête étape */}
            <header className="trip-form__step-header">
                <div className="trip-form__step-icon">
                    <StepIcon size={20} aria-hidden="true" />
                </div>

                <div>
                    <h2>{step?.title}</h2>
                    <p>{step?.description}</p>
                </div>
            </header>

            {/* Erreur serveur */}
            {serverError && (
                <div className="server-error" role="alert">
                    <span className="error-icon" aria-hidden="true">⚠️</span>
                    <span>{serverError}</span>
                </div>
            )}

            {/* Champs */}
            <div className="trip-form__fields">{renderStep()}</div>

            {/* Navigation */}
            <footer className="trip-form__actions">
                {!isFirstStep && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={goPrev}
                        disabled={isSubmitting}
                    >
                        Retour
                    </Button>
                )}

                {!isLastStep ? (
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth={isFirstStep}
                    >
                        Continuer
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        variant="primary"
                        loading={isSubmitting}
                        fullWidth
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
                                <Save size={16} />
                                Créer le voyage
                            </>
                        )}
                    </Button>
                )}
            </footer>
        </form>
    );
}