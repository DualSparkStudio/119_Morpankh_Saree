import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId; // Optional for guest orders
    const { 
      items, 
      shippingAddress, 
      billingAddress, 
      couponCode,
      guestEmail,
      guestPhone,
      guestName 
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return next(new AppError('Order items are required', 400));
    }

    if (!shippingAddress) {
      return next(new AppError('Shipping address is required', 400));
    }

    // For guest orders, validate guest information
    if (!userId) {
      if (!guestEmail || !guestPhone || !guestName) {
        return next(new AppError('Guest information (name, email, phone) is required', 400));
      }
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Calculate totals
    let subtotal = 0;
    for (const item of items) {
      subtotal += (item.price || 0) * (item.quantity || 1);
    }

    // TODO: Apply coupon discount if provided
    let discount = 0;
    // TODO: Calculate tax
    const tax = 0;
    // TODO: Calculate shipping
    const shipping = 0;

    const total = subtotal - discount + tax + shipping;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        guestEmail: userId ? null : guestEmail,
        guestPhone: userId ? null : guestPhone,
        guestName: userId ? null : guestName,
        orderNumber,
        status: 'PENDING',
        subtotal,
        discount,
        tax,
        shipping,
        total,
        paymentStatus: 'PENDING',
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        couponCode: couponCode || null,
        items: {
          create: items.map((item: any) => {
            const orderItem: any = {
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity,
            };
            // Only include variantId if provided and valid
            if (item.variantId && item.variantId.trim() !== '') {
              orderItem.variantId = item.variantId;
            }
            return orderItem;
          }),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { page = '1', limit = '20' } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where: { userId } }),
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

export const getOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        payments: true,
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

export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json(order);
  } catch (error) {
    next(error);
  }
};

