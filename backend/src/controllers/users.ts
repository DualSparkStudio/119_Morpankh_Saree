import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { name, email, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, email, phone },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
      },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getAddresses = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    res.json(addresses);
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const addressData = req.body;

    // If this is set as default, unset other defaults
    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        ...addressData,
        userId,
      },
    });

    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const addressData = req.body;

    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return next(new AppError('Address not found', 404));
    }

    // If this is set as default, unset other defaults
    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: addressData,
    });

    res.json(address);
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const address = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      return next(new AppError('Address not found', 404));
    }

    await prisma.address.delete({
      where: { id },
    });

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    next(error);
  }
};

