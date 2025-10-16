"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = exports.notFound = exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const response = {
        status: statusCode >= 500 ? 'error' : 'fail',
        statusCode,
        message: err.message || 'Internal Server Error'
    };
    // use safe access for errors — many error types attach `errors`
    if (err.errors) {
        response.errors = err.errors;
    }
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
// notFound handler: mark unused param with underscore to avoid TS unused param complaint
const notFound = (req, _res, next) => {
    const err = new Error('Not Found');
    err.statusCode = 404;
    next(err);
};
exports.notFound = notFound;
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.catchAsync = catchAsync;
//# sourceMappingURL=errorMiddleware.js.map