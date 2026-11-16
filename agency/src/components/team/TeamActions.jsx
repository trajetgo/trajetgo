import {
    Eye,
    MoreHorizontal,
    Pencil,
    ShieldCheck,
    UserCheck,
    UserX,
} from "lucide-react";
import { useState } from "react";
import "../../styles/components/team/TeamActions.scss";

export default function TeamActions({
    member,
    onView,
    setSelectedAction,
    setSelectedMember,
}) {
    const [open, setOpen] = useState(false);

    const openAction = (action) => {
        setSelectedMember(member);
        setSelectedAction(action);
        setOpen(false);
    };

    const handleView = () => {
        setOpen(false);
        onView?.(member);
    };

    const toggleMenu = () => {
        setOpen((previous) => !previous);
    };

    const isActive = member?.status === "ACTIVE";

    return (
        <div className="team-actions">
            <button
                type="button"
                className="team-actions__trigger"
                title="Actions"
                aria-label={`Actions pour ${member?.firstName || "ce membre"
                    }`}
                aria-expanded={open}
                aria-haspopup="menu"
                onClick={toggleMenu}
            >
                <MoreHorizontal size={18} />
            </button>

            {open && (
                <div
                    className="team-actions__menu"
                    role="menu"
                >
                    <button
                        type="button"
                        className="team-actions__item"
                        role="menuitem"
                        onClick={handleView}
                    >
                        <Eye size={16} />
                        <span>Voir les détails</span>
                    </button>

                    <button
                        type="button"
                        className="team-actions__item"
                        role="menuitem"
                        onClick={() =>
                            openAction("EDIT_ROLE")
                        }
                    >
                        <Pencil size={16} />
                        <span>Modifier le rôle</span>
                    </button>

                    <button
                        type="button"
                        className="team-actions__item"
                        role="menuitem"
                        onClick={() =>
                            openAction("EDIT_STATUS")
                        }
                    >
                        {isActive ? (
                            <UserX size={16} />
                        ) : (
                            <UserCheck size={16} />
                        )}

                        <span>
                            {isActive
                                ? "Désactiver"
                                : "Activer"}
                        </span>
                    </button>

                    <button
                        type="button"
                        className="team-actions__item"
                        role="menuitem"
                        onClick={() =>
                            openAction("VIEW_PERMISSIONS")
                        }
                    >
                        <ShieldCheck size={16} />
                        <span>Permissions</span>
                    </button>
                </div>
            )}
        </div>
    );
}