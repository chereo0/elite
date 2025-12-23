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
const isProd = process.env.NODE_ENV === 'production';

// Production allowlist (do not allow localhost in production)
const PROD_ALLOWED_ORIGINS = new Set<string>([
    'https://elite-iota-gray.vercel.app',
]);

// Optional override via env (comma-separated)
const envOrigins = (process.env.FRONTEND_URL ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const allowedOrigins = envOrigins.length > 0 ? new Set(envOrigins) : PROD_ALLOWED_ORIGINS;

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow server-to-server calls and same-origin requests (no Origin header)
        if (!origin) return callback(null, true);

        if (!isProd) {
            const devAllowed = new Set<string>([
                ...allowedOrigins,
                'http://localhost:5173',
                'http://127.0.0.1:5173',
            ]);
            return callback(null, devAllowed.has(origin));
        }

        return callback(null, allowedOrigins.has(origin));
    },
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
};

// CORS MUST be applied before routes
app.use(cors(corsOptions));

// Properly handle preflight requests
app.options('*', cors(corsOptions));

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
