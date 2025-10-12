import { Request, Response, NextFunction } from 'express';
import { getCache, setCache } from '../utils/redis';
import logger from '../utils/logger';

export const cacheMiddleware = (prefix: string, ttl?: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Skip caching for non-GET requests
      if (req.method !== 'GET') {
        return next();
      }

      // Create a cache key based on the request URL and query params
      const key = `${prefix}:${req.originalUrl}`;
      
      // Try to get data from cache
      const cachedData = await getCache(key);
      
      if (cachedData) {
        logger.debug('Cache hit:', { key });
        return res.json(cachedData);
      }

      // If not in cache, replace the response.json method to intercept the response
      const originalJson = res.json;
      res.json = function(body) {
        // Restore the original json method
        res.json = originalJson;
        
        // Cache the response data
        setCache(key, body, ttl)
          .catch(err => logger.error('Cache set error:', err));
        
        // Send the response as usual
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};