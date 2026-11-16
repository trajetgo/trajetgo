import { useState, useId, useMemo } from "react";
import {
  HelpCircle,
  ChevronDown,
  Search,
  MapPin,
  CreditCard,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import Input from "@shared/components/ui/Input";
import Button from "@shared/components/ui/Button";
import HighlightText from "@shared/components/ui/HighlightText";

import "../../styles/pages/support/FAQ.scss";

/* ------------------------------------------------------------------ */
/* Utilitaires                                                         */
/* ------------------------------------------------------------------ */

/** Normalise une chaîne : minuscules + sans accents */
const normalize = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/** Filtre les items d'une section selon la query */
const filterItems = (items, query) => {
  const q = normalize(query.trim());
  if (!q) return items;

  return items.filter(
    (item) =>
      normalize(item.question).includes(q) ||
      normalize(item.answer).includes(q)
  );
};

/* ------------------------------------------------------------------ */
/* Données — Trajet Go                                                 */
/* ------------------------------------------------------------------ */

const faqSections = [
  {
    title: "Compte et sécurité",
    icon: ShieldCheck,
    items: [
      {
        question: "Comment créer un compte Trajet Go ?",
        answer:
          "Cliquez sur « Inscription », renseignez votre nom, votre adresse email et votre numéro de téléphone, puis confirmez votre email pour activer votre compte.",
      },
      {
        question: "Pourquoi dois-je vérifier mon identité ?",
        answer:
          "La vérification d'identité est requise pour réserver un trajet et garantir la sécurité de tous les passagers. Elle renforce la confiance entre voyageurs et compagnies partenaires.",
      },
      {
        question: "Que faire si j'ai oublié mon mot de passe ?",
        answer:
          "Depuis la page de connexion, cliquez sur « Mot de passe oublié » et suivez les instructions envoyées par email pour réinitialiser votre mot de passe.",
      },
      {
        question: "Comment protéger mon compte ?",
        answer:
          "Utilisez un mot de passe unique et complexe, activez la vérification en deux étapes et ne partagez jamais vos identifiants. Vous pouvez gérer vos sessions actives depuis votre espace personnel.",
      },
    ],
  },
  {
    title: "Recherche et réservation",
    icon: Search,
    items: [
      {
        question: "Comment rechercher un trajet ?",
        answer:
          "Depuis la page d'accueil, indiquez votre ville de départ, votre ville d'arrivée, la date souhaitée et le nombre de passagers. Cliquez sur « Rechercher » pour afficher les trajets disponibles.",
      },
      {
        question: "Comment réserver une place ?",
        answer:
          "Sélectionnez le trajet qui vous convient, vérifiez les informations (heure, lieu de départ, prix) puis confirmez votre réservation en procédant au paiement sécurisé.",
      },
      {
        question: "Puis-je réserver pour plusieurs personnes ?",
        answer:
          "Oui. Lors de la recherche, indiquez le nombre d'adultes et, si nécessaire, ajoutez des enfants avec leur âge. Le tarif peut varier selon l'âge des passagers.",
      },
      {
        question: "Puis-je modifier ou annuler ma réservation ?",
        answer:
          "Tant que le départ est à plus de 24 heures, vous pouvez modifier ou annuler votre réservation depuis votre espace personnel. Des frais peuvent s'appliquer selon les conditions du transporteur.",
      },
    ],
  },
  {
    title: "Trajets et voyageurs",
    icon: MapPin,
    items: [
      {
        question: "Trajet Go couvre-t-il les trajets internationaux ?",
        answer:
          "Oui. Trajet Go propose des trajets nationaux et internationaux à travers la Côte d'Ivoire et les pays voisins, afin de faciliter vos déplacements régionaux.",
      },
      {
        question: "Que dois-je apporter au moment du départ ?",
        answer:
          "Présentez-vous au point de départ avec une pièce d'identité valide et votre confirmation de réservation (disponible dans votre espace personnel).",
      },
      {
        question: "Que se passe-t-il si je rate mon départ ?",
        answer:
          "Contactez immédiatement le support. Selon les conditions du transporteur, un report ou un remboursement partiel peut être proposé. Aucun remboursement ne sera effectué en cas de non-présentation sans préavis.",
      },
      {
        question: "Les bagages sont-ils inclus ?",
        answer:
          "Chaque passager dispose d'un bagage en soute et d'un bagage à main, dans la limite fixée par la compagnie. Les bagages supplémentaires peuvent entraîner des frais additionnels.",
      },
    ],
  },
  {
    title: "Paiements et remboursements",
    icon: CreditCard,
    items: [
      {
        question: "Quels moyens de paiement sont acceptés ?",
        answer:
          "Trajet Go accepte les cartes bancaires (Visa, Mastercard) et les solutions de paiement mobile compatibles avec votre pays (Orange Money, MTN, Wave, etc.).",
      },
      {
        question: "Le paiement est-il sécurisé ?",
        answer:
          "Oui. Toutes les transactions sont chiffrées et traitées par des prestataires de paiement certifiés. Trajet Go ne stocke jamais vos données bancaires.",
      },
      {
        question: "Comment obtenir un remboursement ?",
        answer:
          "En cas d'annulation éligible, le remboursement est automatiquement initié vers votre moyen de paiement d'origine. Le délai varie de 3 à 10 jours ouvrés selon votre banque.",
      },
      {
        question: "Puis-je obtenir une facture ?",
        answer:
          "Oui. Une facture est générée automatiquement après chaque réservation payée et reste accessible à tout moment depuis votre espace personnel, rubrique « Mes réservations ».",
      },
    ],
  },
  {
    title: "Support et assistance",
    icon: Users,
    items: [
      {
        question: "Comment contacter le support Trajet Go ?",
        answer:
          "Vous pouvez joindre notre équipe via le formulaire de contact, par email à support@trajetgo.com ou via la messagerie intégrée depuis votre espace personnel.",
      },
      {
        question: "Quels sont les délais de réponse ?",
        answer:
          "Notre équipe répond généralement sous 24 heures en jours ouvrés. Les demandes urgentes (annulation imminente, incident au départ) sont traitées en priorité.",
      },
      {
        question: "Comment signaler un problème avec un trajet ?",
        answer:
          "Depuis votre réservation, cliquez sur « Signaler un problème » et décrivez la situation. Notre équipe vous répondra dans les plus brefs délais.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Composant principal                                                 */
/* ------------------------------------------------------------------ */

export default function FAQ() {
  const [query, setQuery] = useState("");

  /** Résultat filtré par section */
  const filteredSections = useMemo(() => {
    return faqSections
      .map((section) => ({
        ...section,
        items: filterItems(section.items, query),
      }))
      .filter((section) => section.items.length > 0);
  }, [query]);

  const hasResults = filteredSections.length > 0;
  const isSearching = query.trim().length > 0;

  return (
    <section className="faq-page">
      {/* ---------- Hero ---------- */}

      <div className="faq-page__hero">
        <div className="faq-page__hero-content">
          <span className="faq-page__badge">
            <HelpCircle size={16} />
            Questions fréquentes
          </span>

          <h1>
            Les réponses aux questions les plus fréquentes
          </h1>

          <p>
            Retrouvez rapidement des réponses sur votre compte,
            la recherche de trajets, les réservations, les
            paiements et le support sur Trajet Go.
          </p>

          <div className="faq-page__search">
            <Input
              type="search"
              placeholder="Rechercher une question…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Rechercher dans la FAQ"
            />
          </div>
        </div>
      </div>

      {/* ---------- Contenu ---------- */}

      <div className="faq-page__content">
        {filteredSections.map((section) => {
          const Icon = section.icon;

          return (
            <section
              key={section.title}
              className="faq-section"
            >
              <header className="faq-section__header">
                <Icon size={22} aria-hidden="true" />
                <HighlightText
                  as="h2"
                  text={section.title}
                  search={query}
                />
              </header>

              <div className="faq-section__list">
                {section.items.map((item) => (
                  <FaqItem
                    key={item.question}
                    question={item.question}
                    answer={item.answer}
                    query={query}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* ---------- État vide ---------- */}

        {isSearching && !hasResults && (
          <div className="faq-page__empty">
            <HelpCircle size={40} aria-hidden="true" />
            <h3>Aucun résultat trouvé</h3>
            <p>
              Essayez un autre mot-clé ou contactez notre
              équipe d'assistance.
            </p>
          </div>
        )}

        {/* ---------- CTA ---------- */}

        <div className="faq-page__cta">
          <h2>Vous n'avez pas trouvé votre réponse ?</h2>

          <p>
            Notre équipe d'assistance est disponible pour vous
            accompagner dans l'utilisation de Trajet Go.
          </p>

          <div className="faq-page__cta-actions">
            <Link to="/support/contact">
              <Button>Contacter le support</Button>
            </Link>

            <Link to="/support/help-center">
              <Button variant="secondary">
                Retour au centre d'aide
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Item accordéon                                                      */
/* ------------------------------------------------------------------ */

function FaqItem({ question, answer, query }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <article className={`faq-item ${open ? "faq-item--open" : ""}`}>
      <button
        type="button"
        className="faq-item__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`faq-panel-${id}`}
        id={`faq-trigger-${id}`}
      >
        <HighlightText
          as="span"
          text={question}
          search={query}
        />
        <ChevronDown
          size={20}
          className="faq-item__chevron"
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          className="faq-item__content"
          id={`faq-panel-${id}`}
          role="region"
          aria-labelledby={`faq-trigger-${id}`}
        >
          <HighlightText
            as="p"
            text={answer}
            search={query}
          />
        </div>
      )}
    </article>
  );
}