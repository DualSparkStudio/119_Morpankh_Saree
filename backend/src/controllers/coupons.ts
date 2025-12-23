import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const validateCoupon = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { code, amount } = req.body;

    if (!code || !amount) {
      return next(new AppError('Code and amount are required', 400));
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon || !coupon.isActive) {
      return next(new AppError('Invalid coupon code', 400));
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return next(new AppError('Coupon has expired', 400));
    }

    if (amount < coupon.minAmount) {
      return next(new AppError(`Minimum order amount is ₹${coupon.minAmount}`, 400));
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return next(new AppError('Coupon usage limit exceeded', 400));
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (amount * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, amount);

    res.json({
      valid: true,
      discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    });
  } catch (error) {
    next(error);
  }
};

