import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { cache } from '../config/redis';

export const getBanners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { position } = req.query;
    
    // Try cache first
    const cacheKey = `banners:${position || 'all'}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const now = new Date();

    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
        ...(position && { position: position as string }),
        AND: [
          {
            OR: [
              { validFrom: null },
              { validFrom: { lte: now } },
            ],
          },
          {
            OR: [
              { validUntil: null },
              { validUntil: { gte: now } },
            ],
          },
        ],
      },
      orderBy: { order: 'asc' },
    });

    // Cache for 15 minutes
    await cache.set(cacheKey, banners, 900);

    res.json(banners);
  } catch (error) {
    next(error);
  }
};

