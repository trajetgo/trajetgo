import React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const articles = [
  "Créer un compte Kilo Go",
  "Vérifier son adresse email",
  "Publier un voyage",
  "Créer une demande de colis",
  "Recevoir un paiement",
  "Annuler un voyage",
  "Modifier son profil",
  "Vérifier son identité"
];

export default function PopularArticles() {

  return (
    <section className="popular-articles">

      <h2>
        Articles les plus consultés
      </h2>

      <div className="popular-articles__list">

        {articles.map(article => (

          <Link
            key={article}
            to="#"
            className="popular-article"
          >

            <span>
              {article}
            </span>

            <ChevronRight size={18} />

          </Link>

        ))}

      </div>

    </section>
  );
}