const repository = require('./location.repository');
const cacheService = require('../../services/cache.service');

// Durées de vie (TTL) en secondes
const TTL_COUNTRIES = 3600; // 1 heure
const TTL_CITIES_LIST = 1800; // 30 minutes
const TTL_CITY_SEARCH = 600; // 10 minutes pour les recherches

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
};

module.exports = new LocationService();