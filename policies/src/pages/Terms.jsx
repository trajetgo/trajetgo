
import { useEffect, useState } from "react";

import { TERMS_SECTIONS } from "../utils/nav.utils";

import "../styles/pages/Policy.scss";



const RESUME = TERMS_SECTIONS.map(({ id, title }) => ({ id, title }));

export default function Terms() {
    const [activeSection, setActiveSection] = useState("intro");

    useEffect(() => {
        const sections = document.querySelectorAll(
            ".policy-content__section"
        );

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleSections = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top -
                            b.boundingClientRect.top
                    );

                if (visibleSections.length > 0) {
                    setActiveSection(visibleSections[0].target.id);
                }
            },
            {
                root: null,
                rootMargin: "-15% 0px -70% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    return (
        <main className="policy-page" id="top">
            <header className="policy-page__header">
                <span className="policy-page__eyebrow">
                    CENTRE DE CONFIANCE
                </span>

                <h1>Conditions d'utilisation</h1>

                <p>
                    Découvrez les règles qui encadrent l'accès et
                    l'utilisation des services Trajet Go.
                </p>

                <span className="policy-page__updated">
                    Dernière mise à jour : à compléter
                </span>
            </header>

            <div className="policy-page__layout">
                <aside className="policy-toc">
                    <div className="policy-toc__heading">
                        <strong>Sommaire</strong>
                        <span>{RESUME.length} sections</span>
                    </div>

                    <nav aria-label="Sommaire des conditions d'utilisation">
                        {RESUME.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={() => setActiveSection(item.id)}
                                className={`policy-toc__link ${
                                    activeSection === item.id
                                        ? "policy-toc__link--active"
                                        : ""
                                }`}
                                aria-current={
                                    activeSection === item.id
                                        ? "location"
                                        : undefined
                                }
                            >
                                {item.title}
                            </a>
                        ))}
                    </nav>
                </aside>

                <article className="policy-content">
                    {TERMS_SECTIONS.map((section) => (
                        <section
                            key={section.id}
                            id={section.id}
                            className="policy-content__section"
                        >
                            <h2>{section.title}</h2>

                            <div className="policy-content__body">
                                {section.content}
                            </div>
                        </section>
                    ))}

                    <div className="policy-content__footer">
                        <span>
                            Fin des Conditions d'utilisation.
                        </span>

                        <a href="#top">Retour en haut</a>
                    </div>
                </article>
            </div>
        </main>
    );
}
