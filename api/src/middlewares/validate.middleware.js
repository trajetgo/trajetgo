const { StatusCodes } = require("http-status-codes");

/**
 * Middleware de validation Zod.
 *
 * @param {import("zod").ZodSchema} schema
 * @param {"body" | "query" | "params"} [source="body"]
 */
const validate = (schema, source = "body") => {
    return (req, res, next) => {
        const result = schema.safeParse(req[source] ?? {});

        if (!result.success) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Validation failed.",
                errors: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
                timestamp: new Date().toISOString(),
            });
        }

        // Remplace la source par les données validées (et transformées)
        req[source] = result.data;

        next();
    };
};

module.exports = validate;