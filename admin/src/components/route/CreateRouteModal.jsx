import Modal from "@shared/components/ui/Modal";
import { useToast } from "@shared/contexts/toast.context";

import useCreateRoute from "../../hooks/useCreateRoute";
import CreateRouteForm from "./CreateRouteForm";

import useLocations from "../../hooks/useLocations";
import useCompanies from "../../hooks/useCompanies";

/* ------------------------------------------------------------------ */

export default function CreateRouteModal({
    open,
    onClose,
    onCreated,
}) {
    const { showToast } = useToast();

    const {
        loading: companiesLoading,
        companies,
        search: companySearch,
        setSearch: setCompanySearch,
    } = useCompanies();

    const {
        loading: citiesLoading,
        locations: cities,
        search: citySearch,
        setSearch: setCitySearch
    } = useLocations('city');

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

        originCity,
        destinationCity,
    } = useCreateRoute();

    /* ---------- Submit ---------- */

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const result = await handleSubmit(e);

        if (result?.success) {
            showToast(
                "success",
                "Ligne créée",
                "La ligne a été ajoutée avec succès.",
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
            title="Nouvelle ligne"
            size="md"
        >
            <CreateRouteForm
                handleFormSubmit={handleFormSubmit}

                formData={formData}
                errors={errors}
                touched={touched}

                handleChange={handleChange}
                handleBlur={handleBlur}

                isSubmitting={isSubmitting}
                serverError={serverError}

                locations={cities}
                citiesLoading={citiesLoading}
                citySearch={citySearch}
                setCitySearch={setCitySearch}

                originCity={originCity}
                destinationCity={destinationCity}

                companies={companies}
                companiesLoading={companiesLoading}
                companySearch={companySearch}
                setCompanySearch={setCompanySearch}
            />
        </Modal>
    );
}