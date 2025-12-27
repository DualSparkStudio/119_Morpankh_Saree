import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { cache } from '../../config/redis';
import { AppError } from '../../middleware/errorHandler';
import { getFileUrl } from '../../middleware/upload';

// Get all banners (admin)
export const getAdminBanners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    res.json(banners);
  } catch (error) {
    next(error);
  }
};

// Get banner by ID
export const getBannerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return next(new AppError('Banner not found', 404));
    }

    res.json(banner);
  } catch (error) {
    next(error);
  }
};

// Create banner
export const createBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, link, linkText, position, order, isActive, validFrom, validUntil } = req.body;
    
    // Get uploaded file URL
    let imageUrl = req.body.image; // If image URL is provided directly
    if (req.file) {
      imageUrl = getFileUrl(req.file.filename, req.body.uploadType || 'banners');
    }

    if (!imageUrl) {
      return next(new AppError('Image is required', 400));
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        description,
        image: imageUrl,
        link,
        linkText,
        position: position || 'homepage_hero',
        order: order ? parseInt(order) : 0,
        isActive: isActive !== undefined ? isActive : true,
        validFrom: validFrom ? new Date(validFrom) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
      },
    });

    // Invalidate cache
    await cache.delPattern('banners:*');

    res.status(201).json(banner);
  } catch (error) {
    next(error);
  }
};

// Update banner
export const updateBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, link, linkText, position, order, isActive, validFrom, validUntil } = req.body;

    // Check if banner exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return next(new AppError('Banner not found', 404));
    }

    // Get uploaded file URL
    let imageUrl = req.body.image || existingBanner.image;
    if (req.file) {
      imageUrl = getFileUrl(req.file.filename, req.body.uploadType || 'banners');
    }

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(imageUrl && { image: imageUrl }),
        ...(link !== undefined && { link }),
        ...(linkText !== undefined && { linkText }),
        ...(position !== undefined && { position }),
        ...(order !== undefined && { order: parseInt(order) }),
        ...(isActive !== undefined && { isActive }),
        ...(validFrom !== undefined && { validFrom: validFrom ? new Date(validFrom) : null }),
        ...(validUntil !== undefined && { validUntil: validUntil ? new Date(validUntil) : null }),
      },
    });

    // Invalidate cache
    await cache.delPattern('banners:*');

    res.json(banner);
  } catch (error) {
    next(error);
  }
};

// Delete banner
export const deleteBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return next(new AppError('Banner not found', 404));
    }

    await prisma.banner.delete({
      where: { id },
    });

    // Invalidate cache
    await cache.delPattern('banners:*');

    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    next(error);
  }
};

