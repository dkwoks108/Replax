import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = (req as any).cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized' });
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) return res.status(401).json({ message: 'Not authorized' });
    // attach admin to request
    (req as any).admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};
