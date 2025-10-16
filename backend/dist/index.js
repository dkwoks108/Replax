"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const swagger_1 = __importDefault(require("./utils/swagger"));
const logger_1 = __importDefault(require("./utils/logger"));
const redis_1 = require("./utils/redis");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const rateLimiter_1 = require("./middleware/rateLimiter");
// Routes
const admin_1 = __importDefault(require("./routes/admin"));
const product_1 = __importDefault(require("./routes/product"));
const order_1 = __importDefault(require("./routes/order"));
const category_1 = __importDefault(require("./routes/category"));
const blog_1 = __importDefault(require("./routes/blog"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
// Parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Logging middleware
app.use((0, morgan_1.default)('dev'));
// Rate limiting
app.use('/api', rateLimiter_1.apiLimiter);
// API Routes
app.use('/api/admin', admin_1.default);
app.use('/api/products', product_1.default);
app.use('/api/orders', order_1.default);
app.use('/api/categories', category_1.default);
app.use('/api/blog', blog_1.default);
// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});
// API Documentation
(0, swagger_1.default)(app);
// Error handling
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorHandler);
// Initialize services
const startServer = async () => {
    try {
        // Connect to MongoDB
        await (0, db_1.default)();
        logger_1.default.info('Database connected successfully');
        // Connect to Redis if URL is provided
        if (process.env.REDIS_URL) {
            await (0, redis_1.connectRedis)();
            logger_1.default.info('Redis connected successfully');
        }
        // Start HTTP server
        const server = app.listen(PORT, () => {
            logger_1.default.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
            logger_1.default.info(`API Documentation available at http://localhost:${PORT}/api/docs`);
        });
        // Handle graceful shutdown
        const shutdownGracefully = async () => {
            logger_1.default.info('Shutting down gracefully...');
            server.close(() => {
                logger_1.default.info('HTTP server closed');
                process.exit(0);
            });
        };
        process.on('SIGTERM', shutdownGracefully);
        process.on('SIGINT', shutdownGracefully);
    }
    catch (error) {
        logger_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
};
void startServer();
//# sourceMappingURL=index.js.map