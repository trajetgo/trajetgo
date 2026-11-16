import {
    Save,
    Route as RouteIcon,
    MapPin,
    Clock,
    Calendar,
    FileText,
} from "lucide-react";

import Input from "@shared/components/ui/Input";
import Select from "@shared/components/ui/Select";
import Button from "@shared/components/ui/Button";
import Checkbox from "@shared/components/ui/Checkbox";
import ActivityIndicator from "@shared/components/ui/ActivityIndicator";
import { formatDate } from "@shared/utils/date.utils";

import CreateScheduleStepper from "./CreateScheduleStepper";
import ScheduleDepartureList from "./ScheduleDepartureList";

import { DAYS, DAYS_FULL } from "../../utils/schedule.utils";

import "../../styles/components/schedule/CreateScheduleForm.scss";

/* ------------------------------------------------------------------ */

const STEP_ICONS = {
    route: RouteIcon,
    agencies: MapPin,
    departures: Clock,
    period: Calendar,
    summary: FileText,
};

/* ------------------------------------------------------------------ */

export default function CreateScheduleForm({
    formData,
    errors,
    touched,

    updateField,
    updateDays,
    touchField,

    isSubmitting,
    serverError,

    onSubmit,

    /* Steps */
    currentStep,
    step,
    steps,
    isFirstStep,
    isLastStep,
    goNext,
    goPrev,
    goTo,

    /* Data */
    selectedRoute,
    buses,
    routes,
    agencies,

    /* Departures */
    addDeparture,
    updateDeparture,
    removeDeparture,
}) {
    const StepIcon = STEP_ICONS[step?.key] ?? RouteIcon;

    /* =========================================================
       Options
    ========================================================= */

    const routeOptions = routes
        .filter((r) => r.active)
        .map((r) => ({
            value: r.id,
            label: `${r.originCity?.name ?? "?"} → ${r.destinationCity?.name ?? "?"}`,
        }));

    const originCityId = selectedRoute?.originCityId ?? null;
    const destinationCityId = selectedRoute?.destinationCityId ?? null;

    const departureAgencyOptions = agencies
        .filter(
            (a) =>
                a.status === "ACTIVE" &&
                a.cityId === originCityId    // ✅ corrigé
        )
        .map((a) => ({ value: a.id, label: a.name }));

    const arrivalAgencyOptions = agencies
        .filter(
            (a) =>
                a.status === "ACTIVE" &&
                a.cityId === destinationCityId   // ✅ corrigé
        )
        .map((a) => ({ value: a.id, label: a.name }));

    /* =========================================================
       Rendu des champs par étape
    ========================================================= */

    const renderStep = () => {
        switch (step?.key) {
            /* =====================================================
               Étape 0 : Ligne
            ===================================================== */
            case "route":
                return (
                    <Select
                        label="Ligne"
                        name="routeId"
                        id="routeId"
                        value={formData.routeId}
                        onChange={(e) =>
                            updateField("routeId", e.target.value)
                        }
                        onBlur={() => touchField("routeId")}
                        error={touched.routeId && errors.routeId}
                        options={routeOptions}
                        required
                    />
                );

            /* =====================================================
               Étape 1 : Agences
            ===================================================== */
            case "agencies":
                return (
                    <div className="schedule-form__row">
                        <Select
                            label="Agence de départ"
                            name="departureAgencyId"
                            id="departureAgencyId"
                            value={formData.departureAgencyId}
                            onChange={(e) =>
                                updateField(
                                    "departureAgencyId",
                                    e.target.value
                                )
                            }
                            onBlur={() => touchField("departureAgencyId")}
                            error={
                                touched.departureAgencyId &&
                                errors.departureAgencyId
                            }
                            options={departureAgencyOptions}
                            required
                        />

                        <Select
                            label="Agence d'arrivée"
                            name="arrivalAgencyId"
                            id="arrivalAgencyId"
                            value={formData.arrivalAgencyId}
                            onChange={(e) =>
                                updateField(
                                    "arrivalAgencyId",
                                    e.target.value
                                )
                            }
                            onBlur={() => touchField("arrivalAgencyId")}
                            error={
                                touched.arrivalAgencyId &&
                                errors.arrivalAgencyId
                            }
                            options={arrivalAgencyOptions}
                            required
                        />
                    </div>
                );

            /* =====================================================
               Étape 2 : Départs (N)
            ===================================================== */
            case "departures":
                return (
                    <ScheduleDepartureList
                        departures={formData.departures}
                        buses={buses}
                        errors={errors}
                        onAdd={addDeparture}
                        onUpdate={updateDeparture}
                        onRemove={removeDeparture}
                    />
                );

            /* =====================================================
               Étape 3 : Période
            ===================================================== */
            case "period":
                return (
                    <>
                        <fieldset className="schedule-form__days">
                            <legend>Jours de la semaine</legend>

                            <div className="schedule-form__days-grid">
                                {DAYS.map((day) => {
                                    const isActive =
                                        formData.daysOfWeek.includes(
                                            day.value
                                        );

                                    return (
                                        <button
                                            key={day.value}
                                            type="button"
                                            className={`schedule-form__day ${isActive
                                                ? "schedule-form__day--active"
                                                : ""
                                                }`}
                                            onClick={() =>
                                                updateDays(day.value)
                                            }
                                            aria-label={DAYS_FULL[day.value]}
                                            aria-pressed={isActive}
                                            title={DAYS_FULL[day.value]}
                                        >
                                            {day.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {touched.daysOfWeek && errors.daysOfWeek && (
                                <p
                                    className="schedule-form__error"
                                    role="alert"
                                >
                                    {errors.daysOfWeek}
                                </p>
                            )}
                        </fieldset>

                        <div className="schedule-form__row">
                            <Input
                                label="Date de début"
                                type="date"
                                name="startDate"
                                id="startDate"
                                min={new Date().toISOString().split("T")[0]}
                                value={formData.startDate}
                                onChange={(e) =>
                                    updateField("startDate", e.target.value)
                                }
                                onBlur={() => touchField("startDate")}
                                error={
                                    touched.startDate && errors.startDate
                                }
                                required
                            />

                            <Input
                                label="Date de fin (optionnel)"
                                type="date"
                                name="endDate"
                                id="endDate"
                                min={formData.startDate}
                                value={formData.endDate}
                                onChange={(e) =>
                                    updateField("endDate", e.target.value)
                                }
                                onBlur={() => touchField("endDate")}
                                error={touched.endDate && errors.endDate}
                            />
                        </div>
                    </>
                );

            /* =====================================================
               Étape 4 : Récapitulatif
            ===================================================== */
            case "summary":
                return (
                    <>
                        {selectedRoute && (
                            <div className="schedule-form__summary">
                                <h4>Récapitulatif</h4>

                                <ul>
                                    <li>
                                        <span>Ligne</span>
                                        <strong>
                                            {selectedRoute.originCity?.name} →{" "}
                                            {selectedRoute.destinationCity?.name}
                                        </strong>
                                    </li>

                                    <li>
                                        <span>Gares</span>
                                        <strong>
                                            {departureAgencyOptions.find(
                                                (agency) => formData.departureAgencyId === agency.value
                                            )?.label ?? "Non sélectionnée"}
                                            {" → "}
                                            {arrivalAgencyOptions.find(
                                                (agency) => formData.arrivalAgencyId === agency.value
                                            )?.label ?? "Non sélectionnée"}
                                        </strong>
                                    </li>

                                    <li>
                                        <span>Départs quotidiens</span>
                                        <strong>{formData.departures.length}</strong>
                                    </li>

                                    {selectedRoute.durationMin && (
                                        <li>
                                            <span>Durée</span>
                                            <strong>
                                                {Math.floor(selectedRoute.durationMin / 60)}h
                                                {String(
                                                    selectedRoute.durationMin % 60
                                                ).padStart(2, "0")}
                                            </strong>
                                        </li>
                                    )}

                                    {selectedRoute.basePrice && (
                                        <li>
                                            <span>Prix de base</span>
                                            <strong>
                                                {new Intl.NumberFormat("fr-FR").format(
                                                    selectedRoute.basePrice
                                                )}{" "}
                                                FCFA
                                            </strong>
                                        </li>
                                    )}

                                    {formData.daysOfWeek.length > 0 && (
                                        <li>
                                            <span>Jours</span>
                                            <strong>
                                                {formData.daysOfWeek
                                                    .map((d) => DAYS_FULL[d])
                                                    .join(", ")}
                                            </strong>
                                        </li>
                                    )}

                                    {formData.startDate && (
                                        <li>
                                            <span>Période</span>
                                            <strong>
                                                {formatDate(formData.startDate, 'dd MMM yyyy')}
                                                {formData.endDate
                                                    ? ` → ${formatDate(formData.endDate, 'dd MMM yyyy')}`
                                                    : " (en cours)"}
                                            </strong>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}

                        <Checkbox
                            name="autoGenerate"
                            label="Générer automatiquement les voyages"
                            helperText="Un voyage sera créé pour chaque départ, chaque jour sélectionné, pendant la période."
                            checked={formData.autoGenerate}
                            onChange={(e) =>
                                updateField("autoGenerate", e.target.checked)
                            }
                        />
                    </>
                );

            default:
                return null;
        }
    };

    /* =========================================================
       Submit local
    ========================================================= */

    const handleFormLocalSubmit = (e) => {
        e.preventDefault();

        if (isLastStep) {
            return onSubmit(e);
        }

        return goNext();
    };

    /* =========================================================
       Rendu
    ========================================================= */

    return (
        <form
            onSubmit={handleFormLocalSubmit}
            className="schedule-form"
            noValidate
        >
            {/* Stepper */}
            {steps && (
                <CreateScheduleStepper
                    steps={steps}
                    currentStep={currentStep}
                    onStepClick={goTo}
                />
            )}

            {/* En-tête étape */}
            <header className="schedule-form__step-header">
                <div className="schedule-form__step-icon">
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
                    <span className="error-icon" aria-hidden="true">
                        ⚠️
                    </span>
                    <span>{serverError}</span>
                </div>
            )}

            {/* Champs */}
            <div className="schedule-form__fields">{renderStep()}</div>

            {/* Navigation */}
            <footer className="schedule-form__actions">
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
                        disabled={isSubmitting}
                        fullWidth
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
                                Créer la programmation
                            </>
                        )}
                    </Button>
                )}
            </footer>
        </form>
    );
}