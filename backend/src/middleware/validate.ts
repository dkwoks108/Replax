import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from './errorMiddleware';

export interface ValidationError {
  field: string;
  message: string;
  location?: string;
}

interface ValidationAppError extends AppError {
  errors?: ValidationError[];
}

interface ExtendedValidationError {
  param: string;
  msg: string;
  location: string;
  [key: string]: any;
}

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Run all validations in parallel
      await Promise.all(validations.map(validation => validation.run(req)));

      const result = validationResult(req);
      if (result.isEmpty()) {
        return next();
      }

      // Format validation errors
      const formattedErrors: ValidationError[] = result.array().map(err => {
        const validationError = err as unknown as ExtendedValidationError;
        return {
          field: validationError.param,
          message: validationError.msg,
          location: validationError.location
        };
      });

      // Create custom error with validation details
      const error = new AppError(400, 'Validation failed', true) as ValidationAppError;
      error.errors = formattedErrors;
      
      throw error;
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError(500, 'Internal validation error'));
      }
    }
  };
};

export const validateId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const validateObjectId = (value: string, fieldName: string): AppError | null => {
  if (!validateId(value)) {
    return new AppError(400, `Invalid ${fieldName} ID format`);
  }
  return null;
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};