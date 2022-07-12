const ApiError = require('./ApiError')
function apiErrorHandler(error, req, res, next) {
    if (error instanceof ApiError) {
        return res.status(error.code).json(error.message)
    }
    return res.status(500).send('Internal server error')
}
module.exports = apiErrorHandler;