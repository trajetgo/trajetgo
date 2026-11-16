import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    Armchair,
    Eye,
    MoreHorizontal,
    Pencil,
    Power,
    RotateCcw,
} from "lucide-react";

import "../../styles/components/bus/BusActions.scss";

/* ------------------------------------------------------------------ */
/* Position du menu                                                    */
/* ------------------------------------------------------------------ */

const MENU_WIDTH = 210;
const MENU_GAP = 8;

function computeMenuPosition(trigger) {
    if (!trigger) return { top: 0, left: 0 };

    const rect = trigger.getBoundingClientRect();

    // Aligner le bord droit du menu sur le bord droit du trigger
    const left = rect.right - MENU_WIDTH;

    // Si le menu dépasse à gauche, aligner sur le bord gauche
    const safeLeft = Math.max(8, left);

    return {
        top: rect.bottom + MENU_GAP,
        left: safeLeft,
    };
}

/* ------------------------------------------------------------------ */

export default function BusActions({
    bus,
    onView,
    setSelectedAction,
    setSelectedBus,
}) {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const menuRef = useRef(null);
    const triggerRef = useRef(null);

    /* ---------- Recalcul de la position à l'ouverture ---------- */

    useEffect(() => {
        if (!open) return;

        setPosition(computeMenuPosition(triggerRef.current));

        // Recalcul au scroll / resize
        const handleReposition = () => {
            setPosition(computeMenuPosition(triggerRef.current));
        };

        window.addEventListener("scroll", handleReposition, true);
        window.addEventListener("resize", handleReposition);

        return () => {
            window.removeEventListener("scroll", handleReposition, true);
            window.removeEventListener("resize", handleReposition);
        };
    }, [open]);

    /* ---------- Fermeture extérieure + Escape ---------- */

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

    /* ---------- Menu (portail) ---------- */

    const menu = open
        ? createPortal(
            <div
                ref={menuRef}
                className="bus-actions__menu bus-actions__menu--portal"
                role="menu"
                style={{
                    position: "fixed",
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                    width: `${MENU_WIDTH}px`,
                }}
            >
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
            </div>,
            document.body
        )
        : null;

    /* ---------- Rendu ---------- */

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

            {menu}
        </div>
    );
}