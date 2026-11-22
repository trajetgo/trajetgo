const prisma = require("../config/database");
const tripGeneratorService = require("../modules/trips/tripGenerator.service");

const WINDOW_DAYS = 30;

async function run() {
    const from = new Date();
    const to = new Date();
    to.setDate(to.getDate() + WINDOW_DAYS);

    const schedules = await prisma.schedule.findMany({
        where: {
            active: true,
            autoGenerate: true,
            OR: [
                { endDate: null },
                { endDate: { gte: from } },
            ],
        },
        select: { id: true },
    });

    let total = { created: 0, updated: 0, skipped: 0 };

    for (const { id } of schedules) {
        try {
            const stats = await tripGeneratorService.generateTripsForSchedule(id, from, to);
            total.created += stats.created;
            total.updated += stats.updated;
            total.skipped += stats.skipped;
        } catch (error) {
            console.error(`[generateTrips] schedule ${id}:`, error.message);
        }
    }

    console.log("[generateTrips]", total);
}

module.exports = { run };