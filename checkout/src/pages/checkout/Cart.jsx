import { useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    AlertTriangle,
    ArrowLeft,
    Users,
    CreditCard,
    ShieldCheck,
} from "lucide-react";

import useTrip from "../../hooks/useTrip";
import useForm from "../../hooks/useForm";
import { useAuth } from "../../contexts/auth.context";
import Loading from "../../components/Loading";

import TripSummary from "../../components/cart/TripSummary";
import PassengerForm from "../../components/cart/PassengerForm";
import BuyerForm from "../../components/cart/BuyerForm";
import PaymentMethodsSection from "../../components/cart/PaymentMethodsSection";

import { parseCartParams } from "../../utils/cart.utils";
import { PASSENGER_URL } from "../../services/api";

import "../../styles/pages/checkout/Cart.scss";

/* ------------------------------------------------------------------ */

export default function Cart() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    /* ---------- Params ---------- */

    const cart = useMemo(
        () => parseCartParams(searchParams),
        [searchParams]
    );

    /* ---------- Trip ---------- */

    const { loading, trip, serverError, refresh } = useTrip(cart.tripId);

    /* ---------- Form (toujours appelé, même si cart invalide) ---------- */

    const {
        passengers,
        buyer,
        payment,
        errors,
        isSubmitting,
        isValid,
        updatePassenger,
        blurPassenger,
        updateBuyer,
        blurBuyer,
        updatePayment,
        blurPayment,
        handleSubmit,
    } = useForm({
        cart,
        seats: cart.seatIds.map((id, i) => ({
            id,
            number: cart.seatNumbers[i],
        })),
        initialBuyer: {
            firstName: user?.firstName,
            lastName: user?.lastName,
            phone: user?.phone,
            email: user?.email,
        },
    });

    /* ---------- Submit ---------- */

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const result = await handleSubmit(e);

        if (result?.success) {
            navigate(`/payment/processing?bookingId=${result.data.id}`);
        }
    };

    /* =========================================================
       États d'erreur (AVANT le rendu principal)
    ========================================================= */

    if (!cart.isValid) {
        return (
            <div className="cart cart--error">
                <div className="cart__error">
                    <AlertTriangle size={48} aria-hidden="true" />
                    <h1>Réservation invalide</h1>
                    <p>
                        Les informations de votre réservation sont
                        incomplètes ou corrompues.
                    </p>
                    <a href={PASSENGER_URL} className="cart__error-link">
                        <ArrowLeft size={16} />
                        Retour à la recherche
                    </a>
                </div>
            </div>
        );
    }

    if (loading) {
        return <Loading message="Chargement de votre réservation..." />;
    }

    if (serverError || !trip) {
        return (
            <div className="cart cart--error">
                <div className="cart__error">
                    <AlertTriangle size={48} aria-hidden="true" />
                    <h1>Trajet introuvable</h1>
                    <p>{serverError ?? "Ce trajet n'est plus disponible."}</p>
                    <button type="button" onClick={refresh}>
                        Réessayer
                    </button>
                    <a href={PASSENGER_URL} className="cart__error-link">
                        <ArrowLeft size={16} />
                        Choisir un autre trajet
                    </a>
                </div>
            </div>
        );
    }

    /* ---------- Prix ---------- */

    const computedPrice = (trip.price ?? 0) * cart.totalPassengers;

    const hasPriceMismatch =
        cart.totalPrice > 0 &&
        Math.abs(cart.totalPrice - computedPrice) > 0.01;

    /* ---------- Back URL ---------- */

    const backUrl = `${PASSENGER_URL}/seats?tripId=${cart.tripId}&from=${cart.from ?? ""
        }&to=${cart.to ?? ""}&date=${cart.date ?? ""}&adults=${cart.adults
        }&children=${cart.children.join(",")}`;

    /* =========================================================
       Rendu principal
    ========================================================= */

    return (
        <form
            className="cart"
            onSubmit={handleFormSubmit}
            noValidate
        >
            {/* ============================================
                HEADER + RÉSUMÉ TRIP DÉPLIABLE
            ============================================ */}

            <header className="cart__header">
                <div className="cart__header-top">
                    <a href={backUrl} className="cart__back">
                        <ArrowLeft size={18} />
                        Modifier ma sélection
                    </a>

                    <h1>Finalisez votre réservation</h1>
                </div>
            </header>

            {/* Trip résumé dépliable */}
            <TripSummary
                trip={trip}
                cart={cart}
            />

            <div className="cart__content">
                {/* ============================================
                    SECTION 2 : PASSAGERS (N passagers)
                ============================================ */}

                <section className="cart__section">
                    <h2 className="cart__section-title">
                        <Users size={18} aria-hidden="true" />
                        Informations des passagers
                    </h2>

                    <p className="cart__section-hint">
                        Renseignez les coordonnées de chaque voyageur.
                    </p>

                    <div className="cart__passengers-list">
                        {passengers.map((passenger) => (
                            <PassengerForm
                                key={passenger.id}
                                passenger={passenger}
                                errors={errors}
                                onUpdate={updatePassenger}
                                onBlur={blurPassenger}
                            />
                        ))}
                    </div>
                </section>

                {/* ============================================
                    SECTION 3 : ACHETEUR
                ============================================ */}

                <section className="cart__section">
                    <h2 className="cart__section-title">
                        <ShieldCheck size={18} aria-hidden="true" />
                        Vos coordonnées
                    </h2>

                    <p className="cart__section-hint">
                        Pour vous envoyer la confirmation et le billet.
                    </p>

                    <BuyerForm
                        buyer={buyer}
                        errors={errors}
                        onUpdate={updateBuyer}
                        onBlur={blurBuyer}
                        isAuthenticated={isAuthenticated}
                    />
                </section>

                {/* ============================================
                    SECTION 4 : PAIEMENT
                ============================================ */}

                <section className="cart__section">
                    <h2 className="cart__section-title">
                        <CreditCard size={18} aria-hidden="true" />
                        Moyen de paiement
                    </h2>

                    <PaymentMethodsSection
                        payment={payment}
                        errors={errors}
                        onUpdate={updatePayment}
                        onBlur={blurPayment}
                        totalPrice={computedPrice}
                    />
                </section>

                {/* Erreur serveur globale */}
                {errors["global"] && (
                    <div className="cart__server-error" role="alert">
                        ⚠️ {errors["global"]}
                    </div>
                )}
            </div>

            {/* ============================================
                FOOTER : TOTAL + ACTION
            ============================================ */}

            <footer className="cart__actions">
                <div className="cart__actions-summary">
                    <span>Total à payer</span>
                    <strong>
                        {new Intl.NumberFormat("fr-FR").format(
                            computedPrice
                        )}{" "}
                        FCFA
                    </strong>
                </div>

                <button
                    type="submit"
                    className="cart__actions-continue"
                    disabled={isSubmitting || !isValid}
                    title={
                        !isValid
                            ? "Veuillez remplir tous les champs requis."
                            : undefined
                    }
                >
                    {isSubmitting ? "Traitement..." : "Payer maintenant"}
                </button>
            </footer>
        </form>
    );
}