import { useEffect, useRef, useState } from "react";
import {
    Armchair,
    Eye,
    MoreHorizontal,
    Pencil,
    Power,
    RotateCcw,
} from "lucide-react";

import "../../styles/components/bus/BusActions.scss";

export default function BusActions({
    bus,
    onView,
    setSelectedAction,
    setSelectedBus,
}) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const triggerRef = useRef(null);

    /* ---------- Fermeture extérieure ---------- */

    useEffect(() => {
        if (!open) return;

        const onClickOutside = (e) => {
            if (
                !menuRef.current?.contains(e.target) &&
                !triggerRef.current?.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        const onEscape = (e) => {
            if (e.key === "Escape") {
                setOpen(false);
                triggerRef.current?.focus();
            }
        };

        document.addEventListener("mousedown", onClickOutside);
        document.addEventListener("keydown", onEscape);

        return () => {
            document.removeEventListener("mousedown", onClickOutside);
            document.removeEventListener("keydown", onEscape);
        };
    }, [open]);

    /* ---------- Handlers ---------- */

    const close = () => setOpen(false);

    const openAction = (action) => {
        close();
        setSelectedBus(bus);
        setSelectedAction(action);
    };

    const handleView = () => {
        close();
        onView?.(bus);
    };

    /* ---------- Status ---------- */

    const isActive = bus?.status === "ACTIVE";
    const isInactive = bus?.status === "INACTIVE";
    const isRetired = bus?.status === "RETIRED";

    return (
        <div className="bus-actions">
            <button
                ref={triggerRef}
                type="button"
                className="bus-actions__trigger"
                title="Actions"
                aria-label={`Actions pour ${bus?.name || bus?.registrationNumber || "ce bus"
                    }`}
                aria-expanded={open}
                aria-haspopup="menu"
                onClick={() => setOpen((v) => !v)}
            >
                <MoreHorizontal size={18} />
            </button>

            {open && (
                <div ref={menuRef} className="bus-actions__menu" role="menu">
                    <button
                        type="button"
                        role="menuitem"
                        className="bus-actions__item"
                        onClick={handleView}
                    >
                        <Eye size={16} />
                        <span>Voir les détails</span>
                    </button>

                    <button
                        type="button"
                        role="menuitem"
                        className="bus-actions__item"
                        onClick={() => openAction("EDIT")}
                    >
                        <Pencil size={16} />
                        <span>Modifier</span>
                    </button>

                    <button
                        type="button"
                        role="menuitem"
                        className="bus-actions__item"
                        onClick={() => openAction("MANAGE_SEATS")}
                    >
                        <Armchair size={16} />
                        <span>Gérer les sièges</span>
                    </button>

                    {!isRetired && (
                        <button
                            type="button"
                            role="menuitem"
                            className="bus-actions__item"
                            onClick={() => openAction("EDIT_STATUS")}
                        >
                            {isActive ? (
                                <Power size={16} />
                            ) : (
                                <RotateCcw size={16} />
                            )}

                            <span>
                                {isActive
                                    ? "Désactiver"
                                    : isInactive
                                        ? "Réactiver"
                                        : "Modifier le statut"}
                            </span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}