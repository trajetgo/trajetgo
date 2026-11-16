import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    FileSpreadsheet,
    LoaderCircle,
    ShieldCheck,
    XCircle
} from "lucide-react";

import { SHEET_LABELS } from "../../../utils/tgtl.utils";

import "../../../styles/components/tgtl/import/ImportConfirmationStep.scss";

export default function ImportConfirmationStep({
    analysis,
    selectedFile,
    loading = false,
    error = "",
    result = null
}) {
    if (!analysis) {
        return (
            <div className="tgtl-confirmation__empty">
                <FileSpreadsheet size={28} />
                <h3>Aucune analyse disponible</h3>
                <p>Lancez d'abord l'analyse d'un fichier.</p>
            </div>
        );
    }

    const summary = analysis.summary || {};
    const sheets = (analysis.sheets || []).filter(
        (sheet) => (sheet.totalRows ?? 0) > 0
    );

    const totalRows = summary.totalRows ?? 0;
    const warningRows = summary.warningRows ?? 0;

    // Import terminé.
    if (result) {
        return (
            <div className="tgtl-confirmation">
                <div className="tgtl-confirmation__done">
                    <div className="tgtl-confirmation__done-icon">
                        <CheckCircle2 size={34} />
                    </div>

                    <h3>Import terminé</h3>

                    <p>
                        Les données de votre organisation ont été importées
                        dans Trajet Go. Aucun voyage n'a été publié
                        automatiquement : vérifiez vos programmations avant
                        de les ouvrir à la vente.
                    </p>
                </div>

                <ul className="tgtl-confirmation__sheets">
                    {sheets.map((sheet) => (
                        <li key={sheet.name}>
                            <div className="tgtl-confirmation__sheet-name">
                                <FileSpreadsheet size={16} />
                                <span>{SHEET_LABELS[sheet.name] || sheet.name}</span>
                            </div>

                            <span className="is-valid">
                                <CheckCircle2 size={14} />
                                {sheet.totalRows} ligne(s)
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <div className="tgtl-confirmation">

            <div className="tgtl-confirmation__heading">
                <h3>Confirmer l'importation</h3>

                <p>
                    Dernière vérification avant l'enregistrement. Les données
                    seront créées dans votre organisation Trajet Go.
                </p>
            </div>

            {selectedFile && (
                <div className="tgtl-confirmation__file">
                    <FileSpreadsheet size={18} />

                    <div>
                        <strong>{selectedFile.name}</strong>
                        <span>
                            {sheets.length} feuille(s) · {totalRows} ligne(s)
                        </span>
                    </div>
                </div>
            )}

            <ul className="tgtl-confirmation__sheets">
                {sheets.map((sheet) => (
                    <li key={sheet.name}>
                        <div className="tgtl-confirmation__sheet-name">
                            <FileSpreadsheet size={16} />
                            <span>{SHEET_LABELS[sheet.name] || sheet.name}</span>
                        </div>

                        <span className={sheet.warningRows > 0 ? "is-warning" : "is-valid"}>
                            {sheet.warningRows > 0
                                ? <AlertTriangle size={14} />
                                : <CheckCircle2 size={14} />}
                            {sheet.totalRows} ligne(s)
                        </span>
                    </li>
                ))}
            </ul>

            {warningRows > 0 && (
                <div className="tgtl-confirmation__warning">
                    <AlertTriangle size={18} />

                    <p>
                        {warningRows} ligne(s) comportent des avertissements que
                        vous avez acceptés à l'étape précédente.
                    </p>
                </div>
            )}

            <div className="tgtl-confirmation__guarantees">
                <ShieldCheck size={18} />

                <ul>
                    <li>Le fichier est de nouveau vérifié par le serveur avant l'enregistrement.</li>
                    <li>Votre organisation est déterminée par votre compte, pas par le fichier.</li>
                    <li>Aucun mot de passe n'est importé : les membres du personnel reçoivent une invitation sécurisée.</li>
                    <li>Aucun voyage n'est publié automatiquement.</li>
                </ul>
            </div>

            {error && (
                <div className="tgtl-confirmation__error" role="alert">
                    <XCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {loading && (
                <div className="tgtl-confirmation__loading" role="status">
                    <LoaderCircle size={18} className="is-spinning" />
                    <span>Importation en cours, ne fermez pas cette page…</span>
                </div>
            )}

            <div className="tgtl-confirmation__notice">
                <AlertCircle size={18} />

                <p>
                    Cette action crée des données dans votre organisation.
                    Elle ne peut pas être annulée automatiquement.
                </p>
            </div>

        </div>
    );
}