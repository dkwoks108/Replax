"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/register', adminController_1.registerAdmin);
router.post('/login', adminController_1.loginAdmin);
router.get('/profile', auth_1.auth, adminController_1.getAdminProfile);
router.post('/logout', auth_1.auth, adminController_1.logoutAdmin);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map