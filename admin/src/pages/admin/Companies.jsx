import { useState } from "react";
import {
    Plus,
    Search,
    Building2,
    X,
    List,
    LayoutGrid,
} from "lucide-react";

import Loading from "@shared/components/Loading";
import Pagination from "@shared/components/ui/Pagination";

import useCompanies from "../../hooks/useCompanies";

import { STATUS_FILTERS } from "../../utils/company.utils";

import CreateCompanyModal from "../../components/company/CreateCompanyModal";
import CompanyGrid from "../../components/company/CompanyGrid";

import "../../styles/pages/admin/Companies.scss";
import CompanyList from "../../components/company/CompanyList";
import CompanyDetailsModal from "../../components/company/CompanyDetailsModal";

export default function Companies() {
    const {
        loading,
        serverError,
        companies,
        filteredCompanies,
        paginatedCompanies,

        counts,

        search,
        setSearch,

        statusFilter,
        setStatusFilter,

        sort,
        handleSort,

        viewMode,
        changeViewMode,

        updateStatus,
        refresh,

        // Pagination
        pagination,
        changePage,
    } = useCompanies();

    const [selectedAction, setSelectedAction] = useState(null);

    const [selectedCompany, setSelectedCompany] = useState(null);

    const [openModal, setOpenModal] = useState(false);

    if (loading) {
        return (
            <Loading
                message="Chargement des entreprises..."
            />
        );
    }

    const isEmpty = companies.length === 0;

    return (
        <div className="companies">

            <div className="companies__header">

                <div>
                    <h1>Entreprises</h1>

                    <p>
                        Gérez les entreprises qui utilisent votre service.
                    </p>
                </div>

                <button
                    type="button"
                    className="companies__create-button"
                    onClick={() => setOpenModal(true)}
                >
                    <Plus size={18} />
                    Ajouter une entreprise
                </button>

            </div>

            {serverError && (
                <div
                    className="companies__error"
                    role="alert"
                >
                    {serverError}
                </div>
            )}

            {isEmpty ? (
                <section className="companies__empty">

                    <Building2 size={42} />

                    <h2>
                        Aucune entreprise
                    </h2>

                    <p>
                        Commencez par ajouter une entreprise
                        dans votre système.
                    </p>

                </section>
            ) : (
                <>

                    <section className="companies__toolbar">

                        <div className="companies__search">

                            <Search
                                size={18}
                                aria-hidden="true"
                            />

                            <input
                                type="search"
                                placeholder="Rechercher une entreprise..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                aria-label="Rechercher une entreprise"
                            />

                            {search && (
                                <button
                                    type="button"
                                    className="companies__search-clear"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    aria-label="Effacer la recherche"
                                >
                                    <X size={16} />
                                </button>
                            )}

                        </div>


                        <div className="companies__filter">

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                                aria-label="Filtrer les entreprises par statut"
                            >
                                {STATUS_FILTERS.map(
                                    (filter) => (
                                        <option
                                            key={filter.value}
                                            value={filter.value}
                                        >
                                            {filter.label}
                                        </option>
                                    )
                                )}
                            </select>

                        </div>

                        <div className="companies__view-toggle" role="tablist">
                            <button
                                type="button"
                                role="tab"
                                aria-selected={viewMode === "list"}
                                className={`companies__view-btn ${viewMode === "list" ? "companies__view-btn--active" : ""
                                    }`}
                                onClick={() => changeViewMode("list")}
                                aria-label="Vue liste"
                            >
                                <List size={16} />
                            </button>

                            <button
                                type="button"
                                role="tab"
                                aria-selected={viewMode === "grid"}
                                className={`companies__view-btn ${viewMode === "grid" ? "companies__view-btn--active" : ""
                                    }`}
                                onClick={() => changeViewMode("grid")}
                                aria-label="Vue grille"
                            >
                                <LayoutGrid size={16} />
                            </button>
                        </div>

                    </section>

                    {(search ||
                        statusFilter !== "ALL") && (
                            <div className="companies__result-info">

                                <span>
                                    {filteredCompanies.length}{" "}
                                    entreprise
                                    {filteredCompanies.length > 1
                                        ? "s"
                                        : ""}{" "}
                                    trouvée
                                    {filteredCompanies.length > 1
                                        ? "s"
                                        : ""}
                                </span>

                            </div>
                        )}

                    {filteredCompanies.length === 0 ? (
                        <section className="companies__empty">

                            <Building2 size={42} />

                            <h3>
                                Aucune entreprise trouvée
                            </h3>

                            <p>
                                Aucune entreprise ne correspond
                                aux filtres actuels.
                            </p>

                        </section>

                    ) : (

                        <section className="companies__card">

                            {viewMode === "list" && (
                                <CompanyList
                                    companies={companies}
                                    paginatedCompanies={paginatedCompanies}
                                    search={search}
                                    sort={sort}
                                    onSort={handleSort}
                                    setSelectedAction={setSelectedAction}
                                    setSelectedCompany={setSelectedCompany}
                                />
                            )}

                            {viewMode === "grid" && (
                                <CompanyGrid
                                    companies={paginatedCompanies}
                                    search={search}
                                    sort={sort}
                                    onSort={handleSort}
                                    setSelectedAction={setSelectedAction}
                                    setSelectedCompany={setSelectedCompany}
                                />
                            )}

                            <Pagination
                                pagination={pagination}
                                changePage={changePage}
                            />


                        </section>
                    )}

                </>
            )}

            {selectedCompany && selectedAction === "VIEW" && (
                <CompanyDetailsModal 
                    company={selectedCompany}
                    isOpen={!!selectedCompany}
                    onClose={() => setSelectedCompany(null)}
                />
            )}

            <CreateCompanyModal
                onClose={() => setOpenModal(false)}
                open={openModal}
                onCreated={refresh}
            />

        </div>
    )
}
