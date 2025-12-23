import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const scanStock = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const scannedBy = req.userId!;
    const { barcode, quantity, transactionType, stockType, reason, notes } = req.body;

    if (!barcode || !quantity || !transactionType || !stockType) {
      return next(new AppError('Missing required fields', 400));
    }

    // Find product by barcode (check both product and variant barcodes)
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { barcode },
          { variants: { some: { barcode } } },
        ],
      },
      include: {
        variants: {
          where: { barcode },
        },
        inventory: true,
      },
    });

    if (!product) {
      return next(new AppError('Product not found with this barcode', 404));
    }

    const variant = product.variants[0] || null;

    // Find or create inventory record
    let inventory = await prisma.inventory.findFirst({
      where: {
        productId: product.id,
        variantId: variant?.id || null,
        type: stockType,
      },
    });

    if (!inventory) {
      inventory = await prisma.inventory.create({
        data: {
          productId: product.id,
          variantId: variant?.id || null,
          type: stockType,
          quantity: 0,
        },
      });
    }

    // Update inventory quantity
    const quantityChange = transactionType === 'IN' ? parseInt(quantity) : -parseInt(quantity);
    const newQuantity = Math.max(0, inventory.quantity + quantityChange);

    await prisma.inventory.update({
      where: { id: inventory.id },
      data: { quantity: newQuantity },
    });

    // Create stock log
    const stockLog = await prisma.stockLog.create({
      data: {
        productId: product.id,
        variantId: variant?.id || null,
        transactionType,
        quantity: parseInt(quantity),
        stockType,
        reason: reason || 'Manual scan',
        scannedBy,
        notes,
      },
      include: {
        product: {
          select: { id: true, name: true, sku: true },
        },
        variant: {
          select: { id: true, name: true },
        },
      },
    });

    res.json({
      success: true,
      message: `Stock ${transactionType === 'IN' ? 'added' : 'removed'} successfully`,
      stockLog,
      newQuantity,
    });
  } catch (error) {
    next(error);
  }
};

export const getStockLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '50', productId, variantId } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {};
    if (productId) where.productId = productId;
    if (variantId) where.variantId = variantId;

    const [logs, total] = await Promise.all([
      prisma.stockLog.findMany({
        where,
        include: {
          product: {
            select: { id: true, name: true, sku: true },
          },
          variant: {
            select: { id: true, name: true },
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.stockLog.count({ where }),
    ]);

    res.json({
      logs,
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
