const prisma = require("../../config/database");

const DAYS_MAP = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function combineDateAndTime(date, timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    const result = new Date(date);
    result.setHours(h, m, 0, 0);
    return result;
}

function computeArrival(departureAt, durationMinutes) {
    if (!durationMinutes) return null;
    return new Date(departureAt.getTime() + durationMinutes * 60 * 1000);
}

function resolveDuration(schedule) {
    const duration =
        schedule.durationMinutes ??
        schedule.route.durationMin;

    if (!Number.isInteger(duration) || duration <= 0) {
        throw new Error(
            `Durée invalide pour la programmation ${schedule.id}`
        );
    }

    return duration;
}

class TripGeneratorService {
    /**
 * Génère les Trip pour un Schedule, sur une fenêtre [from, to].
 * Idempotent : utilise upsert sur (scheduleId, departureAt, busId).
 *
 * @param {string} scheduleId
 * @param {Date}   from  - début de la fenêtre (incluse)
 * @param {Date}   to    - fin de la fenêtre (incluse)
 * @param {object} tx    - client Prisma (transaction ou prisma global)
 * @returns {Promise<{ created: number, updated: number, skipped: number }>}
 */

    generateTripsForSchedule = async (scheduleId, from, to, tx = prisma) => {
        const schedule = await tx.schedule.findUnique({
            where: { id: scheduleId },
            include: {
                departures: {
                    include: { bus: true },
                },
                route: true,
            },
        });

        if (!schedule || !schedule.active || !schedule.autoGenerate) {
            return { created: 0, updated: 0, skipped: 0 };
        }

        const stats = { created: 0, updated: 0, skipped: 0 };

        const durationMinutes = resolveDuration(schedule);

        const periodStart = new Date(Math.max(from.getTime(), schedule.startDate.getTime()));
        const periodEnd = schedule.endDate
            ? new Date(Math.min(to.getTime(), schedule.endDate.getTime()))
            : to;

        if (periodStart > periodEnd) return stats;

        const activeDays = new Set(
            schedule.daysOfWeek.map((d) => DAYS_MAP[d]).filter((v) => v !== undefined)
        );

        // Parcourt chaque jour de la fenêtre
        const cursor = new Date(periodStart);
        cursor.setHours(0, 0, 0, 0);

        while (cursor <= periodEnd) {
            if (!activeDays.has(cursor.getDay())) {
                cursor.setDate(cursor.getDate() + 1);
                continue;
            }

            for (const departure of schedule.departures) {
                if (!departure.active) continue;

                const departureAt = combineDateAndTime(cursor, departure.departureTime);
                const arrivalAt = computeArrival(departureAt, durationMinutes);

                // Ignore les départs déjà passés
                if (departureAt < new Date()) {
                    stats.skipped++;
                    continue;
                }

                if (departure.driverId) {
                    const driverConflict = await tx.trip.findFirst({
                        where: {
                            driverId: departure.driverId,
                            status: { in: ["SCHEDULED", "BOARDING", "DEPARTED"] },
                            OR: [
                                {
                                    departureAt: { lt: arrivalAt },
                                    arrivalAt: { gt: departureAt },
                                },
                                {
                                    departureAt: { lt: arrivalAt },
                                    arrivalAt: null,
                                },
                            ],
                        },
                    });

                    if (driverConflict) {
                        stats.skipped++;
                        continue;
                    }
                }

                const existing = await tx.trip.findUnique({
                    where: {
                        scheduleId_departureAt_busId: {
                            scheduleId: schedule.id,
                            departureAt,
                            busId: departure.busId,
                        },
                    },
                });

                if (existing) {
                    // Ne pas écraser un Trip qui a des réservations
                    if (existing.status === "SCHEDULED") {
                        await tx.trip.update({
                            where: { id: existing.id },
                            data: {
                                arrivalAt,
                                price: schedule.price,
                                departureAgencyId: schedule.departureAgencyId,
                                arrivalAgencyId: schedule.arrivalAgencyId,
                            },
                        });
                        stats.updated++;
                    } else {
                        stats.skipped++;
                    }
                    continue;
                }

                // Vérifier que le bus n'est pas déjà pris à cette heure
                const conflict = await tx.trip.findFirst({
                    where: {
                        busId: departure.busId,
                        departureAt,
                        status: { in: ["SCHEDULED", "BOARDING", "DEPARTED"] },
                    },
                });

                if (conflict) {
                    stats.skipped++;
                    continue;
                }

                await tx.trip.create({
                    data: {
                        scheduleId: schedule.id,
                        routeId: schedule.routeId,
                        busId: departure.busId,
                        driverId: departure.driverId,
                        departureAgencyId: schedule.departureAgencyId,
                        arrivalAgencyId: schedule.arrivalAgencyId,
                        departureAt,
                        arrivalAt,
                        price: schedule.price,
                        status: "SCHEDULED",
                    },
                });

                stats.created++;
            }

            cursor.setDate(cursor.getDate() + 1);
        }

        return stats;
    };
};


module.exports = new TripGeneratorService();