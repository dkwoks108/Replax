"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutAdmin = exports.getAdminProfile = exports.loginAdmin = exports.registerAdmin = void 0;
const Admin_1 = __importDefault(require("../models/Admin"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorMiddleware_1 = require("../middleware/errorMiddleware");
const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new errorMiddleware_1.AppError(400, 'Missing required fields');
    }
    const exists = await Admin_1.default.findOne({ email });
    if (exists) {
        throw new errorMiddleware_1.AppError(400, 'Email already registered');
    }
    const admin = await Admin_1.default.create({ name, email, password });
    const token = jsonwebtoken_1.default.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
exports.registerAdmin = registerAdmin;
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new errorMiddleware_1.AppError(400, 'Missing required fields');
    }
    const admin = await Admin_1.default.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
        throw new errorMiddleware_1.AppError(401, 'Invalid credentials');
    }
    const token = jsonwebtoken_1.default.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
exports.loginAdmin = loginAdmin;
const getAdminProfile = async (req, res) => {
    const admin = req.admin;
    if (!admin) {
        throw new errorMiddleware_1.AppError(404, 'Admin not found');
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
exports.getAdminProfile = getAdminProfile;
const logoutAdmin = async (_req, res) => {
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
exports.logoutAdmin = logoutAdmin;
//# sourceMappingURL=adminController.js.map