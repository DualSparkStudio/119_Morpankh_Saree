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

    // Validate shipping address structure
    if (typeof shippingAddress !== 'object') {
      return next(new AppError('Shipping address must be an object', 400));
    }

    const requiredAddressFields = ['name', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    for (const field of requiredAddressFields) {
      if (!shippingAddress[field]) {
        return next(new AppError(`Shipping address ${field} is required`, 400));
      }
    }

    // Validate each item has required fields
    for (const item of items) {
      if (!item.productId) {
        return next(new AppError('Each order item must have a productId', 400));
      }
      if (!item.quantity || item.quantity < 1) {
        return next(new AppError('Each order item must have a valid quantity (>= 1)', 400));
      }
      if (!item.price || item.price < 0) {
        return next(new AppError('Each order item must have a valid price (>= 0)', 400));
      }
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

    // Validate products exist and prepare order items
    // Use Promise.allSettled to handle errors gracefully
    const orderItemsResults = await Promise.allSettled(
      items.map(async (item: any) => {
        // Validate product exists
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { id: true, isActive: true },
        });

        if (!product) {
          throw new AppError(`Product with ID ${item.productId} not found`, 400);
        }

        if (!product.isActive) {
          throw new AppError(`Product with ID ${item.productId} is not active`, 400);
        }

        const orderItem: any = {
          productId: item.productId,
          quantity: parseInt(String(item.quantity)) || 1,
          price: parseFloat(String(item.price)) || 0,
          total: (parseFloat(String(item.price)) || 0) * (parseInt(String(item.quantity)) || 1),
        };

        // Only include variantId if provided and valid (check if it exists in database)
        // Handle variantId being null, undefined, empty string, or a valid string
        if (item.variantId !== null && item.variantId !== undefined && item.variantId !== '') {
          const variantIdStr = String(item.variantId).trim();
          if (variantIdStr !== '' && variantIdStr !== 'null' && variantIdStr !== 'undefined') {
            try {
              // Validate variant exists and belongs to the product
              const variant = await prisma.productVariant.findFirst({
                where: {
                  id: variantIdStr,
                  productId: item.productId,
                  isActive: true,
                },
              });

              if (!variant) {
                // If variant doesn't exist, log warning but don't fail the order
                // Just proceed without the variantId
                console.warn(`Variant with ID ${variantIdStr} not found for product ${item.productId}. Proceeding without variant.`);
              } else {
                orderItem.variantId = variantIdStr;
              }
            } catch (variantError) {
              // If variant lookup fails, just proceed without variantId
              console.warn(`Error validating variant ${variantIdStr} for product ${item.productId}:`, variantError);
            }
          }
        }

        return orderItem;
      })
    );

    // Check for any rejected promises
    const rejected = orderItemsResults.find(result => result.status === 'rejected');
    if (rejected && rejected.status === 'rejected') {
      const error = rejected.reason;
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error?.message || 'Failed to validate order items', 400);
    }

    // Extract fulfilled values
    const orderItemsData = orderItemsResults
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value);

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
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    res.status(201).json(order);
  } catch (error: any) {
    console.error('Order creation error:', error);
    console.error('Error details:', {
      code: error.code,
      meta: error.meta,
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    
    // If it's a known AppError, pass it through
    if (error instanceof AppError) {
      return next(error);
    }
    
    // Handle Prisma errors
    if (error.code) {
      if (error.code === 'P2002') {
        return next(new AppError('Duplicate order entry', 400));
      }
      if (error.code === 'P2025') {
        return next(new AppError('Related record not found', 404));
      }
      if (error.code === 'P2003') {
        return next(new AppError('Invalid foreign key reference', 400));
      }
    }
    
    // Otherwise, wrap in a generic error with more details
    const errorMessage = error.message || 'Failed to create order';
    console.error('Unexpected error during order creation:', errorMessage);
    next(new AppError(errorMessage, 500));
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
    const userId = req.userId; // Optional - can be undefined for guest orders
    const { id } = req.params;

    // Build where clause - if user is authenticated, only return their orders
    // If not authenticated, return any order by ID (for guest checkout success page)
    const whereClause: any = { id };
    if (userId) {
      whereClause.userId = userId;
    }

    const order = await prisma.order.findFirst({
      where: whereClause,
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
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

// Get order by order number (supports guest checkout)
export const getOrderByNumber = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { orderNumber } = req.params;
    const userId = req.userId; // Optional - can be undefined for guest orders

    // Build where clause - if user is authenticated, only return their orders
    // If not authenticated, return any order by order number (for guest checkout)
    const whereClause: any = { orderNumber };
    if (userId) {
      whereClause.userId = userId;
    }

    const order = await prisma.order.findFirst({
      where: whereClause,
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
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

