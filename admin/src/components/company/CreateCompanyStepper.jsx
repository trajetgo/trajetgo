import { Check } from "lucide-react";

import "../../styles/components/company/CreateCompanyStepper.scss";

export default function CreateCompanyStepper({
    steps,
    currentStep,
    onStepClick,
}) {
    return (
        <nav
            className="company-stepper"
            aria-label="Étapes du formulaire"
        >
            <ol className="company-stepper__list">
                {steps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    const isClickable = index <= currentStep;

                    return (
                        <li
                            key={step.key}
                            className={`company-stepper__item ${isActive ? "company-stepper__item--active" : ""
                                } ${isCompleted
                                    ? "company-stepper__item--completed"
                                    : ""
                                }`}
                        >
                            <button
                                type="button"
                                className="company-stepper__button"
                                onClick={() =>
                                    isClickable && onStepClick(index)
                                }
                                disabled={!isClickable}
                                aria-current={isActive ? "step" : undefined}
                            >
                                <span className="company-stepper__circle">
                                    {isCompleted ? (
                                        <Check size={16} />
                                    ) : (
                                        index + 1
                                    )}
                                </span>

                                <span className="company-stepper__label">
                                    <strong>{step.title}</strong>
                                    <span>{step.description}</span>
                                </span>
                            </button>

                            {index < steps.length - 1 && (
                                <span
                                    className={`company-stepper__line ${isCompleted
                                            ? "company-stepper__line--completed"
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