import Input from "@shared/components/ui/Input";
import Select from "@shared/components/ui/Select";
import ActivityIndicator from "@shared/components/ui/ActivityIndicator";
import Button from "@shared/components/ui/Button";

export default function CreateLocationForm({
    type, // "country" | "region" | "city" | "location"
    formData,
    errors,
    touched,
    isSubmitting,
    serverError,
    countries = [],
    countriesLoading,

    onChange,
    onCoordsChange,
    onBlur,
    onSubmit,
    onCancel,
}) {
    const isCountry = type === "country";
    const isRegion = type === "region";
    const isCity = type === "city";
    const isLocation = type === "location";

    const submitLabel = {
        country: "Créer le pays",
        region: "Créer la région",
        city: "Créer la ville",
        location: "Créer le point d'arrêt",
    }[type] ?? "Créer";

    return (
        <form
            className="create-location-form"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            <div className="create-location-form__fields">

                {/* Nom */}
                <Input
                    label="Nom"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                        onChange("name", e.target.value)
                    }
                    onBlur={() => onBlur("name")}
                    placeholder={
                        isCountry
                            ? "Ex. Côte d'Ivoire"
                            : "Ex. Yamoussoukro"
                    }
                    error={
                        touched.name
                            ? errors.name
                            : ""
                    }
                    required
                />

                {/* Code */}
                {!(isRegion || isCity) && (
                    <Input
                        label="Code"
                        name="code"
                        value={formData.code}
                        onChange={(e) =>
                            onChange(
                                "code",
                                e.target.value.toUpperCase()
                            )
                        }
                        onBlur={() => onBlur("code")}
                        placeholder={
                            isCountry
                                ? "Ex. CI"
                                : "Ex. YMK"
                        }
                        error={
                            touched.code
                                ? errors.code
                                : ""
                        }
                        required
                    />
                )}

                {/* Pays pour une ville */}
                {(isRegion || isCity) && (
                    <Select
                        label="Pays"
                        name="countryId"
                        value={formData.countryId}
                        onChange={(e) =>
                            onChange(
                                "countryId",
                                e.target.value
                            )
                        }
                        onBlur={() => onBlur("countryId")}
                        disabled={countriesLoading}
                        error={
                            touched.countryId
                                ? errors.countryId
                                : ""
                        }
                        required
                        options={countries.map(c => ({
                            value: c.id,
                            label: c.name
                        }))}
                    />

                )}

                {/* Indicatif téléphonique */}
                {isCountry && (
                    <Input
                        label="Indicatif téléphonique"
                        name="phoneCode"
                        value={formData.phoneCode}
                        onChange={(e) =>
                            onChange(
                                "phoneCode",
                                e.target.value
                            )
                        }
                        onBlur={() => onBlur("phoneCode")}
                        placeholder="+225"
                        error={
                            touched.phoneCode
                                ? errors.phoneCode
                                : ""
                        }
                        required
                    />
                )}

                {/* Coordonnées */}
                <div className="create-location-form__section">
                    <div className="create-location-form__section-title">
                        Localisation
                    </div>

                    <div className="create-location-form__coordinates">
                        <Input
                            label="Latitude"
                            name="latitude"
                            type="number"
                            step="any"
                            value={formData.coords.lat}
                            onChange={(e) =>
                                onCoordsChange(
                                    "lat",
                                    e.target.value
                                )
                            }
                            placeholder="Ex. 6.8276"
                        />

                        <Input
                            label="Longitude"
                            name="longitude"
                            type="number"
                            step="any"
                            value={formData.coords.lng}
                            onChange={(e) =>
                                onCoordsChange(
                                    "lng",
                                    e.target.value
                                )
                            }
                            placeholder="Ex. -5.2893"
                        />
                    </div>
                </div>

                {/* Erreur serveur */}
                {serverError && (
                    <div
                        className="create-location-form__error"
                        role="alert"
                    >
                        {serverError}
                    </div>
                )}
            </div>

            <div className="create-location-form__actions">
                <Button
                    size="small"
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Annuler
                </Button>

                <Button
                    size="small"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator
                            size={14}
                            type="digital"
                            color="white"
                        />
                    ) : submitLabel}
                </Button>
            </div>
        </form>
    );
}