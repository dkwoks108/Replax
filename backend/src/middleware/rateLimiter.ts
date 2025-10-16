import rateLimit from 'express-rate-limit';
import { Request } from 'express';
import { AppError } from './errorMiddleware';
import logger from '../utils/logger';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
}

const createRateLimiter = (config: RateLimitConfig) => {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    handler: (_req, _res, next) => {
      next(new AppError(429, config.message));
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request) => {
      // Skip health check endpoints
      if (req.path === '/api/health') return true;
      // Skip options requests (CORS preflight)
      if (req.method === 'OPTIONS') return true;
      return false;
    }
  });
};

// General API rate limiter
export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Stricter limiter for authentication routes
export const authLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many login attempts from this IP, please try again after an hour'
});

// Product routes limiter
export const productLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50,
  message: 'Too many product requests, please try again after 5 minutes'
});

// Order routes limiter
export const orderLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30,
  message: 'Too many order requests, please try again after 10 minutes'
});