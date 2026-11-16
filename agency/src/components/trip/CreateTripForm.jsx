import Input from "@shared/components/ui/Input";
import Button from "@shared/components/ui/Button";
import Select from "@shared/components/ui/Select";
import ActivityIndicator from "@shared/components/ui/ActivityIndicator";

export default function CreateTripForm({
    handleFormSubmit,
    serverError,
    formData,
    errors,
    touched,
    handleBlur,
    handleChange,
    isSubmitting,

    routes,
    buses,
    departureLocations,
    arrivalLocations,

    routesLoading = false,
    busesLoading = false,
    locationsLoading = false,
}) {
    return (
        <form
            onSubmit={handleFormSubmit}
            className="trip-form"
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

            <Select
                label="Ligne"
                name="routeId"
                id="routeId"
                placeholder={
                    routesLoading
                        ? "Chargement des lignes..."
                        : "Sélectionner une ligne"
                }
                value={formData.routeId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                    touched.routeId &&
                    errors.routeId
                }
                options={routes}
                required
                disabled={routesLoading}
            />

            <Select
                label="Bus"
                name="busId"
                id="busId"
                placeholder={
                    busesLoading
                        ? "Chargement des bus..."
                        : "Sélectionner un bus"
                }
                value={formData.busId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                    touched.busId &&
                    errors.busId
                }
                options={buses}
                required
                disabled={busesLoading}
            />

            <Select
                label="Lieu de départ"
                name="departureLocationId"
                id="departureLocationId"
                placeholder={
                    !formData.routeId
                        ? "Sélectionnez d'abord une ligne"
                        : locationsLoading
                            ? "Chargement des lieux..."
                            : "Sélectionner le lieu de départ"
                }
                value={
                    formData.departureLocationId
                }
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                    touched.departureLocationId &&
                    errors.departureLocationId
                }
                options={departureLocations}
                required
                disabled={
                    !formData.routeId ||
                    locationsLoading
                }
            />

            <Select
                label="Lieu d'arrivée"
                name="arrivalLocationId"
                id="arrivalLocationId"
                placeholder={
                    !formData.routeId
                        ? "Sélectionnez d'abord une ligne"
                        : locationsLoading
                            ? "Chargement des lieux..."
                            : "Sélectionner le lieu d'arrivée"
                }
                value={
                    formData.arrivalLocationId
                }
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                    touched.arrivalLocationId &&
                    errors.arrivalLocationId
                }
                options={arrivalLocations}
                required
                disabled={
                    !formData.routeId ||
                    locationsLoading
                }
            />

            <div className="trip-form__row">
                <Input
                    label="Date de départ"
                    type="date"
                    name="departureDate"
                    id="departureDate"
                    value={formData.departureDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                        touched.departureDate &&
                        errors.departureDate
                    }
                    required
                />

                <Input
                    label="Heure de départ"
                    type="time"
                    name="departureTime"
                    id="departureTime"
                    value={formData.departureTime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                        touched.departureTime &&
                        errors.departureTime
                    }
                    required
                />
            </div>

            <div className="trip-form__row">
                <Input
                    label="Date d'arrivée"
                    type="date"
                    name="arrivalDate"
                    id="arrivalDate"
                    value={formData.arrivalDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                        touched.arrivalDate &&
                        errors.arrivalDate
                    }
                />

                <Input
                    label="Heure d'arrivée"
                    type="time"
                    name="arrivalTime"
                    id="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                        touched.arrivalTime &&
                        errors.arrivalTime
                    }
                />
            </div>

            <Input
                label="Prix du voyage"
                type="number"
                name="price"
                id="price"
                placeholder="Ex : 7500"
                min="1"
                step="1"
                value={formData.price}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                    touched.price &&
                    errors.price
                }
                required
            />

            <Button
                type="submit"
                size="medium"
                variant="primary"
                loading={isSubmitting}
                fullWidth
                disabled={
                    isSubmitting ||
                    routesLoading ||
                    busesLoading ||
                    locationsLoading
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
                        Créer le voyage
                    </span>
                )}
            </Button>
        </form>
    );
}