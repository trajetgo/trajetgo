import {
    Building2,
    MapPin,
    Phone,
    Mail,
    CalendarDays,
    Hash,
    FileText,
} from "lucide-react";

import Modal from "@shared/components/ui/Modal";

import { AGENCY_STATUS } from "../../utils/agency.utils";


const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

export default function AgencyDetailsModal({
    open,
    agency,
    onClose,
}) {
    if (!agency) {
        return null;
    }

    const status =
        AGENCY_STATUS[agency.status] || {
            label: "Inconnu",
            className: "unknown",
        };

    const city =
        agency.location?.city?.name || "—";

    const locationName =
        agency.location?.name || "—";

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={`Détails de ${agency.name}`}
        >
            <div className="agency-details">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="agency-details__header">

                    <div className="agency-details__identity">

                        <div className="agency-details__icon">
                            <Building2 size={24} />
                        </div>

                        <div>
                            <h2>
                                {agency.name}
                            </h2>

                            {agency.code && (
                                <span>
                                    Code : {agency.code}
                                </span>
                            )}
                        </div>

                    </div>

                    <span
                        className={`badge badge--${status.className}`}
                    >
                        {status.label}
                    </span>

                </div>


                {/* =================================================
                    INFORMATIONS
                ================================================= */}

                <div className="agency-details__section">

                    <h3>
                        Informations générales
                    </h3>

                    <div className="agency-details__grid">

                        <div className="agency-details__item">

                            <span className="agency-details__item-icon">
                                <MapPin size={17} />
                            </span>

                            <div>
                                <span>
                                    Ville
                                </span>

                                <strong>
                                    {city}
                                </strong>
                            </div>

                        </div>


                        <div className="agency-details__item">

                            <span className="agency-details__item-icon">
                                <Building2 size={17} />
                            </span>

                            <div>
                                <span>
                                    Localisation
                                </span>

                                <strong>
                                    {locationName}
                                </strong>
                            </div>

                        </div>


                        <div className="agency-details__item">

                            <span className="agency-details__item-icon">
                                <MapPin size={17} />
                            </span>

                            <div>
                                <span>
                                    Adresse
                                </span>

                                <strong>
                                    {agency.location?.address || "—"}
                                </strong>
                            </div>

                        </div>


                        <div className="agency-details__item">

                            <span className="agency-details__item-icon">
                                <Phone size={17} />
                            </span>

                            <div>
                                <span>
                                    Téléphone
                                </span>

                                <strong>
                                    {agency.phone || "—"}
                                </strong>
                            </div>

                        </div>


                        <div className="agency-details__item">

                            <span className="agency-details__item-icon">
                                <Mail size={17} />
                            </span>

                            <div>
                                <span>
                                    Email
                                </span>

                                <strong>
                                    {agency.email || "—"}
                                </strong>
                            </div>

                        </div>


                        <div className="agency-details__item">

                            <span className="agency-details__item-icon">
                                <Hash size={17} />
                            </span>

                            <div>
                                <span>
                                    Identifiant
                                </span>

                                <strong>
                                    {agency.id}
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                {agency.description && (
                    <div className="agency-details__section">

                        <h3>
                            Description
                        </h3>

                        <div className="agency-details__description">

                            <FileText size={17} />

                            <p>
                                {agency.description}
                            </p>

                        </div>

                    </div>
                )}


                {/* =================================================
                    DATES
                ================================================= */}

                <div className="agency-details__section">

                    <h3>
                        Historique
                    </h3>

                    <div className="agency-details__grid">

                        <div className="agency-details__item">

                            <span className="agency-details__item-icon">
                                <CalendarDays size={17} />
                            </span>

                            <div>
                                <span>
                                    Créée le
                                </span>

                                <strong>
                                    {formatDate(
                                        agency.createdAt
                                    )}
                                </strong>
                            </div>

                        </div>


                        <div className="agency-details__item">

                            <span className="agency-details__item-icon">
                                <CalendarDays size={17} />
                            </span>

                            <div>
                                <span>
                                    Dernière modification
                                </span>

                                <strong>
                                    {formatDate(
                                        agency.updatedAt
                                    )}
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </Modal>
    );
}