const prisma = require("../../config/database");

class DashboardRepository {
    getSummary = async (
        companyId, 
        startOfDay, 
        endOfDay,
        now,
        next24h
    ) => {
        const [
            totalBuses,
            activeBuses,
            activeRoutes,
            agencies,
            staff,
            todayTrips,
            todayBookings,
            todayRevenueResult,
            todayBookedSeatsResult,
            todayCapacityResult,
            upcomingTrips,
        ] = await Promise.all([
            prisma.bus.count({ where: { companyId } }),
            prisma.bus.count({ where: { companyId, status: "ACTIVE" } }),
            prisma.route.count({ where: { companyId, active: true } }),
            prisma.agency.count({ where: { companyId } }),
            prisma.user.count({ where: { companyId } }),

            prisma.trip.count({
                where: {
                    route: { companyId },
                    departureAt: { gte: startOfDay, lt: endOfDay },
                },
            }),

            prisma.booking.count({
                where: {
                    trip: { route: { companyId } },
                    createdAt: { gte: startOfDay, lt: endOfDay },
                },
            }),

            prisma.booking.aggregate({
                where: {
                    trip: { route: { companyId } },
                    status: { in: ["CONFIRMED", "BOARDED", "COMPLETED"] },
                    createdAt: { gte: startOfDay, lt: endOfDay },
                },
                _sum: { amount: true },
            }),

            prisma.booking.count({
                where: {
                    trip: { route: { companyId } },
                    status: { in: ["CONFIRMED", "BOARDED", "COMPLETED"] },
                    trip: { departureAt: { gte: startOfDay, lt: endOfDay } },
                },
            }),

            prisma.trip.findMany({
                where: {
                    route: { companyId },
                    departureAt: { gte: startOfDay, lt: endOfDay },
                },
                select: { bus: { select: { capacity: true } } },
            }),

            prisma.trip.findMany({
                where: {
                    route: { companyId },
                    departureAt: { gte: now, lte: next24h },
                    status: { in: ["SCHEDULED", "BOARDING"] },
                },
                include: {
                    route: {
                        select: {
                            originCity: { select: { name: true } },
                            destinationCity: { select: { name: true } },
                        },
                    },
                    bus: { select: { name: true, capacity: true } },
                    departureAgency: { select: { name: true } },
                    _count: {
                        select: {
                            bookings: { where: { status: { in: ["CONFIRMED", "BOARDED"] } } },
                        },
                    },
                },
                orderBy: { departureAt: "asc" },
                take: 5,
            }),
        ]);

        return {
            totalBuses,
            activeBuses,
            activeRoutes,
            agencies,
            staff,
            todayTrips,
            todayBookings,
            todayRevenueResult,
            todayBookedSeatsResult,
            todayCapacityResult,
            upcomingTrips,
        }
    };
};

module.exports = new DashboardRepository();