import { Building2, BusFront, User, Wallet } from "lucide-react";
import SellTicketStepper from "./sell/SellTicketStepper";

import Button from "@shared/components/ui/Button";
import ActivityIndicator from "@shared/components/ui/ActivityIndicator";

import StepTrip from "./sell/StepTrip";
import StepSeat from "./sell/StepSeat";
import StepPassenger from "./sell/StepPassenger";
import StepPayment from "./sell/StepPayment";
import TicketReceipt from "./sell/TicketReceipt";

import "../../styles/components/ticket/SellTicketForm.scss";

/* ✅ Icônes alignées sur les clés réelles des étapes */
const STEP_ICONS = {
    trip: Building2,
    seat: BusFront,
    passenger: User,
    payment: Wallet,
};

export default function SellTicketForm({
    /* Form state */
    formData,
    errors,
    touched,
    isSubmitting,
    serverError,

    /* Handlers */
    handleChange,
    handleBlur,
    onSubmit,

    /* Navigation */
    steps,
    currentStep,
    step,
    isFirstStep,
    isLastStep,
    goPrev,
    goTo,

    /* Data */
    trips = [],
    tripsLoading = false,
    tripsError = "",

    /* Reçu */
    receipt,
    onCloseReceipt,
}) {
    /* ---------- Si le billet est vendu → reçu ---------- */
    if (receipt) {
        return (
            <TicketReceipt
                ticket={receipt}
                onClose={onCloseReceipt}
            />
        );
    }

    const StepIcon = STEP_ICONS[step?.key] ?? Building2;

    /* ---------- Rendu par étape ---------- */
    const renderStep = () => {
        switch (step?.key) {
            case "trip":
                return (
                    <StepTrip
                        formData={formData}
                        errors={errors}
                        touched={touched}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        trips={trips}
                        loading={tripsLoading}
                        serverError={tripsError}
                    />
                );

            case "seat":
                return (
                    <StepSeat
                        tripId={formData.tripId}
                        value={formData.seatId}
                        error={touched.seatId && errors.seatId}
                        onChange={(seatId) =>
                            handleChange({
                                target: { name: "seatId", value: seatId },
                            })
                        }
                    />
                );

            case "passenger":
                return (
                    <StepPassenger
                        formData={formData}
                        errors={errors}
                        touched={touched}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                );

            case "payment":
                return (
                    <StepPayment
                        formData={formData}
                        errors={errors}
                        touched={touched}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        trips={trips}
                    />
                );

            default:
                return null;
        }
    };

    /* ---------- Submit ---------- */
    // ⚠️ Plus de logique ici : tout est dans le parent.
    const handleLocalSubmit = (e) => onSubmit(e);

    /* ---------- Rendu ---------- */
    return (
        <form
            onSubmit={handleLocalSubmit}
            className="sell-ticket-form"  /* ✅ typo corrigée */
            noValidate
        >
            <SellTicketStepper
                steps={steps}
                currentStep={currentStep}
                onStepClick={goTo}
            />

            <header className="sell-ticket-form__step-header">
                <div className="sell-ticket-form__step-icon">
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

            <div className="sell-ticket-form__fields">
                {renderStep()}
            </div>

            <footer className="sell-ticket-form__actions">
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

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth={isFirstStep}
                    loading={isLastStep && isSubmitting}
                    disabled={isSubmitting}
                >
                    {isLastStep ? (
                        isSubmitting ? (
                            <ActivityIndicator size={14} type="dots" color="white" />
                        ) : (
                            "Encaisser et créer le billet"   /* ✅ label manquant */
                        )
                    ) : (
                        "Continuer"
                    )}
                </Button>
            </footer>
        </form>
    );
}