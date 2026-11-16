import { useEffect, useState } from "react";
import { ArrowUp, ShieldCheck } from "lucide-react";

import { PRIVACY_SECTIONS } from "../utils/nav.utils";

import "../styles/pages/Policy.scss";

const RESUME = PRIVACY_SECTIONS.map(({ id, title }) => ({
    id,
    title,
}));

export default function Privacy() {

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
                <div className="policy-page__icon">
                    <ShieldCheck size={25} />
                </div>

                <span className="policy-page__eyebrow">
                    Centre de confiance Trajet Go
                </span>

                <h1>Politique de confidentialité</h1>

                <p>
                    Découvrez comment Trajet Go collecte, utilise et protège
                    vos données personnelles.
                </p>

                <span className="policy-page__updated">
                    Dernière mise à jour : 7 novembre 2026
                </span>
            </header>

            <div className="policy-page__layout">
                <aside className="policy-toc">
                    <div className="policy-toc__heading">
                        <strong>Sommaire</strong>
                        <span>{RESUME.length} sections</span>
                    </div>

                    <nav aria-label="Sommaire de la politique de confidentialité">
                        {RESUME.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={() => setActiveSection(item.id)}
                                className={`policy-toc__link ${activeSection === item.id
                                        ? "policy-toc__link--active"
                                        : ""
                                    }`}
                                aria-current={
                                    activeSection === item.id ? "location" : undefined
                                }
                            >
                                {item.title}
                            </a>
                        ))}
                    </nav>
                </aside>

                <article className="policy-content">
                    {PRIVACY_SECTIONS.map((section) => (
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
                        <span>Fin de la politique de confidentialité.</span>
                        <a href="#top" aria-label="Retour en haut de page">
                            <ArrowUp size={17} />
                            Retour en haut
                        </a>
                    </div>
                </article>
            </div>
        </main>
    );
}