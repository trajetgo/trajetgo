const ApiError = require('../../utils/ApiError');
const repository = require('./bus.repository');
const companyRepository = require('../companies/company.repository');
const bookingService = require('../bookings/booking.service');

const VALID_STATUSES = [
    'ACTIVE',
    'INACTIVE',
    'MAINTENANCE',
    'RETIRED'
];

class BusService {
    getBuses = async (filters, user) => {
        const query = {
            ...filters
        };

        if (user.role !== 'SUPER_ADMIN') {
            query.companyId = user.companyId;
        }

        return repository.findMany(query);
    }

    getBusById = async (id, user) => {
        const bus = await repository.findById(id);

        if (!bus) {
            throw new ApiError(
                404,
                'Bus introuvable'
            );
        }

        if (
            user.role !== 'SUPER_ADMIN' &&
            bus.companyId !== user.companyId
        ) {
            throw new ApiError(
                403,
                'Vous n’avez pas accès à ce bus'
            );
        }

        return bus;
    }

    createBus = async (data, user) => {
        let companyId = data.companyId;

        if (user.role !== "SUPER_ADMIN") {
            if (!user.companyId) {
                throw new ApiError(
                    403,
                    "Aucune compagnie associée à cet utilisateur"
                );
            }

            companyId = user.companyId;
        }

        if (!companyId) {
            throw new ApiError(
                400,
                "La compagnie est obligatoire"
            );
        }

        const company =
            await companyRepository.findById(
                companyId
            );

        if (!company) {
            throw new ApiError(
                404,
                "Compagnie introuvable"
            );
        }

        if (company.status !== "ACTIVE") {
            throw new ApiError(
                400,
                "Impossible de créer un bus pour une compagnie inactive"
            );
        }

        const registrationNumber =
            data.registrationNumber
                .trim()
                .toUpperCase();

        const existingBus =
            await repository.findByRegistrationNumber(
                companyId,
                registrationNumber
            );

        if (existingBus) {
            throw new ApiError(
                409,
                "Ce numéro d'immatriculation est déjà utilisé pour cette compagnie"
            );
        }

        const busData = {
            ...data,
            companyId,
            registrationNumber,
        };

        console.log(
            "DONNÉES AVANT PRISMA :",
            JSON.stringify(busData, null, 2)
        );

        return repository.create(busData);
    };

    updateBus = async (id, data) => {
        const bus = await this.getBusById(id);

        const updateData = {};

        if (data.registrationNumber !== undefined) {
            const registrationNumber =
                data.registrationNumber
                    .trim()
                    .toUpperCase();

            if (
                registrationNumber !==
                bus.registrationNumber
            ) {
                const existingBus =
                    await repository.findByRegistrationNumber(
                        registrationNumber
                    );

                if (
                    existingBus &&
                    existingBus.id !== id
                ) {
                    throw new ApiError(
                        400,
                        'Un bus avec cette immatriculation existe déjà'
                    );
                }
            }

            updateData.registrationNumber =
                registrationNumber;
        }

        if (data.name !== undefined) {
            updateData.name = data.name || null;
        }

        if (data.brand !== undefined) {
            updateData.brand = data.brand || null;
        }

        if (data.model !== undefined) {
            updateData.model = data.model || null;
        }

        if (data.year !== undefined) {
            updateData.year = data.year || null;
        }

        if (data.capacity !== undefined) {
            updateData.capacity = data.capacity;
        }

        if (data.status !== undefined) {
            if (!VALID_STATUSES.includes(data.status)) {
                throw new ApiError(
                    400,
                    'Statut de bus invalide'
                );
            }

            updateData.status = data.status;
        }

        return repository.update(id, updateData);
    }

    deactivateBus = async (id) => {
        await this.getBusById(id);

        return repository.update(id, {
            status: 'INACTIVE'
        });
    }

    updateSeatLayout = async (busId, data, user) => {
        /* ---------- 1. Vérifier le bus ---------- */

        const bus = await repository.findById(busId);

        if (!bus) {
            throw new ApiError(404, "Bus introuvable.");
        }

        /* ---------- 2. Vérifier la propriété ---------- */

        if (user.role !== "SUPER_ADMIN") {
            if (!user.companyId) {
                throw new ApiError(403, "Aucune compagnie associée.");
            }

            if (bus.companyId !== user.companyId) {
                throw new ApiError(
                    403,
                    "Ce bus n'appartient pas à votre compagnie."
                );
            }
        }

        /* ---------- 3. Vérifier que le total actif = capacité ---------- */

        const activeSeats = data.seats.filter(
            (seat) => seat.status === "ACTIVE"
        ).length;

        if (activeSeats !== bus.capacity) {
            throw new ApiError(
                400,
                `Le nombre de sièges actifs (${activeSeats}) doit correspondre ` +
                `à la capacité du bus (${bus.capacity}).`
            );
        }

        /* ---------- 4. Vérifier qu'aucun siège réservé n'est désactivé ---------- */

        const disabledReserved = await bookingService.checkReservedSeats(
            busId,
            data.seats
        );

        if (disabledReserved.length > 0) {
            throw new ApiError(
                409,
                `Impossible de désactiver les sièges réservés : ${disabledReserved.join(", ")}.`
            );
        }

        /* ---------- 5. Upsert ---------- */

        return repository.upsertSeatLayout(busId, {
            name: data.name ?? "Configuration standard",
            type: data.type ?? "CUSTOM",
            rows: data.rows,
            columns: data.columns,
            aisleAfterColumn: data.aisleAfterColumn ?? null,
            seats: data.seats,
        });
    };

    getSeatLayout = async (busId, user) => {
        const layout = await repository.findSeatLayout(busId);

        if (!layout) {
            throw new ApiError(404, "Aucun plan de sièges configuré.");
        }

        if (user.role !== "SUPER_ADMIN") {
            if (!user.companyId) {
                throw new ApiError(403, "Aucune compagnie associée.");
            }

            if (bus.companyId !== user.companyId) {
                throw new ApiError(
                    403,
                    "Ce bus n'appartient pas à votre compagnie."
                );
            }
        }

        return {
            id: layout.id,
            name: layout.name,
            type: layout.type,
            rows: layout.rows,
            columns: layout.columns,
            seats: layout.seats.map((s) => ({
                id: s.id,
                number: s.number,
                row: s.row,
                column: s.column,
                position: s.position,
                status: s.status,
            })),
        };
    };
};

module.exports = new BusService();