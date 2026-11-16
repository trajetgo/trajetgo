import Input from "@shared/components/ui/Input";
import Button from "@shared/components/ui/Button";
import Select from "@shared/components/ui/Select";
import ActivityIndicator from "@shared/components/ui/ActivityIndicator";

const STATUS_OPTIONS = [
    { value: "ACTIVE", label: "Actif" },
    { value: "INACTIVE", label: "Inactif" },
    { value: "MAINTENANCE", label: "En maintenance" },
];

export default function CreateBusForm({
    handleFormSubmit,

    formData,
    errors,
    touched,

    handleChange,
    handleBlur,

    isSubmitting,
    serverError,
}) {
    return (
        <form
            onSubmit={handleFormSubmit}
            className="bus-form"
            noValidate
        >
            {serverError && (
                <div className="server-error" role="alert">
                    <span className="error-icon" aria-hidden="true">⚠️</span>
                    <span>{serverError}</span>
                </div>
            )}

            <Input
                label="Immatriculation"
                type="text"
                name="registrationNumber"
                id="registrationNumber"
                placeholder="Ex : AB-1234-CI"
                value={formData.registrationNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.registrationNumber && errors.registrationNumber}
                autoComplete="off"
                required
                autoFocus
            />

            <Input
                label="Nom (optionnel)"
                type="text"
                name="name"
                id="name"
                placeholder="Ex : Bus Express 1"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && errors.name}
                autoComplete="off"
            />

            <Input
                label="Capacité (places)"
                type="number"
                name="capacity"
                id="capacity"
                placeholder="Ex : 50"
                min="1"
                max="100"
                step="1"
                value={formData.capacity}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.capacity && errors.capacity}
                required
            />

            <Select
                label="Statut"
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.status && errors.status}
                options={STATUS_OPTIONS}
                required
            />

            <Button
                type="submit"
                size="medium"
                variant="primary"
                loading={isSubmitting}
                fullWidth
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator size={14} type="dots" color="white" />
                ) : (
                    <span>Créer le bus</span>
                )}
            </Button>
        </form>
    );
}