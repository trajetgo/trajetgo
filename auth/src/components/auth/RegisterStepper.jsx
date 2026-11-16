import { Check } from "lucide-react";

import "../../styles/components/auth/RegisterStepper.scss";

export default function RegisterStepper({
    steps,
    currentStep,
    onStepClick,
}) {
     return (
        <nav
            className="register-stepper"
            aria-label="Étapes du formulaire"
        >
            <ol className="register-stepper__list">
                {steps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    const isClickable = index <= currentStep;

                    return (
                        <li
                            key={step.key}
                            className={`register-stepper__item ${isActive ? "register-stepper__item--active" : ""
                                } ${isCompleted
                                    ? "register-stepper__item--completed"
                                    : ""
                                }`}
                        >
                            <button
                                type="button"
                                className="register-stepper__button"
                                onClick={() =>
                                    isClickable && onStepClick(index)
                                }
                                disabled={!isClickable}
                                aria-current={isActive ? "step" : undefined}
                            >
                                <span className="register-stepper__circle">
                                    {isCompleted ? (
                                        <Check size={16} />
                                    ) : (
                                        index + 1
                                    )}
                                </span>

                                <span className="register-stepper__label">
                                    <strong>{step.title}</strong>
                                    <span>{step.description}</span>
                                </span>
                            </button>

                            {index < steps.length - 1 && (
                                <span
                                    className={`register-stepper__line ${isCompleted
                                            ? "register-stepper__line--completed"
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
