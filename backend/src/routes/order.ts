import express, { Request, Response } from 'express';
import { auth, asyncHandler } from '../middleware/auth';
import Order from '../models/Order';
import Product from '../models/Product';

const router = express.Router();

// Get all orders (admin only)
router.get('/', auth, asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const status = req.query.status as string;

  const query: any = {};
  if (status) {
    query.status = status;
  }

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
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
router.get('/:orderNumber', auth, asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber })
    .populate('items.product', 'name price images');

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(order);
}));

// Create new order
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  // Validate products and calculate total
  const items = req.body.items || [];
  let totalAmount = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(400).json({ error: `Product not found: ${item.product}` });
    }
    if ((product.get('stock') as number) < item.quantity) {
      return res.status(400).json({ 
        error: `Insufficient stock for product: ${product.name}` 
      });
    }
    item.price = product.price;
    totalAmount += product.price * item.quantity;
  }

  // Create order
  const order = new Order({
    ...req.body,
    totalAmount,
    items
  });

  // Update product stock
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }
    });
  }

  await order.save();
  res.status(201).json(order);
}));

// Update order status (admin only)
router.patch('/:id/status', auth, asyncHandler(async (req: Request, res: Response) => {
  const { status, trackingNumber } = req.body;
  const allowedStatus = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // If order is being cancelled and was previously confirmed, restore product stock
  if (status === 'cancelled' && order.status === 'confirmed') {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
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
router.patch('/:id/payment', auth, asyncHandler(async (req: Request, res: Response) => {
  const { paymentStatus } = req.body;
  const allowedStatus = ['pending', 'completed', 'failed'];

  if (!allowedStatus.includes(paymentStatus)) {
    return res.status(400).json({ error: 'Invalid payment status' });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.paymentStatus = paymentStatus;
  await order.save();
  res.json(order);
}));

export default router;