import {
    Smartphone,
} from "lucide-react";

import Input from "../ui/Input";
import { PAYMENT_METHODS } from "../../utils/cart.utils";

import "../../styles/components/cart/PaymentMethodsSection.scss";

/* ------------------------------------------------------------------ */

const ICONS = {
    orange: require('../../imgs/payment-providers/om.png'),
    mtn: require('../../imgs/payment-providers/momo.png'),
    moov: require('../../imgs/payment-providers/moov-money.png'),
    wave: require('../../imgs/payment-providers/wave.png'),
    card: require('../../imgs/payment-providers/bank-transfer.png'),
};

/* ------------------------------------------------------------------ */

export default function PaymentMethodsSection({
    payment,
    errors,
    onUpdate,
    totalPrice,
}) {
    const selectedMethod = PAYMENT_METHODS.find(
        (m) => m.value === payment.method
    );

    const handleChange = (method, value) => {
        onUpdate(method, value)
    }

    const needsPhone = selectedMethod?.requiresPhone;

    return (
        <div className="payment-methods">
            {/* Grille de choix */}
            <div
                className="payment-methods__grid"
                role="radiogroup"
                aria-label="Moyen de paiement"
            >
                {PAYMENT_METHODS.map((method) => {
                    const image = ICONS[method.icon] ?? Smartphone;
                    const selected = payment.method === method.value;

                    return (
                        <button
                            key={method.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            className={`payment-methods__option ${selected
                                ? "payment-methods__option--selected"
                                : ""
                                }`}
                            onClick={() =>
                                handleChange("method", method.value)
                            }
                        >
                            <img
                                className="payment-methods__icon"
                                src={image}
                                alt={method.label}
                            />

                            <span className="payment-methods__label">
                                {method.label}
                            </span>

                            {selected && (
                                <span
                                    className="payment-methods__checkmark"
                                    aria-hidden="true"
                                >
                                    ✓
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Champ conditionnel : numéro de paiement */}
            {needsPhone && (
                <div className="payment-methods__field">
                    <Input
                        label={`Numéro ${selectedMethod.label}`}
                        type="tel"
                        name="payment-phone"
                        value={payment.phone}
                        onChange={(e) =>
                            handleChange("phone", e.target.value)
                        }
                        error={errors["payment-phone"]}
                        placeholder="+225 07 07 00 00 00"
                        required
                    />

                    <p className="payment-methods__hint">
                        Vous recevrez une demande de paiement sur ce
                        numéro.
                    </p>
                </div>
            )}

            {/* Info pour les autres méthodes */}
            {selectedMethod?.value === "CARD" && (
                <p className="payment-methods__hint">
                    Vous serez redirigé vers notre plateforme de
                    paiement sécurisé.
                </p>
            )}

            {selectedMethod?.value === "CASH" && (
                <p className="payment-methods__hint">
                    Le paiement en espèces se fera à l'agence de
                    départ. Votre réservation sera maintenue pendant
                    2 heures.
                </p>
            )}
        </div>
    );
}