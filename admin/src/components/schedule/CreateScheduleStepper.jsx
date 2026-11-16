import { Check } from "lucide-react";

import "../../styles/components/schedule/CreateScheduleStepper.scss";

export default function CreateScheduleStepper({
    steps,
    currentStep,
    onStepClick,
}) {
    return (
        <nav className="schedule-stepper" aria-label="Étapes">
            <ol className="schedule-stepper__list">
                {steps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    const isClickable = index <= currentStep;

                    return (
                        <li
                            key={step.key}
                            className={`schedule-stepper__item ${
                                isActive ? "schedule-stepper__item--active" : ""
                            } ${
                                isCompleted
                                    ? "schedule-stepper__item--completed"
                                    : ""
                            }`}
                        >
                            <button
                                type="button"
                                className="schedule-stepper__button"
                                onClick={() =>
                                    isClickable && onStepClick(index)
                                }
                                disabled={!isClickable}
                            >
                                <span className="schedule-stepper__circle">
                                    {isCompleted ? (
                                        <Check size={16} />
                                    ) : (
                                        index + 1
                                    )}
                                </span>

                                <span className="schedule-stepper__label">
                                    <strong>{step.title}</strong>
                                </span>
                            </button>

                            {index < steps.length - 1 && (
                                <span
                                    className={`schedule-stepper__line ${
                                        isCompleted
                                            ? "schedule-stepper__line--completed"
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