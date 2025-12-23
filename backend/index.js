import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import ordersRouter from './routes/orders.js';
import usersRouter from './routes/users.js';
import statsRouter from './routes/stats.js';
import uploadRouter from './routes/upload.js';

dotenv.config();

const app = express();

const DEFAULT_FRONTEND = 'https://elite-iota-gray.vercel.app';

const normalizeOrigin = (value) => (typeof value === 'string' ? value.trim().replace(/\/+$/, '') : '');

const allowedOrigins = new Set(
  (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || DEFAULT_FRONTEND)
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean)
);

// By default, allow Vercel preview/prod domains for this frontend.
// Set ALLOW_VERCEL_APP_ORIGINS=false to disable.
const allowVercelAppOrigins = (process.env.ALLOW_VERCEL_APP_ORIGINS ?? 'true').toLowerCase() !== 'false';
const isAllowedByPattern = (origin) => {
  if (!allowVercelAppOrigins) return false;
  // Allow any https://*.vercel.app (covers preview + prod aliases)
  return typeof origin === 'string' && /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
};

// In dev, also allow localhost Vite.
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.add('http://localhost:5173');
  allowedOrigins.add('http://127.0.0.1:5173');
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (no Origin header)
    if (!origin) return callback(null, true);
    const normalized = normalizeOrigin(origin);
    return callback(null, allowedOrigins.has(normalized) || isAllowedByPattern(normalized));
  },
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

// CORS must run BEFORE routes
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));

// Static uploads
app.use('/uploads', express.static('uploads'));

// Health route for Render/Vercel testing
app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'elite-backend',
    timestamp: new Date().toISOString(),
  });
});

// Route mounts
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);
app.use('/api/stats', statsRouter);
app.use('/api/upload', uploadRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ success: false, message: 'Server error' });
});

const PORT = Number(process.env.PORT) || 5000;

const start = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('Missing MONGODB_URI');
    }

    await mongoose.connect(mongoUri);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err?.message ?? err);
    process.exit(1);
  }
};

start();
