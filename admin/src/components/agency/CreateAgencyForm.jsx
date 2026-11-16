import { Building2, MapPin, Phone, Save } from "lucide-react";

import Input from "@shared/components/ui/Input";
import Button from "@shared/components/ui/Button";
import SearchableSelect from "@shared/components/ui/SearchableSelect";
import ActivityIndicator from "@shared/components/ui/ActivityIndicator";

import CreateAgencyStepper from "./CreateAgencyStepper";

import "../../styles/components/agency/CreateAgencyForm.scss";

export default function CreateAgencyForm({
    handleFormSubmit,

    formData,
    errors,
    touched,

    handleBlur,
    handleChange,

    isSubmitting,
    serverError,

    /* Steps */
    STEPS,
    currentStep,
    step,
    isFirstStep,
    isLastStep,
    goNext,
    goPrev,
    goTo,

    /* Data */
    locations = [],
    companies = [],
    citiesLoading = false,
    companiesLoading = false,

    citySearch = "",
    setCitySearch,
    companySearch = "",
    setCompanySearch,
}) {
    /* ---------- Icône par étape ---------- */

    const STEP_ICONS = {
        identity: Building2,
        contact: Phone,
        location: MapPin,
    };

    const StepIcon = STEP_ICONS[step.key] ?? Building2;

    /* ---------- Rendu des champs selon l'étape ---------- */

    const renderFields = () => {
        switch (step.key) {
            case "identity":
                return (
                    <>
                        <Input
                            label="Nom de l'agence"
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Ex : Gare Siporex"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                touched.name &&
                                errors.name
                            }
                            required
                        // autoFocus
                        />

                        <SearchableSelect
                            label="Compagnie"
                            name="companyId"
                            id="companyId"
                            value={formData.companyId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.companyId && errors.companyId}
                            placeholder="Sélectionner une entreprise"
                            searchPlaceholder="Rechercher une entreprise..."
                            options={companies.map((c) => ({
                                value: c.id,
                                label: `${c.name}`,
                            }))}
                            search={companySearch}
                            onSearchChange={setCompanySearch}
                            loading={companiesLoading}
                            required
                        />
                    </>
                );

            case "contact":
                return (
                    <>
                        <Input
                            label="Téléphone"
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.phone && errors.phone}
                            placeholder="+225 07 07 00 00 00"
                            autoComplete="tel"
                            required
                        />

                        <Input
                            label="Email (optionnel)"
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email && errors.email}
                            placeholder="contact@utb.ci"
                            autoComplete="email"
                        />
                    </>
                );

            case "location":
                return (
                    <>
                        <SearchableSelect
                            label="Ville de l'agence"
                            name="cityId"
                            id="cityId"
                            value={formData.cityId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.cityId && errors.cityId}
                            placeholder="Sélectionner une ville"
                            searchPlaceholder="Rechercher une ville..."
                            options={locations.map((city) => ({
                                value: city.id,
                                label: `${city.name}${city.country?.name
                                    ? ` · ${city.country.name}`
                                    : ""
                                    }`,
                            }))}
                            search={citySearch}
                            onSearchChange={setCitySearch}
                            loading={citiesLoading}
                            required
                        />

                        <Input
                            label="Adresse de l'agence"
                            name="address"
                            id="address"
                            value={formData.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.address && errors.address}
                            placeholder="Ex : Rue du Commerce, Zone 4, Abidjan"
                            required
                        />
                    </>
                );

            default:
                return null;
        }
    }

    /* ---------- Submit ---------- */

    const handleFormLocalSubmit = async (e) => {
        e.preventDefault();

        if (isLastStep) {
            return handleFormSubmit(e);
        }

        return goNext();
    };

    return (
        <form
            onSubmit={handleFormLocalSubmit}
            className="agency-form"
            noValidate
        >

            {/* ---------- Stepper ---------- */}

            <CreateAgencyStepper
                steps={STEPS}
                currentStep={currentStep}
                onStepClick={goTo}
            />

            {/* ---------- En-tête de l'étape ---------- */}

            <header className="agency-form__step-header">
                <div className="company-form__step-icon">
                    <StepIcon size={20} aria-hidden="true" />
                </div>

                <div>
                    <h2>{step.title}</h2>
                    <p>{step.description}</p>
                </div>
            </header>

            {/* ---------- Erreur serveur ---------- */}

            {serverError && (
                <div className="server-error" role="alert">
                    <span className="error-icon" aria-hidden="true">⚠️</span>
                    <span>{serverError}</span>
                </div>
            )}

            {/* ---------- Champs ---------- */}

            <div className="company-form__fields">
                {renderFields()}
            </div>

            {/* ---------- Navigation ---------- */}

            <footer className="company-form__actions">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={goPrev}
                    disabled={isFirstStep || isSubmitting}
                >
                    Précédent
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator
                            size={14}
                            type="dots"
                            color="white"
                        />
                    ) : isLastStep ? (
                        <>
                            <Save size={16} />
                            Créer
                        </>
                    ) : (
                        <>
                            Suivant
                        </>
                    )}
                </Button>
            </footer>

        </form>
    );
}