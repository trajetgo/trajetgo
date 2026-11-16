import React from "react";

import {
  AlertTriangle,
  ShieldAlert,
  Bus,
  CreditCard,
  Ticket,
  Send,
} from "lucide-react";

import Input from "@shared/components/ui/Input";
import Textarea from "@shared/components/ui/Textarea";
import Select from "@shared/components/ui/Select";
import Button from "@shared/components/ui/Button";
import ActivityIndicator from "@shared/components/ui/ActivityIndicator";
import { useToast } from "@shared/contexts/toast.context";

import useReportIssue from "../../hooks/useReportIssue";

import "../../styles/pages/support/ReportIssue.scss";

export default function ReportIssue() {
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
  } = useReportIssue();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await handleSubmit(e);

      if (result?.success) {
        showToast(
          "success",
          "Signalement envoyé",
          "Votre signalement a bien été envoyé à notre équipe.",
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
        "Impossible d'envoyer votre signalement. Veuillez réessayer.",
        {
          title: "Échec",
          duration: 5000,
        }
      );
    }
  };

  return (
    <section className="report-page">

      <div className="report-page__hero">

        <div className="report-page__hero-content">

          <span className="report-page__badge">
            🚨 Signaler un problème
          </span>

          <h1>
            Aidez-nous à améliorer Trajet Go
          </h1>

          <p>
            Signalez un problème rencontré lors de votre
            réservation, de votre paiement, de votre trajet
            ou de l'utilisation de la plateforme.
          </p>

        </div>

      </div>

      <div className="report-page__content">

        <div className="report-page__categories">

          <div className="report-category">

            <Bus size={22} />

            <div>
              <h3>
                Trajet ou réservation
              </h3>

              <p>
                Problème avec un trajet, une réservation,
                un départ ou une information incorrecte.
              </p>
            </div>

          </div>

          <div className="report-category">

            <CreditCard size={22} />

            <div>
              <h3>
                Paiement ou remboursement
              </h3>

              <p>
                Paiement échoué, débit incorrect,
                transaction en attente ou remboursement
                non reçu.
              </p>
            </div>

          </div>

          <div className="report-category">

            <Ticket size={22} />

            <div>
              <h3>
                Billet ou embarquement
              </h3>

              <p>
                Problème avec votre billet, QR code,
                siège ou contrôle à l'embarquement.
              </p>
            </div>

          </div>

          <div className="report-category report-category--danger">

            <ShieldAlert size={22} />

            <div>
              <h3>
                Sécurité ou abus
              </h3>

              <p>
                Fraude, usurpation d'identité, comportement
                abusif ou problème de sécurité.
              </p>
            </div>

          </div>

        </div>

        <div className="report-page__form-wrapper">

          <form
            className="report-form"
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

            <div className="report-form__header">

              <h2>
                Décrire le problème
              </h2>

              <p>
                Plus votre description est précise,
                plus nous pourrons vous aider rapidement.
              </p>

            </div>

            <div className="report-form__grid">

              <Input
                label="Nom complet"
                name="name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name && touched.name}
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
                error={errors.email && touched.email}
                placeholder="vous@example.com"
                required
              />

            </div>

            <Select
              label="Type de problème"
              name="type"
              value={form.type}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.type && touched.type}
              options={[
                {
                  label: "Choisir un type",
                  value: "",
                },
                {
                  label: "Trajet / réservation",
                  value: "TRIP",
                },
                {
                  label: "Paiement",
                  value: "PAYMENT",
                },
                {
                  label: "Remboursement",
                  value: "REFUND",
                },
                {
                  label: "Billet / embarquement",
                  value: "TICKET",
                },
                {
                  label: "Compte utilisateur",
                  value: "ACCOUNT",
                },
                {
                  label: "Bug technique",
                  value: "BUG",
                },
                {
                  label: "Sécurité / abus",
                  value: "SECURITY",
                },
                {
                  label: "Autre",
                  value: "OTHER",
                },
              ]}
              required
            />

            <Input
              label="Référence (optionnel)"
              name="reference"
              value={form.reference}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="N° de réservation, billet ou transaction"
            />

            <Textarea
              label="Description détaillée"
              name="description"
              value={form.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                errors.description &&
                touched.description
              }
              placeholder="Expliquez le problème rencontré…"
              rows={7}
              required
            />

            <div className="report-form__footer">

              <div className="report-form__notice">

                <AlertTriangle size={18} />

                <p>
                  Les signalements liés à la sécurité,
                  aux paiements et aux fraudes peuvent
                  nécessiter une vérification
                  supplémentaire par notre équipe.
                </p>

              </div>

              <Button
                type="submit"
                icon={Send}
                loading={isSubmitting}
                disabled={isSubmitting}
              >

                {isSubmitting ? (
                  <ActivityIndicator
                    size={14}
                    color="white"
                    type="dots"
                  />
                ) : (
                  <span>
                    Envoyer le signalement
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