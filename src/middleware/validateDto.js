const ApiError = require("../error/ApiError");

function validateDto(schema) {
    return async (req, res, next) => {
        try {
            const validBody = await schema.validate(req.body);
            req.body = validBody;
            next();
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
}
module.exports = validateDto;