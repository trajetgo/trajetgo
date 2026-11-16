const path = require("path");
const fs = require("fs");

const {
    prisma,
    logSeed,
    logSuccess,
    logWarning,
    logInfo,
} = require("./helpers");

/* ------------------------------------------------------------------ */
/* Chargement du fichier de coordonnées                               */
/* ------------------------------------------------------------------ */

function loadCoordinates() {
    const filePath = path.join(
        __dirname,
        "..",
        "data",
        "cities-coordinates.json"
    );

    if (!fs.existsSync(filePath)) {
        throw new Error(
            `[enrich-cities] Fichier introuvable : ${filePath}`
        );
    }

    return JSON.parse(
        fs.readFileSync(filePath, "utf-8")
    );
}

/* ------------------------------------------------------------------ */
/* Normalisation des coordonnées                                      */
/* ------------------------------------------------------------------ */

function normalizeCoordinates(coords) {
    return {
        latitude: Number(coords.lat),
        longitude: Number(coords.lng ?? coords.long),
    };
}

/* ------------------------------------------------------------------ */

const enrichCities = async () => {
    logSeed("Enrichissement des villes (lat/lng)");

    const data = loadCoordinates();

    let created = 0;
    let updated = 0;
    let skipped = 0;
    let invalid = 0;

    /* ---------- Pour chaque pays ---------- */

    for (const [countryCode, cities] of Object.entries(data)) {

        const country = await prisma.country.findUnique({
            where: {
                code: countryCode,
            },
        });

        if (!country) {
            logWarning(
                `Pays ${countryCode} introuvable — ignoré`
            );

            continue;
        }

        /* ---------- Pour chaque ville ---------- */

        for (const [cityName, coords] of Object.entries(cities)) {

            const {
                latitude,
                longitude,
            } = normalizeCoordinates(coords);

            /* ---------- Validation ---------- */

            if (
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude)
            ) {
                invalid++;

                logWarning(
                    `Coordonnées invalides : ${countryCode}/${cityName}`
                );

                continue;
            }

            /* ---------- Région ---------- */

            let regionId = null;

            if (coords.region) {

                const region = await prisma.region.upsert({
                    where: {
                        countryId_name: {
                            countryId: country.id,
                            name: coords.region,
                        },
                    },

                    update: {},

                    create: {
                        name: coords.region,
                        countryId: country.id,
                    },
                });

                regionId = region.id;
            }

            /* ---------- Ville ---------- */

            const city = await prisma.city.findUnique({
                where: {
                    countryId_name: {
                        countryId: country.id,
                        name: cityName,
                    },
                },
            });

            /* ====================================================== */
            /* Ville inexistante → création                           */
            /* ====================================================== */

            if (!city) {

                await prisma.city.create({
                    data: {
                        name: cityName,

                        countryId: country.id,

                        regionId,

                        latitude,
                        longitude,

                        active: true,
                    },
                });

                created++;

                continue;
            }

            /* ====================================================== */
            /* Ville existante                                        */
            /* ====================================================== */

            const needsUpdate =
                city.latitude == null ||
                city.longitude == null ||
                city.regionId == null;

            if (!needsUpdate) {
                skipped++;
                continue;
            }

            /* ---------- Compléter les données manquantes ---------- */

            await prisma.city.update({
                where: {
                    id: city.id,
                },

                data: {
                    latitude:
                        city.latitude ?? latitude,

                    longitude:
                        city.longitude ?? longitude,

                    regionId:
                        city.regionId ?? regionId,
                },
            });

            updated++;
        }
    }

    /* ---------------------------------------------------------------- */
    /* Résumé                                                           */
    /* ---------------------------------------------------------------- */

    logSuccess(`${created} villes créées`);
    logSuccess(`${updated} villes enrichies`);
    logWarning(`${skipped} villes déjà complètes`);

    if (invalid > 0) {
        logWarning(
            `${invalid} villes ignorées pour coordonnées invalides`
        );
    }

    return {
        created,
        updated,
        skipped,
        invalid,
    };
};

module.exports = enrichCities;