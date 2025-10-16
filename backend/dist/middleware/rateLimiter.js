"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderLimiter = exports.productLimiter = exports.authLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const errorMiddleware_1 = require("./errorMiddleware");
const createRateLimiter = (config) => {
    return (0, express_rate_limit_1.default)({
        windowMs: config.windowMs,
        max: config.max,
        handler: (_req, _res, next) => {
            next(new errorMiddleware_1.AppError(429, config.message));
        },
        standardHeaders: true,
        legacyHeaders: false,
        skip: (req) => {
            // Skip health check endpoints
            if (req.path === '/api/health')
                return true;
            // Skip options requests (CORS preflight)
            if (req.method === 'OPTIONS')
                return true;
            return false;
        }
    });
};
// General API rate limiter
exports.apiLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
// Stricter limiter for authentication routes
exports.authLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: 'Too many login attempts from this IP, please try again after an hour'
});
// Product routes limiter
exports.productLimiter = createRateLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50,
    message: 'Too many product requests, please try again after 5 minutes'
});
// Order routes limiter
exports.orderLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 30,
    message: 'Too many order requests, please try again after 10 minutes'
});
//# sourceMappingURL=rateLimiter.js.map