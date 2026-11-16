import Modal from "@shared/components/ui/Modal";
import { useToast } from "@shared/contexts/toast.context";

import useCreateBus from "../../hooks/useCreateBus";
import CreateBusForm from "./CreateBusForm";

export default function CreateBusModal({
    open,
    onClose,
    onCreated,
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
        resetForm,
    } = useCreateBus();

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const result = await handleSubmit(e);

        if (result?.success) {
            showToast(
                "success",
                "Bus créé",
                "Le bus a été ajouté à votre flotte.",
                { duration: 4000 }
            );

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
            size="md"
        >
            <CreateBusForm
                handleFormSubmit={handleFormSubmit}
                formData={formData}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                isSubmitting={isSubmitting}
                serverError={serverError}
            />
        </Modal>
    );
}