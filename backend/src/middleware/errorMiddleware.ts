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

// local typedef for validation errors (avoid TS error if a specific type isn't available)
type ValidationError = any;

interface ErrorResponse {
  status?: string;
  statusCode?: number;
  message?: string;
  errors?: ValidationError[];
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const response: ErrorResponse = {
    status: statusCode >= 500 ? 'error' : 'fail',
    statusCode,
    message: err.message || 'Internal Server Error'
  };

  // use safe access for errors — many error types attach `errors`
  if ((err as any).errors) {
    response.errors = (err as any).errors;
  }

  res.status(statusCode).json(response);
};

// notFound handler: mark unused param with underscore to avoid TS unused param complaint
export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const err = new Error('Not Found');
  (err as any).statusCode = 404;
  next(err);
};

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};