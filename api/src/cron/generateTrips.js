const cron = require("node-cron");
const scheduleService = require("../modules/schedules/schedule.service");

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const CRON_SCHEDULE = "0 2 * * *";        // Tous les jours à 02:00
const TIMEZONE = "Africa/Abidjan";

/* ------------------------------------------------------------------ */
/* Job                                                                 */
/* ------------------------------------------------------------------ */

/**
 * Job : génère les trips pour tous les schedules actifs avec autoGenerate.
 */

let lastRun = null;

async function runGenerateTrips() {
    try {
        const result = await scheduleService.generateAllTrips();

        lastRun = {
            at: new Date(),
            status: "success",
            ...result,
        };

        return result;
    } catch (error) {
        lastRun = {
            at: new Date(),
            status: "error",
            error: error.message,
        };
        throw error;
    }
}

/* ------------------------------------------------------------------ */
/* Scheduler                                                           */
/* ------------------------------------------------------------------ */

function scheduleGenerateTrips() {
    const task = cron.schedule(CRON_SCHEDULE, runGenerateTrips, {
        timezone: TIMEZONE,
        scheduled: true,
    });

    console.log(
        `[cron] Trip generation scheduled (${CRON_SCHEDULE}, ${TIMEZONE}).`
    );

    return task;
}

function getLastRun() {
    return lastRun;
}

module.exports = {
    scheduleGenerateTrips,
    runGenerateTrips,
    getLastRun,
};