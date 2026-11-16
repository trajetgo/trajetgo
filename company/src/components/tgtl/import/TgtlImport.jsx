import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    LoaderCircle,
    UploadCloud
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import ImportWizard from "./ImportWizard";
import ImportFileStep from "./ImportFileStep";
import ImportAnalysisStep from "./ImportAnalysisStep";
import ImportPreviewStep from "./ImportPreviewStep";
import ImportResolutionStep from "./ImportResolutionStep";
import ImportConfirmationStep from "./ImportConfirmationStep";

import useImportSession from "../../../hooks/useImportSession";
import service from "../../../services/tgtlImport.service";

import { 
    BASE_PATH, 
    EXIT_PATH, 
    STEP_ANALYSIS, 
    STEP_CONFIRMATION, 
    STEP_FILE, 
    STEP_PREVIEW, 
    STEP_RESOLUTION, 
    STEPS 
} from "../../../utils/tgtl.utils";

import "../../../styles/components/tgtl/import/Import.scss";


export default function TgtlImport() {
    const navigate = useNavigate();
    const { step } = useParams();

    const {
        hydrated,
        selectedFile,
        analysis,
        warningsAcknowledged,
        importResult,
        setSelectedFile,
        setAnalysis,
        setWarningsAcknowledged,
        setImportResult,
        clear
    } = useImportSession();

    // États transitoires : une requête interrompue par un rafraîchissement
    // est simplement relancée, rien à persister.
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [analysisError, setAnalysisError] = useState("");
    const [fileError, setFileError] = useState("");
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [confirmError, setConfirmError] = useState("");

    // ---------- étape courante = URL ----------

    // /integrations/tgtl/import (sans étape) = étape « Fichier ».
    const stepIndex = step
        ? STEPS.findIndex((item) => item.slug === step)
        : STEP_FILE;

    const goToStep = (index, { replace = false } = {}) => {
        navigate(`${BASE_PATH}/${STEPS[index].slug}`, { replace });
    };

    const hasErrors = analysis?.status === "ERROR";
    const hasWarnings = analysis?.status === "WARNING";

    const canConfirm =
        Boolean(analysis) &&
        !hasErrors &&
        (!hasWarnings || warningsAcknowledged);

    // Étape la plus avancée accessible avec les données actuelles : empêche
    // d'ouvrir /confirmation par l'URL sans fichier ni analyse valide.
    const getMaxStep = () => {
        if (importResult) return STEP_CONFIRMATION;
        if (!selectedFile) return STEP_FILE;
        if (!analysis) return STEP_ANALYSIS;
        if (hasErrors) return STEP_RESOLUTION;

        return STEP_CONFIRMATION;
    };

    const maxStep = getMaxStep();

    useEffect(() => {
        if (!hydrated) return;

        // Import terminé : on ne peut plus revenir en arrière (évite un double import).
        if (importResult && stepIndex !== STEP_CONFIRMATION) {
            goToStep(STEP_CONFIRMATION, { replace: true });
            return;
        }

        if (stepIndex === -1) {
            // Slug inconnu.
            goToStep(STEP_FILE, { replace: true });
            return;
        }

        if (stepIndex > maxStep) {
            goToStep(maxStep, { replace: true });
            return;
        }

        // Confirmation visée sans avoir accepté les avertissements.
        if (stepIndex === STEP_CONFIRMATION && !importResult && !canConfirm) {
            goToStep(STEP_RESOLUTION, { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hydrated, stepIndex, maxStep, importResult, canConfirm]);

    // ---------- actions ----------

    const resetOutcome = () => {
        setAnalysis(null);
        setAnalysisError("");
        setWarningsAcknowledged(false);
        setConfirmError("");
        setImportResult(null);
    };

    const handleFileSelected = (file) => {
        setSelectedFile(file);

        // Un nouveau fichier nécessite une nouvelle analyse.
        resetOutcome();
        setFileError("");
    };

    const handleAnalyze = async () => {
        if (!selectedFile) {
            setFileError("Veuillez sélectionner un fichier Excel.");
            goToStep(STEP_FILE);
            return;
        }

        goToStep(STEP_ANALYSIS, { replace: stepIndex === STEP_ANALYSIS });
        resetOutcome();
        setAnalysisLoading(true);

        try {
            const formData = new FormData();

            formData.append("file", selectedFile);

            const result = await service.analyze(formData);

            setAnalysis(result?.data);
        } catch (error) {
            setAnalysisError(error.message);
        } finally {
            setAnalysisLoading(false);
        }
    };

    // Rafraîchissement pendant l'analyse : le fichier est restauré mais pas
    // l'analyse, on la relance une seule fois.
    const autoAnalyzed = useRef(false);

    useEffect(() => {
        if (!hydrated || autoAnalyzed.current) return;

        autoAnalyzed.current = true;

        if (stepIndex === STEP_ANALYSIS && selectedFile && !analysis) {
            handleAnalyze();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hydrated]);

    const handleContinueFromAnalysis = () => {
        if (!analysis) return;

        // Avec des erreurs, la suite naturelle est la résolution.
        goToStep(hasErrors ? STEP_RESOLUTION : STEP_PREVIEW);
    };

    const handleResolutionBack = () => {
        goToStep(hasErrors ? STEP_ANALYSIS : STEP_PREVIEW);
    };

    // Corriger le fichier : on repart de l'étape « Fichier ».
    const handleReplaceFile = () => {
        handleFileSelected(null);
        goToStep(STEP_FILE);
    };

    // Le serveur ré-analyse le fichier avant d'enregistrer : on lui renvoie
    // donc le fichier d'origine, jamais le résultat de l'analyse.
    const handleConfirm = async () => {
        if (!selectedFile || !canConfirm || confirmLoading || importResult) {
            return;
        }

        setConfirmLoading(true);
        setConfirmError("");

        try {
            const formData = new FormData();

            formData.append("file", selectedFile);

            const result = await service.confirm(formData);

            setImportResult(result?.data ?? {});
        } catch (error) {
            setConfirmError(error.message);
        } finally {
            setConfirmLoading(false);
        }
    };

    // Annuler / terminer : ne rien laisser dans le navigateur.
    const handleExit = () => {
        clear();
        navigate(EXIT_PATH);
    };

    const busy = analysisLoading || confirmLoading;

    // ---------- rendu ----------

    if (!hydrated || stepIndex === -1) {
        return (
            <div className="tgtl-import">
                <LoaderCircle size={24} className="is-spinning" />
            </div>
        );
    }

    const footer = (
        <>
            <button
                type="button"
                className="tgtl-import__cancel"
                onClick={handleExit}
                disabled={busy}
                hidden={Boolean(importResult)}
            >
                Annuler
            </button>

            {stepIndex === STEP_FILE && (
                <button
                    type="button"
                    className="tgtl-import__continue"
                    disabled={!selectedFile}
                    onClick={handleAnalyze}
                >
                    Analyser le fichier
                    <ArrowRight size={17} />
                </button>
            )}

            {stepIndex === STEP_ANALYSIS && (
                <>
                    <button
                        type="button"
                        className="tgtl-import__cancel"
                        onClick={() => goToStep(STEP_FILE)}
                        disabled={analysisLoading}
                    >
                        <ArrowLeft size={17} />
                        Modifier le fichier
                    </button>

                    <button
                        type="button"
                        className="tgtl-import__continue"
                        disabled={!analysis || analysisLoading}
                        onClick={handleContinueFromAnalysis}
                    >
                        {analysisLoading ? (
                            <>
                                <LoaderCircle size={17} className="is-spinning" />
                                Analyse en cours...
                            </>
                        ) : (
                            <>
                                {hasErrors ? "Résoudre les erreurs" : "Continuer"}
                                <ArrowRight size={17} />
                            </>
                        )}
                    </button>
                </>
            )}

            {stepIndex === STEP_PREVIEW && (
                <>
                    <button
                        type="button"
                        className="tgtl-import__cancel"
                        onClick={() => goToStep(STEP_ANALYSIS)}
                    >
                        <ArrowLeft size={17} />
                        Retour à l'analyse
                    </button>

                    <button
                        type="button"
                        className="tgtl-import__continue"
                        disabled={!analysis || hasErrors}
                        onClick={() => goToStep(STEP_RESOLUTION)}
                    >
                        Continuer
                        <ArrowRight size={17} />
                    </button>
                </>
            )}

            {stepIndex === STEP_RESOLUTION && (
                <>
                    <button
                        type="button"
                        className="tgtl-import__cancel"
                        onClick={handleResolutionBack}
                    >
                        <ArrowLeft size={17} />
                        {hasErrors ? "Retour à l'analyse" : "Retour à la prévisualisation"}
                    </button>

                    {/* En présence d'erreurs, la correction se fait via
                        « Importer le fichier corrigé » dans le composant. */}
                    {!hasErrors && (
                        <button
                            type="button"
                            className="tgtl-import__continue"
                            disabled={!canConfirm}
                            onClick={() => goToStep(STEP_CONFIRMATION)}
                        >
                            Continuer
                            <ArrowRight size={17} />
                        </button>
                    )}
                </>
            )}

            {stepIndex === STEP_CONFIRMATION && (
                importResult ? (
                    <button
                        type="button"
                        className="tgtl-import__continue"
                        onClick={handleExit}
                    >
                        Terminer
                        <ArrowRight size={17} />
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            className="tgtl-import__cancel"
                            onClick={() => goToStep(STEP_RESOLUTION)}
                            disabled={confirmLoading}
                        >
                            <ArrowLeft size={17} />
                            Retour à la résolution
                        </button>

                        <button
                            type="button"
                            className="tgtl-import__continue"
                            disabled={!canConfirm || confirmLoading}
                            onClick={handleConfirm}
                        >
                            {confirmLoading ? (
                                <>
                                    <LoaderCircle size={17} className="is-spinning" />
                                    Importation en cours...
                                </>
                            ) : (
                                <>
                                    {confirmError ? "Réessayer" : "Confirmer l'import"}
                                    <CheckCircle2 size={17} />
                                </>
                            )}
                        </button>
                    </>
                )
            )}
        </>
    );

    return (
        <div className="tgtl-import">

            <button
                type="button"
                className="tgtl-import__back"
                onClick={handleExit}
                disabled={busy}
            >
                <ArrowLeft size={17} />
                Retour à l'intégration
            </button>

            <header className="tgtl-import__header">
                <div className="tgtl-import__title-icon">
                    <UploadCloud size={23} />
                </div>

                <div>
                    <h2>Importer une organisation</h2>

                    <p>
                        Transférez les données de votre compagnie vers
                        Trajet Go à partir d'un fichier TGTL.
                    </p>
                </div>
            </header>

            <ImportWizard
                steps={STEPS.map((item) => item.label)}
                currentStep={stepIndex}
                finished={Boolean(importResult)}
                footer={footer}
            >
                {stepIndex === STEP_FILE && (
                    <ImportFileStep
                        selectedFile={selectedFile}
                        onFileSelected={handleFileSelected}
                        error={fileError}
                    />
                )}

                {stepIndex === STEP_ANALYSIS && (
                    <ImportAnalysisStep
                        analysis={analysis}
                        loading={analysisLoading}
                        error={analysisError}
                        onRetry={handleAnalyze}
                    />
                )}

                {stepIndex === STEP_PREVIEW && (
                    <ImportPreviewStep
                        analysis={analysis}
                        selectedFile={selectedFile}
                    />
                )}

                {stepIndex === STEP_RESOLUTION && (
                    <ImportResolutionStep
                        analysis={analysis}
                        selectedFile={selectedFile}
                        acknowledged={warningsAcknowledged}
                        onAcknowledgeChange={setWarningsAcknowledged}
                        onReplaceFile={handleReplaceFile}
                    />
                )}

                {stepIndex === STEP_CONFIRMATION && (
                    <ImportConfirmationStep
                        analysis={analysis}
                        selectedFile={selectedFile}
                        loading={confirmLoading}
                        error={confirmError}
                        result={importResult}
                    />
                )}
            </ImportWizard>
        </div>
    );
}