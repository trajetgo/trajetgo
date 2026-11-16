import React from "react";

import {
  User,
  Plane,
  Package,
  Wallet,
  ShieldCheck,
  BadgeCheck
} from "lucide-react";

const categories = [
  {
    icon: <User size={30} />,
    title: "Compte",
    description: "Connexion, inscription et paramètres."
  },
  {
    icon: <Plane size={30} />,
    title: "Voyages",
    description: "Publier et gérer vos voyages."
  },
  {
    icon: <Package size={30} />,
    title: "Colis",
    description: "Créer et suivre vos expéditions."
  },
  {
    icon: <Wallet size={30} />,
    title: "Paiements",
    description: "Transactions et remboursements."
  },
  {
    icon: <ShieldCheck size={30} />,
    title: "Sécurité",
    description: "Protection du compte."
  },
  {
    icon: <BadgeCheck size={30} />,
    title: "Vérification",
    description: "Validation de votre identité."
  }
];

export default function HelpCategories() {

  return (
    <section className="help-categories">

      <h2>
        Parcourir les catégories
      </h2>

      <div className="help-categories__grid">

        {categories.map(category => (

          <article
            key={category.title}
            className="help-category"
          >

            <div className="help-category__icon">
              {category.icon}
            </div>

            <h3>
              {category.title}
            </h3>

            <p>
              {category.description}
            </p>

          </article>

        ))}

      </div>

    </section>
  );
}