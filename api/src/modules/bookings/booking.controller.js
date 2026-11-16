const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./booking.service');

const requestMeta = (req) => ({
    ip: req.ip,
    userAgent: req.userAgent
});

class BookingController {

    /**
     * POST /bookings
     */
    create = asyncHandler(async (req, res) => {
        const booking = await service.createBooking(
            req.body,
            req.user,
            requestMeta(req)
        );

        return ApiResponse.created(
            res,
            booking,
            "Réservation créée avec succès"
        );
    });


    /**
     * GET /bookings/my
     */
    getMyBookings = asyncHandler(async (req, res) => {
        const bookings = await service.getMyBookings(req.user);

        return ApiResponse.success(
            res,
            bookings,
            "Réservations de l'utilisateur récupérées avec succès"
        );
    });


    /**
     * GET /bookings/:id
     */
    getById = asyncHandler(async (req, res) => {
        const booking =
            await service.getBookingById(
                req.params.id,
                req.user
            );

        return ApiResponse.success(
            res,
            booking,
            "Réservation récupérée avec succès"
        );
    });


    /**
     * PATCH /bookings/:id/cancel
     */
    cancel = asyncHandler(async (req, res) => {
        const booking = await service.cancelBooking(
            req.params.id,
            req.user
        );

        return ApiResponse.success(
            res,
            booking,
            'Réservation annulée avec succès',
        );
    });
}

module.exports = new BookingController();