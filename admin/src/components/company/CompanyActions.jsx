import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    Eye,
    MoreHorizontal,
    Power,
    RotateCcw,
} from "lucide-react";

import "../../styles/components/company/CompanyActions.scss";

const MENU_WIDTH = 210;
const MENU_GAP = 8;
const VIEWPORT_PADDING = 8;

function computeMenuPosition(trigger, menu) {
    if (!trigger) return { top: 0, left: 0 };

    const rect = trigger.getBoundingClientRect();
    const menuHeight = menu?.offsetHeight ?? 140;

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

export default function CompanyActions({
    company,
    onView,
    setSelectedCompany,
    setSelectedAction,
}) {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const menuRef = useRef(null);
    const triggerRef = useRef(null);

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

    useEffect(() => {
        if (!open) return;

        const onClickOutside = (event) => {
            if (
                !menuRef.current?.contains(event.target) &&
                !triggerRef.current?.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        const onEscape = (event) => {
            if (event.key === "Escape") {
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

    if (!company) return null;

    const close = () => setOpen(false);

    const openAction = (action) => {
        close();
        setSelectedCompany?.(company);
        setSelectedAction?.(action);
    };

    const handleView = () => {
        close();
        setSelectedCompany?.(company);
        onView?.(company);
    };

    const isActive = company.status === "ACTIVE";
    const isInactive = company.status === "INACTIVE";

    const menu = open
        ? createPortal(
              <div
                  ref={menuRef}
                  className="company-actions__menu"
                  role="menu"
                  style={{
                      position: "fixed",
                      top: `${position.top}px`,
                      left: `${position.left}px`,
                      width: `${MENU_WIDTH}px`,
                      visibility: position.top === 0 ? "hidden" : "visible",
                  }}
              >
                  <button
                      type="button"
                      role="menuitem"
                      className="company-actions__item"
                      onClick={handleView}
                  >
                      <Eye size={16} />
                      <span>Voir les détails</span>
                  </button>

                  {isActive && (
                      <button
                          type="button"
                          role="menuitem"
                          className="company-actions__item"
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
                          className="company-actions__item"
                          onClick={() => openAction("EDIT_STATUS")}
                      >
                          <RotateCcw size={16} />
                          <span>Réactiver</span>
                      </button>
                  )}
              </div>,
              document.body
          )
        : null;

    return (
        <div className="company-actions">
            <button
                ref={triggerRef}
                type="button"
                className="company-actions__trigger"
                title="Actions"
                aria-label={`Actions pour ${company.name || "cette entreprise"}`}
                aria-expanded={open}
                aria-haspopup="menu"
                onClick={() => setOpen((previous) => !previous)}
            >
                <MoreHorizontal size={18} />
            </button>

            {menu}
        </div>
    );
}