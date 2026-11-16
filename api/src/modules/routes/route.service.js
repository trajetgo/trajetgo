const ApiError = require('../../utils/ApiError');
const companyRepository = require('../companies/company.repository');
const repository = require('./route.repository');

class RouteService {
    /* =========================================================
       ROUTES
    ========================================================= */

    getRoutes = async (filters, user) => {
        const query = { ...filters };

        // Un non-SUPER_ADMIN ne voit que les routes de sa compagnie
        if (user.role !== "SUPER_ADMIN") {
            if (!user.companyId) {
                throw new ApiError(
                    403,
                    "Aucune compagnie associée à cet utilisateur"
                );
            }
            query.companyId = user.companyId;
        }

        return repository.findMany(query);
    };

    /* =========================================================
        LOCATIONS
     ========================================================= */

    /**
     * Récupère une ville + ses lieux actifs.
     * @param {string} cityId
     */
    getLocationsByCity = async (cityId) => {
        if (!cityId) {
            throw new ApiError(400, "L'identifiant de la ville est requis");
        }

        const city = await repository.findCityById(cityId);

        if (!city) {
            throw new ApiError(404, "Ville introuvable");
        }

        return repository.findLocationsByCityId(cityId);

        // return {
        //     city: {
        //         id: city.id,
        //         name: city.name,
        //         code: city.code,
        //     },
        //     locations: city.locations,   // déjà filtré active: true
        // };
    }

    /* =========================================================
       CITIES
    ========================================================= */

    getCities = async (filters = {}) => {
        const cities = await repository.findCities(filters);

        if (!cities.length) {
            throw new ApiError(404, "Aucune ville trouvée");
        }

        // Nettoyage : transforme _count en locationCount
        return cities.map(({ _count, ...city }) => ({
            ...city,
            locationCount: _count?.locations ?? 0,
        }));
    };

    getRouteById = async (id, user) => {
        const route = await repository.findById(id);

        if (!route) {
            throw new ApiError(
                404,
                "Ligne introuvable"
            )
        }

        if (
            user.role !== 'SUPER_ADMIN' &&
            route.companyId !== user.companyId
        ) {
            throw new ApiError(
                403,
                'Vous n’avez pas accès à cette route'
            );
        }

        return route;
    }

    createRoute = async (data, user) => {
        let companyId = data.companyId;

        if (user.role !== 'SUPER_ADMIN') {
            companyId = user.companyId;
        }

        if (!companyId) {
            throw new ApiError(
                403,
                'Aucune compagnie associée à cet utilisateur'
            );
        }

        const company =
            await companyRepository.findById(
                companyId
            );

        if (!company) {
            throw new ApiError(
                404,
                'Compagnie introuvable'
            );
        }

        if (data.originCityId === data.destinationCityId) {
            throw new ApiError(
                400,
                'La ville de départ et la ville de destination doivent être différentes'
            )
        }

        const existingRoute = await repository.findByCities(
            data.originCityId,
            data.destinationCityId,
            data.companyId
        );

        if (existingRoute) {
            throw new ApiError(
                409,
                "Cette route existe déjà"
            )
        }

        return repository.create({
            companyId,
            originCityId: data.originCityId,
            destinationCityId: data.destinationCityId,
            distanceKm: data.distanceKm,
            durationMin: data.durationMin,
            basePrice: data.basePrice
        });
    }

    updateRoute = async (id, data) => {
        await this.getRouteById(id);

        const updateData = {};

        if (data.distanceKm !== undefined) {
            updateData.distanceKm = data.distanceKm;
        }

        if (data.durationMin !== undefined) {
            updateData.durationMin = data.durationMin;
        }

        if (data.active !== undefined) {
            updateData.active = data.active;
        }

        if (data.originCityId || data.destinationCityId) {
            const route = await repository.findById(id);

            const originCityId =
                data.originCityId || route.originCityId;

            const destinationCityId =
                data.destinationCityId || route.destinationCityId;

            if (originCityId === destinationCityId) {
                throw new ApiError(
                    400,
                    'La ville de départ et la ville de destination doivent être différentes'
                )
            }

            const existingRoute = await repository.findByCities(
                originCityId,
                destinationCityId
            );

            if (existingRoute && existingRoute.id !== id) {
                throw new ApiError(
                    409,
                    "Cette route existe déjà"
                )
            }

            updateData.originCityId = originCityId;
            updateData.destinationCityId = destinationCityId;
        }

        return repository.update(id, updateData);
    }

    deleteRoute = async (id) => {
        await this.getRouteById(id);

        return repository.deleteById(id);
    }
};

module.exports = new RouteService();