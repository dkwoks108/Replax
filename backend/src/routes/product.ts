import express from 'express';
import { auth, asyncHandler } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { apiLimiter } from '../middleware/rateLimiter';
import { productValidation } from '../validations/product.validation';
import Product from '../models/Product';
import { isValidObjectId } from 'mongoose';
import logger from '../utils/logger';
import { AppError } from '../middleware/errorHandler';

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management API
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with pagination and filters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID to filter by
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Brand ID to filter by
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

const router = express.Router();

// Get all products with pagination and filters
router.get('/', 
  apiLimiter,
  validate(productValidation.getAll),
  asyncHandler(async (req: express.Request, res: express.Response) => {
    logger.info('Fetching products with filters', { 
      query: req.query 
    });
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const category = req.query.category;
  const brand = req.query.brand;
  const search = req.query.search as string;
  const minPrice = parseFloat(req.query.minPrice as string);
  const maxPrice = parseFloat(req.query.maxPrice as string);

  const query: any = { isActive: true };

  if (category && isValidObjectId(category)) {
    query.category = category;
  }
  if (brand && isValidObjectId(brand)) {
    query.brand = brand;
  }
  if (search) {
    // Use $regex for better search with case insensitivity
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  if (!isNaN(minPrice) || !isNaN(maxPrice)) {
    query.price = {};
    if (!isNaN(minPrice)) query.price.$gte = minPrice;
    if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
  }

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name')
    .populate('brand', 'name')
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}));

// Get single product by slug
router.get('/:slug', asyncHandler(async (req: express.Request, res: express.Response) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name')
    .populate('brand', 'name');

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
}));

// Create new product (protected)
router.post('/', 
  auth,
  apiLimiter,
  validate(productValidation.create),
  asyncHandler(async (req: express.Request, res: express.Response) => {
    logger.info('Creating new product', { 
      productData: { ...req.body, password: undefined } 
    });
    
    const product = new Product(req.body);
    await product.save();
    
    logger.info('Product created successfully', { productId: product._id });
    return res.status(201).json({
      success: true,
      data: product
    });
  }));

// Update product (protected)
router.put('/:id', 
  auth,
  apiLimiter,
  validate(productValidation.update),
  asyncHandler(async (req: express.Request, res: express.Response) => {
    logger.info('Updating product', { 
      productId: req.params.id,
      updates: req.body
    });
  const updates = Object.keys(req.body) as Array<keyof typeof req.body>;
  const allowedUpdates = ['name', 'description', 'price', 'comparePrice', 'images', 
    'category', 'brand', 'stock', 'isActive', 'specifications', 'tags'] as const;
  
  const isValidOperation = updates.every(update => 
    allowedUpdates.includes(update as typeof allowedUpdates[number])
  );

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Type-safe updates
  allowedUpdates.forEach(field => {
    if (field in req.body) {
      (product as any)[field] = req.body[field];
    }
  });
  
  await product.save();
  res.json(product);
}));

// Delete product (protected)
router.delete('/:id', 
  auth,
  apiLimiter,
  validate(productValidation.delete),
  asyncHandler(async (req: express.Request, res: express.Response) => {
    logger.info('Deleting product', { productId: req.params.id });

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      throw new AppError(404, 'Product not found');
    }

    logger.info('Product deleted successfully', { productId: req.params.id });
    return res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  }));

export default router;