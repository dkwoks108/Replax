"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const rateLimiter_1 = require("../middleware/rateLimiter");
const product_validation_1 = require("../validations/product.validation");
const Product_1 = __importDefault(require("../models/Product"));
const mongoose_1 = require("mongoose");
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler_1 = require("../middleware/errorHandler");
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
const router = express_1.default.Router();
// Get all products with pagination and filters
router.get('/', rateLimiter_1.apiLimiter, (0, validate_1.validate)(product_validation_1.productValidation.getAll), (0, auth_1.asyncHandler)(async (req, res) => {
    logger_1.default.info('Fetching products with filters', {
        query: req.query
    });
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const brand = req.query.brand;
    const search = req.query.search;
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);
    const query = { isActive: true };
    if (category && (0, mongoose_1.isValidObjectId)(category)) {
        query.category = category;
    }
    if (brand && (0, mongoose_1.isValidObjectId)(brand)) {
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
        if (!isNaN(minPrice))
            query.price.$gte = minPrice;
        if (!isNaN(maxPrice))
            query.price.$lte = maxPrice;
    }
    const total = await Product_1.default.countDocuments(query);
    const products = await Product_1.default.find(query)
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
router.get('/:slug', (0, auth_1.asyncHandler)(async (req, res) => {
    const product = await Product_1.default.findOne({ slug: req.params.slug, isActive: true })
        .populate('category', 'name')
        .populate('brand', 'name');
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
}));
// Create new product (protected)
router.post('/', auth_1.auth, rateLimiter_1.apiLimiter, (0, validate_1.validate)(product_validation_1.productValidation.create), (0, auth_1.asyncHandler)(async (req, res) => {
    logger_1.default.info('Creating new product', {
        productData: { ...req.body, password: undefined }
    });
    const product = new Product_1.default(req.body);
    await product.save();
    logger_1.default.info('Product created successfully', { productId: product._id });
    return res.status(201).json({
        success: true,
        data: product
    });
}));
// Update product (protected)
router.put('/:id', auth_1.auth, rateLimiter_1.apiLimiter, (0, validate_1.validate)(product_validation_1.productValidation.update), (0, auth_1.asyncHandler)(async (req, res) => {
    logger_1.default.info('Updating product', {
        productId: req.params.id,
        updates: req.body
    });
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'price', 'comparePrice', 'images',
        'category', 'brand', 'stock', 'isActive', 'specifications', 'tags'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates' });
    }
    const product = await Product_1.default.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    // Type-safe updates
    allowedUpdates.forEach(field => {
        if (field in req.body) {
            product[field] = req.body[field];
        }
    });
    await product.save();
    res.json(product);
}));
// Delete product (protected)
router.delete('/:id', auth_1.auth, rateLimiter_1.apiLimiter, (0, validate_1.validate)(product_validation_1.productValidation.delete), (0, auth_1.asyncHandler)(async (req, res) => {
    logger_1.default.info('Deleting product', { productId: req.params.id });
    const product = await Product_1.default.findByIdAndDelete(req.params.id);
    if (!product) {
        throw new errorHandler_1.AppError(404, 'Product not found');
    }
    logger_1.default.info('Product deleted successfully', { productId: req.params.id });
    return res.json({
        success: true,
        message: 'Product deleted successfully'
    });
}));
exports.default = router;
//# sourceMappingURL=product.js.map