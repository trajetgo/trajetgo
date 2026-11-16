import Modal from "@shared/components/ui/Modal";
import { useToast } from "@shared/contexts/toast.context";

import useCompanies from "../../hooks/useCompanies";
import useCreateAgency from "../../hooks/useCreateAgency";
import useLocations from "../../hooks/useLocations";
import { STEPS } from "../../utils/agency.utils";
import CreateAgencyForm from "./CreateAgencyForm";

export default function CreateAgencyModal({
    isOpen,
    onClose,
    onCreated,
}) {
    const { showToast } = useToast();

    const {
        locations,
        search: citySearch,
        setSearch: setCitySearch,
        loading: citiesLoading,
    } = useLocations('city');

    const {
        companies,
        search: companySearch,
        setSearch: setCompanySearch,
        loading: companyLoading,
    } = useCompanies();

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

        currentStep,
        step,
        isFirstStep,
        isLastStep,
        goNext,
        goPrev,
        goTo,
    } = useCreateAgency();

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

    /* ---------- Fermeture ---------- */

    const handleClose = () => {
        resetForm();
        onClose?.();
    };

    /* ---------- Rendu ---------- */

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
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
                citySearch={citySearch}
                setCitySearch={setCitySearch}

                companies={companies}
                companiesLoading={companyLoading}
                companySearch={companySearch}
                setCompanySearch={setCompanySearch}
            />
        </Modal>
    );
}