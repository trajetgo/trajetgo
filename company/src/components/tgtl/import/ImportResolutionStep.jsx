import { useMemo, useState } from "react";
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    Download,
    FileSpreadsheet,
    Lightbulb,
    RefreshCw,
    XCircle
} from "lucide-react";

import "../../../styles/components/tgtl/import/ImportResolutionStep.scss";
import { HINTS, SHEET_LABELS } from "../../../utils/tgtl.utils";

function buildIssues(analysis) {
    const globalIssue = (level) => (issue) => ({
        ...issue,
        level,
        sheet: null
    });

    const fromSheets = (level, key) =>
        (analysis.sheets || []).flatMap((sheet) =>
            (sheet[key] || []).map((issue) => ({
                ...issue,
                level,
                sheet: sheet.name
            }))
        );

    return [
        ...(analysis.errors || []).map(globalIssue("error")),
        ...fromSheets("error", "errors"),
        ...(analysis.warnings || []).map(globalIssue("warning")),
        ...fromSheets("warning", "warnings")
    ];
}

function csvCell(value) {
    return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function downloadReport(issues, fileName) {
    const lines = [
        ["Niveau", "Feuille", "Ligne", "Colonne", "Code", "Message"],
        ...issues.map((issue) => [
            issue.level === "error" ? "Erreur" : "Avertissement",
            SHEET_LABELS[issue.sheet] || issue.sheet || "Classeur",
            issue.row,
            issue.column,
            issue.code,
            issue.message
        ])
    ].map((line) => line.map(csvCell).join(";"));

    // BOM + « ; » pour une ouverture directe dans Excel en version française.
    const blob = new Blob(["﻿" + lines.join("\r\n")], {
        type: "text/csv;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `rapport-analyse-${(fileName || "import").replace(/\.xlsx$/i, "")}.csv`;
    link.click();

    URL.revokeObjectURL(url);
}

function IssueGroup({ title, issues }) {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="tgtl-resolution__group">
            <button
                type="button"
                className="tgtl-resolution__group-header"
                onClick={() => setExpanded((previous) => !previous)}
                aria-expanded={expanded}
            >
                <FileSpreadsheet size={17} />
                <strong>{title}</strong>
                <span>{issues.length}</span>
            </button>

            {expanded && (
                <ul>
                    {issues.map((issue, index) => (
                        <li
                            key={`${issue.code}-${issue.row}-${issue.column}-${index}`}
                            className={issue.level === "error" ? "is-error" : "is-warning"}
                        >
                            {issue.level === "error"
                                ? <XCircle size={16} />
                                : <AlertTriangle size={16} />}

                            <div>
                                <span>{issue.message}</span>

                                {(issue.row || issue.column) && (
                                    <small>
                                        {issue.row ? `Ligne ${issue.row}` : ""}
                                        {issue.row && issue.column ? " · " : ""}
                                        {issue.column || ""}
                                    </small>
                                )}

                                {HINTS[issue.code] && (
                                    <p className="tgtl-resolution__hint">
                                        <Lightbulb size={13} />
                                        {HINTS[issue.code]}
                                    </p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function ImportResolutionStep({
    analysis,
    selectedFile,
    acknowledged,
    onAcknowledgeChange,
    onReplaceFile
}) {
    const issues = useMemo(
        () => (analysis ? buildIssues(analysis) : []),
        [analysis]
    );

    const groups = useMemo(() => {
        const map = new Map();

        issues.forEach((issue) => {
            const key = issue.sheet || "__global";

            if (!map.has(key)) map.set(key, []);

            map.get(key).push(issue);
        });

        return [...map.entries()].map(([key, items]) => ({
            key,
            title: key === "__global" ? "Classeur" : (SHEET_LABELS[key] || key),
            items
        }));
    }, [issues]);

    if (!analysis) {
        return (
            <div className="tgtl-resolution__empty">
                <FileSpreadsheet size={28} />
                <h3>Aucune analyse disponible</h3>
                <p>Lancez d'abord l'analyse d'un fichier.</p>
            </div>
        );
    }

    const errorCount = issues.filter((issue) => issue.level === "error").length;
    const warningCount = issues.length - errorCount;

    // Cas 1 : erreurs bloquantes -> corriger le fichier puis le réimporter.
    if (errorCount > 0) {
        return (
            <div className="tgtl-resolution">
                <div className="tgtl-resolution__heading">
                    <h3>Résolution des problèmes</h3>
                    <p>
                        {errorCount} erreur(s) bloquante(s) empêchent l'importation.
                        Corrigez-les dans votre fichier Excel, puis importez-le à nouveau.
                    </p>
                </div>

                <ol className="tgtl-resolution__steps">
                    <li>Téléchargez le rapport ou notez les lignes concernées.</li>
                    <li>Corrigez les cellules dans Excel et enregistrez le fichier.</li>
                    <li>Importez le fichier corrigé : il sera analysé à nouveau.</li>
                </ol>

                <div className="tgtl-resolution__actions">
                    <button
                        type="button"
                        className="tgtl-resolution__secondary"
                        onClick={() => downloadReport(issues, selectedFile?.name)}
                    >
                        <Download size={16} />
                        Télécharger le rapport (.csv)
                    </button>

                    <button
                        type="button"
                        className="tgtl-resolution__primary"
                        onClick={onReplaceFile}
                    >
                        <RefreshCw size={16} />
                        Importer le fichier corrigé
                    </button>
                </div>

                <div className="tgtl-resolution__groups">
                    {groups.map((group) => (
                        <IssueGroup
                            key={group.key}
                            title={group.title}
                            issues={group.items}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Cas 2 : aucun blocage -> prise en compte des avertissements.
    return (
        <div className="tgtl-resolution">
            <div className="tgtl-resolution__heading">
                <h3>Résolution des points à vérifier</h3>
                <p>
                    {warningCount > 0
                        ? `${warningCount} point(s) méritent votre attention avant la confirmation.`
                        : "Aucun point à résoudre."}
                </p>
            </div>

            {warningCount === 0 ? (
                <div className="tgtl-resolution__clear">
                    <CheckCircle2 size={22} />
                    <div>
                        <strong>Votre fichier est prêt</strong>
                        <p>Vous pouvez passer à la confirmation.</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="tgtl-resolution__groups">
                        {groups.map((group) => (
                            <IssueGroup
                                key={group.key}
                                title={group.title}
                                issues={group.items}
                            />
                        ))}
                    </div>

                    <label className="tgtl-resolution__acknowledge">
                        <input
                            type="checkbox"
                            checked={acknowledged}
                            onChange={(event) => onAcknowledgeChange(event.target.checked)}
                        />
                        <span>
                            J'ai pris connaissance de ces avertissements et je
                            souhaite poursuivre l'importation.
                        </span>
                    </label>
                </>
            )}

            <div className="tgtl-resolution__notice">
                <AlertCircle size={18} />
                <p>
                    Aucune donnée n'est enregistrée avant l'étape de confirmation.
                </p>
            </div>
        </div>
    );
}