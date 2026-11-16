const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./ticket.service');

class TicketController {
    getTickets = asyncHandler(async (req, res) => {
        const tickets = await service.getTickets(
            req.query,
            req.user
        );

        return ApiResponse.success(
            res,
            tickets,
            "Tickets récupérés avec succès"
        );
    });

    getMyTickets = asyncHandler(async (req, res) => {
        const tickets = await service.getMyTickets(req.user);

        return ApiResponse.success(
            res,
            tickets,
            "Tickets de l'utilisateur récupérés avec succès"
        );
    });

    sellTicket = asyncHandler(async (req, res) => {
        const ticket = await service.sellTicket(
            req.body,
            req.user
        );

        return ApiResponse.success(
            res,
            ticket,
            "Billet vendu avec succès"
        );
    });


    getById = asyncHandler(async (req, res) => {
        const ticket = await service.getTicketById(
            req.params.id,
            req.user
        );

        return ApiResponse.success(
            res,
            ticket,
            "Ticket récupéré avec succès"
        );
    });


    getByNumber = asyncHandler(async (req, res) => {
        const ticket = await service.getTicketByNumber(
            req.params.ticketNumber,
            req.user
        );

        return ApiResponse.success(
            res,
            ticket,
            "Ticket récupéré à partir du numéro"
        );
    });


    getByQrCode = asyncHandler(async (req, res) => {
        const ticket = await service.getTicketByQrCode(
            req.params.qrCode,
            req.user
        );

        return ApiResponse.success(
            res,
            ticket,
            "Ticket récupéré avec partir du code QR"
        );
    });


    cancel = asyncHandler(async (req, res) => {
        const ticket = await service.cancelTicket(
            req.params.id,
            req.user
        );

        return ApiResponse.success(
            res,
            ticket,
            'Ticket annulé avec succès',
        );
    });


    use = asyncHandler(async (req, res) => {
        const ticket = await service.useTicket(
            req.params.id,
            req.user
        );

        return ApiResponse.success(
            res,
            ticket,
            'Ticket marqué comme utilisé',
        );
    });
}

module.exports = new TicketController();
