
import { useEffect, useState } from "react";

import { COOKIES_SECTIONS } from "../utils/nav.utils";

import "../styles/pages/Policy.scss";



const RESUME = COOKIES_SECTIONS.map(({ id, title }) => ({ id, title }));

export default function Cookies() {
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
                threshold: 0,
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

                <h1>Politique relative aux cookies</h1>

                <p>
                    Comprenez comment les cookies et technologies
                    similaires peuvent être utilisés sur les
                    plateformes Trajet Go et comment gérer
                    vos préférences.
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

                    <nav aria-label="Sommaire de la politique relative aux cookies">
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
                    {COOKIES_SECTIONS.map((section) => (
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
                            Fin de la Politique relative aux cookies.
                        </span>

                        <a href="#top">Retour en haut</a>
                    </div>
                </article>
            </div>
        </main>
    );
}
