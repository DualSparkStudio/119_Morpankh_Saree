import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      totalProducts,
      totalCustomers,
      ordersRevenue,
      todayOrders,
      todayOrdersRevenue,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: today },
        },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: today },
          paymentStatus: 'PAID',
        },
        _sum: { total: true },
      }),
    ]);

    res.json({
      totalOrders,
      totalProducts,
      totalCustomers,
      totalRevenue: ordersRevenue._sum.total || 0,
      todayOrders,
      todayRevenue: todayOrdersRevenue._sum.total || 0,
    });
  } catch (error) {
    next(error);
  }
};

