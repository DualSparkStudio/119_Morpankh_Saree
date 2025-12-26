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
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  console.error('Error:', err);
  
  // Always show error details in development, or if NODE_ENV is not production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(500).json({
    error: 'Internal server error',
    ...(isDevelopment && { 
      message: err.message, 
      stack: err.stack,
      name: err.name
    })
  });
};

