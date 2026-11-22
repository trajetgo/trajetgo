const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const service = require("./tgtl.service");

class TgtlController {
    getStatus = asyncHandler(async (req, res) => {
        const status = await service.getStatus(
            req.user
        );

        return ApiResponse.success(
            res, 
            status, 
            "État récupéré."
        );
    });
};

module.exports = new TgtlController();