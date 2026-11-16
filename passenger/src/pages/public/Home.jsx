import Hero from "../../components/home/Hero";

import "../../styles/pages/public/Home.scss";

export default function Home() {
    return (
        <main className="home">

            {/* Hero */}
           <Hero />

            {/* Services */}
            <section className="home-services">

                <div className="home-services__header">
                    <span>TRAJET GO</span>

                    <h2>
                        Tout commence par un trajet.
                    </h2>

                    <p>
                        Trouvez votre itinéraire et profitez d'une
                        expérience de voyage simple et fluide.
                    </p>
                </div>

            </section>

        </main>
    );
}