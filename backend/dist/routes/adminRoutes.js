"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/register', adminController_1.registerAdmin);
router.post('/login', adminController_1.loginAdmin);
router.get('/profile', authMiddleware_1.protect, adminController_1.getAdminProfile);
router.post('/logout', authMiddleware_1.protect, adminController_1.logoutAdmin);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map