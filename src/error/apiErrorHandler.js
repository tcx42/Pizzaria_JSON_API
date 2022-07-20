const ApiError = require('./ApiError')
function apiErrorHandler(error, req, res, next) {
    if (error instanceof ApiError) {
        return res.status(error.code).json(error.message)
    }
    if (error.code == 'SQLITE_CONSTRAINT') {
        return res.status(400).json('The item already exists')
    }
    return res.status(500).send('Internal server error')
}
module.exports = apiErrorHandler;