import express, { Request, Response } from 'express';
import { auth, asyncHandler } from '../middleware/auth';
import Blog from '../models/Blog';

const router = express.Router();

// Get all published blog posts with pagination
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const tag = req.query.tag as string;

  const query: any = { isPublished: true };
  if (tag) {
    query.tags = tag;
  }

  const total = await Blog.countDocuments(query);
  const posts = await Blog.find(query)
    .populate('author', 'name')
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ publishDate: -1 });

  res.json({
    posts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}));

// Get single blog post by slug
router.get('/:slug', asyncHandler(async (req: Request, res: Response) => {
  const post = await Blog.findOne({ 
    slug: req.params.slug,
    isPublished: true 
  }).populate('author', 'name');

  if (!post) {
    return res.status(404).json({ error: 'Blog post not found' });
  }

  res.json(post);
}));

// Get all blog posts (including unpublished) - Admin only
router.get('/admin/all', auth, asyncHandler(async (req: Request, res: Response) => {
  const posts = await Blog.find()
    .populate('author', 'name')
    .sort({ createdAt: -1 });
  res.json(posts);
}));

// Create new blog post (protected)
router.post('/', auth, asyncHandler(async (req: Request & { admin?: any }, res: Response) => {
  const blog = new Blog({
    ...req.body,
    author: req.admin!._id
  });
  await blog.save();
  res.status(201).json(blog);
}));

// Update blog post (protected)
router.put('/:id', auth, asyncHandler(async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'title', 'content', 'excerpt', 'featuredImage', 
    'tags', 'isPublished', 'publishDate'
  ];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  const post = await Blog.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Blog post not found' });
  }

  updates.forEach(update => {
    if (allowedUpdates.includes(update)) {
      (post as any)[update] = req.body[update];
    }
  });

  await post.save();
  res.json(post);
}));

// Delete blog post (protected)
router.delete('/:id', auth, asyncHandler(async (req: Request, res: Response) => {
  const post = await Blog.findByIdAndDelete(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Blog post not found' });
  }

  res.json({ message: 'Blog post deleted successfully' });
}));

export default router;