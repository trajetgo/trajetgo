import { useMemo } from "react";

import Modal from "@shared/components/ui/Modal";
import { useToast } from "@shared/contexts/toast.context";

import useCreateTrip from "../../hooks/useCreateTrip";
import useRoutes from "../../hooks/useRoutes";
import useBuses from "../../hooks/useBuses";
import useLocations from "../../hooks/useLocations";

import CreateTripForm from "./CreateTripForm";

export default function CreateTripModal({
    isOpen,
    onClose,
    onCreated,
}) {
    const {
        routes,
        loading: routesLoading,
    } = useRoutes();

    const {
        buses,
        loading: busesLoading,
    } = useBuses();

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
    } = useCreateTrip();

    /*
     * ---------------------------------------------------------
     * Route sélectionnée
     * ---------------------------------------------------------
     */

    const selectedRoute = useMemo(() => {
        return routes.find(
            (route) => route.id === formData.routeId
        ) || null;
    }, [routes, formData.routeId]);

    const originCityId =
        selectedRoute?.originCity?.id || null;

    const destinationCityId =
        selectedRoute?.destinationCity?.id || null;


    /*
     * ---------------------------------------------------------
     * Locations de départ
     * ---------------------------------------------------------
     */

    const {
        locations: departureLocations,
        loading: departureLocationsLoading,
        serverError: departureLocationsError,
    } = useLocations(originCityId);


    /*
     * ---------------------------------------------------------
     * Locations d'arrivée
     * ---------------------------------------------------------
     */

    const {
        locations: arrivalLocations,
        loading: arrivalLocationsLoading,
        serverError: arrivalLocationsError,
    } = useLocations(destinationCityId);


    /*
     * ---------------------------------------------------------
     * Options pour les Select
     * ---------------------------------------------------------
     */

    const routeOptions = routes
        .filter((route) => route.active)
        .map((route) => ({
            label: `${route.originCity.name} → ${route.destinationCity.name}`,
            value: route.id,
        }));

    const busOptions = buses
        .filter((bus) => bus.status === "ACTIVE")
        .map((bus) => ({
            label: `${bus.name || bus.registrationNumber} · ${bus.capacity} places`,
            value: bus.id,
        }));

    const departureLocationOptions =
        departureLocations.map((location) => ({
            label: location.name,
            value: location.id,
        }));

    const arrivalLocationOptions =
        arrivalLocations.map((location) => ({
            label: location.name,
            value: location.id,
        }));


    const locationsLoading =
        departureLocationsLoading ||
        arrivalLocationsLoading;

    const locationsError =
        departureLocationsError ||
        arrivalLocationsError;


    /*
     * ---------------------------------------------------------
     * Submit
     * ---------------------------------------------------------
     */

    const { showToast } = useToast();

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await handleSubmit();

            if (result.success) {
                showToast(
                    "success",
                    "Succès",
                    "Nouveau voyage créé"
                );

                resetForm();

                onClose();

                await onCreated?.(result.data);
            }
        } catch (error) {
            showToast(
                "error",
                "Erreur",
                error.message ||
                    "Une erreur est survenue"
            );
        }
    };


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Nouveau voyage"
        >
            <CreateTripForm
                handleFormSubmit={handleFormSubmit}

                serverError={
                    serverError ||
                    locationsError
                }

                formData={formData}
                errors={errors}
                touched={touched}

                handleBlur={handleBlur}
                handleChange={handleChange}

                isSubmitting={isSubmitting}

                routes={routeOptions}
                buses={busOptions}

                departureLocations={
                    departureLocationOptions
                }

                arrivalLocations={
                    arrivalLocationOptions
                }

                routesLoading={routesLoading}
                busesLoading={busesLoading}
                locationsLoading={locationsLoading}

                originCityId={originCityId}
                destinationCityId={
                    destinationCityId
                }
            />
        </Modal>
    );
}