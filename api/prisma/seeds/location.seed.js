// prisma/seeds/location.seed.js
const { prisma, logSeed, logSuccess, logInfo } = require("./helpers");

/* =========================================================
   DONNÉES DE SEED
   ========================================================= */

const COUNTRIES = [
    { code: "CI", name: "Côte d'Ivoire", phoneCode: "+225", currency: "XOF" },
    { code: "SN", name: "Sénégal", phoneCode: "+221", currency: "XOF" },
    { code: "GH", name: "Ghana", phoneCode: "+233", currency: "GHS" },
    { code: "ML", name: "Mali", phoneCode: "+223", currency: "XOF" },
    { code: "BF", name: "Burkina Faso", phoneCode: "+226", currency: "XOF" },
    { code: "GN", name: "Guinée", phoneCode: "+224", currency: "GNF" },
    { code: "TG", name: "Togo", phoneCode: "+228", currency: "XOF" },
    { code: "BJ", name: "Bénin", phoneCode: "+229", currency: "XOF" },
    { code: "NE", name: "Niger", phoneCode: "+227", currency: "XOF" },
    { code: "LR", name: "Liberia", phoneCode: "+231", currency: "LRD" },
];

/* Chaque ville porte son pays + sa région (optionnel) */
const CITIES = [
    {
        name: "Abidjan",
        code: "ABJ",
        countryCode: "CI",
        region: "Lagunes",
        locations: [
            { name: "Gare routière d'Adjamé", address: "Adjamé, Abidjan" },
            { name: "Gare de Yopougon", address: "Yopougon, Abidjan" },
        ],
    },
    {
        name: "Yamoussoukro",
        code: "YAM",
        countryCode: "CI",
        region: "Lacs",
        locations: [
            { name: "Gare routière de Yamoussoukro", address: "Yamoussoukro" },
        ],
    },
    {
        name: "Bouaké",
        code: "BKE",
        countryCode: "CI",
        region: "Vallée du Bandama",
        locations: [
            { name: "Gare routière de Bouaké", address: "Bouaké" },
        ],
    },
    {
        name: "Daloa",
        code: "DAL",
        countryCode: "CI",
        region: "Haut-Sassandra",
        locations: [
            { name: "Gare routière de Daloa", address: "Daloa" },
        ],
    },
    {
        name: "Korhogo",
        code: "KGO",
        countryCode: "CI",
        region: "Savanes",
        locations: [
            { name: "Gare routière de Korhogo", address: "Korhogo" },
        ],
    },
];

/* =========================================================
   SEED
   ========================================================= */

const seedLocations = async () => {
    logSeed("Seed locations");

    /* ---------- 1. Pays ---------- */

    const countries = {};

    for (const c of COUNTRIES) {
        const country = await prisma.country.upsert({
            where: { code: c.code },
            update: {
                name: c.name,
                phoneCode: c.phoneCode,
                currency: c.currency,
            },
            create: {
                code: c.code,
                name: c.name,
                phoneCode: c.phoneCode,
                currency: c.currency,
            },
        });

        countries[c.code] = country;
    }

    logSuccess(`${Object.keys(countries).length} pays prêts`);

    /* ---------- 2. Régions ---------- */

    const regions = {};

    for (const cityData of CITIES) {
        if (!cityData.region) continue;

        const country = countries[cityData.countryCode];

        const region = await prisma.region.upsert({
            where: {
                countryId_name: {
                    countryId: country.id,
                    name: cityData.region,
                },
            },
            update: {},
            create: {
                name: cityData.region,
                countryId: country.id,
            },
        });

        regions[`${cityData.countryCode}-${cityData.region}`] = region;
    }

    logSuccess(`${Object.keys(regions).length} régions prêtes`);

    /* ---------- 3. Villes ---------- */

    const cities = {};

    for (const cityData of CITIES) {
        const country = countries[cityData.countryCode];

        if (!country) {
            throw new Error(
                `Pays introuvable pour la ville ${cityData.name} (${cityData.countryCode})`
            );
        }

        const regionKey = cityData.region
            ? `${cityData.countryCode}-${cityData.region}`
            : null;

        const regionId = regionKey ? regions[regionKey]?.id ?? null : null;

        const city = await prisma.city.upsert({
            where: {
                countryId_name: {
                    countryId: country.id,
                    name: cityData.name,
                },
            },
            update: {
                code: cityData.code,
                regionId,
            },
            create: {
                name: cityData.name,
                code: cityData.code,
                countryId: country.id,   // ✅ LA clé du fix
                regionId,
            },
        });

        cities[cityData.code] = city;

        /* ---------- 4. Locations (gares) ---------- */

        for (const loc of cityData.locations) {
            await prisma.location.upsert({
                where: {
                    id: `${city.id}-${loc.name}`,
                },
                update: {
                    name: loc.name,
                    address: loc.address,
                    active: true,
                },
                create: {
                    id: `${city.id}-${loc.name}`,
                    name: loc.name,
                    address: loc.address,
                    cityId: city.id,
                    active: true,
                },
            });
        }
    }

    logSuccess(`${Object.keys(cities).length} villes prêtes`);

    return { countries, regions, cities };
};

module.exports = seedLocations;