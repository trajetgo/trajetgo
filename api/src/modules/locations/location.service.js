const repository = require('./location.repository');
const cacheService = require('../../services/cache.service');

// Durées de vie (TTL) en secondes
const TTL_COUNTRIES = 3600; // 1 heure
const TTL_CITIES_LIST = 1800; // 30 minutes
const TTL_CITY_SEARCH = 600; // 10 minutes pour les recherches

function parseCoord(value) {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const n = Number(value);

    return Number.isFinite(n) ? n : null;
}

class LocationService {

    getByType = async (type) => {
        // Cas 1 : Pays
        if (type === "country") {
            const cacheKey = "locations:countries";

            // 1. Vérifier le cache
            const cachedData = cacheService.get(cacheKey);
            if (cachedData) {
                return cachedData;
            }

            // 2. Si absent, requêter la BDD
            const countries = await repository.findCountries();

            // 3. Mettre en cache le résultat
            cacheService.set(cacheKey, countries, TTL_COUNTRIES);

            return countries;
        }

        // Cas 2 : Villes (liste complète)
        if (type === "city") {
            const cacheKey = "locations:cities:all";

            const cachedData = cacheService.get(cacheKey);
            if (cachedData) {
                return cachedData;
            }

            const cities = await repository.findCities();
            cacheService.set(cacheKey, cities, TTL_CITIES_LIST);

            return cities;
        }

        // Type inconnu : retourner un tableau vide ou null selon votre logique
        return [];
    };

    searchCities = async (search) => {
        const term = search?.trim();

        if (!term || term.length < 2) {
            return [];
        }

        // Clé de cache basée sur le terme de recherche (en minuscules pour l'unicité)
        const cacheKey = `locations:cities:search:${term.toLowerCase()}`;

        // 1. Vérifier le cache
        const cachedResults = cacheService.get(cacheKey);
        if (cachedResults) {
            return cachedResults;
        }

        // 2. Requêter la BDD
        const results = await repository.searchCities(term);

        // 3. Mettre en cache
        // On peut mettre en cache même un tableau vide pour éviter de re-requêter 
        // pour un terme qui ne donne rien, mais avec un TTL plus court.
        const ttl = results.length > 0 ? TTL_CITY_SEARCH : 60; // 1 min si vide
        cacheService.set(cacheKey, results, ttl);

        return results;
    };

    create = async (payload, user, meta = {}) => {
        const { type } = payload;

        switch (type) {
            case "country":
                return this.createCountry(payload);
            case "region":
                return this.createRegion(payload);
            case "city":
                return this.createCity(payload);
            case "location":
                return this.createLocation(payload, user);
            default:
                throw new ApiError(400, "Type de localisation invalide.");
        }
    };

    /* ---------- Pays ---------- */

    createCountry = async ({ name, code, phoneCode, coords }) => {
        const existing = await repository.findCountryByCode(code);

        if (existing) {
            throw new ApiError(409, "Un pays avec ce code existe déjà.");
        }

        return repository.createCountry({
            name: name.trim(),
            code: code.toUpperCase(),
            phoneCode: phoneCode.trim(),
        });
    };

    /* ---------- Région ---------- */

    createRegion = async ({ name, code, countryId }) => {
        const country = await repository.findCountryById(countryId);

        if (!country) {
            throw new ApiError(404, "Pays introuvable.");
        }

        const existing = await repository.findRegionByNameAndCountry(
            name.trim(),
            countryId
        );

        if (existing) {
            throw new ApiError(
                409,
                "Une région avec ce nom existe déjà dans ce pays."
            );
        }

        return repository.createRegion({
            name: name.trim(),
            code: code?.trim() || null,
            countryId,
        });
    };

    /* ---------- Ville ---------- */

    createCity = async ({ name, countryId, regionId, coords }) => {
        const country = await repository.findCountryById(countryId);

        if (!country) {
            throw new ApiError(404, "Pays introuvable.");
        }

        if (regionId) {
            const region = await repository.findRegionById(regionId);

            if (!region) {
                throw new ApiError(404, "Région introuvable.");
            }

            if (region.countryId !== countryId) {
                throw new ApiError(
                    400,
                    "La région ne appartient pas au pays sélectionné."
                );
            }
        }

        const existing = await repository.findCityByNameAndCountry(
            name.trim(),
            countryId
        );

        if (existing) {
            throw new ApiError(
                409,
                "Une ville avec ce nom existe déjà dans ce pays."
            );
        }

        return repository.createCity({
            name: name.trim(),
            countryId,
            regionId: regionId || null,
            latitude: parseCoord(coords?.lat),
            longitude: parseCoord(coords?.lng),
        });
    };

    /* ---------- Point d'arrêt ---------- */

    createLocation = async ({ name, cityId, coords }) => {
        const city = await repository.findCityById(cityId);

        if (!city) {
            throw new ApiError(404, "Ville introuvable.");
        }

        return repository.createLocation({
            name: name.trim(),
            cityId,
            latitude: parseCoord(coords?.lat),
            longitude: parseCoord(coords?.lng),
        });
    };
};

module.exports = new LocationService();