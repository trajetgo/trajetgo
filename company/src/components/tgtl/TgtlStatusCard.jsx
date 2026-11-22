
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

import Loading from "@shared/components/Loading";
import { formatTimeAgo } from "@shared/utils/date.utils";

export default function TgtlStatusCard({
    status,
    loading,
    error,
    onRefresh
}) {

    if (loading) {
        return <Loading message="Chargement de votre organisation..." />
    }

    if (error) {
        return (
            <section className="tgtl-status tgtl-status--error">
                <div className="tgtl-status__icon">
                    <AlertCircle size={21} />
                </div>
                <div className="tgtl-status__content">
                    <h4>État indisponible</h4>
                    <p>{error}</p>
                </div>
                <button type="button" onClick={onRefresh} className="tgtl-status__refresh">
                    <RefreshCw size={15} />
                    Réessayer
                </button>
            </section>
        );
    }

    const synced = Boolean(status?.synced);

    if (!synced) {
        return (
            <section className="tgtl-status tgtl-status--pending">
                <div className="tgtl-status__icon">
                    <RefreshCw size={21} />
                </div>
                <div className="tgtl-status__content">
                    <h4>État de votre organisation</h4>
                    <p>
                        Votre organisation n'a pas encore été synchronisée
                        avec un système externe. Commencez par importer
                        un fichier TGTL.
                    </p>
                </div>
                <span className="tgtl-status__badge tgtl-status__badge--pending">
                    Non synchronisé
                </span>
            </section>
        );
    }

    const relative = formatTimeAgo(status.lastSyncAt);

    return (
        <section className="tgtl-status tgtl-status--synced">
            <div className="tgtl-status__icon">
                <CheckCircle2 size={21} />
            </div>

            <div className="tgtl-status__content">
                <h4>Organisation synchronisée</h4>
                <p>
                    Dernière importation {relative} · {status.resources.total}{" "}
                    ressource{status.resources.total > 1 ? "s" : ""} synchronisée
                    {status.resources.total > 1 ? "s" : ""}.
                </p>
            </div>

            <span className="tgtl-status__badge tgtl-status__badge--synced">
                Synchronisé
            </span>
        </section>
    );
}
