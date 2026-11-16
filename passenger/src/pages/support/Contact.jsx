import React from "react";

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
} from "lucide-react";

import Input from "@shared/components/ui/Input";
import Textarea from "@shared/components/ui/Textarea";
import Select from "@shared/components/ui/Select";
import Button from "@shared/components/ui/Button";
import ActivityIndicator from "@shared/components/ui/ActivityIndicator";
import { useToast } from "@shared/contexts/toast.context";

import useContact from "../../hooks/useContact";

import "../../styles/pages/support/Contact.scss";

export default function Contact() {
  const { showToast } = useToast();

  const {
    form,
    errors,
    touched,
    serverError,
    isSubmitting,

    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
  } = useContact();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await handleSubmit(e);

      if (result?.success) {
        showToast(
          "success",
          "Message envoyé",
          "Votre message a bien été envoyé à notre équipe.",
          {
            title: "Merci",
            duration: 3000,
          }
        );

        handleReset();
      }
    } catch (error) {
      showToast(
        "error",
        "Échec",
        "Impossible d'envoyer votre message. Veuillez réessayer.",
        {
          title: "Échec",
          duration: 5000,
        }
      );
    }
  };

  return (
    <section className="contact-page">

      <div className="contact-page__hero">

        <div className="contact-page__hero-content">

          <span className="contact-page__badge">
            📩 Support Trajet Go
          </span>

          <h1>
            Contactez notre équipe
          </h1>

          <p>
            Une question, un problème ou une suggestion ?
            Notre équipe est là pour vous accompagner dans
            l'utilisation de Trajet Go.
          </p>

        </div>

      </div>

      <div className="contact-page__content">

        <div className="contact-page__info">

          <div className="contact-card">

            <Mail size={22} />

            <div>
              <h3>Email</h3>
              <p>support@trajet-go.com</p>
            </div>

          </div>

          <div className="contact-card">

            <Phone size={22} />

            <div>
              <h3>Téléphone</h3>
              <p>+225 07 00 00 00 00</p>
            </div>

          </div>

          <div className="contact-card">

            <MapPin size={22} />

            <div>
              <h3>Adresse</h3>
              <p>Abidjan, Côte d'Ivoire</p>
            </div>

          </div>

          <div className="contact-card">

            <Clock size={22} />

            <div>
              <h3>Horaires</h3>
              <p>
                Lun - Ven : 8h00 - 18h00
              </p>
            </div>

          </div>

          <div className="contact-page__faq">

            <div className="contact-page__faq-header">

              <MessageSquare size={20} />

              <h3>
                Avant de nous écrire
              </h3>

            </div>

            <ul>

              <li>
                Consultez notre FAQ pour les questions
                fréquentes.
              </li>

              <li>
                Pour une réservation, préparez votre
                numéro de réservation ou votre billet.
              </li>

              <li>
                Pour un paiement ou un remboursement,
                indiquez la référence de la transaction.
              </li>

              <li>
                Pour un problème d'embarquement,
                indiquez le trajet et la date concernés.
              </li>

            </ul>

          </div>

        </div>

        <div className="contact-page__form-wrapper">

          <form
            className="contact-form"
            onSubmit={handleFormSubmit}
          >

            {serverError && (
              <div
                className="server-error"
                role="alert"
              >
                <span className="error-icon">
                  ⚠️
                </span>

                <span>
                  {serverError}
                </span>
              </div>
            )}

            <div className="contact-form__header">

              <h2>
                Envoyer un message
              </h2>

              <p>
                Décrivez votre demande et notre équipe
                vous répondra dans les meilleurs délais.
              </p>

            </div>

            <div className="contact-form__grid">

              <Input
                label="Nom complet"
                name="name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.name &&
                  errors.name
                }
                placeholder="Votre nom"
                required
              />

              <Input
                label="Adresse email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.email &&
                  errors.email
                }
                placeholder="vous@example.com"
                required
              />

            </div>

            <Select
              label="Sujet"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.subject &&
                errors.subject
              }
              options={[
                {
                  label: "Choisir un sujet",
                  value: "",
                },
                {
                  label: "Compte et connexion",
                  value: "account",
                },
                {
                  label: "Trajets et horaires",
                  value: "trips",
                },
                {
                  label: "Réservation",
                  value: "booking",
                },
                {
                  label: "Billet et embarquement",
                  value: "ticket",
                },
                {
                  label: "Paiement",
                  value: "payment",
                },
                {
                  label: "Remboursement",
                  value: "refund",
                },
                {
                  label: "Sécurité",
                  value: "security",
                },
                {
                  label: "Suggestion",
                  value: "suggestion",
                },
                {
                  label: "Autre",
                  value: "other",
                },
              ]}
              required
            />

            <Textarea
              label="Message"
              name="message"
              value={form.message}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.message &&
                errors.message
              }
              placeholder="Décrivez votre question ou le problème rencontré avec le plus de détails possible…"
              rows={6}
              required
            />

            <div className="contact-form__footer">

              <p>
                En envoyant ce formulaire, vous acceptez
                que Trajet Go utilise les informations
                fournies pour traiter votre demande de
                support.
              </p>

              <Button
                type="submit"
                icon={Send}
                loading={isSubmitting}
                disabled={isSubmitting}
              >

                {isSubmitting ? (
                  <ActivityIndicator
                    size={14}
                    type="dots"
                    color="white"
                  />
                ) : (
                  <span>
                    Envoyer le message
                  </span>
                )}

              </Button>

            </div>

          </form>

        </div>

      </div>

    </section>
  );
}