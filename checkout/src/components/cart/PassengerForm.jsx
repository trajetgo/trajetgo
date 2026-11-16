import { User, Baby, IdCard } from "lucide-react";

import { 
    DOCUMENT_OPTIONS, 
    GENDER_OPTIONS 
} from "../../utils/cart.utils";

import Input from "../ui/Input";
import Select from "../ui/Select";

import "../../styles/components/cart/PassengerForm.scss";

export default function PassengerForm({
    passenger,
    errors,
    onUpdate,
    onBlur,
}) {
    const { index, type } = passenger;
    const isChild = type === "CHILD";
    const Icon = isChild ? Baby : User;

    const prefix = `passengers.${index}`;

    const label = isChild
        ? `Enfant ${index + 1}${passenger.age ? ` · ${passenger.age} ans` : ""}`
        : `Passager ${index + 1}`;

    return (
        <article className="passenger-form">
            <header className="passenger-form__header">
                <div
                    className={`passenger-form__icon ${isChild ? "passenger-form__icon--child" : ""
                        }`}
                >
                    <Icon size={22} aria-hidden="true" />
                </div>

                <div>
                    <h3>{label}</h3>
                    <p>Siège {passenger.seatNumber}</p>
                </div>
            </header>

            <div className="passenger-form__grid">
                {/* Prénom */}
                <Input
                    label="Prénom"
                    name={`${prefix}.firstName`}
                    value={passenger.firstName}
                    onChange={(e) =>
                        onUpdate(index, "firstName", e.target.value)
                    }
                    onBlur={() => onBlur(index, "firstName")}
                    error={errors[`${prefix}.firstName`]}
                    placeholder="Jean"
                    autoComplete="given-name"
                    required
                />

                {/* Nom */}
                <Input
                    label="Nom"
                    name={`${prefix}.lastName`}
                    value={passenger.lastName}
                    onChange={(e) =>
                        onUpdate(index, "lastName", e.target.value)
                    }
                    onBlur={() => onBlur(index, "lastName")}
                    error={errors[`${prefix}.lastName`]}
                    placeholder="Kouassi"
                    autoComplete="family-name"
                    required
                />

                {/* Genre */}
                <Select
                    label="Genre"
                    name={`${prefix}.gender`}
                    value={passenger.gender}
                    onChange={(e) =>
                        onUpdate(index, "gender", e.target.value)
                    }
                    onBlur={() => onBlur(index, "gender")}
                    error={errors[`${prefix}.gender`]}
                    options={GENDER_OPTIONS}
                />

                {/* Date de naissance (optionnel) */}
                <Input
                    label="Date de naissance"
                    type="date"
                    name={`${prefix}.dateOfBirth`}
                    value={passenger.dateOfBirth}
                    onChange={(e) =>
                        onUpdate(index, "dateOfBirth", e.target.value)
                    }
                    onBlur={() => onBlur(index, "dateOfBirth")}
                    error={errors[`${prefix}.dateOfBirth`]}
                    max={new Date().toISOString().split("T")[0]}
                />

                {/* Téléphone */}
                <Input
                    label="Téléphone"
                    type="tel"
                    name={`${prefix}.phone`}
                    value={passenger.phone}
                    onChange={(e) =>
                        onUpdate(index, "phone", e.target.value)
                    }
                    onBlur={() => onBlur(index, "phone")}
                    error={errors[`${prefix}.phone`]}
                    placeholder="+225 07 07 00 00 00"
                    autoComplete="tel"
                    required
                />

                {/* Email */}
                <Input
                    label="Email (optionnel)"
                    type="email"
                    name={`${prefix}.email`}
                    value={passenger.email}
                    onChange={(e) =>
                        onUpdate(index, "email", e.target.value)
                    }
                    onBlur={() => onBlur(index, "email")}
                    error={errors[`${prefix}.email`]}
                    placeholder="jean@exemple.com"
                    autoComplete="email"
                />
            </div>

            {/* ---------- Document (adultes seulement) ---------- */}

            {!isChild && (
                <div className="passenger-form__documents">
                    <h4 className="passenger-form__section-title">
                        <IdCard size={14} aria-hidden="true" />
                        Pièce d'identité
                    </h4>

                    <div className="passenger-form__grid">
                        <Select
                            label="Type de document"
                            name={`${prefix}.documentType`}
                            value={passenger.documentType}
                            onChange={(e) =>
                                onUpdate(
                                    index,
                                    "documentType",
                                    e.target.value
                                )
                            }
                            onBlur={() => onBlur(index, "documentType")}
                            error={errors[`${prefix}.documentType`]}
                            options={DOCUMENT_OPTIONS}
                            required
                        />

                        <Input
                            label="Numéro de document"
                            name={`${prefix}.documentNumber`}
                            value={passenger.documentNumber}
                            onChange={(e) =>
                                onUpdate(
                                    index,
                                    "documentNumber",
                                    e.target.value
                                )
                            }
                            onBlur={() =>
                                onBlur(index, "documentNumber")
                            }
                            error={errors[`${prefix}.documentNumber`]}
                            placeholder="AB1234567"
                            required
                        />
                    </div>
                </div>
            )}

            {!isChild && index === 0 && (
                <p className="passenger-form__hint">
                    💡 C'est le passager principal. Il recevra la
                    confirmation.
                </p>
            )}
        </article>
    );
}