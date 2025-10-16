"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const Blog_1 = __importDefault(require("../models/Blog"));
const router = express_1.default.Router();
// Get all published blog posts with pagination
router.get('/', (0, auth_1.asyncHandler)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const tag = req.query.tag;
    const query = { isPublished: true };
    if (tag) {
        query.tags = tag;
    }
    const total = await Blog_1.default.countDocuments(query);
    const posts = await Blog_1.default.find(query)
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
router.get('/:slug', (0, auth_1.asyncHandler)(async (req, res) => {
    const post = await Blog_1.default.findOne({
        slug: req.params.slug,
        isPublished: true
    }).populate('author', 'name');
    if (!post) {
        return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(post);
}));
// Get all blog posts (including unpublished) - Admin only
router.get('/admin/all', auth_1.auth, (0, auth_1.asyncHandler)(async (req, res) => {
    const posts = await Blog_1.default.find()
        .populate('author', 'name')
        .sort({ createdAt: -1 });
    res.json(posts);
}));
// Create new blog post (protected)
router.post('/', auth_1.auth, (0, auth_1.asyncHandler)(async (req, res) => {
    const blog = new Blog_1.default({
        ...req.body,
        author: req.admin._id
    });
    await blog.save();
    res.status(201).json(blog);
}));
// Update blog post (protected)
router.put('/:id', auth_1.auth, (0, auth_1.asyncHandler)(async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        'title', 'content', 'excerpt', 'featuredImage',
        'tags', 'isPublished', 'publishDate'
    ];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates' });
    }
    const post = await Blog_1.default.findById(req.params.id);
    if (!post) {
        return res.status(404).json({ error: 'Blog post not found' });
    }
    updates.forEach(update => {
        if (allowedUpdates.includes(update)) {
            post[update] = req.body[update];
        }
    });
    await post.save();
    res.json(post);
}));
// Delete blog post (protected)
router.delete('/:id', auth_1.auth, (0, auth_1.asyncHandler)(async (req, res) => {
    const post = await Blog_1.default.findByIdAndDelete(req.params.id);
    if (!post) {
        return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
}));
exports.default = router;
//# sourceMappingURL=blog.js.map