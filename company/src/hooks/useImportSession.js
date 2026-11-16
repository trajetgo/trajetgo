import { useCallback, useEffect, useState } from "react";

// Persistance de la session d'import pour survivre à un rafraîchissement :
//  - analyse, avertissements acceptés, résultat -> sessionStorage (par onglet)
//  - fichier Excel (File)                       -> IndexedDB (sessionStorage ne stocke pas de binaire)
// Le fichier est indexé par un identifiant propre à l'onglet pour que deux
// onglets ouverts en parallèle ne se mélangent pas.

const PREFIX = "tgtl-import:";
const DB_NAME = "tgtl-import";
const STORE = "session";

// ---------- sessionStorage (jamais bloquant) ----------

function readJson(key) {
    try {
        const raw = sessionStorage.getItem(PREFIX + key);

        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function writeJson(key, value) {
    try {
        if (value === null || value === undefined) {
            sessionStorage.removeItem(PREFIX + key);
        } else {
            sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
        }
    } catch {
        // Stockage plein ou indisponible : la session reste fonctionnelle en mémoire.
    }
}

function getTabId() {
    try {
        let id = sessionStorage.getItem(PREFIX + "tab");

        if (!id) {
            id = crypto.randomUUID();
            sessionStorage.setItem(PREFIX + "tab", id);
        }

        return id;
    } catch {
        return "default";
    }
}

// ---------- IndexedDB ----------

function openDb() {
    return new Promise((resolve, reject) => {
        if (typeof indexedDB === "undefined") {
            reject(new Error("IndexedDB indisponible"));
            return;
        }

        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = () => {
            request.result.createObjectStore(STORE);
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function idb(mode, run) {
    try {
        const db = await openDb();

        return await new Promise((resolve, reject) => {
            const request = run(db.transaction(STORE, mode).objectStore(STORE));

            request.onsuccess = () => resolve(request.result ?? null);
            request.onerror = () => reject(request.error);
        });
    } catch {
        return null; // navigation privée, quota... -> pas de persistance du fichier
    }
}

const fileKey = () => `file:${getTabId()}`;

const loadFile = () => idb("readonly", (store) => store.get(fileKey()));
const saveFile = (file) => idb("readwrite", (store) => store.put(file, fileKey()));
const deleteFile = () => idb("readwrite", (store) => store.delete(fileKey()));

// ---------- hook ----------

export default function useImportSession() {
    const [hydrated, setHydrated] = useState(false);

    const [selectedFile, setFileState] = useState(null);
    const [analysis, setAnalysisState] = useState(null);
    const [warningsAcknowledged, setAckState] = useState(false);
    const [importResult, setResultState] = useState(null);

    useEffect(() => {
        let cancelled = false;

        loadFile().then((file) => {
            if (cancelled) return;

            const hasFile = file instanceof Blob;

            setFileState(hasFile ? file : null);

            // Une analyse sans son fichier n'est pas exploitable (la confirmation
            // renvoie le fichier au serveur) : on l'ignore.
            setAnalysisState(hasFile ? readJson("analysis") : null);
            setAckState(hasFile ? readJson("ack") === true : false);
            setResultState(hasFile ? readJson("result") : null);

            setHydrated(true);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    const setSelectedFile = useCallback((file) => {
        setFileState(file);

        if (file) saveFile(file);
        else deleteFile();
    }, []);

    const setAnalysis = useCallback((value) => {
        setAnalysisState(value);
        writeJson("analysis", value);
    }, []);

    const setWarningsAcknowledged = useCallback((value) => {
        setAckState(value);
        writeJson("ack", value ? true : null);
    }, []);

    const setImportResult = useCallback((value) => {
        setResultState(value);
        writeJson("result", value);
    }, []);

    // À appeler à l'annulation et à la fin : ne rien laisser dans le navigateur.
    const clear = useCallback(() => {
        setFileState(null);
        setAnalysisState(null);
        setAckState(false);
        setResultState(null);

        ["analysis", "ack", "result"].forEach((key) => writeJson(key, null));
        deleteFile();
    }, []);

    return {
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
    };
}