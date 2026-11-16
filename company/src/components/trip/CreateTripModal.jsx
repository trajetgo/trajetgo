import { useEffect, useMemo } from "react";

import { useToast } from "@shared/contexts/toast.context";
import Modal from "@shared/components/ui/Modal";

import useCreateTrip from "../../hooks/useCreateTrip";
import useRoutes from "../../hooks/useRoutes";
import useBuses from "../../hooks/useBuses";
import useAgencies from "../../hooks/useAgencies";
import CreateTripForm from "./CreateTripForm";

import {
    computeArrival,
} from "../../utils/trip.utils";

/* ------------------------------------------------------------------ */

export default function CreateTripModal({
    isOpen,
    onClose,
    onCreated,
}) {
    const { showToast } = useToast();

    /* ---------- Données ---------- */

    const { routes = [], loading: routesLoading } = useRoutes();
    const { buses = [], loading: busesLoading } = useBuses();
    const { agencies = [], loading: agenciesLoading } = useAgencies();

    /* ---------- Form ---------- */

    const {
        formData,
        setFormData,
        errors,
        touched,
        isSubmitting,
        serverError,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,

        /* Steps */
        STEPS,
        currentStep,
        step,
        isFirstStep,
        isLastStep,
        goNext,
        goPrev,
        goTo,
    } = useCreateTrip();

    /* ---------- Route sélectionnée ---------- */

    const selectedRoute = useMemo(
        () => routes.find((r) => r.id === formData.routeId) ?? null,
        [routes, formData.routeId]
    );

    const originCityId = selectedRoute?.originCity?.id ?? null;
    const destinationCityId = selectedRoute?.destinationCity?.id ?? null;

    /* ---------- Auto-complétion du prix ---------- */

    const durationMin = selectedRoute?.durationMin ?? null;

    useEffect(() => {
        if (!selectedRoute) return;

        setFormData((prev) => {
            const next = {
                ...prev,
            };

            // Le prix provient de la ligne.
            if (
                !prev.price ||
                prev.routeId !== selectedRoute.id
            ) {
                next.price = String(
                    selectedRoute.basePrice ?? ""
                );
            }

            // Sans durée définie, on ne calcule pas l'arrivée.
            if (!durationMin || durationMin <= 0) {
                return next;
            }

            const arrival = computeArrival(
                prev.departureDate,
                prev.departureTime,
                durationMin
            );

            if (!arrival) {
                next.arrivalDate = "";
                next.arrivalTime = "";
                return next;
            }

            next.arrivalDate = arrival.date;
            next.arrivalTime = arrival.time;

            return next;
        });
    }, [
        selectedRoute?.id,
        selectedRoute?.basePrice,
        durationMin,
        formData.departureDate,
        formData.departureTime,
        setFormData,
    ]);

    /* ---------- Agences filtrées ---------- */

    const departureAgencies = useMemo(() => {
        if (!originCityId) return [];

        return agencies.filter(
            (a) =>
                a.status === "ACTIVE" &&
                a.cityId === originCityId
        );
    }, [agencies, originCityId]);

    const arrivalAgencies = useMemo(() => {
        if (!destinationCityId) return [];

        return agencies.filter(
            (a) =>
                a.status === "ACTIVE" &&
                a.cityId === destinationCityId
        );
    }, [agencies, destinationCityId]);

    /* ---------- Options ---------- */

    const routeOptions = useMemo(
        () =>
            routes
                .filter((r) => r.active)
                .map((r) => ({
                    value: r.id,
                    label: `${r.originCity?.name ?? "?"} → ${r.destinationCity?.name ?? "?"
                        }`,
                })),
        [routes]
    );

    const busOptions = useMemo(
        () =>
            buses
                .filter((b) => b.status === "ACTIVE")
                .map((b) => ({
                    value: b.id,
                    label: `${b.name || b.registrationNumber} · ${b.capacity} places`,
                })),
        [buses]
    );

    const departureAgencyOptions = useMemo(
        () =>
            departureAgencies.map((a) => ({
                value: a.id,
                label: a.location?.name
                    ? `${a.name} · ${a.location.name}`
                    : a.name,
            })),
        [departureAgencies]
    );

    const arrivalAgencyOptions = useMemo(
        () =>
            arrivalAgencies.map((a) => ({
                value: a.id,
                label: a.location?.name
                    ? `${a.name} · ${a.location.name}`
                    : a.name,
            })),
        [arrivalAgencies]
    );

    /* ---------- Submit ---------- */

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const result = await handleSubmit(e);

        if (result?.success) {
            showToast(
                "success",
                "Voyage créé",
                "Le voyage a été programmé."
            );

            resetForm();
            onClose();
            onCreated?.(result.data);
        }
    };

    /* ---------- Close ---------- */

    const handleClose = () => {
        if (isSubmitting) return; // ✅ ne pas fermer pendant la soumission
        resetForm();
        onClose();
    };

    /* ---------- Rendu ---------- */

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Nouveau voyage"
            size="lg"
        >
            <CreateTripForm
                handleFormSubmit={handleFormSubmit}

                formData={formData}
                errors={errors}
                touched={touched}

                handleChange={handleChange}
                handleBlur={handleBlur}

                isSubmitting={isSubmitting}
                serverError={serverError}

                routes={routeOptions}
                buses={busOptions}
                departureAgencies={departureAgencyOptions}
                arrivalAgencies={arrivalAgencyOptions}

                routesLoading={routesLoading}
                busesLoading={busesLoading}
                agenciesLoading={agenciesLoading}

                selectedRoute={selectedRoute}
                durationMin={durationMin}

                STEPS={STEPS}
                currentStep={currentStep}
                step={step}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                goNext={goNext}
                goPrev={goPrev}
                goTo={goTo}
            />
        </Modal>
    );
}