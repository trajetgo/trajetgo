import { useCallback, useEffect, useMemo, useState } from "react";
import service from "../services/tickets.service.js";

const SORT_ACCESSORS = {
    ticketNumber: (ticket) =>
        ticket.ticketNumber ?? "",

    status: (ticket) =>
        ticket.status ?? "",

    issuedAt: (ticket) =>
        new Date(
            ticket.issuedAt ?? 0
        ).getTime(),

    usedAt: (ticket) =>
        new Date(
            ticket.usedAt ?? 0
        ).getTime(),

    createdAt: (ticket) =>
        new Date(
            ticket.createdAt ?? 0
        ).getTime(),

    passengerName: (ticket) =>
        `${ticket.booking?.user?.firstName ?? ""} ${ticket.booking?.user?.lastName ?? ""}`
            .trim()
            .toLowerCase(),

    tripDate: (ticket) =>
        new Date(
            ticket.booking?.trip?.departureAt ?? 0
        ).getTime(),
};

export default function useTickets(filters = {}) {
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [serverError, setServerError] = useState("");

    const [statusFilter, setStatusFilter] = useState("ALL");

    const [search, setSearch] = useState("");

    const [sort, setSort] = useState({
        key: "issuedAt",
        direction: "desc",
    });

    const filtersKey = JSON.stringify(filters);

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        setServerError("");

        try {
            const result =
                await service.getTickets(filters);

            if (!result.success) {
                setTickets([]);

                setServerError(
                    result.message ||
                    "Impossible de charger les billets."
                );

                return;
            }

            setTickets(result.data?.tickets || []);
        } catch (error) {
            setTickets([]);

            setServerError(
                error.message ||
                "Impossible de charger les billets."
            );
        } finally {
            setLoading(false);
        }
    }, [filtersKey]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const filteredTickets = useMemo(() => {
        let data = [...tickets];

        /*
         * -----------------------------------------------------
         * STATUS
         * -----------------------------------------------------
         */

        if (statusFilter !== "ALL") {
            data = data.filter(
                (ticket) =>
                    ticket.status === statusFilter
            );
        }

        /*
         * -----------------------------------------------------
         * SEARCH
         * -----------------------------------------------------
         */

        const term = search
            .trim()
            .toLowerCase();

        if (term) {
            data = data.filter((ticket) => {
                const values = [
                    ticket.id,
                    ticket.ticketNumber,
                    ticket.qrCode,
                    ticket.status,

                    ticket.booking?.user?.firstName,
                    ticket.booking?.user?.lastName,
                    ticket.booking?.user?.phone,

                    ticket.booking?.trip?.id,

                    ticket.booking?.trip?.departureLocation?.city?.name,
                    ticket.booking?.trip?.arrivalLocation?.city?.name,

                    ticket.booking?.seat?.number,
                    ticket.booking?.seat?.name,
                ];

                return values.some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(term)
                );
            });
        }

        /*
         * -----------------------------------------------------
         * SORT
         * -----------------------------------------------------
         */

        const accessor =
            SORT_ACCESSORS[sort.key] ||
            ((ticket) =>
                ticket[sort.key] ?? "");

        data.sort((a, b) => {
            const aValue = accessor(a);
            const bValue = accessor(b);

            if (aValue == null) {
                return 1;
            }

            if (bValue == null) {
                return -1;
            }

            if (aValue < bValue) {
                return sort.direction === "asc"
                    ? -1
                    : 1;
            }

            if (aValue > bValue) {
                return sort.direction === "asc"
                    ? 1
                    : -1;
            }

            return 0;
        });

        return data;
    }, [
        tickets,
        search,
        statusFilter,
        sort,
    ]);

    const handleSort = (key) => {
        setSort((previous) => ({
            key,

            direction:
                previous.key === key &&
                    previous.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    const updateStatus = async (
        id,
        status
    ) => {
        try {
            const result =
                await service.updateStatus(
                    id,
                    status
                );

            if (!result.success) {
                throw new Error(
                    result.message ||
                    "Impossible de modifier le statut du billet."
                );
            }

            setTickets((previous) =>
                previous.map((ticket) => {
                    if (ticket.id !== id) {
                        return ticket;
                    }

                    return {
                        ...ticket,
                        status,

                        usedAt:
                            status === "USED"
                                ? new Date().toISOString()
                                : ticket.usedAt,

                        cancelledAt:
                            status === "CANCELLED"
                                ? new Date().toISOString()
                                : ticket.cancelledAt,
                    };
                })
            );

            return result;
        } catch (error) {
            setServerError(
                error.message ||
                "Impossible de modifier le statut du billet."
            );

            throw error;
        }
    };

    const counts = useMemo(() => {
        return {
            all: tickets.length,

            active: tickets.filter(
                (ticket) =>
                    ticket.status === "ACTIVE"
            ).length,

            used: tickets.filter(
                (ticket) =>
                    ticket.status === "USED"
            ).length,

            cancelled: tickets.filter(
                (ticket) =>
                    ticket.status === "CANCELLED"
            ).length,

            expired: tickets.filter(
                (ticket) =>
                    ticket.status === "EXPIRED"
            ).length,
        };
    }, [tickets]);

    return {
        loading,

        tickets,
        filteredTickets,

        counts,

        serverError,

        search,
        setSearch,

        statusFilter,
        setStatusFilter,

        sort,
        handleSort,

        updateStatus,

        refresh: fetchTickets,
    };
}