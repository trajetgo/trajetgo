import { useEffect, useState } from "react";
import { Baby, Minus, Plus, Trash2, Users } from "lucide-react";
import '../styles/components/PassengerSelector.scss';

const MAX_ADULTS = 10;
const MAX_CHILDREN = 5;
const MIN_CHILD_AGE = 0;
const MAX_CHILD_AGE = 11; // 12 ans = adulte

export default function PassengerSelector({
    value = { adults: 1, children: [] },
    onSelect
}) {
    const [adults, setAdults] = useState(value.adults);
    const [children, setChildren] = useState(value.children);

    // 🔄 resync si la prop change (réouverture du modal)
    useEffect(() => {
        setAdults(value.adults);
        setChildren(value.children ?? []);
    }, [value]);

    /* ---------- Adultes ---------- */

    const decreaseAdults = () =>
        setAdults((n) => Math.max(1, n - 1));

    const increaseAdults = () =>
        setAdults((n) => Math.min(MAX_ADULTS, n + 1));

    /* ---------- Enfants ---------- */

    const addChild = () => {
        if (children.length >= MAX_CHILDREN) return;
        setChildren((prev) => [
            ...prev,
            { id: crypto.randomUUID(), age: 5 },
        ]);
    };

    const removeChild = (id) =>
        setChildren((prev) => prev.filter((c) => c.id !== id));

    const updateChildAge = (id, age) =>
        setChildren((prev) =>
            prev.map((c) => (c.id === id ? { ...c, age } : c))
        );

    /* ---------- Submit ---------- */

    const handleSubmit = () => {
        onSelect({ adults, children });
    };

    return (
        <div className="passenger-selector">
            <header className="passenger-selector__header">
                <div className="passenger-selector__icon" aria-hidden="true">
                    <Users size={24} />
                </div>
                <div>
                    <h2 className="passenger-selector__title">
                        Combien de voyageurs ?
                    </h2>
                    <p className="passenger-selector__subtitle">
                        Sélectionnez le nombre de personnes.
                    </p>
                </div>
            </header>

            {/* ---------- Adultes ---------- */}

            <section className="passenger-selector__group">
                <div className="passenger-selector__group-info">
                    <h3 className="passenger-selector__group-title">
                        Adultes
                    </h3>
                    <span className="passenger-selector__group-hint">
                        À partir de 12 ans
                    </span>
                </div>

                <div className="passenger-selector__counter">
                    <button
                        type="button"
                        className="passenger-selector__counter-btn"
                        onClick={decreaseAdults}
                        disabled={adults <= 1}
                        aria-label="Retirer un adulte"
                    >
                        <Minus size={18} />
                    </button>

                    <span
                        className="passenger-selector__counter-value"
                        aria-live="polite"
                    >
                        {adults}
                    </span>

                    <button
                        type="button"
                        className="passenger-selector__counter-btn"
                        onClick={increaseAdults}
                        disabled={adults >= MAX_ADULTS}
                        aria-label="Ajouter un adulte"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </section>

            {/* ---------- Enfants ---------- */}

            <section className="passenger-selector__group passenger-selector__group--children">
                <div className="passenger-selector__group-info">
                    <h3 className="passenger-selector__group-title">
                        Enfants
                    </h3>
                    <span className="passenger-selector__group-hint">
                        Moins de 12 ans
                    </span>
                </div>

                {children.length === 0 && (
                    <p className="passenger-selector__empty">
                        Aucun enfant ajouté.
                    </p>
                )}

                <ul className="passenger-selector__children">
                    {children.map((child, index) => (
                        <li
                            key={child.id}
                            className="passenger-selector__child"
                        >
                            <label
                                htmlFor={`child-age-${child.id}`}
                                className="passenger-selector__child-label"
                            >
                                Enfant {index + 1}
                            </label>

                            <select
                                id={`child-age-${child.id}`}
                                className="passenger-selector__child-age"
                                value={child.age}
                                onChange={(e) =>
                                    updateChildAge(
                                        child.id,
                                        Number(e.target.value)
                                    )
                                }
                            >
                                {Array.from(
                                    { length: MAX_CHILD_AGE - MIN_CHILD_AGE + 1 },
                                    (_, i) => MIN_CHILD_AGE + i
                                ).map((age) => (
                                    <option key={age} value={age}>
                                        {age} an{age > 1 ? "s" : ""}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                className="passenger-selector__child-remove"
                                onClick={() => removeChild(child.id)}
                                aria-label={`Supprimer l'enfant ${index + 1}`}
                            >
                                <Trash2 size={16} />
                            </button>
                        </li>
                    ))}
                </ul>

                <button
                    type="button"
                    className="passenger-selector__add-child"
                    onClick={addChild}
                    disabled={children.length >= MAX_CHILDREN}
                >
                    <Baby size={18} />
                    <span>
                        Ajouter un enfant
                        {children.length > 0 &&
                            ` (${children.length}/${MAX_CHILDREN})`}
                    </span>
                </button>
            </section>

            {/* ---------- Submit ---------- */}

            <button
                type="button"
                className="passenger-selector__submit"
                onClick={handleSubmit}
            >
                Continuer
            </button>
        </div>
    );
}