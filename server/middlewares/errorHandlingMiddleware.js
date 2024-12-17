const statusCodes = require('../config/statusCodes');

const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    console.log(err);

    const statusCode = err.statusCode || statusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || 'An unexpected error occurred.';

    res.status(statusCode).json({
        status: 'error',
        message,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
};

module.exports = errorMiddleware;
