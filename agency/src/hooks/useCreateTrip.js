import { useState } from "react";
import service from "../services/trips.service";

export default function useCreateTrip() {
    const [formData, setFormData] = useState({
        routeId: "",
        busId: "",
        departureLocationId: "",
        arrivalLocationId: "",
        departureDate: "",
        departureTime: "",
        arrivalDate: "",
        arrivalTime: "",
        price: "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const validateField = (name, value) => {
        switch (name) {
            case "routeId":
                if (!value) {
                    return "Veuillez sélectionner une ligne.";
                }

                return "";

            case "busId":
                if (!value) {
                    return "Veuillez sélectionner un bus.";
                }

                return "";

            case "departureLocationId":
                if (!value) {
                    return "Veuillez sélectionner le lieu de départ.";
                }

                return "";

            case "arrivalLocationId":
                if (!value) {
                    return "Veuillez sélectionner le lieu d'arrivée.";
                }

                return "";

            case "departureDate":
                if (!value) {
                    return "La date de départ est obligatoire.";
                }

                return "";

            case "departureTime":
                if (!value) {
                    return "L'heure de départ est obligatoire.";
                }

                return "";

            case "arrivalDate":
                if (!value) {
                    return "La date d'arrivée est obligatoire.";
                }

                return "";

            case "arrivalTime":
                if (!value) {
                    return "L'heure d'arrivée est obligatoire.";
                }

                return "";

            case "price":
                if (value === "") {
                    return "Le prix est obligatoire.";
                }

                if (Number(value) <= 0) {
                    return "Le prix doit être supérieur à 0.";
                }

                return "";

            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        const nextValue =
            type === "checkbox"
                ? checked
                : value;

        if (name === "routeId") {
            setFormData((previous) => ({
                ...previous,
                routeId: value,
                departureLocationId: "",
                arrivalLocationId: "",
            }));

            setErrors((previous) => ({
                ...previous,
                routeId: "",
                departureLocationId: "",
                arrivalLocationId: "",
            }));

            setServerError("");

            return;
        }

        setFormData((previous) => ({
            ...previous,
            [name]: nextValue,
        }));

        const error =
            validateField(
                name,
                nextValue
            );

        setErrors((previous) => ({
            ...previous,
            [name]: error,
        }));

        setServerError("");
    };

    const handleBlur = (e) => {
        const {
            name,
            value,
        } = e.target;

        setTouched((previous) => ({
            ...previous,
            [name]: true,
        }));

        const error =
            validateField(
                name,
                value
            );

        setErrors((previous) => ({
            ...previous,
            [name]: error,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        Object.entries(formData).forEach(
            ([name, value]) => {
                const error =
                    validateField(
                        name,
                        value
                    );

                if (error) {
                    newErrors[name] = error;
                }
            }
        );

        // Vérification supplémentaire
        if (
            formData.departureLocationId &&
            formData.arrivalLocationId &&
            formData.departureLocationId ===
            formData.arrivalLocationId
        ) {
            newErrors.arrivalLocationId =
                "Le départ et l'arrivée doivent être différents.";
        }

        setErrors(newErrors);

        setTouched({
            routeId: true,
            busId: true,
            departureLocationId: true,
            arrivalLocationId: true,
            departureDate: true,
            departureTime: true,
            arrivalDate: true,
            arrivalTime: true,
            price: true,
        });

        return (
            Object.keys(newErrors).length === 0
        );
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return {
                success: false,
            };
        }

        setIsSubmitting(true);
        setServerError("");

        try {
            const payload = {
                routeId: formData.routeId,
                busId: formData.busId,

                departureLocationId:
                    formData.departureLocationId,

                arrivalLocationId:
                    formData.arrivalLocationId,

                departureDate:
                    formData.departureDate,

                departureTime:
                    formData.departureTime,

                arrivalDate:
                    formData.arrivalDate,

                arrivalTime:
                    formData.arrivalTime,

                price: Number(
                    formData.price
                ),
            };

            const result =
                await service.createTrip(
                    payload
                );

            if (!result.success) {
                setServerError(
                    result.message ||
                    "Impossible de créer le voyage."
                );

                return {
                    success: false,
                };
            }

            return {
                success: true,
                data: result.data,
            };

        } catch (error) {
            setServerError(
                error.message ||
                "Impossible de créer le voyage."
            );

            return {
                success: false,
                error,
            };

        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            routeId: "",
            busId: "",
            departureLocationId: "",
            arrivalLocationId: "",
            departureDate: "",
            departureTime: "",
            arrivalDate: "",
            arrivalTime: "",
            price: "",
        });

        setErrors({});
        setTouched({});
        setIsSubmitting(false);
        setServerError("");
    };

    return {
        formData,
        errors,
        touched,
        isSubmitting,
        serverError,

        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
    };
}