import { useState } from "react";
import { Eye, QrCode, CheckCircle2, XCircle, MoreHorizontal } from "lucide-react";

import "../../styles/components/ticket/TicketActions.scss";

export default function TicketActions({
    ticket,
    onView,
    setSelectedAction,
    setSelectedTicket,
}) {
    const [open, setOpen] = useState(false);

    const status = ticket.status;

    const canBeUsed = status === "ACTIVE";
    const canBeCancelled = status === "ACTIVE";

    const openAction = (action) => {
        setSelectedTicket(ticket);
        setSelectedAction(action);
        setOpen(false);
    };

    const handleView = () => {
        setOpen(false);
        onView?.(ticket);
    };

    const toggleMenu = () => {
        setOpen((previous) => !previous);
    };

    return (
        <div className="ticket-actions">
            <button
                type="button"
                className="ticket-actions__trigger"
                title="Actions"
                aria-label={`Actions pour ${ticket?.ticketNumber
                    }`}
                aria-expanded={open}
                aria-haspopup="menu"
                onClick={toggleMenu}
            >
                <MoreHorizontal size={18} />
            </button>

            {open && (
                <div
                    className="ticket-actions__menu"
                    role="menu"
                >
                    {/* Voir */}
                    <button
                        type="button"
                        className="ticket-actions__btn ticket-actions__btn--neutral"
                        title="Voir les détails"
                        aria-label={`Voir les détails du billet ${ticket.ticketNumber ?? ""}`}
                        onClick={handleView}
                    >
                        <Eye size={16} />
                    </button>

                    {/* Afficher le QR */}
                    <button
                        type="button"
                        className="ticket-actions__btn ticket-actions__btn--neutral"
                        title="Afficher le QR code"
                        aria-label={`Afficher le QR code du billet ${ticket.ticketNumber ?? ""}`}
                        onClick={() => openAction("SHOW_QR")}
                    >
                        <QrCode size={16} />
                    </button>

                    {/* Marquer comme utilisé */}
                    <button
                        type="button"
                        className="ticket-actions__btn ticket-actions__btn--success"
                        title="Marquer comme utilisé"
                        aria-label={`Marquer le billet ${ticket.ticketNumber ?? ""} comme utilisé`}
                        disabled={!canBeUsed}
                        onClick={() => openAction("MARK_USED")}
                    >
                        <CheckCircle2 size={16} />
                    </button>

                    {/* Annuler */}
                    <button
                        type="button"
                        className="ticket-actions__btn ticket-actions__btn--danger"
                        title="Annuler le billet"
                        aria-label={`Annuler le billet ${ticket.ticketNumber ?? ""}`}
                        disabled={!canBeCancelled}
                        onClick={() => openAction("CANCEL")}
                    >
                        <XCircle size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}