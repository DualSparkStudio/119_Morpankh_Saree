import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { cache } from '../config/redis';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1',
      limit = '20',
      category,
      minPrice,
      maxPrice,
      fabric,
      color,
      occasion,
      search,
      premium,
      trending,
      sort = 'createdAt',
      order = 'desc',
    } = req.query;

    // Create cache key (include all filter params)
    const cacheKey = `products:${JSON.stringify({ page, limit, category, minPrice, maxPrice, premium, trending, search, sort, order })}`;

    // Try to get from cache (only for non-search queries to keep cache simple)
    if (!search) {
      const cached = await cache.get(cacheKey);
      if (cached) {
        return res.json(cached);
      }
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {
      isActive: true,
    };

    if (category) where.categoryId = category;
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = parseFloat(minPrice as string);
      if (maxPrice) where.basePrice.lte = parseFloat(maxPrice as string);
    }
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    // Check premium filter - query params are strings
    if (premium && (String(premium) === 'true' || String(premium) === '1')) {
      where.showInPremium = true;
    }
    // Check trending filter - query params are strings
    if (trending && (String(trending) === 'true' || String(trending) === '1')) {
      where.showInTrending = true;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          inventory: true,
          _count: {
            select: { reviews: true },
          },
        },
        skip,
        take,
        orderBy: { [sort as string]: order },
      }),
      prisma.product.count({ where }),
    ]);

    const result = {
      products,
      pagination: {
        page: parseInt(page as string),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    };

    // Cache result for 5 minutes (only if not a search query)
    if (!search) {
      await cache.set(cacheKey, result, 300);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Try cache first
    const cacheKey = `product:${id}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: {
          where: { isActive: true },
        },
        inventory: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Cache for 10 minutes
    await cache.set(cacheKey, product, 600);

    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    // Try cache first
    const cacheKey = `product:slug:${slug}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: {
          where: { isActive: true },
        },
        inventory: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Cache for 10 minutes
    await cache.set(cacheKey, product, 600);

    res.json(product);
  } catch (error) {
    next(error);
  }
};

