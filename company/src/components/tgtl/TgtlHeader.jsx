
import { Network } from "lucide-react";

export default function TgtlHeader() {
    return (
        <section className="tgtl-header">
            <div className="tgtl-header__top">

                <div className="tgtl-header__identity">
                    <div className="tgtl-header__icon">
                        <Network size={22} />
                    </div>

                    <div>
                        <h3>Intégration TGTL</h3>
                        <span>Trajet Go Transport Language</span>
                    </div>
                </div>

                <span className="tgtl-header__badge">
                    Disponible
                </span>

            </div>

            <p>
                Connectez votre organisation à l'écosystème Trajet Go.
                Importez, exportez et synchronisez les données de votre compagnie.
            </p>
        </section>
    );
}
