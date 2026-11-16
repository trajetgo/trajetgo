import { Check } from "lucide-react";

import "../../styles/components/ticket/SellTicketStepper.scss";

export default function SellTicketStepper({
    steps,
    currentStep,
    onStepClick,
}) {
    return (
        <nav
            className="bus-stepper"
            aria-label="Étapes du formulaire"
        >
            <ol className="bus-stepper__list">
                {steps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    const isClickable = index <= currentStep;

                    return (
                        <li
                            key={step.key}
                            className={`bus-stepper__item ${isActive ? "bus-stepper__item--active" : ""
                                } ${isCompleted
                                    ? "bus-stepper__item--completed"
                                    : ""
                                }`}
                        >
                            <button
                                type="button"
                                className="bus-stepper__button"
                                onClick={() =>
                                    isClickable && onStepClick(index)
                                }
                                disabled={!isClickable}
                                aria-current={isActive ? "step" : undefined}
                            >
                                <span className="bus-stepper__circle">
                                    {isCompleted ? (
                                        <Check size={16} />
                                    ) : (
                                        index + 1
                                    )}
                                </span>

                                <span className="bus-stepper__label">
                                    <strong>{step.title}</strong>
                                    <span>{step.description}</span>
                                </span>
                            </button>

                            {index < steps.length - 1 && (
                                <span
                                    className={`bus-stepper__line ${isCompleted
                                        ? "bus-stepper__line--completed"
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