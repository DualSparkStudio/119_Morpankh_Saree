import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { generateToken, generateRefreshToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone, name, password } = req.body;

    // Validation
    if (!email && !phone) {
      return next(new AppError('Email or phone is required', 400));
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : {},
          phone ? { phone } : {},
        ],
      },
    });

    if (existingUser) {
      return next(new AppError('User already exists', 400));
    }

    // Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        name,
        password: hashedPassword,
        otp,
        otpExpiry,
      },
    });

    // TODO: Send OTP via SMS/Email

    res.status(201).json({
      message: 'OTP sent successfully',
      userId: user.id,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone, password, otp } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : {},
          phone ? { phone } : {},
        ],
      },
    });

    if (!user) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Password login
    if (password) {
      if (!user.password) {
        return next(new AppError('Password not set. Please use OTP login', 401));
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return next(new AppError('Invalid credentials', 401));
      }
    }
    // OTP login
    else if (otp) {
      if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
        return next(new AppError('Invalid or expired OTP', 401));
      }
    } else {
      return next(new AppError('Password or OTP is required', 400));
    }

    // Generate tokens
    const token = generateToken({ userId: user.id, role: user.role, email: user.email || undefined });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role, email: user.email || undefined });

    // Clear OTP
    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpiry: null, isVerified: true },
    });

    res.json({
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, otp } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return next(new AppError('Invalid or expired OTP', 401));
    }

    const token = generateToken({ userId: user.id, role: user.role, email: user.email || undefined });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role, email: user.email || undefined });

    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpiry: null, isVerified: true },
    });

    res.json({
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const resendOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : {},
          phone ? { phone } : {},
        ],
      },
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiry },
    });

    // TODO: Send OTP via SMS/Email

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return next(new AppError('Refresh token required', 400));
    }

    // TODO: Implement refresh token verification and generation
    res.json({ message: 'Refresh token endpoint - to be implemented' });
  } catch (error) {
    next(error);
  }
};

