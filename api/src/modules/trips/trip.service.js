const ApiError = require('../../utils/ApiError');
const busRepository = require('../buses/bus.repository');
const repository = require('./trip.repository');
const agencyRepository = require('../agencies/agency.repository');
const ensureCompanyAccess = require('../../utils/ensureCompanyAccess');
const formatDuration = require('../../utils/trip.utils');
const { getDayRange } = require('../../utils/dateRange');

const VALID_STATUSES = [
    'SCHEDULED',
    'BOARDING',
    'DEPARTED',
    'ARRIVED',
    'CANCELLED'
];

class TripService {

    findById = async (id) => {
        return repository.findById(id);
    };

    getTrips = async (filters, user) => {
        if (!user) {
            throw new ApiError(
                401,
                "Authentification requise"
            );
        }

        let companyId = null;
        let agencyId = null;

        if (user.role === "SUPER_ADMIN") {
            companyId = filters.companyId || undefined;
        } else {
            if (!user.companyId) {
                throw new ApiError(
                    403,
                    "Aucune compagnie associée à cet utilisateur"
                );
            }

            companyId = user.companyId;
        }

        if (user.role === "AGENCY_AGENT") {
            if (!user.agencyId) {
                throw new ApiError(
                    403,
                    "Aucune agence associée à cet utilisateur"
                );
            }

            agencyId = user.agencyId;
        }

        const trips = await repository.findMany({
            companyId,
            agencyId,
            routeId: filters.routeId,
            busId: filters.busId,
            status: filters.status,
            date: filters.date,
        });

        return trips.map((trip) => {
            const booked = trip._count.bookings;
            const total = trip.bus?.capacity ?? 0;

            return {
                id: trip.id,

                departure: {
                    agency: trip.departureAgency.name,
                    city: trip.departureAgency?.city?.name || null,
                    time: trip.departureAt,
                },

                arrival: {
                    agency: trip.arrivalAgency.name,
                    city: trip.arrivalAgency?.city?.name || null,
                    time: trip.arrivalAt,
                },

                duration: trip.arrivalAt
                    ? formatDuration(
                        trip.departureAt,
                        trip.arrivalAt
                    )
                    : null,

                date: trip.departureAt,

                bus: {
                    id: trip.bus?.id || null,
                    name: trip.bus?.name || null,
                    capacity: total,
                },

                seats: {
                    booked,
                    total,
                    available: Math.max(
                        0,
                        total - booked
                    ),
                    occupancyRate:
                        total > 0
                            ? booked / total
                            : 0,
                },

                price: trip.price,
                status: trip.status,
            };
        });
    };

    getSeatsForTrip = async (id, user) => {
        const trip = await repository.findById(id);

        if (!trip) {
            throw new ApiError(404, "Trajet introuvable.");
        }

        ensureCompanyAccess(
            trip.route.companyId,
            user
        );

        return await repository.getSeatsForTrip({
            tripId: trip.id,
            busId: trip.busId
        });
    }


    getTripById = async (id) => {
        const trip = await this.findById(id);

        if (!trip) {
            throw new ApiError(404, "Trajet introuvable.");
        }

        const bookings = trip.bookings ?? [];
        const total = trip.bus?.capacity ?? 0;

        const bookedSeatIds = new Set(
            (trip.bookings ?? [])
                .map((booking) => booking.seatId)
                .filter(Boolean)
        );

        const booked = bookedSeatIds.size;

        const rawSeats = trip.bus?.seatLayout?.seats ?? [];

        const seats = rawSeats.map((seat) => ({
            id: seat.id,
            number: seat.number,
            row: seat.row,
            column: seat.column,
            position: seat.position ?? null,
            status:
                seat.status !== "ACTIVE"
                    ? "INACTIVE"
                    : bookedSeatIds.has(seat.id)
                        ? "OCCUPIED"
                        : "AVAILABLE",
        }));

        const unavailableSeatIds = seats
            .filter((seat) => seat.status !== "AVAILABLE")
            .map((seat) => seat.id);

        return {
            id: trip.id,

            departure: {
                agency: {
                    id: trip.departureAgency?.id ?? null,
                    name: trip.departureAgency?.name ?? null,
                },
                city: {
                    id: trip.departureAgency?.city?.id ?? null,
                    name: trip.departureAgency?.city?.name ?? null,
                },
                time: trip.departureAt,
            },

            arrival: {
                agency: {
                    id: trip.arrivalAgency?.id ?? null,
                    name: trip.arrivalAgency?.name ?? null,
                },
                city: {
                    id: trip.arrivalAgency?.city?.id ?? null,
                    name: trip.arrivalAgency?.city?.name ?? null,
                },
                time: trip.arrivalAt,
            },

            company: trip.route?.company
                ? {
                    id: trip.route.company.id,
                    name: trip.route.company.name,
                    logo: trip.route.company.logo,
                }
                : null,

            duration: trip.arrivalAt
                ? formatDuration(trip.departureAt, trip.arrivalAt)
                : null,

            date: trip.departureAt,

            bus: trip.bus
                ? {
                    id: trip.bus.id,
                    name: trip.bus.name,
                    registrationNumber: trip.bus.registrationNumber,
                    fleetNumber: trip.bus.fleetNumber,
                    capacity: total,
                    seatLayout: trip.bus.seatLayout
                        ? {
                            id: trip.bus.seatLayout.id,
                            name: trip.bus.seatLayout.name,
                            type: trip.bus.seatLayout.type,
                            rows: trip.bus.seatLayout.rows,
                            columns: trip.bus.seatLayout.columns,
                            aisleAfterColumn:
                                trip.bus.seatLayout.aisleAfterColumn,
                            seats,
                        }
                        : null,
                }
                : null,

            seats: {
                booked,
                total,
                available: seats.filter(
                    (seat) => seat.status === "AVAILABLE"
                ).length,
                occupancyRate: total > 0 ? booked / total : 0,
            },

            unavailableSeatIds,
            price: trip.price,
            status: trip.status,
        };
    };

    validateAgency = async ({
        route,
        departureAgencyId,
        arrivalAgencyId
    }) => {
        if (!departureAgencyId || !arrivalAgencyId) {
            throw new ApiError(
                400,
                "Les agences de départ et d'arrivée sont obligatoires"
            );
        }

        const [departureAgency, arrivalAgency] = await Promise.all([
            agencyRepository.findById(departureAgencyId),
            agencyRepository.findById(arrivalAgencyId),
        ]);

        if (!departureAgency) {
            throw new ApiError(
                404,
                "L'agence de départ est introuvable"
            );
        }

        if (!arrivalAgency) {
            throw new ApiError(
                404,
                "L'agence d'arrivée est introuvable"
            );
        }

        if (
            !["ACTIVE"].includes(departureAgency.status) ||
            !["ACTIVE"].includes(arrivalAgency.status)
        ) {
            throw new ApiError(
                400,
                "Les deux agences doivent être actives"
            );
        }

        if (
            departureAgency.companyId !== route.companyId ||
            arrivalAgency.companyId !== route.companyId
        ) {
            throw new ApiError(
                400,
                "Les agences doivent appartenir à la compagnie de la ligne"
            );
        }

        if (
            departureAgency.cityId !== route.originCityId
        ) {
            throw new ApiError(
                400,
                "L'agence de départ doit se situer dans la ville d'origine de la ligne"
            );
        }

        if (
            arrivalAgency.cityId !== route.destinationCityId
        ) {
            throw new ApiError(
                400,
                "L'agence d'arrivée doit se situer dans la ville de destination de la ligne"
            );
        }
    };

    createTrip = async (data, user) => {
        const {
            routeId,
            busId,
            departureAgencyId,
            arrivalAgencyId,
            departureAt,
            arrivalAt,
            price
        } = data;

        const route =
            await repository.findRouteById(routeId);

        if (!route) {
            throw new ApiError(
                404,
                'Ligne introuvable'
            );
        }

        if (!route.active) {
            throw new ApiError(
                400,
                'Impossible de créer un trajet sur une ligne inactive'
            );
        }

        const tripPrice = route.basePrice;

        ensureCompanyAccess(
            route.companyId,
            user
        );

        const bus =
            await busRepository.findById(busId);

        if (!bus) {
            throw new ApiError(
                404,
                'Bus introuvable'
            );
        }

        if (bus.status === 'RETIRED') {
            throw new ApiError(
                400,
                'Impossible d’utiliser un bus retiré'
            );
        }

        // RÈGLE MULTI-TENANT ESSENTIELLE
        if (route.companyId !== bus.companyId) {
            throw new ApiError(
                400,
                'La ligne et le bus doivent appartenir à la même compagnie'
            );
        }

        ensureCompanyAccess(
            bus.companyId,
            user
        );

        const departureDate =
            new Date(departureAt);

        if (departureDate <= new Date()) {
            throw new ApiError(
                400,
                'La date de départ doit être dans le futur'
            );
        }

        let arrivalDate = null;

        if (arrivalAt) {
            arrivalDate =
                new Date(arrivalAt);

            if (arrivalDate <= departureDate) {
                throw new ApiError(
                    400,
                    "L'arrivée doit être après le départ"
                );
            }
        }

        await this.validateAgency({
            route,
            departureAgencyId,
            arrivalAgencyId
        });

        return repository.create({
            routeId,
            busId,
            departureAgencyId,
            arrivalAgencyId,
            departureAt: departureDate,
            arrivalAt: arrivalDate,
            price: tripPrice
        });
    };

    updateTrip = async (id, data, user) => {
        const trip = await this.getTripById(id, user);

        if (
            ['DEPARTED', 'ARRIVED'].includes(trip.status)
        ) {
            throw new ApiError(
                400,
                'Impossible de modifier un trajet déjà terminé'
            );
        }

        const finalBusId =
            data.busId !== undefined
                ? data.busId
                : trip.busId;

        const finalDepartureLocationId =
            data.departureLocationId !== undefined
                ? data.departureLocationId
                : trip.departureLocationId;

        const finalArrivalLocationId =
            data.arrivalLocationId !== undefined
                ? data.arrivalLocationId
                : trip.arrivalLocationId;

        const finalDepartureAt =
            data.departureAt !== undefined
                ? new Date(data.departureAt)
                : trip.departureAt;

        const finalArrivalAt =
            data.arrivalAt !== undefined
                ? data.arrivalAt
                    ? new Date(data.arrivalAt)
                    : null
                : trip.arrivalAt;

        /*
         * ==============================
         * BUS
         * ==============================
         */

        const bus = await busRepository.findById(finalBusId);

        if (!bus) {
            throw new ApiError(
                404,
                'Bus introuvable'
            );
        }

        // Règle multi-tenant
        if (
            bus.companyId !==
            trip.route.companyId
        ) {
            throw new ApiError(
                400,
                'Le bus doit appartenir à la même compagnie que la route'
            );
        }

        if (bus.status === 'RETIRED') {
            throw new ApiError(
                400,
                'Impossible d’utiliser un bus retiré'
            );
        }

        /*
         * ==============================
         * DATES
         * ==============================
         */

        if (finalDepartureAt <= new Date()) {
            throw new ApiError(
                400,
                'La date de départ doit être dans le futur'
            );
        }

        if (
            finalArrivalAt &&
            finalArrivalAt <= finalDepartureAt
        ) {
            throw new ApiError(
                400,
                "L'arrivée doit être après le départ"
            );
        }

        /*
         * ==============================
         * LOCATIONS
         * ==============================
         */

        await this.validateLocation({
            route: trip.route,
            departureLocationId:
                finalDepartureLocationId,
            arrivalLocationId:
                finalArrivalLocationId
        });

        /*
         * ==============================
         * DONNÉES À MODIFIER
         * ==============================
         */

        const updateData = {};

        if (data.busId !== undefined) {
            updateData.busId = finalBusId;
        }

        if (data.departureLocationId !== undefined) {
            updateData.departureLocationId =
                finalDepartureLocationId;
        }

        if (data.arrivalLocationId !== undefined) {
            updateData.arrivalLocationId =
                finalArrivalLocationId;
        }

        if (data.departureAt !== undefined) {
            updateData.departureAt =
                finalDepartureAt;
        }

        if (data.arrivalAt !== undefined) {
            updateData.arrivalAt =
                finalArrivalAt;
        }

        if (data.price !== undefined) {
            updateData.price = data.price;
        }

        if (data.status !== undefined) {
            if (!VALID_STATUSES.includes(data.status)) {
                throw new ApiError(
                    400,
                    'Statut de trajet invalide'
                );
            }

            updateData.status = data.status;
        }

        return repository.update(
            id,
            updateData
        );
    };

    cancelTrip = async (id, user) => {
        const trip =
            await this.getTripById(id, user);

        if (trip.status === 'DEPARTED') {
            throw new ApiError(
                400,
                'Impossible d’annuler un trajet déjà parti'
            );
        }

        if (trip.status === 'ARRIVED') {
            throw new ApiError(
                400,
                'Un trajet arrivé ne peut plus être annulé'
            );
        }

        if (trip.status === 'CANCELLED') {
            throw new ApiError(
                400,
                'Ce trajet est déjà annulé'
            );
        }

        return repository.update(id, {
            status: 'CANCELLED'
        });
    };

    searchTrips = async (filters) => {
        const { from, to, date } = filters;

        /* ---------- Validation ---------- */

        if (!from || !to) {
            throw new ApiError(400, "Les villes de départ et d'arrivée sont requises.");
        }

        if (from === to) {
            throw new ApiError(400, "La ville de départ et la ville d'arrivée doivent être différentes.");
        }

        if (!date) {
            throw new ApiError(400, "La date est requise.");
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            throw new ApiError(400, "Date invalide. Format attendu : YYYY-MM-DD.");
        }

        /* ---------- Plage de la journée ---------- */

        const { start, end, isToday } = getDayRange(date, new Date());

        /* ---------- Pagination ---------- */

        const limit = Math.min(Number(filters.limit) || 20, 50);
        const offset = Number(filters.offset) || 0;

        /* ---------- Fetch ---------- */

        const trips = await repository.search({
            originCityId: from,
            destinationCityId: to,
            startDate: start,
            endDate: end,
            limit,
            offset,
        });

        /* ---------- DTO ---------- */

        return trips.map((trip) => {
            const departureAt = trip.departureAt;
            const arrivalAt = trip.arrivalAt;

            const durationMinutes =
                departureAt && arrivalAt
                    ? Math.round((new Date(arrivalAt) - new Date(departureAt)) / 60000)
                    : null;

            const totalSeats = trip.bus?.capacity ?? 0;
            const bookedSeats = trip._count?.bookings ?? 0;
            const availableSeats = Math.max(0, totalSeats - bookedSeats);

            return {
                id: trip.id,

                route: trip.route
                    ? {
                        id: trip.route.id,
                        distanceKm: trip.route.distanceKm,
                        basePrice: trip.route.basePrice,
                        company: trip.route.company
                            ? {
                                id: trip.route.company.id,
                                name: trip.route.company.name,
                                logo: trip.route.company.logo,
                            }
                            : null,
                    }
                    : null,

                departure: {
                    city: trip.route?.originCity
                        ? { id: trip.route.originCity.id, name: trip.route.originCity.name }
                        : null,
                    agency: trip.departureAgency
                        ? { id: trip.departureAgency.id, name: trip.departureAgency.name }
                        : null,
                    at: departureAt,
                    time: departureAt
                        ? new Date(departureAt).toISOString().slice(11, 16)
                        : null,
                },

                arrival: {
                    city: trip.route?.destinationCity
                        ? { id: trip.route.destinationCity.id, name: trip.route.destinationCity.name }
                        : null,
                    agency: trip.arrivalAgency
                        ? { id: trip.arrivalAgency.id, name: trip.arrivalAgency.name }
                        : null,
                    at: arrivalAt,
                    time: arrivalAt
                        ? new Date(arrivalAt).toISOString().slice(11, 16)
                        : null,
                },

                bus: trip.bus
                    ? {
                        id: trip.bus.id,
                        name: trip.bus.name,
                        registrationNumber: trip.bus.registrationNumber,
                        fleetNumber: trip.bus.fleetNumber,
                        capacity: trip.bus.capacity,
                        amenities: trip.bus.amenities ?? [],
                    }
                    : null,

                duration: durationMinutes,
                durationLabel: durationMinutes
                    ? `${Math.floor(durationMinutes / 60)}h${String(durationMinutes % 60).padStart(2, "0")}`
                    : null,

                availableSeats,
                totalSeats,

                price: trip.price,
                currency: "XOF",

                status: trip.status,
                scheduleId: trip.scheduleId,
            };
        });
    };

    getPricesAroundDate = async (filters) => {
        const { from, to, date, range = 2 } = filters;

        /* ✅ Range maximum = 2 (J-2 → J+2 = 5 jours) */
        const safeRange = Math.min(Number(range) || 2, 2);

        /* ---------- Validation ---------- */

        const center = new Date(`${date}T00:00:00.000Z`);

        if (isNaN(center.getTime())) {
            throw new ApiError(400, "Date invalide.");
        }

        /* ---------- Plage EXACTE : J-2 → J+2 ---------- */

        const startDate = new Date(center);
        startDate.setUTCDate(startDate.getUTCDate() - safeRange);

        const endDate = new Date(center);
        endDate.setUTCDate(endDate.getUTCDate() + safeRange);
        // ✅ endDate = J+2 (inclus)

        /* Le repository doit chercher sur [J-2, J+3[  (exclu) */
        const queryEndDate = new Date(endDate);
        queryEndDate.setUTCDate(queryEndDate.getUTCDate() + 1);

        /* ---------- Fetch ---------- */

        const prices = await repository.findPricesByDateRange({
            originCityId: from,
            destinationCityId: to,
            startDate,
            endDate: queryEndDate,
        });

        /* ---------- Compléter les dates manquantes ---------- */

        const priceMap = new Map(prices.map((p) => [p.date, p]));
        const result = [];

        const cursor = new Date(startDate);

        // ✅ On itère de J-2 à J+2 inclus = 5 itérations
        while (cursor <= endDate) {
            const dateKey = cursor.toISOString().split("T")[0];

            result.push(
                priceMap.get(dateKey) ?? {
                    date: dateKey,
                    minPrice: null,
                    tripsCount: 0,
                }
            );

            cursor.setUTCDate(cursor.getUTCDate() + 1);
        }

        // ✅ Sécurité : retourner exactement 5 dates
        return result.slice(0, 5);
    };
}

module.exports = new TripService();