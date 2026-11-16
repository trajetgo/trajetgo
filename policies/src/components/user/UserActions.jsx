import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    Eye,
    Pencil,
    ShieldCheck,
    Power,
    RotateCcw,
    Ban,
    MoreHorizontal,
} from "lucide-react";

import "../../styles/components/user/UserActions.scss";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const MENU_WIDTH = 220;
const MENU_GAP = 8;

function computeMenuPosition(trigger) {
    if (!trigger) return { top: 0, left: 0 };

    const rect = trigger.getBoundingClientRect();
    const left = Math.max(8, rect.right - MENU_WIDTH);

    return { top: rect.bottom + MENU_GAP, left };
}

/* ------------------------------------------------------------------ */

export default function UserActions({
    user,
    setSelectedUser,
    setSelectedAction,
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

    if (!user) return null;

    /* ---------- Handlers ---------- */

    const close = () => setOpen(false);

    const openAction = (action) => {
        close();
        setSelectedUser?.(user);
        setSelectedAction?.(action);
    };

    /* ---------- Statuts ---------- */

    const isActive = user.status === "ACTIVE";
    const isInactive = user.status === "INACTIVE";
    const isSuspended = user.status === "SUSPENDED";
    const isInvited = user.status === "INVITED";

    const canSuspend = isActive || isInactive;
    const canReactivate = isInactive || isSuspended;

    /* ---------- Menu (portail) ---------- */

    const menu = open
        ? createPortal(
              <div
                  ref={menuRef}
                  className="user-actions__menu"
                  role="menu"
                  style={{
                      position: "fixed",
                      top: `${position.top}px`,
                      left: `${position.left}px`,
                      width: `${MENU_WIDTH}px`,
                  }}
              >
                  {/* Voir */}
                  <button
                      type="button"
                      role="menuitem"
                      className="user-actions__item"
                      onClick={() => openAction("VIEW")}
                  >
                      <Eye size={16} />
                      <span>Voir les détails</span>
                  </button>

                  {/* Modifier */}
                  <button
                      type="button"
                      role="menuitem"
                      className="user-actions__item"
                      onClick={() => openAction("EDIT")}
                  >
                      <Pencil size={16} />
                      <span>Modifier</span>
                  </button>

                  {/* Changer le rôle */}
                  <button
                      type="button"
                      role="menuitem"
                      className="user-actions__item"
                      onClick={() => openAction("EDIT_ROLE")}
                  >
                      <ShieldCheck size={16} />
                      <span>Changer le rôle</span>
                  </button>

                  {/* Séparateur */}
                  <span className="user-actions__divider" aria-hidden="true" />

                  {/* Statut : Désactiver / Réactiver */}
                  {canReactivate && (
                      <button
                          type="button"
                          role="menuitem"
                          className="user-actions__item user-actions__item--success"
                          onClick={() => openAction("ACTIVATE")}
                      >
                          <RotateCcw size={16} />
                          <span>Réactiver</span>
                      </button>
                  )}

                  {isActive && (
                      <button
                          type="button"
                          role="menuitem"
                          className="user-actions__item"
                          onClick={() => openAction("DEACTIVATE")}
                      >
                          <Power size={16} />
                          <span>Désactiver</span>
                      </button>
                  )}

                  {canSuspend && (
                      <button
                          type="button"
                          role="menuitem"
                          className="user-actions__item user-actions__item--danger"
                          onClick={() => openAction("SUSPEND")}
                      >
                          <Ban size={16} />
                          <span>Suspendre</span>
                      </button>
                  )}
              </div>,
              document.body
          )
        : null;

    /* ---------- Rendu ---------- */

    return (
        <div className="user-actions">
            <button
                ref={triggerRef}
                type="button"
                className="user-actions__trigger"
                title="Actions"
                aria-label={`Actions pour ${user.firstName ?? ""} ${
                    user.lastName ?? ""
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