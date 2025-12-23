import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: string; role: string };
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else {
      next(error);
    }
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.userRole !== 'ADMIN' && req.userRole !== 'STAFF') {
    return next(new AppError('Admin access required', 403));
  }
  next();
};

export const requireStaff = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.userRole !== 'STAFF') {
    return next(new AppError('Staff access required', 403));
  }
  next();
};

