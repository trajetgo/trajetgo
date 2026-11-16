import { useState } from "react";
import {
    Plus,
    Search,
    Ticket,
    X,
} from "lucide-react";

import Loading from "@shared/components/Loading";

import useTickets from "../../hooks/useTickets";
import TicketTable from "../../components/ticket/TicketTable";
import { TICKET_STATUS_FILTERS } from "../../utils/ticket.utils";
import SellTicketModal from "../../components/ticket/SellTicketModal";

import "../../styles/pages/company/Ticketing.scss";

export default function Ticketing() {
    const {
        loading,
        serverError,

        filteredTickets,
        counts,

        search,
        setSearch,

        statusFilter,
        setStatusFilter,

        sort,
        handleSort,

        refresh,
    } = useTickets();

    const [
        selectedTicket,
        setSelectedTicket,
    ] = useState(null);

    const [
        selectedAction,
        setSelectedAction,
    ] = useState(null);

    const [openSellModal, setOpenSellModal] = useState(false);

    const hasActiveFilters =
        Boolean(search) || statusFilter !== "ALL";

    if (loading) {
        return (
            <Loading
                message="Chargement des billets..."
            />
        );
    }

    return (
        <div className="ticketing">

            <header className="ticketing__header">

                <div>
                    <h1>
                        Billetterie
                    </h1>

                    <p>
                        Consultez et gérez les billets
                        vendus par votre agence.
                    </p>
                </div>

                <button
                    type="button"
                    className="ticketing__create-button"
                    onClick={() => setOpenSellModal(true)}
                >
                    <Plus size={18} /> Vendre un billet
                </button>

            </header>

            {serverError && (
                <div
                    className="ticketing__error"
                    role="alert"
                >
                    {serverError}
                </div>
            )}

            <section className="ticketing__stats">

                <div className="ticketing__stat">
                    <span>
                        Tous
                    </span>

                    <strong>
                        {counts.all}
                    </strong>
                </div>

                <div className="ticketing__stat ticketing__stat--success">
                    <span>
                        Valides
                    </span>

                    <strong>
                        {counts.active}
                    </strong>
                </div>

                <div className="ticketing__stat ticketing__stat--info">
                    <span>
                        Utilisés
                    </span>

                    <strong>
                        {counts.used}
                    </strong>
                </div>

                <div className="ticketing__stat ticketing__stat--danger">
                    <span>
                        Annulés
                    </span>

                    <strong>
                        {counts.cancelled}
                    </strong>
                </div>

            </section>

            <section className="ticketing__toolbar">

                <div className="ticketing__search">

                    <Search size={18} />

                    <input
                        type="search"
                        placeholder="Rechercher un billet, passager, téléphone..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() =>
                                setSearch("")
                            }
                            aria-label="Effacer la recherche"
                        >
                            <X size={16} />
                        </button>
                    )}

                </div>

                <div className="ticketing__filter">
                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                    >
                        {TICKET_STATUS_FILTERS.map(
                            (filter) => (
                                <option
                                    key={filter.value}
                                    value={
                                        filter.value
                                    }
                                >
                                    {filter.label}
                                </option>
                            )
                        )}
                    </select>
                </div>

            </section>

            {hasActiveFilters && (
                <div className="ticketing__result-info">    {/* ✅ au lieu de trips__result-info */}
                    <span>
                        {filteredTickets.length} billet
                        {filteredTickets.length > 1 ? "s" : ""} trouvé
                        {filteredTickets.length > 1 ? "s" : ""}
                    </span>
                </div>
            )}

            {filteredTickets.length === 0 ? (
                <section className="ticketing__empty">

                    <Ticket size={42} />

                    <h2>
                        Aucun billet trouvé
                    </h2>

                    <p>
                        Aucun billet ne correspond
                        aux critères actuels.
                    </p>

                </section>
            ) : (
                <section className="ticketing__card">

                    <TicketTable
                        tickets={
                            filteredTickets
                        }
                        search={search}
                        sort={sort}
                        onSort={handleSort}
                        setSelectedTicket={
                            setSelectedTicket
                        }
                        setSelectedAction={
                            setSelectedAction
                        }
                    />

                </section>
            )}

            {/* Détails + actions à brancher ici */}

            <SellTicketModal
                open={openSellModal}
                onClose={() => setOpenSellModal(false)}
                onSold={() => {
                    refresh();
                    // le reçu reste affiché dans le modal tant que l'utilisateur ne ferme pas
                }}
            />
        </div>
    );
}