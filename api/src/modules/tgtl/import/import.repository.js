const prisma = require("../../../config/database");

class ImportRepository {
    /* =========================================================
      COUNTRY / REGION / CITY
   ========================================================= */

    findCountryByCode = (code) =>
        prisma.country.findUnique({ where: { code } });

    upsertCountry = (data) =>
        prisma.country.upsert({
            where: { code: data.code },
            update: {},
            create: data,
        });

    upsertRegion = ({ countryId, name, code }) =>
        prisma.region.upsert({
            where: { countryId_name: { countryId, name } },
            update: {},
            create: { countryId, name, code },
        });

    upsertCity = ({ countryId, regionId, name, latitude, longitude }) =>
        prisma.city.upsert({
            where: { countryId_name: { countryId, name } },
            update: {},
            create: { countryId, regionId, name, latitude, longitude },
        });

    /* =========================================================
       COMPANY
    ========================================================= */

    upsertCompany = (data) =>
        prisma.company.upsert({
            where: { name: data.name },
            update: {},
            create: data,
        });

    /* =========================================================
       AGENCY
    ========================================================= */

    findAgencyByName = ({ companyId, name }) =>
        prisma.agency.findFirst({ where: { companyId, name } });

    createAgency = (data) => prisma.agency.create({ data });

    /* =========================================================
       BUS / SEAT LAYOUT / SEAT
    ========================================================= */

    upsertBus = ({ companyId, registrationNumber, ...rest }) =>
        prisma.bus.upsert({
            where: {
                companyId_registrationNumber: { companyId, registrationNumber },
            },
            update: {},
            create: { companyId, registrationNumber, ...rest },
        });

    upsertSeatLayout = ({ busId, name, type, rows, columns }) =>
        prisma.seatLayout.upsert({
            where: { busId },
            update: {},
            create: { busId, name, type, rows, columns },
        });

    createManySeats = (seats) =>
        prisma.seat.createMany({ data: seats, skipDuplicates: true });

    /* =========================================================
       ROUTE
    ========================================================= */

    upsertRoute = ({ companyId, originCityId, destinationCityId, ...rest }) =>
        prisma.route.upsert({
            where: {
                companyId_originCityId_destinationCityId: {
                    companyId,
                    originCityId,
                    destinationCityId,
                },
            },
            update: {},
            create: { companyId, originCityId, destinationCityId, ...rest },
        });

    /* =========================================================
       SCHEDULE / SCHEDULE DEPARTURE
    ========================================================= */

    createSchedule = (data) => prisma.schedule.create({ data });

    createScheduleDepartures = (departures) =>
        prisma.scheduleDeparture.createMany({
            data: departures,
            skipDuplicates: true,
        });

    /* =========================================================
       USER / INVITATION
    ========================================================= */

    findUserByPhone = (phone) =>
        prisma.user.findUnique({ where: { phone } });

    createInvitation = (data) =>
        prisma.companyInvitation.create({ data });

    /* =========================================================
       TRANSACTION
    ========================================================= */

    transaction = (fn) => prisma.$transaction(fn, { timeout: 30_000 });
};

module.exports = new ImportRepository();