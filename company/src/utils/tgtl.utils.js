import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

// L'ordre de ce tableau définit l'ordre des étapes ; le slug apparaît dans l'URL.
export const STEPS = [
    { slug: "fichier", label: "Fichier" },
    { slug: "analyse", label: "Analyse" },
    { slug: "previsualisation", label: "Prévisualisation" },
    { slug: "resolution", label: "Résolution" },
    { slug: "confirmation", label: "Confirmation" }
];

export const BASE_PATH = "/integrations/tgtl/import";
export const EXIT_PATH = "/integrations/tgtl";

export const STEP_FILE = 0;
export const STEP_ANALYSIS = 1;
export const STEP_PREVIEW = 2;
export const STEP_RESOLUTION = 3;
export const STEP_CONFIRMATION = 4;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo

export const EXCEL_MIME_TYPE =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export const TEMPLATE_URL = "/templates/Trajet_Go_Modele_Import_Organisation_V1.xlsx";

export const SHEET_LABELS = {
    Compagnie: "Compagnie",
    Villes: "Villes",
    Agences: "Agences",
    Bus: "Bus",
    Plans_Sieges: "Plans de sièges",
    Lignes: "Lignes",
    Programmations: "Programmations",
    Personnel: "Personnel"
};

export const STATUS_CONFIG = {
    SUCCESS: {
        label: "Valide",
        icon: CheckCircle2,
        className: "is-success"
    },
    WARNING: {
        label: "À vérifier",
        icon: AlertTriangle,
        className: "is-warning"
    },
    ERROR: {
        label: "Erreurs détectées",
        icon: XCircle,
        className: "is-error"
    }
};

// Conseil de correction affiché selon le code d'erreur renvoyé par l'API.
export const HINTS = {
    MISSING_SHEET: "Ne supprimez ni ne renommez les feuilles du modèle.",
    MISSING_HEADER: "Ne modifiez pas la première ligne de chaque feuille : les en-têtes doivent rester identiques au modèle.",
    DUPLICATE_HEADER: "Supprimez la colonne en double.",
    REQUIRED_FIELD: "Renseignez la cellule. Si l'information est inconnue, supprimez toute la ligne plutôt que de l'inventer.",
    DUPLICATE_EXTERNAL_ID: "Chaque identifiant doit être unique dans sa feuille (ex. BUS-001, BUS-002).",
    INVALID_REFERENCE: "Cet identifiant doit exister dans la feuille référencée. Vérifiez l'orthographe.",
    AGENCY_CITY_MISMATCH: "L'agence choisie doit être située dans la ville d'origine (départ) ou de destination (arrivée) de la ligne.",
    INVALID_ROUTE: "Une ligne doit relier deux villes différentes.",
    INVALID_ENUM: "Utilisez uniquement les valeurs proposées dans la liste déroulante.",
    INVALID_DATE: "Format attendu : AAAA-MM-JJ (ex. 2026-11-01).",
    INVALID_DATE_RANGE: "La date de fin doit être postérieure ou égale à la date de début.",
    INVALID_TIME: "Format attendu : HH:MM (ex. 07:00).",
    INVALID_DAYS: "Jours en anglais et en majuscules, séparés par des virgules (ex. MONDAY,FRIDAY).",
    DUPLICATE_DAY: "Retirez le jour en double.",
    INVALID_CAPACITY: "La capacité doit être un entier positif.",
    INVALID_SEAT_POSITION: "Le rang et la colonne doivent être des entiers positifs.",
    INVALID_COORDINATE: "Latitude entre -90 et 90, longitude entre -180 et 180.",
    INVALID_EMAIL: "Saisissez une adresse e-mail valide (nom@domaine.ci)."
};