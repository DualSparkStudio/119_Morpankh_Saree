import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { cache } from '../config/redis';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Try cache first
    const cacheKey = 'categories:all';
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    // Cache for 1 hour
    await cache.set(cacheKey, categories, 3600);

    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          take: 20,
        },
      },
    });

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
};

