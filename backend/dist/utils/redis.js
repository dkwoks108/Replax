"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCache = exports.deleteCache = exports.setCache = exports.getCache = exports.connectRedis = void 0;
const redis_1 = require("redis");
const logger_1 = __importDefault(require("./logger"));
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});
redisClient.on('error', (err) => logger_1.default.error('Redis Client Error', err));
redisClient.on('connect', () => logger_1.default.info('Redis Client Connected'));
const connectRedis = async () => {
    try {
        await redisClient.connect();
    }
    catch (error) {
        logger_1.default.error('Redis connection error:', error);
    }
};
exports.connectRedis = connectRedis;
const getCache = async (key) => {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    }
    catch (error) {
        logger_1.default.error('Redis get error:', error);
        return null;
    }
};
exports.getCache = getCache;
const setCache = async (key, value, ttl) => {
    try {
        const stringValue = JSON.stringify(value);
        if (ttl) {
            await redisClient.setEx(key, ttl, stringValue);
        }
        else {
            await redisClient.set(key, stringValue);
        }
        return true;
    }
    catch (error) {
        logger_1.default.error('Redis set error:', error);
        return false;
    }
};
exports.setCache = setCache;
const deleteCache = async (key) => {
    try {
        await redisClient.del(key);
        return true;
    }
    catch (error) {
        logger_1.default.error('Redis delete error:', error);
        return false;
    }
};
exports.deleteCache = deleteCache;
const clearCache = async () => {
    try {
        await redisClient.flushDb();
        return true;
    }
    catch (error) {
        logger_1.default.error('Redis clear error:', error);
        return false;
    }
};
exports.clearCache = clearCache;
exports.default = redisClient;
//# sourceMappingURL=redis.js.map