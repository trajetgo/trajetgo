const ApiError = require("./ApiError");

const ensureCompanyAccess = (resourceCompanyId, user) => {
    if (!user) {
        throw new ApiError(
            401,
            'Authentification requise'
        );
    }

    // Le SUPER_ADMIN peut accéder à toutes les compagnies
    if (user.role === 'SUPER_ADMIN') {
        return;
    }

    // Les autres utilisateurs doivent être rattachés
    // à une compagnie
    if (!user.companyId) {
        throw new ApiError(
            403,
            'Aucune compagnie associée à cet utilisateur'
        );
    }

    // Empêche l'accès aux ressources d'une autre compagnie
    if (resourceCompanyId !== user.companyId) {
        throw new ApiError(
            403,
            'Vous n’avez pas accès à cette ressource'
        );
    }
};

module.exports = ensureCompanyAccess;