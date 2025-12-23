import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const { page = '1', limit = '20' } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          productId,
          isApproved: true,
        },
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({
        where: { productId, isApproved: true },
      }),
    ]);

    res.json({
      reviews,
      pagination: {
        page: parseInt(page as string),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || rating < 1 || rating > 5) {
      return next(new AppError('Valid product ID and rating (1-5) are required', 400));
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        title,
        comment,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

