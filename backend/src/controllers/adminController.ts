import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Admin from '../models/Admin';
import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorMiddleware';

interface RegisterAdminBody {
  name: string;
  email: string;
  password: string;
}

interface LoginAdminBody {
  email: string;
  password: string;
}

export const registerAdmin = async (
  req: Request<{}, {}, RegisterAdminBody>,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError(400, 'Missing required fields');
  }

  const exists = await Admin.findOne({ email });
  if (exists) {
    throw new AppError(400, 'Email already registered');
  }

  const admin = await Admin.create({ name, email, password });
  const token = jwt.sign(
    { id: admin._id },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.status(201).json({
    success: true,
    data: {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      },
      token
    }
  });
};

export const loginAdmin = async (
  req: Request<{}, {}, LoginAdminBody>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(400, 'Missing required fields');
  }

  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.comparePassword(password))) {
    throw new AppError(401, 'Invalid credentials');
  }

  const token = jwt.sign(
    { id: admin._id },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({
    success: true,
    data: {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      },
      token
    }
  });
};

export const getAdminProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const admin = req.admin;
  if (!admin) {
    throw new AppError(404, 'Admin not found');
  }

  res.json({
    success: true,
    data: {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    }
  });
};

export const logoutAdmin = async (
  _req: Request,
  res: Response
): Promise<void> => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};
