import Modal from "@shared/components/ui/Modal";

import useCreateLocation from "../../hooks/useCreateLocation";
import CreateLocationForm from "./CreateLocationForm";

export default function CreateLocationModal({
    type, // "country" | "city"
    open,
    onClose,
    onCreated,

    countries,
    countriesLoading,
    locationsError,
}) {
    const {
        formData,
        errors,
        touched,
        isSubmitting,
        serverError: submitError,

        updateField,
        updateCoords,
        touchField,

        submit,
    } = useCreateLocation(type);

    const handleSubmit = async () => {
        const result = await submit();

        if (!result.success) {
            return;
        }

        onCreated?.(result.data);
        onClose?.();
    };

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={
                type === "country"
                    ? "Ajouter un pays"
                    : "Ajouter une ville"
            }
        >
            <CreateLocationForm
                type={type}
                formData={formData}
                errors={errors}
                touched={touched}
                isSubmitting={isSubmitting}
                serverError={submitError || locationsError}
                countries={countries}
                countriesLoading={countriesLoading}
                onChange={updateField}
                onCoordsChange={updateCoords}
                onBlur={touchField}
                onSubmit={handleSubmit}
                onCancel={onClose}
            />
        </Modal>
    );
}