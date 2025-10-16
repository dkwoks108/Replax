"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const Category_1 = __importDefault(require("../models/Category"));
const router = express_1.default.Router();
// Get all categories
router.get('/', (0, auth_1.asyncHandler)(async (req, res) => {
    const categories = await Category_1.default.find({ isActive: true })
        .populate('parentCategory', 'name');
    res.json(categories);
}));
// Get category by slug
router.get('/:slug', (0, auth_1.asyncHandler)(async (req, res) => {
    const category = await Category_1.default.findOne({
        slug: req.params.slug,
        isActive: true
    }).populate('parentCategory', 'name');
    if (!category) {
        return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
}));
// Create new category (protected)
router.post('/', auth_1.auth, (0, auth_1.asyncHandler)(async (req, res) => {
    const category = new Category_1.default(req.body);
    await category.save();
    res.status(201).json(category);
}));
// Update category (protected)
router.put('/:id', auth_1.auth, (0, auth_1.asyncHandler)(async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'image', 'isActive', 'parentCategory'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates' });
    }
    const category = await Category_1.default.findById(req.params.id);
    if (!category) {
        return res.status(404).json({ error: 'Category not found' });
    }
    // Type-safe update of category fields
    updates.forEach(update => {
        if (allowedUpdates.includes(update)) {
            category[update] = req.body[update];
        }
    });
    await category.save();
    res.json(category);
}));
// Delete category (protected)
router.delete('/:id', auth_1.auth, (0, auth_1.asyncHandler)(async (req, res) => {
    const category = await Category_1.default.findByIdAndDelete(req.params.id);
    if (!category) {
        return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
}));
exports.default = router;
//# sourceMappingURL=category.js.map