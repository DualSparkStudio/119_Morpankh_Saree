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

    // Extract all images from colorImages for the legacy images field (for backward compatibility)
    const allImages: string[] = [];
    if (colors && Array.isArray(colors) && colors.length > 0) {
      colors.forEach((c: any) => {
        if (Array.isArray(c.images)) {
          c.images.forEach((img: string) => {
            if (img && img.trim() !== '' && !allImages.includes(img)) {
              allImages.push(img);
            }
          });
        }
      });
    }

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
        images: allImages, // Auto-populated from colorImages for backward compatibility
        colorImages: colors && Array.isArray(colors) && colors.length > 0
          ? colors.map((c: any, index: number) => ({
              color: c.color,
              images: Array.isArray(c.images) 
                ? c.images.filter((img: string) => img && img.trim() !== '')
                : [],
              isActive: c.isActive !== undefined ? c.isActive : true,
              order: c.order !== undefined ? c.order : index,
            }))
          : undefined,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured || false,
        showInPremium: showInPremium || false,
        showInTrending: showInTrending || false,
        showInCategories: showInCategories || false,
        tags: tags || [],
        inventory: {
          create: {
            type: 'ONLINE',
            quantity: 0,
          },
        },
      },
      include: {
        category: true,
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

    // Check if product exists first (we need this for colorImages sync)
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { id: true, slug: true, sku: true, colorImages: true },
    });

    // Handle colorImages if provided
    if (updateData.colors !== undefined) {
      const colorImages = Array.isArray(updateData.colors)
        ? updateData.colors.map((c: any, index: number) => ({
            color: c.color,
            images: Array.isArray(c.images) 
              ? c.images.filter((img: string) => img && img.trim() !== '')
              : [],
            isActive: c.isActive !== undefined ? c.isActive : true,
            order: c.order !== undefined ? c.order : index,
          }))
        : null;
      
      updateData.colorImages = colorImages;
      
      // Auto-populate images field from colorImages for backward compatibility
      const allImages: string[] = [];
      if (colorImages && Array.isArray(colorImages) && colorImages.length > 0) {
        colorImages.forEach((c: any) => {
          if (Array.isArray(c.images)) {
            c.images.forEach((img: string) => {
              if (img && img.trim() !== '' && !allImages.includes(img)) {
                allImages.push(img);
              }
            });
          }
        });
      }
      updateData.images = allImages;
      
      delete updateData.colors;
    } else if (existingProduct && existingProduct.colorImages) {
      // If colors not provided but product has existing colorImages, sync images field
      const colorImages = existingProduct.colorImages as any[];
      const allImages: string[] = [];
      if (Array.isArray(colorImages) && colorImages.length > 0) {
        colorImages.forEach((c: any) => {
          if (Array.isArray(c.images)) {
            c.images.forEach((img: string) => {
              if (img && img.trim() !== '' && !allImages.includes(img)) {
                allImages.push(img);
              }
            });
          }
        });
      }
      updateData.images = allImages;
    } else if (existingProduct && (!existingProduct.colorImages || (Array.isArray(existingProduct.colorImages) && existingProduct.colorImages.length === 0))) {
      // If no colorImages exist, set images to empty array
      updateData.images = [];
    }

    // Convert numeric strings to numbers
    if (updateData.basePrice) updateData.basePrice = parseFloat(updateData.basePrice);
    if (updateData.compareAtPrice) updateData.compareAtPrice = updateData.compareAtPrice ? parseFloat(updateData.compareAtPrice) : null;
    if (updateData.costPrice) updateData.costPrice = updateData.costPrice ? parseFloat(updateData.costPrice) : null;
    if (updateData.sareeLength) updateData.sareeLength = updateData.sareeLength ? parseFloat(updateData.sareeLength) : null;

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

// Color management functions - now working with colorImages JSON field
export const addProductColor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { color, images, isActive, order } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, colorImages: true },
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Get existing colorImages or initialize empty array
    const colorImages: any[] = (product.colorImages as any[]) || [];

    // Check if color already exists
    if (colorImages.some((c: any) => c.color === color)) {
      return next(new AppError('This color already exists for this product', 400));
    }

    const filteredImages = Array.isArray(images) 
      ? images.filter((img: string) => img && img.trim() !== '')
      : [];
    
    // Add new color
    const newColor = {
      color,
      images: filteredImages,
      isActive: isActive !== undefined ? isActive : true,
      order: order !== undefined ? order : colorImages.length,
    };

    colorImages.push(newColor);

    // Auto-populate images field from colorImages for backward compatibility
    const allImages: string[] = [];
    colorImages.forEach((c: any) => {
      if (Array.isArray(c.images)) {
        c.images.forEach((img: string) => {
          if (img && img.trim() !== '' && !allImages.includes(img)) {
            allImages.push(img);
          }
        });
      }
    });

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { 
        colorImages,
        images: allImages, // Auto-update images field
      },
      include: { category: true, inventory: true },
    });

    // Invalidate caches
    await cache.del(`product:${id}`);
    await cache.delPattern('products:*');

    res.status(201).json(newColor);
  } catch (error: any) {
    next(error);
  }
};

export const updateProductColor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, colorIndex } = req.params;
    const { color, images, isActive, order } = req.body;
    
    const index = parseInt(colorIndex);
    if (isNaN(index)) {
      return next(new AppError('Invalid color index', 400));
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, colorImages: true },
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    const colorImages: any[] = (product.colorImages as any[]) || [];
    
    if (index < 0 || index >= colorImages.length) {
      return next(new AppError('Color not found', 404));
    }

    // Update color
    if (color !== undefined) colorImages[index].color = color;
    if (images !== undefined) {
      colorImages[index].images = Array.isArray(images) 
        ? images.filter((img: string) => img && img.trim() !== '')
        : [];
    }
    if (isActive !== undefined) colorImages[index].isActive = isActive;
    if (order !== undefined) colorImages[index].order = order;

    // Auto-populate images field from colorImages for backward compatibility
    const allImages: string[] = [];
    colorImages.forEach((c: any) => {
      if (Array.isArray(c.images)) {
        c.images.forEach((img: string) => {
          if (img && img.trim() !== '' && !allImages.includes(img)) {
            allImages.push(img);
          }
        });
      }
    });

    // Update product
    await prisma.product.update({
      where: { id },
      data: { 
        colorImages,
        images: allImages, // Auto-update images field
      },
    });

    // Invalidate caches
    await cache.del(`product:${id}`);
    await cache.delPattern('products:*');

    res.json(colorImages[index]);
  } catch (error: any) {
    next(error);
  }
};

export const deleteProductColor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, colorIndex } = req.params;

    const index = parseInt(colorIndex);
    if (isNaN(index)) {
      return next(new AppError('Invalid color index', 400));
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, colorImages: true },
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    const colorImages: any[] = (product.colorImages as any[]) || [];
    
    if (index < 0 || index >= colorImages.length) {
      return next(new AppError('Color not found', 404));
    }

    // Remove color
    colorImages.splice(index, 1);

    // Auto-populate images field from colorImages for backward compatibility
    const allImages: string[] = [];
    colorImages.forEach((c: any) => {
      if (Array.isArray(c.images)) {
        c.images.forEach((img: string) => {
          if (img && img.trim() !== '' && !allImages.includes(img)) {
            allImages.push(img);
          }
        });
      }
    });

    // Update product
    await prisma.product.update({
      where: { id },
      data: { 
        colorImages,
        images: allImages, // Auto-update images field
      },
    });

    // Invalidate caches
    await cache.del(`product:${id}`);
    await cache.delPattern('products:*');

    res.json({ message: 'Color deleted successfully' });
  } catch (error: any) {
    next(error);
  }
};

