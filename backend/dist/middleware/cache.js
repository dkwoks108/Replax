"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheMiddleware = void 0;
const redis_1 = require("../utils/redis");
const logger_1 = __importDefault(require("../utils/logger"));
const cacheMiddleware = (prefix, ttl) => {
    return async (req, res, next) => {
        try {
            // Skip caching for non-GET requests
            if (req.method !== 'GET') {
                return next();
            }
            // Create a cache key based on the request URL and query params
            const key = `${prefix}:${req.originalUrl}`;
            // Try to get data from cache
            const cachedData = await (0, redis_1.getCache)(key);
            if (cachedData) {
                logger_1.default.debug('Cache hit:', { key });
                return res.json(cachedData);
            }
            // If not in cache, replace the response.json method to intercept the response
            const originalJson = res.json;
            res.json = function (body) {
                // Restore the original json method
                res.json = originalJson;
                // Cache the response data
                (0, redis_1.setCache)(key, body, ttl)
                    .catch(err => logger_1.default.error('Cache set error:', err));
                // Send the response as usual
                return originalJson.call(this, body);
            };
            next();
        }
        catch (error) {
            logger_1.default.error('Cache middleware error:', error);
            next();
        }
    };
};
exports.cacheMiddleware = cacheMiddleware;
//# sourceMappingURL=cache.js.map