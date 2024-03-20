/**
 * @file controller-advisor
 * @summary use to handle errors globally
 */
import * as httpStatus from 'http-status';
import config from '../config/config';
import logger from '../config/logger';
import ApiError from '../utils/ApiError';


/**
 * use to convert un-expected error into generic error schema
 * @param err - error object
 * @param req - express middleware request object
 * @param res - express middleware response function
 * @param next - express middleware flow next function execution method
 */
export const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || 400;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};

/**
 * use to handle errors globally
 * @param err - error object
 * @param req - express middleware request object
 * @param res - express middleware response function
 * @param next - express middleware flow next function execution method
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (config.env === 'production' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(config.env === 'development' && { stack: err.stack }),
    };
    logger.error(err);
    //
    res.status(statusCode).send(response);
};

