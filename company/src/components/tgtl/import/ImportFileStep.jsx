import { useRef, useState } from "react";
import {
    UploadCloud,
    FileSpreadsheet,
    X,
    AlertCircle,
    CheckCircle2,
    Download
} from "lucide-react";

import "../../../styles/components/tgtl/import/ImportFileStep.scss";
import { EXCEL_MIME_TYPE, MAX_FILE_SIZE, TEMPLATE_URL } from "../../../utils/tgtl.utils";

function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} octets`;

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} Ko`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
}

export default function ImportFileStep({
    selectedFile,
    onFileSelected,
    error
}) {
    const inputRef = useRef(null);

    const [dragging, setDragging] = useState(false);
    const [localError, setLocalError] = useState("");

    const handleFile = (file) => {
        if (!file) return;

        const isExcel =
            file.name.toLowerCase().endsWith(".xlsx") &&
            (
                file.type === EXCEL_MIME_TYPE ||
                file.type === ""
            );

        if (!isExcel) {
            setLocalError(
                "Veuillez sélectionner un fichier Excel au format .xlsx."
            );
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setLocalError(
                "Le fichier ne doit pas dépasser 10 Mo."
            );
            return;
        }

        if (file.size === 0) {
            setLocalError(
                "Le fichier sélectionné est vide."
            );
            return;
        }

        setLocalError("");
        onFileSelected(file);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);

        const file = event.dataTransfer.files?.[0];

        handleFile(file);
    };

    const handleInputChange = (event) => {
        const file = event.target.files?.[0];

        handleFile(file);

        // Permet de sélectionner à nouveau le même fichier.
        event.target.value = "";
    };

    const handleRemoveFile = () => {
        onFileSelected(null);
        setLocalError("");
    };

    const displayedError = localError || error;

    return (
        <div className="tgtl-import-file">

            <div className="tgtl-import-file__heading">
                <h3>Importer votre fichier Excel</h3>

                <p>
                    Sélectionnez le classeur contenant les informations
                    de votre organisation Trajet Go.
                </p>
            </div>

            {!selectedFile ? (
                <div
                    className={`tgtl-import-file__dropzone ${
                        dragging ? "is-dragging" : ""
                    }`}
                    onDragOver={(event) => {
                        event.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget)) {
                            setDragging(false);
                        }
                    }}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    onKeyDown={(event) => {
                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {
                            event.preventDefault();
                            inputRef.current?.click();
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Sélectionner un fichier Excel"
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        hidden
                        onChange={handleInputChange}
                    />

                    <div className="tgtl-import-file__upload-icon">
                        <UploadCloud size={29} />
                    </div>

                    <h4>
                        Glissez-déposez votre fichier Excel ici
                    </h4>

                    <p>
                        ou cliquez pour parcourir vos fichiers
                    </p>

                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            inputRef.current?.click();
                        }}
                    >
                        Parcourir les fichiers
                    </button>

                    <span>
                        Format accepté : Excel (.xlsx) · 10 Mo maximum
                    </span>
                </div>
            ) : (
                <div className="tgtl-import-file__selected">

                    <div className="tgtl-import-file__file-icon">
                        <FileSpreadsheet size={25} />
                    </div>

                    <div className="tgtl-import-file__file-info">
                        <strong title={selectedFile.name}>
                            {selectedFile.name}
                        </strong>

                        <span>
                            {formatFileSize(selectedFile.size)}
                        </span>
                    </div>

                    <div
                        className="tgtl-import-file__file-status"
                        aria-label="Fichier sélectionné"
                    >
                        <CheckCircle2 size={19} />
                    </div>

                    <button
                        type="button"
                        aria-label="Retirer le fichier"
                        title="Retirer le fichier"
                        onClick={handleRemoveFile}
                    >
                        <X size={18} />
                    </button>

                </div>
            )}

            {displayedError && (
                <div
                    className="tgtl-import-file__error"
                    role="alert"
                >
                    <AlertCircle size={17} />
                    <span>{displayedError}</span>
                </div>
            )}

            <div className="tgtl-import-file__template">

                <div className="tgtl-import-file__template-icon">
                    <FileSpreadsheet size={21} />
                </div>

                <div className="tgtl-import-file__template-info">
                    <strong>Vous n'avez pas encore votre fichier ?</strong>

                    <p>
                        Téléchargez le modèle officiel TGTL et renseignez
                        les informations de votre organisation.
                    </p>
                </div>

                <a
                    href={TEMPLATE_URL}
                    download
                    className="tgtl-import-file__template-link"
                >
                    <Download size={17} />
                    <span>Télécharger le modèle</span>
                </a>

            </div>

            <div className="tgtl-import-file__notice">
                <AlertCircle size={18} />

                <div>
                    <strong>À savoir</strong>

                    <p>
                        Seuls les fichiers respectant le standard TGTL
                        pourront être importés. La structure, la version,
                        les références et les données seront vérifiées
                        pendant l'analyse. Aucune donnée ne sera enregistrée
                        avant votre confirmation.
                    </p>
                </div>
            </div>

        </div>
    );
}