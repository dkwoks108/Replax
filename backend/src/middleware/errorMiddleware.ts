import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: ValidationError[];
  stack?: string;
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isDev = process.env.NODE_ENV === 'development';
  let statusCode = 500;
  let response: ErrorResponse = {
    success: false,
    message: 'Internal server error'
  };

  // Handle known errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    response.message = err.message;
    if (err.errors) {
      response.errors = err.errors;
    }
  } else if (err instanceof Error) {
    if (isDev) {
      response.message = err.message;
    }
  }

  // Log unknown errors
  if (!(err instanceof AppError) || !err.isOperational) {
    logger.error('Unhandled error:', {
      error: err,
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params,
    });
  }

  // Add stack trace in development
  if (isDev) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, `Not Found - ${req.originalUrl}`));
};

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};