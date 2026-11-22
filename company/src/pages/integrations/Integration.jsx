import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@shared/contexts/toast.context";

import TgtlHeader from "../../components/tgtl/TgtlHeader";
import TgtlStatusCard from "../../components/tgtl/TgtlStatusCard";
import TgtlOverview from "../../components/tgtl/TgtlOverview";
import TgtlOperationCard from "../../components/tgtl/TgtlOperationCard";

import "../../styles/pages/integrations/Integration.scss";
import useTgtlStatus from "../../hooks/useTgtlStatus";
import { useEffect } from "react";

export default function Integration() {
    const navigate = useNavigate();
    const location = useLocation();

    const { showToast } = useToast();

    const { status, loading, error, refresh } = useTgtlStatus();

    useEffect(() => {
        if (location.state?.imported) {
            refresh();
        }
    }, [location.state, refresh]);

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

                <TgtlStatusCard
                    status={status}
                    loading={loading}
                    error={error}
                    onRefresh={refresh}
                />

                <TgtlOverview
                    status={status}
                    loading={loading}
                />

                <TgtlOperationCard
                    onOperation={handleOperation}
                />

            </div>
        </main>
    );
}