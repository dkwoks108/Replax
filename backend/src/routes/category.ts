import express, { Request, Response } from 'express';
import { auth, asyncHandler } from '../middleware/auth';
import Category from '../models/Category';
import { ICategory } from '../models/Category';

const router = express.Router();

// Get all categories
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const categories = await Category.find({ isActive: true })
    .populate('parentCategory', 'name');
  res.json(categories);
}));

// Get category by slug
router.get('/:slug', asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findOne({ 
    slug: req.params.slug,
    isActive: true 
  }).populate('parentCategory', 'name');

  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  res.json(category);
}));

// Create new category (protected)
router.post('/', auth, asyncHandler(async (req: Request, res: Response) => {
  const category = new Category(req.body);
  await category.save();
  res.status(201).json(category);
}));

// Update category (protected)
router.put('/:id', auth, asyncHandler(async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'description', 'image', 'isActive', 'parentCategory'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  // Type-safe update of category fields
  updates.forEach(update => {
    if (allowedUpdates.includes(update)) {
      (category as any)[update] = req.body[update];
    }
  });
  
  await category.save();
  res.json(category);
}));

// Delete category (protected)
router.delete('/:id', auth, asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  res.json({ message: 'Category deleted successfully' });
}));

export default router;