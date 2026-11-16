import Modal from "@shared/components/ui/Modal";
import { useToast } from "@shared/contexts/toast.context";

import useSellTicket from "../../hooks/useSellTicket";
import SellTicketForm from "./SellTicketForm";

import useTrips from "../../hooks/useTrips";
import { CREATE_TICKET_STEPS } from "../../utils/ticket.utils";

import "../../styles/components/ticket/SellTicketModal.scss";

export default function SellTicketModal({ open, onClose, onSold }) {
    const { showToast } = useToast();

    const {
        loading: tripsLoading,
        trips,
        serverError: tripsError,
    } = useTrips();

    const {
        formData,
        errors,
        touched,
        isSubmitting,
        serverError,
        currentStep,
        step,
        isFirstStep,
        isLastStep,
        receipt,
        handleChange,
        handleBlur,
        goNext,
        goPrev,
        goTo,
        handleSubmit,
        resetForm,
    } = useSellTicket();

    const handleClose = () => {
        if (isSubmitting) return;
        resetForm();
        onClose?.();
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!isLastStep) {
            goNext();
            return;
        }

        const result = await handleSubmit();
        if (result.success) {
            showToast(
                "success",
                "Billet vendu",
                "Le billet a été créé et encaissé.",
                { duration: 4000 }
            );
            onSold?.(result.data);
        }
    };

    return (
        <Modal
            title={receipt ? "Billet vendu" : "Vendre un billet"}
            isOpen={open}
            onClose={handleClose}
            size="md"
        >
            <SellTicketForm
                formData={formData}
                errors={errors}
                touched={touched}
                isSubmitting={isSubmitting}
                serverError={serverError}

                handleChange={handleChange}
                handleBlur={handleBlur}
                onSubmit={handleFormSubmit}

                steps={CREATE_TICKET_STEPS}
                currentStep={currentStep}
                step={step}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                goPrev={goPrev}
                goTo={goTo}

                trips={trips}
                tripsLoading={tripsLoading}
                tripsError={tripsError}

                receipt={receipt}
                onCloseReceipt={handleClose}
            />
        </Modal>
    );
}