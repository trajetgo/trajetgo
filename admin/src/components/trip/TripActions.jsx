import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    Eye,
    Play,
    Flag,
    XCircle,
    MoreHorizontal,
} from "lucide-react";

import "../../styles/components/trip/TripActions.scss";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const MENU_WIDTH = 210;
const MENU_GAP = 8;

function computeMenuPosition(trigger) {
    if (!trigger) return { top: 0, left: 0 };

    const rect = trigger.getBoundingClientRect();
    const left = Math.max(8, rect.right - MENU_WIDTH);

    return { top: rect.bottom + MENU_GAP, left };
}

/* ------------------------------------------------------------------ */

export default function TripActions({
    trip,
    onView,
    setSelectedAction,
    setSelectedTrip,
}) {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const menuRef = useRef(null);
    const triggerRef = useRef(null);

    /* ---------- Repositionnement ---------- */

    useEffect(() => {
        if (!open) return;

        setPosition(computeMenuPosition(triggerRef.current));

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

    /* ---------- Guard ---------- */

    if (!trip) return null;

    /* ---------- Handlers ---------- */

    const close = () => setOpen(false);

    const openAction = (action) => {
        close();
        setSelectedTrip?.(trip);
        setSelectedAction?.(action);
    };

    const handleView = () => {
        close();
        onView?.(trip);
    };

    /* ---------- Statut ---------- */

    const status = trip.status;

    const isScheduled = status === "SCHEDULED";
    const isBoarding = status === "BOARDING";
    const isDeparted = status === "DEPARTED";
    const isArrived = status === "ARRIVED";
    const isCancelled = status === "CANCELLED";

    const isTerminal = isArrived || isCancelled;

    /* ---------- Menu (portail) ---------- */

    const menu = open
        ? createPortal(
            <div
                ref={menuRef}
                className="trip-actions__menu"
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
                    className="trip-actions__item"
                    onClick={handleView}
                >
                    <Eye size={16} />
                    <span>Voir les détails</span>
                </button>

                {isScheduled && (
                    <button
                        type="button"
                        role="menuitem"
                        className="trip-actions__item"
                        onClick={() => openAction("START_BOARDING")}
                    >
                        <Play size={16} />
                        <span>Démarrer l'embarquement</span>
                    </button>
                )}

                {isBoarding && (
                    <button
                        type="button"
                        role="menuitem"
                        className="trip-actions__item"
                        onClick={() => openAction("DEPART")}
                    >
                        <Play size={16} />
                        <span>Marquer comme parti</span>
                    </button>
                )}

                {isDeparted && (
                    <button
                        type="button"
                        role="menuitem"
                        className="trip-actions__item"
                        onClick={() => openAction("ARRIVE")}
                    >
                        <Flag size={16} />
                        <span>Marquer comme arrivé</span>
                    </button>
                )}

                {!isTerminal && (
                    <button
                        type="button"
                        role="menuitem"
                        className="trip-actions__item trip-actions__item--danger"
                        onClick={() => openAction("CANCEL")}
                    >
                        <XCircle size={16} />
                        <span>Annuler le voyage</span>
                    </button>
                )}
            </div>,
            document.body
        )
        : null;

    /* ---------- Rendu ---------- */

    return (
        <div className="trip-actions">
            <button
                ref={triggerRef}
                type="button"
                className="trip-actions__trigger"
                title="Actions"
                aria-label={`Actions pour le voyage ${trip.departure?.city ?? ""} → ${trip.arrival?.city ?? ""}`}
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