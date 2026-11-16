const { StatusCodes } = require("http-status-codes");

class ApiResponse {
    static success(res, data = null, message = "Success") {
        return res.status(StatusCodes.OK).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        });
    }

    static created(res, data = null, message = "Created successfully") {
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        });
    }
}

module.exports = ApiResponse;