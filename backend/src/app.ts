import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import statsRoutes from './routes/stats.routes';
import uploadRoutes from './routes/upload.routes';

// Create Express app
const app: Application = express();

// Middleware
const parseAllowedOrigins = (value: string | undefined): string[] => {
    if (!value) return [];
    return value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
};

const allowedOrigins = parseAllowedOrigins(process.env.FRONTEND_URL);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow non-browser clients (no Origin header)
            if (!origin) return callback(null, true);

            // If FRONTEND_URL is configured, enforce it (supports comma-separated list)
            if (allowedOrigins.length > 0) {
                return callback(null, allowedOrigins.includes(origin));
            }

            // Fallback: allow any origin (recommended: set FRONTEND_URL)
            return callback(null, true);
        },
        credentials: false,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Elite Motion API is running',
        timestamp: new Date().toISOString(),
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    });
});

export default app;
