import { Request, Response } from 'express';
import Admin from '../models/Admin';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export const registerAdmin = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  const exists = await Admin.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });
  const admin = await Admin.create({ name, email, password });
  const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  res.status(201).json({ admin: { id: admin._id, name: admin.name, email: admin.email }, token });
};

export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({ message: 'Invalid credentials' });
  const isMatch = await admin.comparePassword(password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  res.json({ admin: { id: admin._id, name: admin.name, email: admin.email }, token });
};

export const getAdminProfile = async (req: Request, res: Response) => {
  // req.admin is added by auth middleware
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const admin = req.admin;
  if (!admin) return res.status(404).json({ message: 'Admin not found' });
  res.json({ admin: { id: admin._id, name: admin.name, email: admin.email } });
};

export const logoutAdmin = async (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};
