import { Request, Response, NextFunction } from 'express';
import { ValidationChain } from 'express-validator';
import { AppError } from './errorMiddleware';
export interface ValidationError {
    field: string;
    message: string;
    location?: string;
}
export declare const validate: (validations: ValidationChain[]) => (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export declare const validateId: (id: string) => boolean;
export declare const validateObjectId: (value: string, fieldName: string) => AppError | null;
export declare const validateEmail: (email: string) => boolean;
