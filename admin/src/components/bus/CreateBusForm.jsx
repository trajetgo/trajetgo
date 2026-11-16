import {
    Building2,
    BusFront,
    Settings2,
    Sparkles,
} from "lucide-react";

import Input from "@shared/components/ui/Input";
import Select from "@shared/components/ui/Select";
import SearchableSelect from "@shared/components/ui/SearchableSelect";
import Button from "@shared/components/ui/Button";
import ActivityIndicator from "@shared/components/ui/ActivityIndicator";
import Checkbox from "@shared/components/ui/Checkbox";

import {
    BUS_TYPE_OPTIONS,
    STATUS_OPTIONS,
    AMENITY_OPTIONS,
} from "../../utils/bus.utils";
import CreateBusStepper from "./CreateBusStepper";

import "../../styles/components/bus/CreateBusForm.scss";   // ✅

/* ------------------------------------------------------------------ */

const STEP_ICONS = {
    identity: Building2,
    vehicle: BusFront,
    operation: Settings2,
    amenities: Sparkles,
};

/* ------------------------------------------------------------------ */

export default function CreateBusForm({
    handleFormSubmit,

    formData,
    errors,
    touched,

    handleChange,
    handleBlur,
    handleAmenityChange,

    isSubmitting,
    serverError,

    companies = [],
    companySearch,
    setCompanySearch,
    companiesLoading,

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
    const StepIcon = STEP_ICONS[step?.key] ?? Building2;

    /* ---------- Rendu des champs par étape ---------- */

    const renderStep = () => {
        switch (currentStep) {
            // =====================================================
            // STEP 0 — Identité
            // =====================================================
            case 0:
                return (
                    <>
                        <SearchableSelect
                            label="Compagnie"
                            name="companyId"
                            id="companyId"
                            value={formData.companyId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.companyId && errors.companyId}
                            placeholder="Sélectionner une compagnie"
                            searchPlaceholder="Rechercher une compagnie..."
                            options={companies.map((c) => ({
                                value: c.id,
                                label: c.name,
                            }))}
                            search={companySearch}
                            onSearchChange={setCompanySearch}
                            loading={companiesLoading}
                            required
                        />

                        <Input
                            label="Immatriculation"
                            name="registrationNumber"
                            id="registrationNumber"
                            placeholder="Ex : AB-1234-CI"
                            value={formData.registrationNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                touched.registrationNumber &&
                                errors.registrationNumber
                            }
                            autoComplete="off"
                            required
                        />

                        <Input
                            label="Numéro de parc"
                            name="fleetNumber"
                            id="fleetNumber"
                            placeholder="Ex : UTB-042"
                            value={formData.fleetNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                touched.fleetNumber && errors.fleetNumber
                            }
                            autoComplete="off"
                        />

                        <Input
                            label="Nom du bus"
                            name="name"
                            id="name"
                            placeholder="Ex : Express Abidjan 01"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.name && errors.name}
                            autoComplete="off"
                        />
                    </>
                );

            // =====================================================
            // STEP 1 — Véhicule
            // =====================================================
            case 1:
                return (
                    <>
                        <Input
                            label="Marque"
                            name="brand"
                            id="brand"
                            placeholder="Ex : Mercedes-Benz"
                            value={formData.brand}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.brand && errors.brand}
                        />

                        <Input
                            label="Modèle"
                            name="model"
                            id="model"
                            placeholder="Ex : Tourismo"
                            value={formData.model}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.model && errors.model}
                        />

                        <Input
                            label="Année"
                            type="number"
                            name="year"
                            id="year"
                            placeholder="Ex : 2024"
                            min="1950"
                            max={new Date().getFullYear() + 1}
                            step="1"
                            value={formData.year}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.year && errors.year}
                        />

                        <Select
                            label="Type de bus"
                            name="busType"
                            id="busType"
                            value={formData.busType}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.busType && errors.busType}
                            options={BUS_TYPE_OPTIONS}
                            required
                        />
                    </>
                );

            // =====================================================
            // STEP 2 — Exploitation
            // =====================================================
            case 2:
                return (
                    <>
                        <Input
                            label="Capacité (places)"
                            type="number"
                            name="capacity"
                            id="capacity"
                            placeholder="Ex : 50"
                            min="1"
                            max="100"
                            step="1"
                            value={formData.capacity}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.capacity && errors.capacity}
                            required
                        />

                        <Select
                            label="Statut"
                            name="status"
                            id="status"
                            value={formData.status}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.status && errors.status}
                            options={STATUS_OPTIONS}
                            required
                        />
                    </>
                );

            // =====================================================
            // STEP 3 — Équipements
            // =====================================================
            case 3:
                return (
                    <div className="bus-form__amenities">
                        <header className="bus-form__amenities-header">
                            <h3>Équipements à bord</h3>
                            <p>
                                Sélectionnez les équipements disponibles
                                dans ce bus.
                            </p>
                        </header>

                        <div className="bus-form__amenities-grid">
                            {AMENITY_OPTIONS.map((amenity) => {
                                const checked =
                                    formData.amenities.includes(
                                        amenity.value
                                    );

                                const Icon = amenity.icon;

                                return (
                                    <Checkbox
                                        label={<> <Icon size={16} /> {amenity.label} </>}
                                        checked={checked}
                                        onChange={() =>
                                            handleAmenityChange(
                                                amenity.value
                                            )
                                        }
                                    />


                                );
                            })}
                        </div>

                        {touched.amenities && errors.amenities && (
                            <div className="field-error">
                                {errors.amenities}
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    /* ---------- Submit ---------- */

    const handleFormLocalSubmit = async (e) => {
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
            className="bus-form"
            noValidate
        >
            <CreateBusStepper
                steps={STEPS}
                currentStep={currentStep}
                onStepClick={goTo}
            />

            <header className="bus-form__step-header">
                <div className="bus-form__step-icon">
                    <StepIcon size={20} aria-hidden="true" />
                </div>

                <div>
                    <h2>{step?.title}</h2>
                    <p>{step?.description}</p>
                </div>
            </header>

            {serverError && (
                <div className="server-error" role="alert">
                    <span className="error-icon" aria-hidden="true">⚠️</span>
                    <span>{serverError}</span>
                </div>
            )}

            <div className="bus-form__fields">
                {renderStep()}
            </div>

            <footer className="bus-form__actions">
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
                            "Créer le bus"
                        )}
                    </Button>
                )}
            </footer>
        </form>
    );
}