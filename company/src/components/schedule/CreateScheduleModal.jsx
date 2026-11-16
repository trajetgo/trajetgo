import Modal from "@shared/components/ui/Modal";
import { useToast } from "@shared/contexts/toast.context";

import CreateScheduleForm from "./CreateScheduleForm";
import useCreateSchedule from "../../hooks/useCreateSchedule";
import useRoutes from "../../hooks/useRoutes";
import useBuses from "../../hooks/useBuses";
import useAgencies from "../../hooks/useAgencies";

/* ------------------------------------------------------------------ */

export default function CreateScheduleModal({
    open,
    onClose,
    onCreated,
}) {
    const { showToast } = useToast();

    const { routes = [] } = useRoutes();
    const { buses = [] } = useBuses();
    const { agencies = [] } = useAgencies();

    const {
        formData,
        errors,
        touched,

        currentStep,
        step,
        steps,
        isFirstStep,
        isLastStep,
        goNext,
        goPrev,
        goTo,

        isSubmitting,
        serverError,

        selectedRoute,

        updateField,
        updateDays,
        touchField,

        handleSubmit,
        resetForm,

        addDeparture,
        updateDeparture,
        removeDeparture,
    } = useCreateSchedule({ routes });

    /* ---------- Submit ---------- */

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const result = await handleSubmit();

        if (result.success) {
            showToast(
                "success",
                "Programmation créée",
                "La programmation a été ajoutée avec succès.",
                { duration: 4000 }
            );

            onClose?.();
            onCreated?.(result.data);
        }
    };

    const handleClose = () => {
        if (isSubmitting) return;
        resetForm();
        onClose?.();
    };

    return (
        <Modal
            title="Nouvelle programmation"
            isOpen={open}
            onClose={handleClose}
            size="md"
        >
            <CreateScheduleForm
                formData={formData}
                errors={errors}
                touched={touched}

                updateField={updateField}
                updateDays={updateDays}
                touchField={touchField}

                isSubmitting={isSubmitting}
                serverError={serverError}

                onSubmit={handleFormSubmit}

                currentStep={currentStep}
                step={step}
                steps={steps}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                goNext={goNext}
                goPrev={goPrev}
                goTo={goTo}

                routes={routes}
                agencies={agencies}
                buses={buses}

                selectedRoute={selectedRoute}

                /* ✅ Simplifié */
                addDeparture={addDeparture}
                updateDeparture={updateDeparture}
                removeDeparture={removeDeparture}
            />
        </Modal>
    );
}