import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

// Get a setting by key (public endpoint)
export const getSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;
    
    const setting = await prisma.settings.findUnique({
      where: { key },
    });

    if (!setting) {
      // Return default value if setting doesn't exist
      if (key === 'tax_percentage') {
        return res.json({ key, value: 0 }); // Default 0%
      }
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json({ key: setting.key, value: setting.value });
  } catch (error) {
    next(error);
  }
};

// Get all settings (admin only)
export const getAllSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await prisma.settings.findMany({
      orderBy: { key: 'asc' },
    });

    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// Update or create a setting (admin only)
export const updateSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined || value === null) {
      throw new AppError('Value is required', 400);
    }

    // Validate tax_percentage if that's what we're updating
    if (key === 'tax_percentage') {
      const taxValue = typeof value === 'number' ? value : parseFloat(value);
      if (isNaN(taxValue) || taxValue < 0 || taxValue > 100) {
        throw new AppError('Tax percentage must be between 0 and 100', 400);
      }
    }

    const setting = await prisma.settings.upsert({
      where: { key },
      update: {
        value: typeof value === 'number' ? value : parseFloat(value),
        updatedAt: new Date(),
      },
      create: {
        key,
        value: typeof value === 'number' ? value : parseFloat(value),
      },
    });

    res.json({ key: setting.key, value: setting.value });
  } catch (error) {
    next(error);
  }
};

