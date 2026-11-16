const NodeCache = require("node-cache");

// stdTTL: durée de vie par défaut en secondes (ex: 1 heure = 3600)
// checkperiod: fréquence de nettoyage des clés expirées (ex: 10 min = 600)
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

class CacheService {
    /**
     * Récupère une valeur du cache.
     * @param {string} key 
     * @returns {*} La valeur ou undefined
     */
    get(key) {
        return cache.get(key);
    }

    /**
     * Stocke une valeur dans le cache.
     * @param {string} key 
     * @param {*} value 
     * @param {number} [ttl] - TTL spécifique en secondes (optionnel)
     */
    set(key, value, ttl = undefined) {
        // Si ttl est undefined, node-cache utilisera le stdTTL configuré
        cache.set(key, value, ttl);
    }

    /**
     * Supprime une entrée du cache.
     * @param {string} key 
     */
    del(key) {
        cache.del(key);
    }

    /**
     * Vide tout le cache (utile pour les tests ou après une mise à jour majeure).
     */
    flush() {
        cache.flushAll();
    }
}

module.exports = new CacheService();