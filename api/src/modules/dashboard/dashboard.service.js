const ApiError = require("../../utils/ApiError");

const repository = require("./dashboard.repository.js");


class DashboardService {
    getSummary = async (user) => {
        if (!user.companyId) {
            throw new ApiError(
                403,
                "Aucune compagnie associée."
            );
        }

        const companyId = user.companyId;

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const {
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
        } = await repository.getSummary(
            companyId, 
            startOfDay, 
            endOfDay,
            now,
            next24h
        )

        /* ---------- Calculs ---------- */

        const totalCapacity = todayCapacityResult.reduce(
            (sum, t) => sum + (t.bus?.capacity ?? 0),
            0
        );

        const todayOccupancy =
            totalCapacity > 0 ? todayBookedSeatsResult / totalCapacity : 0;

        /* ---------- Alertes ---------- */

        const alerts = [];

        if (!activeBuses) {
            alerts.push({
                id: "no-bus",
                severity: "warning",
                message: "Aucun bus actif. Ajoutez un bus pour commencer à programmer.",
                action: { label: "Ajouter un bus", to: "/buses" },
            });
        }

        if (!activeRoutes) {
            alerts.push({
                id: "no-route",
                severity: "warning",
                message: "Aucune ligne active. Créez une ligne pour vendre des billets.",
                action: { label: "Créer une ligne", to: "/routes" },
            });
        }

        if (todayTrips > 0 && todayOccupancy < 0.3) {
            alerts.push({
                id: "low-occupancy",
                severity: "info",
                message: `Taux de remplissage faible aujourd'hui (${Math.round(todayOccupancy * 100)} %).`,
            });
        }

        /* ---------- DTO ---------- */

        return {
            kpis: {
                totalBuses,
                activeBuses,
                activeRoutes,
                agencies,
                staff,
                todayTrips,
                todayBookings,
                todayRevenue: todayRevenueResult._sum.totalPrice ?? 0,
                todayBookedSeats: todayBookedSeatsResult,
                todayOccupancy,
            },
            alerts,
            upcomingTrips: upcomingTrips.map((trip) => ({
                id: trip.id,
                departureAt: trip.departureAt,
                origin: trip.route?.originCity?.name ?? null,
                destination: trip.route?.destinationCity?.name ?? null,
                busName: trip.bus?.name ?? null,
                departureAgency: trip.departureAgency?.name ?? null,
                bookedSeats: trip._count.bookings,
                totalSeats: trip.bus?.capacity ?? 0,
            })),
        };
    }
};

module.exports = new DashboardService();