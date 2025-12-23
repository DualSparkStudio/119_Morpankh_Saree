import { Request, Response, NextFunction } from 'express';
import { cache } from '../config/redis';

export const cacheMiddleware = (ttlSeconds: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create cache key from URL and query params
    const cacheKey = `cache:${req.originalUrl || req.url}`;

    try {
      // Try to get from cache
      const cached = await cache.get(cacheKey);
      if (cached) {
        return res.json(cached);
      }

      // Store original json method
      const originalJson = res.json.bind(res);

      // Override json method to cache response
      res.json = function (body: any) {
        // Cache the response
        cache.set(cacheKey, body, ttlSeconds).catch(console.error);
        // Call original json method
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

