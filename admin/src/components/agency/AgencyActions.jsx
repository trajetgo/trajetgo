import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
    Eye,
    MoreHorizontal,
    Power,
    RotateCcw,
    PowerCircle,
} from "lucide-react";

import "../../styles/components/agency/AgencyActions.scss";

/* ------------------------------------------------------------------ */

const MENU_WIDTH = 210;
const MENU_GAP = 8;
const VIEWPORT_PADDING = 8;

function computeMenuPosition(trigger, menu) {
    if (!trigger) return { top: 0, left: 0 };

    const rect = trigger.getBoundingClientRect();
    const menuHeight = menu?.offsetHeight ?? 160;

    const left = Math.max(
        VIEWPORT_PADDING,
        Math.min(
            rect.right - MENU_WIDTH,
            window.innerWidth - MENU_WIDTH - VIEWPORT_PADDING
        )
    );

    const spaceBelow = window.innerHeight - rect.bottom;
    const openAbove =
        spaceBelow < menuHeight + MENU_GAP &&
        rect.top > menuHeight + MENU_GAP;

    const top = openAbove
        ? rect.top - menuHeight - MENU_GAP
        : Math.min(
            rect.bottom + MENU_GAP,
            window.innerHeight - menuHeight - VIEWPORT_PADDING
        );

    return {
        top: Math.max(VIEWPORT_PADDING, top),
        left,
    };
}

export default function AgencyActions({
    agency,
    onView,
    setSelectedAgency,
    setSelectedAction,
}) {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const menuRef = useRef(null);
    const triggerRef = useRef(null);

    /* ---------- Status ---------- */

    const isActive = agency?.status === "ACTIVE";
    const isInactive = agency?.status === "INACTIVE";
    const isClosed = agency?.status === "CLOSED";

    /* ---------- Positionnement ---------- */

    useEffect(() => {
        if (!open) return;

        const updatePosition = () => {
            setPosition(
                computeMenuPosition(triggerRef.current, menuRef.current)
            );
        };

        updatePosition();

        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);

        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [open]);

    /* ---------- Fermeture extérieure et Escape ---------- */

    useEffect(() => {
        if (!open) return;

        const handlePointerDown = (event) => {
            if (
                !menuRef.current?.contains(event.target) &&
                !triggerRef.current?.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
                triggerRef.current?.focus();
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    if (!agency) return null;

    /* ---------- Actions ---------- */

    const close = () => setOpen(false);

    const openAction = (action) => {
        close();
        setSelectedAgency?.(agency);
        setSelectedAction?.(action);
    };

    const handleView = () => {
        close();
        setSelectedAgency?.(agency);
        onView?.(agency);
    };

    /* ---------- Menu en portail ---------- */

    const menu = open
        ? createPortal(
            <div
                ref={menuRef}
                className="agency-actions__menu"
                role="menu"
                style={{
                    position: "fixed",
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                    width: `${MENU_WIDTH}px`,
                    zIndex: 1100,
                    visibility: position.top === 0 ? "hidden" : "visible",
                }}
            >
                <button
                    type="button"
                    role="menuitem"
                    className="agency-actions__item"
                    onClick={handleView}
                >
                    <Eye size={16} />
                    <span>Voir les détails</span>
                </button>

                {isActive && (
                    <button
                        type="button"
                        role="menuitem"
                        className="agency-actions__item"
                        onClick={() => openAction("EDIT_STATUS")}
                    >
                        <Power size={16} />
                        <span>Désactiver</span>
                    </button>
                )}

                {isInactive && (
                    <button
                        type="button"
                        role="menuitem"
                        className="agency-actions__item"
                        onClick={() => openAction("EDIT_STATUS")}
                    >
                        <RotateCcw size={16} />
                        <span>Réactiver</span>
                    </button>
                )}

                {!isClosed && (
                    <button
                        type="button"
                        role="menuitem"
                        className="agency-actions__item"
                        onClick={() => openAction("EDIT_STATUS")}
                    >
                        <PowerCircle size={16} />
                        <span>Fermer</span>
                    </button>
                )}
            </div>,
            document.body
        )
        : null;

    return (
        <div className="agency-actions">
            <button
                ref={triggerRef}
                type="button"
                className="agency-actions__trigger"
                title="Actions"
                aria-label={`Actions pour ${agency.name || "cette agence"}`}
                aria-expanded={open}
                aria-haspopup="menu"
                onClick={() => setOpen((current) => !current)}
            >
                <MoreHorizontal size={18} />
            </button>

            {menu}
        </div>
    );
}