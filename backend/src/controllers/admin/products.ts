import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { cache } from '../../config/redis';

export const getAdminProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', search } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { sku: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          inventory: true,
          _count: {
            select: { orderItems: true, reviews: true },
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
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

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        inventory: true,
      },
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  // Invalidate product caches
  await cache.delPattern('products:*');
  await cache.delPattern('product:*');
  try {
    const {
      name,
      slug,
      description,
      shortDescription,
      sku,
      barcode,
      categoryId,
      basePrice,
      compareAtPrice,
      costPrice,
      images,
      isActive,
      isFeatured,
      tags,
      variants,
    } = req.body;

    // Generate slug if not provided
    const productSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const product = await prisma.product.create({
      data: {
        name,
        slug: productSlug,
        description,
        shortDescription,
        sku,
        barcode,
        categoryId,
        basePrice: parseFloat(basePrice),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        images: images || [],
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured || false,
        tags: tags || [],
        variants: variants
          ? {
              create: variants.map((v: any) => ({
                name: v.name,
                color: v.color,
                fabric: v.fabric,
                occasion: v.occasion,
                price: v.price ? parseFloat(v.price) : null,
                sku: v.sku,
                barcode: v.barcode,
                isActive: v.isActive !== undefined ? v.isActive : true,
              })),
            }
          : undefined,
        inventory: {
          create: {
            type: 'ONLINE',
            quantity: 0,
          },
        },
      },
      include: {
        category: true,
        variants: true,
        inventory: true,
      },
    });

    // Invalidate caches
    await cache.del(`product:${product.id}`);
    await cache.del(`product:slug:${product.slug}`);
    await cache.delPattern('products:*');

    res.status(201).json(product);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return next(new AppError('Product with this SKU or slug already exists', 400));
    }
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  // Invalidate product caches
  await cache.delPattern('products:*');
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Convert numeric strings to numbers
    if (updateData.basePrice) updateData.basePrice = parseFloat(updateData.basePrice);
    if (updateData.compareAtPrice) updateData.compareAtPrice = parseFloat(updateData.compareAtPrice);
    if (updateData.costPrice) updateData.costPrice = parseFloat(updateData.costPrice);

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        variants: true,
        inventory: true,
      },
    });

    // Invalidate caches
    await cache.del(`product:${product.id}`);
    await cache.del(`product:slug:${product.slug}`);
    await cache.delPattern('products:*');

    res.json(product);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return next(new AppError('Product not found', 404));
    }
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Get product to invalidate slug cache
    const product = await prisma.product.findUnique({
      where: { id },
      select: { slug: true },
    });

    await prisma.product.delete({
      where: { id },
    });

    // Invalidate caches
    await cache.del(`product:${id}`);
    if (product) {
      await cache.del(`product:slug:${product.slug}`);
    }
    await cache.delPattern('products:*');

    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return next(new AppError('Product not found', 404));
    }
    next(error);
  }
};

