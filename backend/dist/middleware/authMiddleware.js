"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
const errorMiddleware_1 = require("./errorMiddleware");
const JWT_SECRET = process.env.JWT_SECRET;
const auth = async (req, _res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new errorMiddleware_1.AppError(401, 'Authentication required');
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const admin = await Admin_1.default.findById(decoded.id).select('-password');
            if (!admin) {
                throw new errorMiddleware_1.AppError(401, 'Invalid authentication token');
            }
            // Store token and admin in request
            req.token = token;
            req.admin = admin;
            next();
        }
        catch (jwtError) {
            throw new errorMiddleware_1.AppError(401, jwtError instanceof jsonwebtoken_1.default.TokenExpiredError
                ? 'Token expired'
                : 'Invalid authentication token');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.auth = auth;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=authMiddleware.js.map