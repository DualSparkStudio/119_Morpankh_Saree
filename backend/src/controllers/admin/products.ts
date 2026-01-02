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
        colors: {
          orderBy: { order: 'asc' },
        },
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
        colors: {
          orderBy: { order: 'asc' },
        },
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
      showInPremium,
      showInTrending,
      showInCategories,
      tags,
      colors,
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
        showInPremium: showInPremium || false,
        showInTrending: showInTrending || false,
        showInCategories: showInCategories || false,
        tags: tags || [],
        colors: colors && Array.isArray(colors)
          ? {
              create: colors.map((c: any, index: number) => ({
                color: c.color,
                images: Array.isArray(c.images) 
                  ? c.images.filter((img: string) => img && img.trim() !== '')
                  : [],
                isActive: c.isActive !== undefined ? c.isActive : true,
                order: c.order !== undefined ? c.order : index,
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
        colors: {
          orderBy: { order: 'asc' },
        },
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
    const updateData = { ...req.body };

    // Remove colors from updateData - colors should be managed separately
    // to avoid creating duplicates
    delete updateData.colors;

    // Convert numeric strings to numbers
    if (updateData.basePrice) updateData.basePrice = parseFloat(updateData.basePrice);
    if (updateData.compareAtPrice) updateData.compareAtPrice = updateData.compareAtPrice ? parseFloat(updateData.compareAtPrice) : null;
    if (updateData.costPrice) updateData.costPrice = updateData.costPrice ? parseFloat(updateData.costPrice) : null;
    if (updateData.sareeLength) updateData.sareeLength = updateData.sareeLength ? parseFloat(updateData.sareeLength) : null;

    // Check if product exists first
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { id: true, slug: true, sku: true },
    });

    if (!existingProduct) {
      return next(new AppError('Product not found', 404));
    }

    // Check for unique constraint violations (slug or SKU)
    if (updateData.slug && updateData.slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug: updateData.slug },
        select: { id: true },
      });
      if (slugExists && slugExists.id !== id) {
        return next(new AppError('A product with this slug already exists', 400));
      }
    }

    if (updateData.sku && updateData.sku !== existingProduct.sku) {
      const skuExists = await prisma.product.findUnique({
        where: { sku: updateData.sku },
        select: { id: true },
      });
      if (skuExists && skuExists.id !== id) {
        return next(new AppError('A product with this SKU already exists', 400));
      }
    }

    // Update the product (only update, never create)
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        colors: {
          orderBy: { order: 'asc' },
        },
        inventory: true,
      },
    });

    // Invalidate caches
    await cache.del(`product:${product.id}`);
    await cache.del(`product:slug:${product.slug}`);
    // Also invalidate old slug cache if slug changed
    if (existingProduct.slug !== product.slug) {
      await cache.del(`product:slug:${existingProduct.slug}`);
    }
    await cache.delPattern('products:*');

    res.json(product);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return next(new AppError('Product not found', 404));
    }
    if (error.code === 'P2002') {
      // Unique constraint violation
      const field = error.meta?.target?.[0] || 'field';
      return next(new AppError(`A product with this ${field} already exists`, 400));
    }
    console.error('Error updating product:', error);
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

// Color management functions
export const addProductColor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { color, images, isActive, order } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Check if color already exists for this product
    const existingColor = await prisma.productColor.findUnique({
      where: {
        productId_color: {
          productId: id,
          color: color,
        },
      },
    });

    if (existingColor) {
      return next(new AppError('This color already exists for this product', 400));
    }

    const filteredImages = Array.isArray(images) 
      ? images.filter((img: string) => img && img.trim() !== '')
      : [];
    
    console.log('Creating product color:', {
      productId: id,
      color,
      images: filteredImages,
      imagesCount: filteredImages.length,
    });

    const productColor = await prisma.productColor.create({
      data: {
        productId: id,
        color,
        images: filteredImages,
        isActive: isActive !== undefined ? isActive : true,
        order: order !== undefined ? order : 0,
      },
    });
    
    console.log('Product color created:', productColor);

    // Invalidate caches
    await cache.del(`product:${id}`);
    await cache.delPattern('products:*');

    res.status(201).json(productColor);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return next(new AppError('This color already exists for this product', 400));
    }
    next(error);
  }
};

export const updateProductColor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, colorId } = req.params;
    const { color, images, isActive, order } = req.body;
    
    // Debug logging
    console.log('Updating product color:', {
      productId: id,
      colorId,
      images: images,
      imagesType: typeof images,
      isArray: Array.isArray(images),
    });

    // Check if color exists and belongs to product
    const existingColor = await prisma.productColor.findUnique({
      where: { id: colorId },
      select: { productId: true, color: true },
    });

    if (!existingColor || existingColor.productId !== id) {
      return next(new AppError('Color not found', 404));
    }

    // If color name is being changed, check for uniqueness
    if (color && color !== existingColor.color) {
      const colorExists = await prisma.productColor.findUnique({
        where: {
          productId_color: {
            productId: id,
            color: color,
          },
        },
      });
      if (colorExists) {
        return next(new AppError('This color already exists for this product', 400));
      }
    }

    const updateData: any = {};
    if (color !== undefined) updateData.color = color;
    if (images !== undefined) {
      updateData.images = Array.isArray(images) 
        ? images.filter((img: string) => img && img.trim() !== '')
        : [];
    }
    if (isActive !== undefined) updateData.isActive = isActive;
    if (order !== undefined) updateData.order = order;

    console.log('Updating color with data:', updateData);
    const productColor = await prisma.productColor.update({
      where: { id: colorId },
      data: updateData,
    });
    console.log('Color updated successfully:', productColor);

    // Invalidate caches
    await cache.del(`product:${id}`);
    await cache.delPattern('products:*');

    res.json(productColor);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return next(new AppError('This color already exists for this product', 400));
    }
    if (error.code === 'P2025') {
      return next(new AppError('Color not found', 404));
    }
    next(error);
  }
};

export const deleteProductColor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, colorId } = req.params;

    // Check if color exists and belongs to product
    const existingColor = await prisma.productColor.findUnique({
      where: { id: colorId },
      select: { productId: true },
    });

    if (!existingColor || existingColor.productId !== id) {
      return next(new AppError('Color not found', 404));
    }

    await prisma.productColor.delete({
      where: { id: colorId },
    });

    // Invalidate caches
    await cache.del(`product:${id}`);
    await cache.delPattern('products:*');

    res.json({ message: 'Color deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return next(new AppError('Color not found', 404));
    }
    next(error);
  }
};

