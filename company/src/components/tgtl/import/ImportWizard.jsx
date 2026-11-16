// Coque du wizard : stepper + contenu de l'étape + pied de page.
// Elle ne connaît ni l'API ni les données : TgtlImport lui passe l'étape
// courante (issue de l'URL), le contenu et les boutons.
export default function ImportWizard({
    steps,
    currentStep,
    finished = false,
    children,
    footer
}) {
    return (
        <section className="tgtl-import__wizard">

            <div className="tgtl-import__steps">
                {steps.map((label, index) => {
                    const completed =
                        index < currentStep ||
                        (finished && index === currentStep);

                    return (
                        <div
                            key={label}
                            className={[
                                "tgtl-import__step",
                                index === currentStep ? "is-active" : "",
                                completed ? "is-completed" : ""
                            ].filter(Boolean).join(" ")}
                            aria-current={index === currentStep ? "step" : undefined}
                        >
                            <div className="tgtl-import__step-number">
                                {index + 1}
                            </div>

                            <span>{label}</span>
                        </div>
                    );
                })}
            </div>

            {children}

            <div className="tgtl-import__footer">
                {footer}
            </div>

        </section>
    );
}