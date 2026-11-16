import { Link } from "react-router-dom";

import Button from "@shared/components/ui/Button";

export default function NeedHelp() {

  return (
    <section className="need-help">

      <h2>
        Vous ne trouvez pas votre réponse ?
      </h2>

      <p>
        Notre équipe est disponible pour vous accompagner.
        Contactez-nous ou signalez directement un problème.
      </p>

      <div className="need-help__actions">

        <Link to="/support/contact">
          <Button>
            Nous contacter
          </Button>
        </Link>

        <Link to="/support/report">
          <Button variant="secondary">
            Signaler un problème
          </Button>
        </Link>

      </div>

    </section>
  );
}