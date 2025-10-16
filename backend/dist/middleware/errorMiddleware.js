"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = exports.notFound = exports.errorHandler = exports.AppError = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
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
const errorHandler = (err, req, res, _next) => {
    const isDev = process.env.NODE_ENV === 'development';
    let statusCode = 500;
    let response = {
        success: false,
        message: 'Internal server error'
    };
    // Handle known errors
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        response.message = err.message;
        if (err.errors) {
            response.errors = err.errors;
        }
    }
    else if (err instanceof Error) {
        if (isDev) {
            response.message = err.message;
        }
    }
    // Log unknown errors
    if (!(err instanceof AppError) || !err.isOperational) {
        logger_1.default.error('Unhandled error:', {
            error: err,
            path: req.path,
            method: req.method,
            body: req.body,
            query: req.query,
            params: req.params,
        });
    }
    // Add stack trace in development
    if (isDev) {
        response.stack = err.stack;
    }
    return res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
const notFound = (req, res, next) => {
    next(new AppError(404, `Not Found - ${req.originalUrl}`));
};
exports.notFound = notFound;
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.catchAsync = catchAsync;
//# sourceMappingURL=errorMiddleware.js.map