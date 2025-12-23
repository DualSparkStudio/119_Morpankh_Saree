import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

export const getAdminOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', status } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
          items: {
            include: {
              product: {
                select: { id: true, name: true, images: true },
              },
            },
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      orders,
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

export const getAdminOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        payments: true,
        coupon: true,
      },
    });

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(order);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return next(new AppError('Order not found', 404));
    }
    next(error);
  }
};

