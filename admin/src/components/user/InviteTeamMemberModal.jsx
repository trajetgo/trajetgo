import { useEffect, useState } from "react";
import {
    UserPlus,
    Phone,
    Mail,
    Building2,
    ShieldCheck,
    MessageSquare,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";

import Modal from "@shared/components/ui/Modal";
import Input from "@shared/components/ui/Input";
import Select from "@shared/components/ui/Select";
import Button from "@shared/components/ui/Button";

import useAgencies from "../../hooks/useAgencies";
import service from "../../services/users.service";

import { USER_ROLE } from "../../utils/user.utils";

import "../../styles/components/user/InviteTeamMemberModal.scss";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const ROLE_OPTIONS = [
    {
        value: "COMPANY_ADMIN",
        label: "Administrateur compagnie",
    },
    {
        value: "AGENCY_AGENT",
        label: "Agent d'agence",
    },
    {
        value: "CONTROLLER",
        label: "Contrôleur",
    },
];

const INITIAL_FORM = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    role: "AGENCY_AGENT",
    agencyId: "",
};

/* ------------------------------------------------------------------ */

export default function InviteTeamMemberModal({
    open,
    onClose,
    onInvited,
}) {
    const { agencies = [] } = useAgencies();

    const [formData, setFormData] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");
    const [inviteSent, setInviteSent] = useState(null);

    /* ---------- Reset à la fermeture ---------- */

    useEffect(() => {
        if (!open) {
            setFormData(INITIAL_FORM);
            setErrors({});
            setServerError("");
            setInviteSent(null);
        }
    }, [open]);

    /* ---------- Champs dérivés ---------- */

    const agencyRequired = formData.role !== "COMPANY_ADMIN";

    const agencyOptions = agencies
        .filter((a) => a.status === "ACTIVE")
        .map((a) => ({
            value: a.id,
            label: a.name,
        }));

    /* =========================================================
       Handlers
    ========================================================= */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setServerError("");

        // Changement de rôle → reset l'agence si COMPANY_ADMIN
        if (name === "role" && value === "COMPANY_ADMIN") {
            setFormData((prev) => ({ ...prev, agencyId: "" }));
        }
    };

    /* ---------- Validation ---------- */

    const validate = () => {
        const next = {};

        if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
            next.firstName = "Le prénom est obligatoire (min. 2 caractères).";
        }

        if (!formData.lastName.trim() || formData.lastName.trim().length < 2) {
            next.lastName = "Le nom est obligatoire (min. 2 caractères).";
        }

        const normalizedPhone = formData.phone.trim().replace(/\s/g, "");
        if (!/^\+225\d{10}$/.test(normalizedPhone)) {
            next.phone = "Numéro ivoirien invalide (+225 XX XX XX XX XX).";
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            next.email = "Adresse email invalide.";
        }

        if (agencyRequired && !formData.agencyId) {
            next.agencyId = "L'agence est obligatoire pour ce rôle.";
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    /* ---------- Submit ---------- */

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validate()) return;

        setSubmitting(true);

        try {
            const payload = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                phone: formData.phone.trim().replace(/\s/g, ""),
                email: formData.email.trim() || null,
                role: formData.role,
                agencyId:
                    formData.role === "COMPANY_ADMIN"
                        ? null
                        : formData.agencyId,
            };

            const result = await service.inviteUser(payload);

            if (!result.success) {
                throw new Error(result.message || "Impossible d'envoyer l'invitation.");
            }

            setInviteSent(result.data);
            onInvited?.(result.data);

            /* ✅ Fermeture auto après 2s */
            setTimeout(() => {
                onClose?.();
            }, 2000);
        } catch (err) {
            setServerError(err.message || "Une erreur est survenue.");
        } finally {
            setSubmitting(false);
        }
    };

    /* =========================================================
       Rendu
    ========================================================= */

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title="Inviter un membre"
            size="md"
        >
            {/* =====================================================
                ÉTAT SUCCÈS
            ===================================================== */}

            {inviteSent ? (
                <div className="invite-modal invite-modal--success">
                    <div className="invite-modal__success-icon">
                        <CheckCircle2 size={48} />
                    </div>

                    <h2 className="invite-modal__success-title">
                        Invitation envoyée
                    </h2>

                    <p className="invite-modal__success-message">
                        Un SMS a été envoyé à{" "}
                        <strong>{inviteSent.phone}</strong>.
                    </p>

                    <p className="invite-modal__success-hint">
                        Le lien d'activation est valable{" "}
                        <strong>7 jours</strong>. Le membre pourra créer
                        son mot de passe à la première connexion.
                    </p>
                </div>
            ) : (
                <form
                    className="invite-modal"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    {/* ---------- Erreur serveur ---------- */}

                    {serverError && (
                        <div className="invite-modal__error" role="alert">
                            <AlertTriangle size={16} />
                            <span>{serverError}</span>
                        </div>
                    )}

                    {/* ---------- Identité ---------- */}

                    <div className="invite-modal__row">
                        <Input
                            label="Prénom"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={errors.firstName}
                            placeholder="Jean"
                            autoComplete="given-name"
                            required
                            autoFocus
                        />

                        <Input
                            label="Nom"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={errors.lastName}
                            placeholder="Kouassi"
                            autoComplete="family-name"
                            required
                        />
                    </div>

                    {/* ---------- Contact ---------- */}

                    <Input
                        label="Téléphone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        placeholder="+225 07 07 00 00 00"
                        icon={<Phone size={16} />}
                        autoComplete="tel"
                        required
                    />

                    <Input
                        label="Email (optionnel)"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="jean@exemple.com"
                        icon={<Mail size={16} />}
                        autoComplete="email"
                    />

                    {/* ---------- Rôle ---------- */}

                    <Select
                        label="Rôle"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        error={errors.role}
                        options={ROLE_OPTIONS}
                        icon={<ShieldCheck size={16} />}
                        required
                    />

                    {/* ---------- Agence (conditionnel) ---------- */}

                    {agencyRequired && (
                        <Select
                            label="Agence"
                            name="agencyId"
                            value={formData.agencyId}
                            onChange={handleChange}
                            error={errors.agencyId}
                            options={[
                                { value: "", label: "Sélectionner une agence" },
                                ...agencyOptions,
                            ]}
                            icon={<Building2 size={16} />}
                            required
                        />
                    )}

                    {/* ---------- Aperçu du SMS ---------- */}

                    <div className="invite-modal__preview">
                        <div className="invite-modal__preview-header">
                            <MessageSquare size={14} />
                            <span>Aperçu du SMS</span>
                        </div>

                        <p className="invite-modal__preview-text">
                            Bonjour{" "}
                            <strong>{formData.firstName || "…"}</strong>,
                            vous êtes invité(e) à rejoindre Trajet Go en
                            tant que{" "}
                            <strong>
                                {USER_ROLE[formData.role]?.label ?? "…"}
                            </strong>
                            . Activez votre compte via le lien qui vous
                            sera envoyé.
                        </p>
                    </div>

                    {/* ---------- Actions ---------- */}

                    <footer className="invite-modal__actions">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Annuler
                        </Button>

                        <Button
                            type="submit"
                            variant="primary"
                            loading={submitting}
                            disabled={submitting}
                        >
                            <UserPlus size={16} />
                            Envoyer l'invitation
                        </Button>
                    </footer>
                </form>
            )}
        </Modal>
    );
}