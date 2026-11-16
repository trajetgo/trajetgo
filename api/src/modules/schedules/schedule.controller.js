const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./schedule.service');

class ScheduleController {
    getSchedules = asyncHandler(async (req, res) => {
        const schedules = await service.getSchedules(
            req.query,
            req.user
        );

        return ApiResponse.success(
            res,
            schedules,
            "Programmations récupérées"
        );
    });

    create = asyncHandler(async (req, res) => {
        const schedule = await service.create(
            req.body,
            req.user
        );

        return ApiResponse.created(
            res,
            schedule,
            "Programmation ajoutée"
        );
    });
};

module.exports = new ScheduleController();