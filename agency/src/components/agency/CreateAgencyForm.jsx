import Input from "@shared/components/ui/Input";
import Button from "@shared/components/ui/Button";
import Select from "@shared/components/ui/Select";
import ActivityIndicator from "@shared/components/ui/ActivityIndicator";

export default function CreateAgencyForm({
    handleFormSubmit,
    serverError,
    formData,
    errors,
    touched,
    handleBlur,
    handleChange,
    isSubmitting,
    cities,
    citiesLoading,
}) {
    return (
        <form
            onSubmit={handleFormSubmit}
            className="agency-form"
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

            <Input
                label="Nom de l'agence"
                type="text"
                name="name"
                id="name"
                placeholder="Ex : Gare Siporex"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                    touched.name &&
                    errors.name
                }
                required
                autoFocus
            />

            <Input
                label="Code agence"
                type="text"
                name="code"
                id="code"
                placeholder="Ex : SIP"
                value={formData.code}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.code && errors.code}
                required
            />

            <Select
                label="Ville"
                name="locationId"
                id="locationId"
                placeholder="Sélectionnez une ville"
                value={formData.locationId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                    touched.locationId &&
                    errors.locationId
                }
                options={cities}
                required
            />

            <Input
                label="Adresse"
                type="text"
                name="address"
                id="address"
                placeholder="Ex : Boulevard de la Paix"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                    touched.address &&
                    errors.address
                }
            />

            <Input
                label="Téléphone"
                type="tel"
                name="phone"
                id="phone"
                placeholder="Ex : +2250700000000"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                    touched.phone &&
                    errors.phone
                }
            />

            <Input
                label="Email"
                type="email"
                name="email"
                id="email"
                placeholder="Ex : agence@compagnie.ci"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                    touched.email &&
                    errors.email
                }
            />

            <Input
                label="Description"
                type="text"
                name="description"
                id="description"
                placeholder="Informations complémentaires..."
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                    touched.description &&
                    errors.description
                }
            />

            <Button
                type="submit"
                size="medium"
                variant="primary"
                loading={isSubmitting}
                fullWidth
                disabled={
                    isSubmitting ||
                    citiesLoading
                }
            >
                {isSubmitting ? (
                    <ActivityIndicator
                        size={14}
                        type="dots"
                        color="white"
                    />
                ) : (
                    <span>
                        Ajouter
                    </span>
                )}
            </Button>
        </form>
    );
}