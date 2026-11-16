import SearchForm from "./SearchForm";

import "../../styles/components/home/Hero.scss";

export default function Hero() {
   

    return (
        <section className="home-hero">
            <div className="home-hero__content">
                <span className="home-hero__eyebrow">
                    Votre trajet, simplement.
                </span>

                <h1 className="home-hero__title">
                    Voyagez plus simplement
                    <br />
                    <span>à travers la Côte d'Ivoire.</span>
                </h1>

                <p className="home-hero__description">
                    Recherchez votre trajet, choisissez votre départ
                    et réservez votre place en quelques clics.
                </p>
            </div>

            {/* Recherche */}
           <SearchForm />
        </section>
    );
}