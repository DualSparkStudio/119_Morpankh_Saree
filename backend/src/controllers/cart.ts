import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

// Get or create cart for user
const getOrCreateCart = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              basePrice: true,
              compareAtPrice: true,
              images: true,
              slug: true,
            },
          },
          variant: {
            select: {
              id: true,
              name: true,
              color: true,
              price: true,
            },
          },
          color: {
            select: {
              id: true,
              color: true,
              images: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                basePrice: true,
                compareAtPrice: true,
                images: true,
                slug: true,
              },
            },
            variant: {
              select: {
                id: true,
                name: true,
                color: true,
                price: true,
              },
            },
            color: {
              select: {
                id: true,
                color: true,
                images: true,
              },
            },
          },
        },
      },
    }) as any;
  }

  return cart;
};

export const getCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const cart = await getOrCreateCart(userId);

    if (!cart) {
      return next(new AppError('Failed to get or create cart', 500));
    }

    // Calculate totals
    const items = (cart.items || []).map((item: any) => {
      const price = item.variant?.price || item.product.basePrice;
      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        colorId: item.colorId,
        selectedColor: item.selectedColor,
        product: item.product,
        variant: item.variant,
        color: item.color,
        quantity: item.quantity,
        price,
        total: price * item.quantity,
      };
    });

    const subtotal = items.reduce((sum: number, item: any) => sum + item.total, 0);

    res.json({
      cartId: cart.id,
      items,
      subtotal,
      total: subtotal,
      itemCount: items.length,
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { productId, variantId, colorId, quantity = 1 } = req.body;

    if (!productId) {
      return next(new AppError('Product ID is required', 400));
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { 
        variants: variantId ? { where: { id: variantId } } : false,
        colors: colorId ? { where: { id: colorId } } : false,
      },
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    if (variantId && !product.variants.find(v => v.id === variantId)) {
      return next(new AppError('Product variant not found', 404));
    }

    if (colorId && product.colors && !product.colors.find(c => c.id === colorId)) {
      return next(new AppError('Product color not found', 404));
    }

    const cart = await getOrCreateCart(userId);

    if (!cart) {
      return next(new AppError('Failed to get or create cart', 500));
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId_variantId_colorId: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          colorId: colorId || null,
        },
      },
    });

    let cartItem;
    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + parseInt(quantity) },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              basePrice: true,
              compareAtPrice: true,
              images: true,
              slug: true,
            },
          },
          variant: {
            select: {
              id: true,
              name: true,
              color: true,
              price: true,
            },
          },
          color: {
            select: {
              id: true,
              color: true,
              images: true,
            },
          },
        },
      });
    } else {
      // Create new cart item
      const selectedColor = colorId && product.colors ? product.colors.find(c => c.id === colorId)?.color : null;
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          colorId: colorId || null,
          selectedColor: selectedColor || null,
          quantity: parseInt(quantity),
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              basePrice: true,
              compareAtPrice: true,
              images: true,
              slug: true,
            },
          },
          variant: {
            select: {
              id: true,
              name: true,
              color: true,
              price: true,
            },
          },
          color: {
            select: {
              id: true,
              color: true,
              images: true,
            },
          },
        },
      });
    }

    res.json({
      success: true,
      message: 'Item added to cart',
      cartItem,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { itemId, quantity } = req.body;

    if (!itemId || quantity === undefined) {
      return next(new AppError('Item ID and quantity are required', 400));
    }

    if (parseInt(quantity) <= 0) {
      // Remove item if quantity is 0 or less
      await prisma.cartItem.delete({
        where: { id: itemId },
      });
      return res.json({ success: true, message: 'Item removed from cart' });
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: parseInt(quantity) },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            basePrice: true,
            compareAtPrice: true,
            images: true,
            slug: true,
          },
        },
        variant: {
          select: {
            id: true,
            name: true,
            color: true,
            price: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Cart updated',
      cartItem,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { itemId } = req.params;

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

