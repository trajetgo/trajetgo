import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";

import "../../styles/components/cart/BuyerForm.scss";

export default function BuyerForm({
    buyer,
    errors,
    onUpdate,
    onBlur,
    isAuthenticated,
}) {
    return (
        <div className="buyer-form">
            {isAuthenticated && (
                <Checkbox
                    onChange={(e) => onUpdate("isSelf", e.target.checked)}
                    label="Je suis le passager principal"
                    name="buyer.isSelf"
                    checked={buyer.isSelf}
                />
            )}

            <div className="buyer-form__grid">
                <Input
                    label="Prénom"
                    name="buyer.firstName"
                    value={buyer.firstName}
                    onChange={(e) =>
                        onUpdate("firstName", e.target.value)
                    }
                    onBlur={() => onBlur("firstName")}
                    error={errors["buyer.firstName"]}
                    required
                />

                <Input
                    label="Nom"
                    name="buyer.lastName"
                    value={buyer.lastName}
                    onChange={(e) =>
                        onUpdate("lastName", e.target.value)
                    }
                    onBlur={() => onBlur("lastName")}
                    error={errors["buyer.lastName"]}
                    required
                />

                <Input
                    label="Téléphone"
                    type="tel"
                    name="buyer.phone"
                    value={buyer.phone}
                    onChange={(e) =>
                        onUpdate("phone", e.target.value)
                    }
                    onBlur={() => onBlur("phone")}
                    error={errors["buyer.phone"]}
                    placeholder="+225 07 07 00 00 00"
                    required
                />

                <Input
                    label="Email"
                    type="email"
                    name="buyer.email"
                    value={buyer.email}
                    onChange={(e) =>
                        onUpdate("email", e.target.value)
                    }
                    onBlur={() => onBlur("email")}
                    error={errors["buyer.email"]}
                    placeholder="vous@exemple.com"
                    required
                />
            </div>
        </div>
    );
}