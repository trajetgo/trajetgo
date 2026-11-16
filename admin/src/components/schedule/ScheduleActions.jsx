import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    Eye,
    Pencil,
    Play,
    Pause,
    Trash2,
    MoreHorizontal,
} from "lucide-react";

import "../../styles/components/schedule/ScheduleActions.scss";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const MENU_WIDTH = 210;
const MENU_GAP = 8;

function computeMenuPosition(trigger) {
    if (!trigger) return { top: 0, left: 0 };

    const rect = trigger.getBoundingClientRect();
    const left = Math.max(8, rect.right - MENU_WIDTH);

    return {
        top: rect.bottom + MENU_GAP,
        left,
    };
}

/* ------------------------------------------------------------------ */

export default function ScheduleActions({
    schedule,
    onView,
    setSelectedAction,
    setSelectedSchedule,
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

    if (!schedule) return null;

    /* ---------- Handlers ---------- */

    const close = () => setOpen(false);

    const openAction = (action) => {
        close();
        setSelectedSchedule?.(schedule);
        setSelectedAction?.(action);
    };

    const handleView = () => {
        close();
        setSelectedSchedule?.(schedule);   // ✅
        onView?.(schedule);
    };

    /* ---------- Statut ---------- */

    const isActive = schedule.active;

    /* ---------- Menu (portail) ---------- */

    const menu = open
        ? createPortal(
            <div
                ref={menuRef}
                className="schedule-actions__menu"    // ✅
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
                    className="schedule-actions__item"
                    onClick={handleView}
                >
                    <Eye size={16} />
                    <span>Voir les détails</span>
                </button>

                <button
                    type="button"
                    role="menuitem"
                    className="schedule-actions__item"
                    onClick={() => openAction("EDIT")}
                >
                    <Pencil size={16} />
                    <span>Modifier</span>
                </button>

                {/* ✅ Pause / Reprendre */}
                <button
                    type="button"
                    role="menuitem"
                    className="schedule-actions__item"
                    onClick={() =>
                        openAction(isActive ? "PAUSE" : "RESUME")
                    }
                >
                    {isActive ? (
                        <>
                            <Pause size={16} />
                            <span>Mettre en pause</span>
                        </>
                    ) : (
                        <>
                            <Play size={16} />
                            <span>Reprendre</span>
                        </>
                    )}
                </button>

                {/* ✅ Supprimer (danger) */}
                <button
                    type="button"
                    role="menuitem"
                    className="schedule-actions__item schedule-actions__item--danger"
                    onClick={() => openAction("DELETE")}
                >
                    <Trash2 size={16} />
                    <span>Supprimer</span>
                </button>
            </div>,
            document.body
        )
        : null;

    /* ---------- Rendu ---------- */

    return (
        <div className="schedule-actions">
            <button
                ref={triggerRef}
                type="button"
                className="schedule-actions__trigger"
                title="Actions"
                aria-label={`Actions pour la programmation ${schedule?.route?.origin ?? ""
                    } → ${schedule?.route?.destination ?? ""}`}
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