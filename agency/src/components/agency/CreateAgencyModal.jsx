import { useToast } from "@shared/contexts/toast.context";
import Modal from "@shared/components/ui/Modal";

import useCreateAgency from "../../hooks/useCreateAgency";
import useCities from "../../hooks/useCities";
import CreateAgencyForm from "./CreateAgencyForm";

export default function CreateAgencyModal({
    isOpen,
    onClose,
    onCreated,
}) {
    const {
        cities,
        loading: citiesLoading,
    } = useCities();

    const {
        isSubmitting,
        serverError,
        formData,
        errors,
        touched,
        handleSubmit,
        handleBlur,
        handleChange,
        resetForm,
    } = useCreateAgency();

    const { showToast } = useToast();

    /*
     * Le Select attend :
     *
     * {
     *   label: "Abidjan",
     *   value: "city-abidjan"
     * }
     */
    const formattedCities = cities.map((city) => ({
        label: city.name,
        value: city.id,
    }));

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await handleSubmit(e);

            if (result.success) {
                showToast(
                    "success",
                    "Succès",
                    "Nouvelle agence créée"
                );

                resetForm();

                onClose();

                await onCreated?.(result.data);
            }
        } catch (error) {
            showToast(
                "error",
                "Erreur",
                "Une erreur est survenue"
            );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Nouvelle agence"
        >
            <CreateAgencyForm
                handleFormSubmit={handleFormSubmit}
                serverError={serverError}
                formData={formData}
                errors={errors}
                touched={touched}
                handleBlur={handleBlur}
                handleChange={handleChange}
                isSubmitting={isSubmitting}
                cities={formattedCities}
                citiesLoading={citiesLoading}
            />
        </Modal>
    );
}