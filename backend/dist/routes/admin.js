"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
const Admin_1 = __importDefault(require("../models/Admin"));
const router = express_1.default.Router();
// Admin Registration (this could be disabled in production)
router.post('/register', (0, auth_1.asyncHandler)(async (req, res) => {
    const admin = new Admin_1.default(req.body);
    await admin.save();
    const token = jsonwebtoken_1.default.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ admin, token });
}));
// Admin Login
router.post('/login', (0, auth_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin_1.default.findOne({ email });
    if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jsonwebtoken_1.default.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ admin, token });
}));
// Get Admin Profile
router.get('/profile', auth_1.auth, (0, auth_1.asyncHandler)(async (req, res) => {
    res.json(req.admin);
}));
// Update Admin Profile
router.put('/profile', auth_1.auth, (0, auth_1.asyncHandler)(async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates' });
    }
    updates.forEach(update => {
        req.admin[update] = req.body[update];
    });
    await req.admin.save();
    res.json(req.admin);
}));
exports.default = router;
//# sourceMappingURL=admin.js.map