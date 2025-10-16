import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin, { IAdmin } from '../models/Admin';
import { AppError } from './errorMiddleware';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  admin?: IAdmin;
  token?: string;
}

export const auth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new AppError(401, 'Authentication required');
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      const admin = await Admin.findById(decoded.id).select('-password');
      
      if (!admin) {
        throw new AppError(401, 'Invalid authentication token');
      }

      // Store token and admin in request
      req.token = token;
      req.admin = admin;
      next();
    } catch (jwtError) {
      throw new AppError(401, 
        jwtError instanceof jwt.TokenExpiredError 
          ? 'Token expired' 
          : 'Invalid authentication token'
      );
    }
  } catch (error) {
    next(error);
  }
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
