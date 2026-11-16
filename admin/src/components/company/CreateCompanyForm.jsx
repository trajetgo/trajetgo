import { Building2, FileText, Phone, MapPin, Save } from "lucide-react";

import Input from "@shared/components/ui/Input";
import SearchableSelect from "@shared/components/ui/SearchableSelect";
import Button from "@shared/components/ui/Button";
import ActivityIndicator from "@shared/components/ui/ActivityIndicator";

import CreateCompanyStepper from "./CreateCompanyStepper";

import "../../styles/components/company/CreateCompanyForm.scss";

/* ------------------------------------------------------------------ */

export default function CreateCompanyForm({
    handleFormSubmit,

    formData,
    errors,
    touched,

    handleChange,
    handleBlur,

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
    citiesLoading = false,

    citySearch = "",
    setCitySearch,
}) {
    /* ---------- Icône par étape ---------- */

    const STEP_ICONS = {
        identity: Building2,
        legal: FileText,
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
                            label="Nom commercial"
                            name="name"
                            id="name"
                            value={formData?.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.name && errors.name}
                            placeholder="Ex : UTB"
                            autoComplete="organization"
                            required
                        />

                        <Input
                            label="Raison sociale (optionnel)"
                            name="legalName"
                            id="legalName"
                            value={formData.legalName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.legalName && errors.legalName}
                            placeholder="Ex : Union des Transports de Bouaké SARL"
                        />
                    </>
                );

            case "legal":
                return (
                    <>
                        <Input
                            label="Numéro RCCM"
                            name="rccm"
                            id="rccm"
                            value={formData.rccm}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.rccm && errors.rccm}
                            placeholder="Ex : CI-ABJ-2020-B-12345"
                        />

                        <Input
                            label="Identifiant Unique (IDU)"
                            name="idu"
                            id="idu"
                            value={formData.idu}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.idu && errors.idu}
                            placeholder="Ex : 1234567890"
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

                        <Input
                            label="Site web (optionnel)"
                            type="url"
                            name="website"
                            id="website"
                            value={formData.website}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.website && errors.website}
                            placeholder="https://utb.ci"
                        />
                    </>
                );

            case "location":
                return (
                    <>
                        <SearchableSelect
                            label="Ville du siège"
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
                            label="Adresse du siège"
                            name="address"
                            id="address"
                            value={formData.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.address && errors.address}
                            placeholder="Ex : Rue du Commerce, Zone 4, Abidjan"
                            required
                        />

                        <Input
                            label="URL du logo (optionnel)"
                            type="url"
                            name="logo"
                            id="logo"
                            value={formData.logo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.logo && errors.logo}
                            placeholder="https://cdn.trajetgo.ci/logos/utb.png"
                        />

                        {formData.logo && (
                            <div className="company-form__logo-preview">
                                <img
                                    src={formData.logo}
                                    alt="Aperçu du logo"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                    }}
                                />
                            </div>
                        )}
                    </>
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
            className="company-form"
            noValidate
        >
            {/* ---------- Stepper ---------- */}

            <CreateCompanyStepper
                steps={STEPS}
                currentStep={currentStep}
                onStepClick={goTo}
            />

            {/* ---------- En-tête de l'étape ---------- */}

            <header className="company-form__step-header">
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