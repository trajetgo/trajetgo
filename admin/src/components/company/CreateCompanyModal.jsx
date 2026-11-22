import Modal from "@shared/components/ui/Modal";
import { useToast } from "@shared/contexts/toast.context";

import useCreateCompany from "../../hooks/useCreateCompany";
import useLocations from "../../hooks/useLocations";
import CreateCompanyForm from "./CreateCompanyForm";

export default function CreateCompanyModal({
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

        STEPS,
        currentStep,
        step,
        isFirstStep,
        isLastStep,
        goNext,
        goPrev,
        goTo,
    } = useCreateCompany();

    const {
        locations = [],
        search,
        setSearch,
        loading: citiesLoading
    } = useLocations("city");

    /* ---------- Submit ---------- */

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const result = await handleSubmit(e);

        if (result?.success) {
            showToast(
                "success",
                "Compagnie créée",
                "La compagnie a été ajoutée avec succès.",
                { duration: 4000 }
            );

            onClose?.();
            onCreated?.(result.data);
        }
    };

    /* ---------- Fermeture ---------- */

    const handleClose = () => {
        resetForm();
        onClose?.();
    };

    /* ---------- Rendu ---------- */

    return (
        <Modal
            isOpen={open}
            onClose={handleClose}
            title="Nouvelle compagnie"
            size="lg"
        >
            <CreateCompanyForm
                handleFormSubmit={handleFormSubmit}

                formData={formData}
                errors={errors}
                touched={touched}

                handleChange={handleChange}
                handleBlur={handleBlur}

                isSubmitting={isSubmitting}
                serverError={serverError}

                STEPS={STEPS}
                currentStep={currentStep}
                step={step}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                goNext={goNext}
                goPrev={goPrev}
                goTo={goTo}

                locations={locations}
                citiesLoading={citiesLoading}

                citySearch={search}
                setCitySearch={setSearch}
            />
        </Modal>
    );
}