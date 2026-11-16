import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";


import "../styles/pages/Dashboard.scss";

export default function Dashboard() {
    const navigate = useNavigate();

    const handleOrganizationSync = () => {
        // Ouvrir la page ou la modal de synchronisation TGTL
        navigate("/integrations/tgtl");
    };

    const handleNewDeparture = () => {
        // Ouvrir le formulaire de création d'un départ
    };

    return (
        <div className="dashboard">
            <div className="dashboard__container">

                <div className="dashboard__header">
                    <div className="dashboard__heading">
                        <h3>Direction Compagnie de Transport</h3>
                        <p>
                            Supervisez l'ensemble de vos activités de transport : gestion des agences, programmation des voyages, billetterie, parc automobile et suivi des performances.
                        </p>
                    </div>

                    <div className="dashboard__actions">
                        <button
                            type="button"
                            className="dashboard__sync"
                            onClick={handleOrganizationSync}
                        >
                            <RefreshCw size={17} />
                            <span>Synchroniser mon organisation</span>
                        </button>

                        <button
                            type="button"
                            className="dashboard__create"
                            onClick={handleNewDeparture}
                        >
                            <Plus size={17} />
                            Nouveau départ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
