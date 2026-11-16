import Input from "@shared/components/ui/Input";
import Select from "@shared/components/ui/Select";
import Button from "@shared/components/ui/Button";
import ActivityIndicator from "@shared/components/ui/ActivityIndicator";

const ROLE_OPTIONS = [
    { value: "COMPANY_ADMIN", label: "Administrateur compagnie" },
    { value: "AGENCY_AGENT", label: "Agent d'agence" },
    { value: "CONTROLLER", label: "Contrôleur" },
];

export default function InviteTeamMemberForm({
    handleFormSubmit,

    formData,
    errors,
    touched,

    handleChange,
    handleBlur,

    isSubmitting,
    serverError,

    agencies = [],
    agenciesLoading = false,
}) {
    const showAgencyField = formData.role !== "COMPANY_ADMIN";

    return (
        <form
            onSubmit={handleFormSubmit}
            className="team-form"
            noValidate
        >
            {serverError && (
                <div className="server-error" role="alert">
                    <span className="error-icon" aria-hidden="true">⚠️</span>
                    <span>{serverError}</span>
                </div>
            )}

            {/* ---------- Identité ---------- */}

            <div className="team-form__row">
                <Input
                    label="Prénom"
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.firstName && errors.firstName}
                    autoComplete="given-name"
                    required
                    autoFocus
                />

                <Input
                    label="Nom"
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Kouassi"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.lastName && errors.lastName}
                    autoComplete="family-name"
                    required
                />
            </div>

            {/* ---------- Contact ---------- */}

            <Input
                label="Téléphone"
                type="tel"
                name="phone"
                id="phone"
                placeholder="+225 07 07 00 00 00"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && errors.phone}
                autoComplete="tel"
                required
            />

            <Input
                label="Email (optionnel)"
                type="email"
                name="email"
                id="email"
                placeholder="nom@exemple.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                autoComplete="email"
            />

            {/* ---------- Rôle ---------- */}

            <Select
                label="Rôle"
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.role && errors.role}
                options={ROLE_OPTIONS}
                required
            />

            {/* ---------- Agence (conditionnel) ---------- */}

            {showAgencyField && (
                <Select
                    label="Agence"
                    name="agencyId"
                    id="agencyId"
                    placeholder={
                        agenciesLoading
                            ? "Chargement des agences..."
                            : "Sélectionner une agence"
                    }
                    value={formData.agencyId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.agencyId && errors.agencyId}
                    options={agencies.map((a) => ({
                        value: a.id,
                        label: a.name,
                    }))}
                    disabled={agenciesLoading}
                    required
                />
            )}

            {/* ---------- Submit ---------- */}

            <Button
                type="submit"
                size="medium"
                variant="primary"
                loading={isSubmitting}
                fullWidth
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator
                        size={14}
                        type="dots"
                        color="white"
                    />
                ) : (
                    <span>Envoyer l'invitation</span>
                )}
            </Button>
        </form>
    );
}