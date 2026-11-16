import { formatDate } from "@shared/utils/date.utils";
import HighlightText from "@shared/components/ui/HighlightText";
import Table from "@shared/components/ui/Table";
import Avatar from "@shared/components/ui/Avatar";

import { TICKET_STATUS } from "../../utils/ticket.utils";
import TicketActions from "./TicketActions";

import "../../styles/components/ticket/TicketTable.scss";

export default function TicketTable({
    tickets,
    search,
    sort,
    onSort,
    setSelectedAction,
    setSelectedTicket,
}) {
    const formatStatus = (status) => {
        return (
            TICKET_STATUS[status] || {
                class: "unknown",
                label: "Inconnu",
            }
        );
    };

    const formatPrice = (value) => {
        if (
            value === null ||
            value === undefined
        ) {
            return "—";
        }

        return `${new Intl.NumberFormat(
            "fr-FR"
        ).format(value)} FCFA`;
    };

    const columns = [
        {
            key: "ticketNumber",
            label: "Billet",
            sortable: true,

            render: (_, ticket) => (
                <div className="ticket-table__ticket-number">
                    <HighlightText
                        as="strong"
                        text={ticket.ticketNumber}
                        search={search}
                    />

                    <div>
                        <span>
                            {ticket.issuedAt
                                ? formatDate(
                                    ticket.issuedAt,
                                    "dd MMM yyyy"
                                )
                                : "—"}
                        </span>

                        <span>à</span>

                        <span>
                            {ticket.issuedAt
                                ? formatDate(
                                    ticket.issuedAt,
                                    "HH:mm"
                                )
                                : "—"}
                        </span>
                    </div>
                </div>
            ),
        },

        {
            key: "passengerName",
            label: "Passager",
            sortable: true,

            render: (_, ticket) => {
                const user =
                    ticket.booking?.user;

                const name =
                    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`
                        .trim();

                return (
                    <div className="ticket-table__passenger">
                        <Avatar
                            name={name}
                            size="sm"
                        />

                        <div>
                            <HighlightText
                                as="strong"
                                text={name || "—"}
                                search={search}
                            />

                            <span>
                                {user?.phone || "—"}
                            </span>
                        </div>
                    </div>
                );
            },
        },

        {
            key: "tripDate",
            label: "Voyage",
            sortable: true,

            render: (_, ticket) => {
                const trip =
                    ticket.booking?.trip;

                return (
                    <div className="ticket-table__trip">

                        <strong>
                            {trip?.departureLocation?.city?.name ||
                                "—"}

                            {" → "}

                            {trip?.arrivalLocation?.city?.name ||
                                "—"}
                        </strong>



                        <div>
                            <span>
                                {trip?.departureAt
                                    ? formatDate(
                                        trip.departureAt,
                                        "dd MMM yyyy"
                                    )
                                    : "—"}
                            </span>

                            <span>
                                à
                            </span>

                            <span>
                                {trip?.departureAt
                                    ? formatDate(
                                        trip.departureAt,
                                        "HH:mm"
                                    )
                                    : "—"}
                            </span>

                        </div>

                    </div>
                );
            },
        },

        {
            key: "seat",
            label: "Siège",
            sortable: false,

            render: (_, ticket) => (
                <span className="ticket-table__seat">
                    {ticket.booking?.seat?.number ||
                        ticket.booking?.seat?.name ||
                        "—"}
                </span>
            ),
        },

        {
            key: "amount",
            label: "Montant",
            sortable: true,

            render: (_, ticket) => (
                <span>
                    {formatPrice(
                        ticket.booking?.amount
                    )}
                </span>
            ),
        },

        {
            key: "status",
            label: "Statut",
            sortable: true,

            render: (_, ticket) => {
                const status =
                    formatStatus(
                        ticket.status
                    );

                return (
                    <span
                        className={`badge badge--${status.class}`}
                    >
                        {status.label}
                    </span>
                );
            },
        },

        {
            key: "actions",
            label: "Actions",
            sortable: false,

            render: (_, ticket) => (
                <TicketActions
                    ticket={ticket}
                    onView={() => {
                        setSelectedTicket(ticket);
                        setSelectedAction("VIEW")
                    }}
                    setSelectedAction={setSelectedAction}
                    setSelectedTicket={setSelectedTicket}
                />
            ),
        },
    ];

    return (
        <Table
            className="ticket-table"
            selectable={false}
            columns={columns}
            data={tickets}
            sortable
            onSort={onSort}
            defaultSort={sort}
            emptyMessage="Aucun billet trouvé."
            hoverable
            bordered
        />
    )
}
