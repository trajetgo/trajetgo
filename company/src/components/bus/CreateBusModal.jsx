import { useToast } from "@shared/contexts/toast.context";
import Modal from "@shared/components/ui/Modal";

import CreateBusForm from "./CreateBusForm";
import useCreateBus from "../../hooks/useCreateBus";

export default function CreateBusModal({ 
    open, 
    onClose, 
    onCreated 
}) {
    const { showToast } = useToast();

    const {
        formData,
        errors,
        touched,
        isSubmitting,
        serverError,
        handleChange,
        handleBlur,
        handleSubmit,
        handleAmenityChange,
        resetForm,

        /* Steps */
        steps,
        currentStep,
        step,
        isFirstStep,
        isLastStep,
        goNext,
        goPrevious,   // ✅ renommé pour cohérence
        goToStep,
    } = useCreateBus();

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const result = await handleSubmit(e);

        if (result?.success) {
            showToast("success", "Bus créé", "Le bus a été ajouté à votre flotte.", {
                duration: 4000,
            });

            resetForm();
            onClose?.();
            onCreated?.(result.data);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose?.();
    };

    return (
        <Modal
            isOpen={open}
            onClose={handleClose}
            title="Nouveau bus"
            size="lg"
        >
            <CreateBusForm
                handleFormSubmit={handleFormSubmit}

                formData={formData}
                errors={errors}
                touched={touched}

                handleChange={handleChange}
                handleBlur={handleBlur}
                handleAmenityChange={handleAmenityChange}

                isSubmitting={isSubmitting}
                serverError={serverError}

                /* ✅ Steps */
                STEPS={steps}
                currentStep={currentStep}
                step={step}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                goNext={goNext}
                goPrev={goPrevious}
                goTo={goToStep}
            />
        </Modal>
    );
}