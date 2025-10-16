"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const router = express_1.default.Router();
// Get all orders (admin only)
router.get('/', auth_1.auth, (0, auth_1.asyncHandler)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const query = {};
    if (status) {
        query.status = status;
    }
    const total = await Order_1.default.countDocuments(query);
    const orders = await Order_1.default.find(query)
        .populate('items.product', 'name price')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
    res.json({
        orders,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    });
}));
// Get single order by order number
router.get('/:orderNumber', auth_1.auth, (0, auth_1.asyncHandler)(async (req, res) => {
    const order = await Order_1.default.findOne({ orderNumber: req.params.orderNumber })
        .populate('items.product', 'name price images');
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
}));
// Create new order
router.post('/', (0, auth_1.asyncHandler)(async (req, res) => {
    // Validate products and calculate total
    const items = req.body.items || [];
    let totalAmount = 0;
    for (const item of items) {
        const product = await Product_1.default.findById(item.product);
        if (!product) {
            return res.status(400).json({ error: `Product not found: ${item.product}` });
        }
        if (product.get('stock') < item.quantity) {
            return res.status(400).json({
                error: `Insufficient stock for product: ${product.name}`
            });
        }
        item.price = product.price;
        totalAmount += product.price * item.quantity;
    }
    // Create order
    const order = new Order_1.default({
        ...req.body,
        totalAmount,
        items
    });
    // Update product stock
    for (const item of items) {
        await Product_1.default.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity }
        });
    }
    await order.save();
    res.status(201).json(order);
}));
// Update order status (admin only)
router.patch('/:id/status', auth_1.auth, (0, auth_1.asyncHandler)(async (req, res) => {
    const { status, trackingNumber } = req.body;
    const allowedStatus = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!allowedStatus.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    const order = await Order_1.default.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    // If order is being cancelled and was previously confirmed, restore product stock
    if (status === 'cancelled' && order.status === 'confirmed') {
        for (const item of order.items) {
            await Product_1.default.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity }
            });
        }
    }
    order.status = status;
    if (trackingNumber) {
        order.trackingNumber = trackingNumber;
    }
    await order.save();
    res.json(order);
}));
// Update payment status (admin only)
router.patch('/:id/payment', auth_1.auth, (0, auth_1.asyncHandler)(async (req, res) => {
    const { paymentStatus } = req.body;
    const allowedStatus = ['pending', 'completed', 'failed'];
    if (!allowedStatus.includes(paymentStatus)) {
        return res.status(400).json({ error: 'Invalid payment status' });
    }
    const order = await Order_1.default.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    order.paymentStatus = paymentStatus;
    await order.save();
    res.json(order);
}));
exports.default = router;
//# sourceMappingURL=order.js.map