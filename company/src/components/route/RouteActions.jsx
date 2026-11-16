import { Eye, Power, Pencil } from "lucide-react";

import "../../styles/components/route/RouteActions.scss";

export default function RouteActions({
    route,
    onView,
    setSelectedRoute,
    setSelectedAction,
}) {
    const isActive = route.active;

    const handleView = () => {
        setSelectedRoute?.(route);
        setSelectedAction?.("VIEW");
    };

    const handleEdit = () => {
        setSelectedRoute?.(route);
        setSelectedAction?.("EDIT");
    };

    const handleToggleStatus = () => {
        setSelectedRoute?.(route);
        setSelectedAction?.(isActive ? "DEACTIVATE" : "ACTIVATE");
    };

    return (
        <div className="route-actions">
            <button
                type="button"
                className="route-actions__btn"
                title="Voir les détails"
                aria-label={`Voir la ligne ${route.originCity?.name} → ${route.destinationCity?.name}`}
                onClick={handleView}
            >
                <Eye size={16} />
            </button>

            <button
                type="button"
                className="route-actions__btn"
                title="Modifier"
                aria-label={`Modifier la ligne`}
                onClick={handleEdit}
            >
                <Pencil size={16} />
            </button>

            <button
                type="button"
                className={`route-actions__btn ${
                    isActive
                        ? "route-actions__btn--warning"
                        : "route-actions__btn--success"
                }`}
                title={isActive ? "Désactiver" : "Activer"}
                aria-label={isActive ? "Désactiver la ligne" : "Activer la ligne"}
                onClick={handleToggleStatus}
            >
                <Power size={16} />
            </button>
        </div>
    );
}