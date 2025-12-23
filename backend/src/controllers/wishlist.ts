import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            inventory: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { productId } = req.body;

    if (!productId) {
      return next(new AppError('Product ID is required', 400));
    }

    const wishlistItem = await prisma.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {},
      create: {
        userId,
        productId,
      },
      include: {
        product: true,
      },
    });

    res.status(201).json(wishlistItem);
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { productId } = req.params;

    await prisma.wishlistItem.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
};

