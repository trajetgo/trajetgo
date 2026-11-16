import { useNavigate } from "react-router-dom";

import TgtlHeader from "../../components/tgtl/TgtlHeader";
import TgtlStatusCard from "../../components/tgtl/TgtlStatusCard";
import TgtlOverview from "../../components/tgtl/TgtlOverview";
import TgtlOperationCard from "../../components/tgtl/TgtlOperationCard";

import "../../styles/pages/integrations/Integration.scss";

export default function Integration() {
    const navigate = useNavigate();

    const handleOperation = (operation) => {
        switch (operation) {
            case "import":
                // navigate vers la page d'importation
                navigate('/integrations/tgtl/import');
                break;

            case "export":
                // navigate vers la page d'exportation
                navigate('/integrations/tgtl/export');
                break;

            case "sync":
                // Synchronisation TGTL
                break;

            default:
                break;
        }
    };

    return (
        <main className="tgtl">
            <div className="tgtl__container">

                <TgtlHeader />

                <TgtlStatusCard />

                <TgtlOverview />

                <TgtlOperationCard
                    onOperation={handleOperation}
                />

            </div>
        </main>
    );
}