const ApiError = require("../../utils/ApiError");
const ensureCompanyAccess = require("../../utils/ensureCompanyAccess");

const agencyRepository = require("../agencies/agency.repository");
const busRepository = require("../buses/bus.repository");
const routeRepository = require("../routes/route.repository");
const tripRepository = require('../trips/trip.repository');
const repository = require("./schedule.repository");

/* ------------------------------------------------------------------ */

class ScheduleService {
    getSchedules = async (filters, user) => {
        /* ---------- 1. companyId ---------- */

        let companyId = null;

        if (user.role === "SUPER_ADMIN") {
            companyId = filters.companyId ?? null;
        } else {
            if (!user.companyId) {
                throw new ApiError(403, "Aucune compagnie associée à cet utilisateur.");
            }
            companyId = user.companyId;
        }

        /* ---------- 2. Pagination ---------- */

        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
        const skip = (page - 1) * limit;

        /* ---------- 3. Tri (whitelist) ---------- */

        const SORTABLE_FIELDS = new Set([
            "createdAt", "updatedAt", "startDate", "endDate",
            "price", "durationMinutes", "active",
        ]);

        const sortBy = SORTABLE_FIELDS.has(filters.sortBy)
            ? filters.sortBy
            : "createdAt";
        const sortOrder = filters.sortOrder === "asc" ? "asc" : "desc";

        /* ---------- 4. Jours normalisés ---------- */

        const daysOfWeek = filters.daysOfWeek
            ? (Array.isArray(filters.daysOfWeek) ? filters.daysOfWeek : [filters.daysOfWeek])
                .map((d) => String(d).trim().toUpperCase())
            : null;

        /* ---------- 5. Repository ---------- */

        const { items, total } = await repository.findMany({
            companyId,
            routeId: filters.routeId ?? null,
            busId: filters.busId ?? null,
            status: filters.status ?? null,
            search: filters.search ?? null,
            daysOfWeek,
            startDate: filters.startDate ? new Date(filters.startDate) : null,
            endDate: filters.endDate ? new Date(filters.endDate) : null,
            skip,
            take: limit,
            sortBy,
            sortOrder,
        });

        /* ---------- 6. DTO ---------- */

        const schedules = items.map((schedule) => ({
            id: schedule.id,

            route: schedule.route
                ? {
                    id: schedule.route.id,
                    origin: schedule.route.originCity?.name ?? null,
                    destination: schedule.route.destinationCity?.name ?? null,
                    distanceKm: schedule.route.distanceKm,
                }
                : null,

            departureAgency: schedule.departureAgency
                ? { id: schedule.departureAgency.id, name: schedule.departureAgency.name }
                : null,

            arrivalAgency: schedule.arrivalAgency
                ? { id: schedule.arrivalAgency.id, name: schedule.arrivalAgency.name }
                : null,

            startDate: schedule.startDate,
            endDate: schedule.endDate,
            daysOfWeek: schedule.daysOfWeek,

            departures: (schedule.departures ?? []).map((d) => ({
                id: d.id,
                departureTime: d.departureTime,
                bus: d.bus
                    ? {
                        id: d.bus.id,
                        name: d.bus.name,
                        registrationNumber: d.bus.registrationNumber,
                        capacity: d.bus.capacity,
                    }
                    : null,
            })),

            departureCount: schedule.departures?.length ?? 0,

            // ✅ champs propres à Schedule, pas à Route
            price: schedule.route.basePrice,
            durationMinutes: schedule.route.durationMin,

            active: schedule.active,
            autoGenerate: schedule.autoGenerate,

            tripsCount: schedule._count?.trips ?? 0,

            createdAt: schedule.createdAt,
            updatedAt: schedule.updatedAt,

            // ✅ null-safe
            company: schedule.route?.company
                ? {
                    name: schedule.route.company.name,
                    logo: schedule.route.company.logo,
                }
                : null,
        }));

        /* ---------- 7. Retour ---------- */

        return {
            items: schedules,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1,
            },
        };
    };

    create = async (data, user) => {
        const {
            routeId,
            departureAgencyId,
            arrivalAgencyId,
            daysOfWeek,
            startDate,
            endDate,
            autoGenerate,
            departures,
        } = data;

        /* =========================================================
           1. Vérifier la ligne
        ========================================================= */

        const route = await routeRepository.findRouteById(routeId);

        if (!route) {
            throw new ApiError(404, "Ligne introuvable.");
        }

        if (!route.active) {
            throw new ApiError(
                400,
                "Impossible de créer une programmation sur une ligne inactive."
            );
        }

        ensureCompanyAccess(route.companyId, user);

        /* =========================================================
           2. Vérifier les agences
        ========================================================= */

        await this.validateAgency({
            route,
            departureAgencyId,
            arrivalAgencyId,
        });

        /* =========================================================
           3. Vérifier chaque bus
        ========================================================= */

        const busIds = departures.map((d) => d.busId);
        const buses = await busRepository.findManyByIds(busIds);
        const busMap = new Map(buses.map((b) => [b.id, b]));

        for (const dep of departures) {
            const bus = busMap.get(dep.busId);

            if (!bus) {
                throw new ApiError(
                    404,
                    `Bus introuvable pour le départ à ${dep.departureTime}.`
                );
            }

            if (bus.status === "RETIRED") {
                throw new ApiError(
                    400,
                    `Le bus du départ à ${dep.departureTime} est retiré.`
                );
            }

            if (bus.companyId !== route.companyId) {
                throw new ApiError(
                    400,
                    `Le bus du départ à ${dep.departureTime} n'appartient pas à la compagnie.`
                );
            }

            ensureCompanyAccess(bus.companyId, user);
        }

        /* =========================================================
           4. Vérifier l'unicité des heures
        ========================================================= */

        const seenTimes = new Set();

        for (const dep of departures) {
            if (seenTimes.has(dep.departureTime)) {
                throw new ApiError(
                    400,
                    `L'heure ${dep.departureTime} est déjà utilisée.`
                );
            }
            seenTimes.add(dep.departureTime);
        }

        /* =========================================================
           5. Vérifier les conflits de bus DANS ce schedule
              (avant même de créer)
        ========================================================= */

        const durationMinutes = route.durationMin;
        const bufferMinutes = 60;   // 1h de battement entre 2 trajets

        if (durationMinutes) {
            const timeline = new Map(); // busId → [{start, end}]

            for (const dep of departures) {
                const [h, m] = dep.departureTime.split(":").map(Number);
                const startMin = h * 60 + m;
                const endMin = startMin + durationMinutes + bufferMinutes;

                const existing = timeline.get(dep.busId) ?? [];

                const hasConflict = existing.some(
                    (slot) => startMin < slot.end && endMin > slot.start
                );

                if (hasConflict) {
                    throw new ApiError(
                        400,
                        `Le bus utilisé à ${dep.departureTime} est déjà occupé sur une plage proche.`
                    );
                }

                existing.push({ start: startMin, end: endMin });
                timeline.set(dep.busId, existing);
            }
        }

        /* =========================================================
           6. Créer la programmation
        ========================================================= */

        const schedule = await repository.create({
            companyId: route.companyId,
            routeId,
            departureAgencyId,
            arrivalAgencyId,

            price: route.basePrice,
            durationMinutes: route.durationMin ?? 0,

            daysOfWeek,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            autoGenerate,

            departures: {
                create: departures.map((d) => ({
                    busId: d.busId,
                    departureTime: d.departureTime,
                })),
            },
        });

        /* =========================================================
           7. Générer les trips si autoGenerate
        ========================================================= */

        if (autoGenerate) {
            await this.generateTrips(schedule.id, user);
        }

        return schedule;
    };

    /* =========================================================
       validateAgency
    ========================================================= */

    validateAgency = async ({
        route,
        departureAgencyId,
        arrivalAgencyId,
    }) => {
        if (!departureAgencyId || !arrivalAgencyId) {
            throw new ApiError(
                400,
                "Les agences de départ et d'arrivée sont obligatoires."
            );
        }

        const [departureAgency, arrivalAgency] = await Promise.all([
            agencyRepository.findById(departureAgencyId),
            agencyRepository.findById(arrivalAgencyId),
        ]);

        if (!departureAgency) {
            throw new ApiError(404, "L'agence de départ est introuvable.");
        }

        if (!arrivalAgency) {
            throw new ApiError(404, "L'agence d'arrivée est introuvable.");
        }

        if (
            departureAgency.status !== "ACTIVE" ||
            arrivalAgency.status !== "ACTIVE"
        ) {
            throw new ApiError(400, "Les deux agences doivent être actives.");
        }

        if (
            departureAgency.companyId !== route.companyId ||
            arrivalAgency.companyId !== route.companyId
        ) {
            throw new ApiError(
                400,
                "Les agences doivent appartenir à la compagnie de la ligne."
            );
        }

        /* ⚠️ Vérifie que ton modèle Agency a bien un cityId */
        if (departureAgency.cityId !== route.originCityId) {
            throw new ApiError(
                400,
                "L'agence de départ doit être dans la ville d'origine."
            );
        }

        if (arrivalAgency.cityId !== route.destinationCityId) {
            throw new ApiError(
                400,
                "L'agence d'arrivée doit être dans la ville de destination."
            );
        }
    };

    /**
 * Génère les trips d'un schedule pour les 30 prochains jours.
 *
 * @param {string} scheduleId
 * @param {object} user
 * @returns {Promise<{ created: number, skipped: number }>}
 */
    generateTrips = async (scheduleId, user) => {
        const HORIZON_DAYS = 30;
        const BUFFER_MINUTES = 60;

        /* =========================================================
           1. Récupérer le schedule complet
        ========================================================= */

        const schedule = await repository.findById(scheduleId);

        if (!schedule) {
            throw new ApiError(404, "Programmation introuvable.");
        }

        if (!schedule.active) {
            return { created: 0, skipped: 0 };
        }

        ensureCompanyAccess(schedule.companyId, user);

        if (!schedule.durationMinutes) {
            return { created: 0, skipped: 0 };
        }

        if (!schedule.departures || schedule.departures.length === 0) {
            return { created: 0, skipped: 0 };
        }

        /* =========================================================
           2. Déterminer la plage de dates
        ========================================================= */

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const horizonEnd = new Date(today);
        horizonEnd.setDate(horizonEnd.getDate() + HORIZON_DAYS);

        const periodStart =
            schedule.startDate > today ? schedule.startDate : today;

        const periodEnd =
            schedule.endDate && schedule.endDate < horizonEnd
                ? schedule.endDate
                : horizonEnd;

        if (periodStart > periodEnd) {
            return { created: 0, skipped: 0 };
        }

        /* =========================================================
           3. Lister les dates éligibles
        ========================================================= */

        const DAY_INDEX = {
            SUNDAY: 0,
            MONDAY: 1,
            TUESDAY: 2,
            WEDNESDAY: 3,
            THURSDAY: 4,
            FRIDAY: 5,
            SATURDAY: 6,
        };

        const allowedDays = schedule.daysOfWeek.map((d) => DAY_INDEX[d]);
        const eligibleDates = [];

        const cursor = new Date(periodStart);
        while (cursor <= periodEnd) {
            if (allowedDays.includes(cursor.getDay())) {
                eligibleDates.push(new Date(cursor));
            }
            cursor.setDate(cursor.getDate() + 1);
        }

        /* =========================================================
           4. Construire la liste des trips à créer
        ========================================================= */

        const tripsToCreate = [];

        for (const date of eligibleDates) {
            for (const dep of schedule.departures) {
                const [h, m] = dep.departureTime.split(":").map(Number);

                const departureAt = new Date(date);
                departureAt.setHours(h, m, 0, 0);

                const arrivalAt = new Date(
                    departureAt.getTime() +
                    schedule.durationMinutes * 60 * 1000
                );

                tripsToCreate.push({
                    // companyId: schedule.companyId,
                    routeId: schedule.routeId,
                    busId: dep.busId,
                    scheduleId: schedule.id,
                    departureAgencyId: schedule.departureAgencyId,
                    arrivalAgencyId: schedule.arrivalAgencyId,
                    departureAt,
                    arrivalAt,
                    price: schedule.price,
                    status: "SCHEDULED",
                });
            }
        }

        if (tripsToCreate.length === 0) {
            return { created: 0, skipped: 0 };
        }

        /* =========================================================
           5. Vérifier les conflits de bus
        ========================================================= */

        const busIds = [...new Set(tripsToCreate.map((t) => t.busId))];

        const existingTrips =
            await tripRepository.findManyByBusIdsAndPeriod({
                busIds,
                from: periodStart,
                to: new Date(periodEnd.getTime() + 24 * 60 * 60 * 1000),
            });

        // Index par busId
        const existingByBus = new Map();
        for (const t of existingTrips) {
            if (!existingByBus.has(t.busId)) {
                existingByBus.set(t.busId, []);
            }
            existingByBus.get(t.busId).push(t);
        }

        // Filtrer les conflits et doublons
        const validTrips = [];

        for (const trip of tripsToCreate) {
            const existing = existingByBus.get(trip.busId) ?? [];

            /* Idempotence : même scheduleId + même departureAt */
            const alreadyExists = existing.some(
                (t) =>
                    t.scheduleId === trip.scheduleId &&
                    t.departureAt.getTime() === trip.departureAt.getTime()
            );

            if (alreadyExists) continue;

            /* Conflit avec un autre trip */
            const hasConflict = existing.some((t) => {
                const start =
                    trip.departureAt.getTime() -
                    BUFFER_MINUTES * 60 * 1000;
                const end =
                    trip.arrivalAt.getTime() +
                    BUFFER_MINUTES * 60 * 1000;

                const tStart = t.departureAt.getTime();
                const tEnd =
                    t.arrivalAt?.getTime() ?? t.departureAt.getTime();

                return start < tEnd && end > tStart;
            });

            if (hasConflict) continue;

            validTrips.push(trip);
        }

        /* =========================================================
           6. Insérer en bulk
        ========================================================= */

        if (validTrips.length === 0) {
            return { created: 0, skipped: tripsToCreate.length };
        }

        const result = await tripRepository.createMany(validTrips);

        return {
            created: result.count,
            skipped: tripsToCreate.length - result.count,
        };
    };

    /**
 * Génère les trips pour TOUS les schedules actifs avec autoGenerate.
 * Utilisé par le cron.
 *
 * @returns {Promise<{ created: number, skipped: number, schedules: number, errors: number }>}
 */
    generateAllTrips = async () => {
        const schedules = await repository.findActiveForGeneration();

        let totalCreated = 0;
        let totalSkipped = 0;
        let errors = 0;

        for (const schedule of schedules) {
            try {
                const result = await this.generateTrips(schedule.id, {
                    role: "SUPER_ADMIN",
                    // companyId: schedule.companyId,
                });

                totalCreated += result.created;
                totalSkipped += result.skipped;
            } catch (err) {
                errors += 1;
                console.error(
                    `[generateAllTrips] Error for schedule ${schedule.id}:`,
                    err.message
                );
            }
        }

        return {
            schedules: schedules.length,
            created: totalCreated,
            skipped: totalSkipped,
            errors,
        };
    };
}

module.exports = new ScheduleService();