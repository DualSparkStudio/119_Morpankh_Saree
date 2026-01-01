import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      message: err.message, // Include both for consistency
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  console.error('Error:', err);
  console.error('Error stack:', err.stack);
  
  // Always show error details in development, or if NODE_ENV is not production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // Check for Prisma errors
  if ((err as any).code) {
    console.error('Prisma error code:', (err as any).code);
    console.error('Prisma error meta:', (err as any).meta);
    
    // Handle specific Prisma errors
    if ((err as any).code === 'P2002') {
      return res.status(400).json({
        error: 'Duplicate entry',
        message: 'A record with this value already exists',
      });
    }
    if ((err as any).code === 'P2025') {
      return res.status(404).json({
        error: 'Record not found',
        message: 'The requested record could not be found',
      });
    }
  }
  
  res.status(500).json({
    error: 'Internal server error',
    message: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { 
      stack: err.stack,
      name: err.name
    })
  });
};

