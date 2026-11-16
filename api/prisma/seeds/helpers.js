const prisma = require('../../src/config/database');

const futureDate = (daysFromNow, hour = 8, minute = 0) => {
    const date = new Date();

    date.setDate(date.getDate() + daysFromNow);
    date.setHours(hour, minute, 0, 0);

    return date;
};

const addMinutes = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60 * 1000);
};

const logSeed = (message) => {
    console.log(`🌱 ${message}`);
};

const logSuccess = (message) => {
    console.log(`   ✅ ${message}`);
};

const logWarning = (message) => {
    console.log(`   ⚠️ ${message}`);
};

module.exports = {
    prisma,
    futureDate,
    addMinutes,
    logSeed,
    logSuccess,
    logWarning
};