import { useState } from "react";
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    FileSpreadsheet,
    RefreshCw,
    XCircle
} from "lucide-react";
import { SHEET_LABELS, STATUS_CONFIG } from "../../../utils/tgtl.utils";

function getStatusConfig(status) {
    return STATUS_CONFIG[status] || STATUS_CONFIG.ERROR;
}

function AnalysisStatus({ status }) {
    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
        <span className={`tgtl-analysis__status ${config.className}`}>
            <Icon size={15} />
            {config.label}
        </span>
    );
}

function AnalysisMetric({ label, value, icon: Icon, variant = "" }) {
    return (
        <div className={`tgtl-analysis__metric ${variant}`}>
            <div className="tgtl-analysis__metric-icon">
                <Icon size={19} />
            </div>

            <div>
                <strong>{value ?? 0}</strong>
                <span>{label}</span>
            </div>
        </div>
    );
}

function IssueList({ issues = [], type = "error" }) {
    if (!issues.length) return null;

    const isError = type === "error";

    return (
        <div className={`tgtl-analysis__issues ${isError ? "is-error" : "is-warning"}`}>
            <div className="tgtl-analysis__issues-heading">
                {isError ? (
                    <AlertCircle size={16} />
                ) : (
                    <AlertTriangle size={16} />
                )}

                <strong>
                    {isError ? "Erreurs" : "Avertissements"} ({issues.length})
                </strong>
            </div>

            <ul>
                {issues.map((issue, index) => (
                    <li key={`${issue.code || "issue"}-${issue.row}-${issue.column}-${index}`}>
                        <span>{issue.message}</span>

                        {(issue.row || issue.column) && (
                            <small>
                                {issue.row ? `Ligne ${issue.row}` : ""}
                                {issue.row && issue.column ? " · " : ""}
                                {issue.column || ""}
                            </small>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SheetCard({ sheet }) {
    const [expanded, setExpanded] = useState(
        sheet.status === "ERROR"
    );

    const config = getStatusConfig(sheet.status);
    const errors = sheet.errors || [];
    const warnings = sheet.warnings || [];

    const label =
        sheet.label ||
        SHEET_LABELS[sheet.name] ||
        sheet.name;

    return (
        <div className={`tgtl-analysis__sheet ${config.className}`}>

            <button
                type="button"
                className="tgtl-analysis__sheet-header"
                onClick={() => setExpanded((previous) => !previous)}
                aria-expanded={expanded}
            >
                <div className="tgtl-analysis__sheet-main">
                    <div className="tgtl-analysis__sheet-icon">
                        <FileSpreadsheet size={20} />
                    </div>

                    <div className="tgtl-analysis__sheet-info">
                        <strong>{label}</strong>
                        <span>
                            {sheet.totalRows ?? 0} ligne(s) détectée(s)
                        </span>
                    </div>
                </div>

                <div className="tgtl-analysis__sheet-result">
                    <div className="tgtl-analysis__sheet-counts">
                        {errors.length > 0 && (
                            <span className="is-error">
                                {errors.length} erreur(s)
                            </span>
                        )}

                        {warnings.length > 0 && (
                            <span className="is-warning">
                                {warnings.length} avertissement(s)
                            </span>
                        )}

                        {!errors.length && !warnings.length && (
                            <span className="is-valid">
                                {sheet.validRows ?? 0} ligne(s) valide(s)
                            </span>
                        )}
                    </div>

                    <AnalysisStatus status={sheet.status} />

                    {expanded ? (
                        <ChevronUp size={18} />
                    ) : (
                        <ChevronDown size={18} />
                    )}
                </div>
            </button>

            {expanded && (
                <div className="tgtl-analysis__sheet-details">

                    <div className="tgtl-analysis__sheet-stats">
                        <span>
                            Total : <strong>{sheet.totalRows ?? 0}</strong>
                        </span>

                        <span>
                            Valides : <strong>{sheet.validRows ?? 0}</strong>
                        </span>

                        <span>
                            Erreurs : <strong>{sheet.errorRows ?? 0}</strong>
                        </span>

                        <span>
                            Avertissements : <strong>{sheet.warningRows ?? 0}</strong>
                        </span>
                    </div>

                    <IssueList
                        issues={errors}
                        type="error"
                    />

                    <IssueList
                        issues={warnings}
                        type="warning"
                    />

                    {!errors.length && !warnings.length && (
                        <div className="tgtl-analysis__sheet-success">
                            <CheckCircle2 size={16} />
                            Aucune anomalie détectée dans cette feuille.
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}

export default function ImportAnalysisStep({
    analysis,
    loading = false,
    error = "",
    onRetry
}) {
    if (loading) {
        return (
            <div className="tgtl-analysis">
                <div className="tgtl-analysis__loading">
                    <div className="tgtl-analysis__loading-icon">
                        <RefreshCw size={30} className="is-spinning" />
                    </div>

                    <h3>Analyse de votre fichier en cours</h3>

                    <p>
                        Nous vérifions la structure du classeur, les données
                        et les relations entre les différentes feuilles.
                    </p>

                    <span>
                        Veuillez patienter quelques instants.
                    </span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tgtl-analysis">
                <div className="tgtl-analysis__failure">
                    <div className="tgtl-analysis__failure-icon">
                        <AlertCircle size={27} />
                    </div>

                    <h3>Impossible d'analyser le fichier</h3>

                    <p>{error}</p>

                    {onRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                        >
                            <RefreshCw size={16} />
                            Réessayer l'analyse
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="tgtl-analysis__empty">
                <FileSpreadsheet size={28} />

                <h3>Aucune analyse disponible</h3>

                <p>
                    Sélectionnez un fichier Excel pour lancer son analyse.
                </p>
            </div>
        );
    }

    const summary = analysis.summary || {};
    const sheets = analysis.sheets || [];

    const totalErrors =
        summary.errorRows ??
        sheets.reduce(
            (total, sheet) => total + (sheet.errorRows ?? 0),
            0
        );

    const totalWarnings =
        summary.warningRows ??
        sheets.reduce(
            (total, sheet) => total + (sheet.warningRows ?? 0),
            0
        );

    const hasErrors =
        analysis.status === "ERROR" || totalErrors > 0;

    const hasWarnings =
        analysis.status === "WARNING" || totalWarnings > 0;

    return (
        <div className="tgtl-analysis">

            <div className="tgtl-analysis__heading">
                <div>
                    <h3>Résultat de l'analyse</h3>

                    <p>
                        Consultez le rapport de vérification de votre
                        fichier avant de poursuivre.
                    </p>
                </div>

                <AnalysisStatus status={analysis.status} />
            </div>

            <div className={`tgtl-analysis__result ${
                hasErrors
                    ? "is-error"
                    : hasWarnings
                        ? "is-warning"
                        : "is-success"
            }`}>
                <div className="tgtl-analysis__result-icon">
                    {hasErrors ? (
                        <XCircle size={24} />
                    ) : hasWarnings ? (
                        <AlertTriangle size={24} />
                    ) : (
                        <CheckCircle2 size={24} />
                    )}
                </div>

                <div>
                    <strong>
                        {hasErrors
                            ? "Des erreurs empêchent l'importation"
                            : hasWarnings
                                ? "Analyse terminée avec des avertissements"
                                : "Votre fichier est conforme"}
                    </strong>

                    <p>
                        {hasErrors
                            ? "Corrigez les erreurs signalées avant de poursuivre."
                            : hasWarnings
                                ? "Vérifiez les avertissements avant de continuer."
                                : "La structure et les données ont passé les contrôles d'analyse."}
                    </p>
                </div>
            </div>

            <div className="tgtl-analysis__metrics">
                <AnalysisMetric
                    label="Feuilles détectées"
                    value={summary.totalSheets ?? sheets.length}
                    icon={FileSpreadsheet}
                />

                <AnalysisMetric
                    label="Lignes analysées"
                    value={summary.totalRows}
                    icon={CheckCircle2}
                />

                <AnalysisMetric
                    label="Erreurs détectées"
                    value={totalErrors}
                    icon={XCircle}
                    variant="is-error"
                />

                <AnalysisMetric
                    label="Avertissements"
                    value={totalWarnings}
                    icon={AlertTriangle}
                    variant="is-warning"
                />
            </div>

            {analysis.errors?.length > 0 && (
                <div className="tgtl-analysis__global-issues">
                    <IssueList
                        issues={analysis.errors}
                        type="error"
                    />
                </div>
            )}

            {analysis.warnings?.length > 0 && (
                <div className="tgtl-analysis__global-issues">
                    <IssueList
                        issues={analysis.warnings}
                        type="warning"
                    />
                </div>
            )}

            <div className="tgtl-analysis__sheets-heading">
                <div>
                    <h4>Détail des feuilles</h4>
                    <p>{sheets.length} feuille(s) examinée(s)</p>
                </div>
            </div>

            <div className="tgtl-analysis__sheets">
                {sheets.map((sheet) => (
                    <SheetCard
                        key={sheet.name}
                        sheet={sheet}
                    />
                ))}
            </div>

            <div className="tgtl-analysis__notice">
                <AlertCircle size={18} />

                <p>
                    Cette analyse est uniquement une vérification.
                    Aucune donnée de votre organisation n'a encore
                    été enregistrée dans Trajet Go.
                </p>
            </div>

        </div>
    );
}