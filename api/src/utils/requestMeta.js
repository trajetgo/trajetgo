// utils/requestMeta.js
const UAParser = require("ua-parser-js");

const requestMeta = (req) => {
    const ua = req.headers["user-agent"];
    const parser = new UAParser(ua);
    const result = parser.getResult();

    // Construit un label lisible à partir de device + os + browser
    const deviceLabel = buildDeviceLabel(result);
    const osLabel = buildOsLabel(result.os);
    const browserLabel = buildBrowserLabel(result.browser);

    return {
        ip: normalizeIp(req.ip),
        userAgent: ua || "inconnu",
        deviceName: deviceLabel,
        os: osLabel,
        browser: browserLabel,
    };
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/**
 * Extrait une adresse IPv4 si l'IP est en IPv6-mapped (::ffff:x.x.x.x).
 * Convertit aussi ::1 en 127.0.0.1 pour la lisibilité en dev.
 */
function normalizeIp(ip) {
    if (!ip) return "inconnue";

    // IPv6-mapped IPv4 : "::ffff:192.168.1.1" → "192.168.1.1"
    if (ip.startsWith("::ffff:")) {
        return ip.slice(7);
    }

    // Loopback IPv6 → IPv4
    if (ip === "::1") {
        return "127.0.0.1";
    }

    return ip;
}

function buildDeviceLabel({ device, os }) {
    // UAParser retourne { type, vendor, model }
    if (device.model) {
        return `${device.vendor ? device.vendor + " " : ""}${device.model}`.trim();
    }

    if (device.type) {
        const map = {
            mobile: "Mobile",
            tablet: "Tablette",
            console: "Console",
            smarttv: "TV",
            wearable: "Montre connectée",
            embedded: "Appareil embarqué",
        };

        return map[device.type] || "Appareil inconnu";
    }

    // Pas d'info device : on déduit du système
    if (os.name) {
        if (/Android|iOS/i.test(os.name)) return "Mobile";
        if (/Windows|Mac OS|Linux/i.test(os.name)) return "Ordinateur";
    }

    return "Appareil inconnu";
}

function buildOsLabel({ name, version }) {
    if (!name) return "inconnu";

    return version ? `${name} ${version}` : name;
}

function buildBrowserLabel({ name, version }) {
    if (!name) return "inconnu";

    // UAParser retourne parfois "Chrome Mobile" + version complète "158.0.8127.42"
    // On garde uniquement le majeur pour la lisibilité : "Chrome Mobile 158"
    const majorVersion = version ? version.split(".")[0] : null;

    return majorVersion ? `${name} ${majorVersion}` : name;
}

module.exports = requestMeta;