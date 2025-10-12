import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { auth, asyncHandler } from '../middleware/auth';
import Admin from '../models/Admin';

const router = express.Router();

// Admin Registration (this could be disabled in production)
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const admin = new Admin(req.body);
  await admin.save();
  
  const token = jwt.sign(
    { id: admin._id }, 
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
  
  res.status(201).json({ admin, token });
}));

// Admin Login
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign(
    { id: admin._id },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
  
  res.json({ admin, token });
}));

// Get Admin Profile
router.get('/profile', auth, asyncHandler(async (req: Request & { admin?: any }, res: Response) => {
  res.json(req.admin);
}));

// Update Admin Profile
router.put('/profile', auth, asyncHandler(async (req: Request & { admin?: any }, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  updates.forEach(update => {
    (req.admin as any)[update] = req.body[update];
  });
  
  await req.admin.save();
  res.json(req.admin);
}));

export default router;