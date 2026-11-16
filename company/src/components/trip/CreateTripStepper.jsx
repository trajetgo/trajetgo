import { Check } from "lucide-react";

import "../../styles/components/trip/CreateTripStepper.scss";

export default function CreateTripStepper({
    steps,
    currentStep,
    onStepClick,
}) {
    return (
        <nav className="trip-stepper" aria-label="Étapes du formulaire">
            <ol className="trip-stepper__list">
                {steps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    const isClickable = index <= currentStep;

                    return (
                        <li
                            key={step.key}
                            className={`trip-stepper__item ${isActive ? "trip-stepper__item--active" : ""
                                } ${isCompleted
                                    ? "trip-stepper__item--completed"
                                    : ""
                                }`}
                        >
                            <button
                                type="button"
                                className="trip-stepper__button"
                                onClick={() =>
                                    isClickable && onStepClick(index)
                                }
                                disabled={!isClickable}
                                aria-current={isActive ? "step" : undefined}
                            >
                                <span className="trip-stepper__circle">
                                    {isCompleted ? (
                                        <Check size={16} />
                                    ) : (
                                        index + 1
                                    )}
                                </span>

                                <span className="trip-stepper__label">
                                    <strong>{step.title}</strong>
                                    <span>{step.description}</span>
                                </span>
                            </button>

                            {index < steps.length - 1 && (
                                <span
                                    className={`trip-stepper__line ${isCompleted
                                            ? "trip-stepper__line--completed"
                                            : ""
                                        }`}
                                    aria-hidden="true"
                                />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}