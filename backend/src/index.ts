import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db';
import swaggerDocs from './utils/swagger';
import logger from './utils/logger';
import { connectRedis } from './utils/redis';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import { apiLimiter } from './middleware/rateLimiter';

// Routes
import adminRoutes from './routes/admin';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';
import categoryRoutes from './routes/category';
import blogRoutes from './routes/blog';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging middleware
app.use(morgan('dev'));

// Rate limiting
app.use('/api', apiLimiter);

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/blog', blogRoutes);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// API Documentation
swaggerDocs(app);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Initialize services
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('Database connected successfully');

    // Connect to Redis if URL is provided
    if (process.env.REDIS_URL) {
      await connectRedis();
      logger.info('Redis connected successfully');
    }

    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
      logger.info(`API Documentation available at http://localhost:${PORT}/api/docs`);
    });

    // Handle graceful shutdown
    const shutdownGracefully = async () => {
      logger.info('Shutting down gracefully...');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdownGracefully);
    process.on('SIGINT', shutdownGracefully);

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

void startServer();
