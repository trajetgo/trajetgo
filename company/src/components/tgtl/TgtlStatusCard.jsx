
import { RefreshCw } from "lucide-react";

export default function TgtlStatusCard() {
    return (
        <section className="tgtl-status">

            <div className="tgtl-status__icon">
                <RefreshCw size={21} />
            </div>

            <div className="tgtl-status__content">
                <h4>État de votre organisation</h4>

                <p>
                    Votre organisation n'a pas encore été synchronisée
                    avec un système externe.
                </p>
            </div>

            <span className="tgtl-status__badge">
                Non synchronisé
            </span>

        </section>
    );
}
