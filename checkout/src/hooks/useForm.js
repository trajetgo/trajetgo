import { useMemo, useState } from "react";
import service from "../services/checkout.service";
import {
    normalizePhoneCI,
    validateEmail,
    validatePhone,
    validateRequired,
} from "../utils/validation.utils";

/* ------------------------------------------------------------------ */
/* Types de documents autorisés                                        */
/* ------------------------------------------------------------------ */

export const DOCUMENT_TYPES = [
    { value: "ID_CARD", label: "Carte d'identité" },
    { value: "PASSPORT", label: "Passeport" },
    { value: "DRIVER_LICENSE", label: "Permis de conduire" },
    { value: "BIRTH_CERTIFICATE", label: "Extrait de naissance" },
];

/* ------------------------------------------------------------------ */
/* Forme initiale                                                      */
/* ------------------------------------------------------------------ */

function buildPassenger(seat, index, cart) {
    const isAdult = index < cart.adults;

    return {
        id: `passenger-${index}`,
        index,
        seatId: seat.id,
        seatNumber: seat.number,
        type: isAdult ? "ADULT" : "CHILD",

        // Identité
        firstName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "",

        // Document (adultes uniquement)
        documentType: isAdult ? "ID_CARD" : "",
        documentNumber: "",

        // Contact
        email: "",
        phone: "",
    };
}

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export default function useForm({
    cart,
    seats = [],
    initialBuyer = {},
    initialPayment = {},
}) {
    /* ---------- State ---------- */

    const [passengers, setPassengers] = useState(() =>
        seats.map((seat, index) => buildPassenger(seat, index, cart))
    );

    const [buyer, setBuyer] = useState({
        firstName: initialBuyer.firstName ?? "",
        lastName: initialBuyer.lastName ?? "",
        email: initialBuyer.email ?? "",
        phone: initialBuyer.phone ?? "",
        isSelf: false,
    });

    const [payment, setPayment] = useState({
        method: initialPayment.method ?? "ORANGE_MONEY",
        phone: initialPayment.phone ?? "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    /* =========================================================
       Validation unitaire
       ========================================================= */

    const validatePassenger = (passenger) => {
        const fieldErrors = {};
        const prefix = `passengers.${passenger.index}`;

        // Prénom
        const firstNameError = validateRequired(
            passenger.firstName,
            "Le prénom"
        );
        if (firstNameError) {
            fieldErrors[`${prefix}.firstName`] = firstNameError;
        }

        // Nom
        const lastNameError = validateRequired(
            passenger.lastName,
            "Le nom"
        );
        if (lastNameError) {
            fieldErrors[`${prefix}.lastName`] = lastNameError;
        }

        // Téléphone
        const phoneError = validatePhone(passenger.phone);
        if (phoneError) {
            fieldErrors[`${prefix}.phone`] = phoneError;
        }

        // Email (optionnel)
        const emailError = validateEmail(passenger.email);
        if (emailError) {
            fieldErrors[`${prefix}.email`] = emailError;
        }

        // Adultes : document obligatoire
        if (passenger.type === "ADULT") {
            if (!passenger.documentType) {
                fieldErrors[`${prefix}.documentType`] =
                    "Le type de document est obligatoire.";
            }

            const docNumberError = validateRequired(
                passenger.documentNumber,
                "Le numéro de document"
            );
            if (docNumberError) {
                fieldErrors[`${prefix}.documentNumber`] = docNumberError;
            }
        }

        return fieldErrors;
    };

    const validateBuyer = (buyer) => {
        const fieldErrors = {};

        const firstNameError = validateRequired(
            buyer.firstName,
            "Le prénom"
        );
        if (firstNameError) fieldErrors["buyer.firstName"] = firstNameError;

        const lastNameError = validateRequired(
            buyer.lastName,
            "Le nom"
        );
        if (lastNameError) fieldErrors["buyer.lastName"] = lastNameError;

        const phoneError = validatePhone(buyer.phone);
        if (phoneError) fieldErrors["buyer.phone"] = phoneError;

        const emailError = validateEmail(buyer.email, {
            required: true,
        });
        if (emailError) fieldErrors["buyer.email"] = emailError;

        return fieldErrors;
    };

    const validatePayment = (payment) => {
        const fieldErrors = {};

        if (!payment.method) {
            fieldErrors["payment.method"] =
                "Veuillez choisir un moyen de paiement.";
        }

        const requiresPhone = [
            "ORANGE_MONEY",
            "MTN_MOMO",
            "MOOV_MONEY",
            "WAVE",
        ].includes(payment.method);

        if (requiresPhone) {
            const phoneError = validatePhone(payment.phone);
            if (phoneError) {
                fieldErrors["payment.phone"] = phoneError;
            }
        }

        return fieldErrors;
    };

    const validateAll = () => {
        const allErrors = {
            ...passengers.reduce(
                (acc, p) => ({ ...acc, ...validatePassenger(p) }),
                {}
            ),
            ...validateBuyer(buyer),
            ...validatePayment(payment),
        };

        return allErrors;
    };

    /* =========================================================
       Handlers passagers
    ========================================================= */

    const updatePassenger = (index, field, value) => {
        setPassengers((prev) =>
            prev.map((p) =>
                p.index === index ? { ...p, [field]: value } : p
            )
        );

        setServerError("");

        // Clear error au changement
        setErrors((prev) => {
            const key = `passengers.${index}.${field}`;
            if (!prev[key]) return prev;

            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const blurPassenger = (index, field) => {
        setTouched((prev) => ({
            ...prev,
            [`passengers.${index}.${field}`]: true,
        }));

        const passenger = passengers.find((p) => p.index === index);
        if (!passenger) return;

        const fieldErrors = validatePassenger(passenger);

        setErrors((prev) => {
            const key = `passengers.${index}.${field}`;
            const next = { ...prev };

            if (fieldErrors[key]) {
                next[key] = fieldErrors[key];
            } else {
                delete next[key];
            }

            return next;
        });
    };

    /* =========================================================
       Handlers buyer
    ========================================================= */

    const updateBuyer = (field, value) => {
        setBuyer((prev) => {
            // Case "Je suis l'acheteur" cochée → on copie le passager 0
            if (field === "isSelf") {
                if (value && passengers.length > 0) {
                    const p = passengers[0];
                    return {
                        ...prev,
                        isSelf: true,
                        firstName: p.firstName,
                        lastName: p.lastName,
                        email: p.email,
                        phone: p.phone,
                    };
                }
                return { ...prev, isSelf: false };
            }

            // Si l'utilisateur modifie un champ alors que isSelf est coché,
            // on décoche automatiquement
            return {
                ...prev,
                isSelf: false,
                [field]: value,
            };
        });

        setServerError("");

        setErrors((prev) => {
            const key = `buyer.${field}`;
            if (!prev[key]) return prev;

            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const blurBuyer = (field) => {
        setTouched((prev) => ({
            ...prev,
            [`buyer.${field}`]: true,
        }));

        const fieldErrors = validateBuyer(buyer);

        setErrors((prev) => {
            const key = `buyer.${field}`;
            const next = { ...prev };

            if (fieldErrors[key]) {
                next[key] = fieldErrors[key];
            } else {
                delete next[key];
            }

            return next;
        });
    };

    /* =========================================================
       Handlers payment
    ========================================================= */

    const updatePayment = (field, value) => {
        setPayment((prev) => ({ ...prev, [field]: value }));
        setServerError("");

        setErrors((prev) => {
            const key = `payment.${field}`;
            if (!prev[key]) return prev;

            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const blurPayment = (field) => {
        setTouched((prev) => ({
            ...prev,
            [`payment.${field}`]: true,
        }));

        const fieldErrors = validatePayment(payment);

        setErrors((prev) => {
            const key = `payment.${field}`;
            const next = { ...prev };

            if (fieldErrors[key]) {
                next[key] = fieldErrors[key];
            } else {
                delete next[key];
            }

            return next;
        });
    };

    /* =========================================================
       Submit
    ========================================================= */

    const handleSubmit = async (e) => {
        e?.preventDefault?.();

        setServerError("");

        const validationErrors = validateAll();

        // Marquer tout comme touché
        const allTouched = {};
        passengers.forEach((p) => {
            ["firstName", "lastName", "phone", "email", "documentType", "documentNumber"].forEach(
                (field) => {
                    allTouched[`passengers.${p.index}.${field}`] = true;
                }
            );
        });
        ["firstName", "lastName", "phone", "email"].forEach((f) => {
            allTouched[`buyer.${f}`] = true;
        });
        ["method", "phone"].forEach((f) => {
            allTouched[`payment.${f}`] = true;
        });

        setTouched(allTouched);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return { success: false, validationError: true };
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            const payload = {
                tripId: cart.tripId,
                passengers: passengers.map((p) => ({
                    seatId: p.seatId,
                    type: p.type,
                    firstName: p.firstName.trim(),
                    lastName: p.lastName.trim(),
                    gender: p.gender || null,
                    dateOfBirth: p.dateOfBirth || null,
                    documentType: p.type === "ADULT" ? p.documentType : null,
                    documentNumber:
                        p.type === "ADULT"
                            ? p.documentNumber.trim()
                            : null,
                    phone: normalizePhoneCI(p.phone),
                    email: p.email.trim() || null,
                })),
                buyer: {
                    firstName: buyer.firstName.trim(),
                    lastName: buyer.lastName.trim(),
                    phone: normalizePhoneCI(buyer.phone),
                    email: buyer.email.trim(),
                },
                payment: {
                    method: payment.method,
                    phone: payment.phone
                        ? normalizePhoneCI(payment.phone)
                        : null,
                },
            };

            const result = await service.createBooking(payload);

            if (!result.success) {
                throw new Error(
                    result.message || "Impossible de finaliser la réservation."
                );
            }

            return result;
        } catch (error) {
            setServerError(
                error.message || "Impossible de finaliser la réservation."
            );
            return { success: false, message: error.message };
        } finally {
            setIsSubmitting(false);
        }
    };

    /* =========================================================
       Reset
    ========================================================= */

    const resetForm = () => {
        setPassengers(
            seats.map((seat, index) => buildPassenger(seat, index, cart))
        );
        setBuyer({
            firstName: initialBuyer.firstName ?? "",
            lastName: initialBuyer.lastName ?? "",
            email: initialBuyer.email ?? "",
            phone: initialBuyer.phone ?? "",
            isSelf: false,
        });
        setPayment({
            method: "ORANGE_MONEY",
            phone: "",
        });
        setErrors({});
        setTouched({});
        setServerError("");
    };

    /* =========================================================
       Dérivés
    ========================================================= */

    const isValid = useMemo(
        () => Object.keys(validateAll()).length === 0,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [passengers, buyer, payment]
    );

    /* =========================================================
       Return
    ========================================================= */

    return {
        // Données
        passengers,
        buyer,
        payment,

        // Erreurs
        errors,
        touched,
        serverError,

        // États
        isSubmitting,
        isValid,

        // Actions
        updatePassenger,
        blurPassenger,
        updateBuyer,
        blurBuyer,
        updatePayment,
        blurPayment,
        handleSubmit,
        resetForm,
    };
}