import {
    ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import { POLICY_ITEMS } from "../utils/nav.utils";

import "../styles/pages/Home.scss";

export default function Home() {
    return (
        <main className="policies-home">
            <section className="policies-home__hero">
                <span className="policies-home__eyebrow">
                    Centre de confiance Trajet Go
                </span>

                <h1>
                    La transparence au cœur de
                    <span> nos engagements.</span>
                </h1>

                <p>
                    Retrouvez ici les informations relatives à l'utilisation
                    de nos services, à la protection de vos données et à vos
                    droits en tant qu'utilisateur de Trajet Go.
                </p>
            </section>

            <section className="policies-home__documents">
                <div className="policies-home__section-heading">
                    <div>
                        <h2>Documents et politiques</h2>
                        <p>
                            Tout ce que vous devez savoir sur nos engagements.
                        </p>
                    </div>
                </div>

                <div className="policies-home__grid">
                    {POLICY_ITEMS.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                to={item.path}
                                key={item.id}
                                className="policy-card"
                            >
                                <div className="policy-card__icon">
                                    <Icon size={22} />
                                </div>

                                <div className="policy-card__content">
                                    <h3>{item.label}</h3>
                                    <p>{item.description}</p>
                                </div>

                                <ArrowUpRight
                                    className="policy-card__arrow"
                                    size={19}
                                />
                            </Link>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}