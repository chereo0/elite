import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const ALLOWED_ORIGIN = 'https://elite-iota-gray.vercel.app';

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (no Origin header)
    if (!origin) return callback(null, true);
    return callback(null, origin === ALLOWED_ORIGIN);
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

// Health route for Render/Vercel testing
app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'elite-backend',
    timestamp: new Date().toISOString(),
  });
});

// Minimal route mounts (replace with your real route handlers)
app.get('/api/products', (req, res) => {
  const limit = Number(req.query.limit ?? 0);
  res.json({
    success: true,
    data: [],
    limit: Number.isFinite(limit) ? limit : 0,
  });
});

app.get('/api/categories', (_req, res) => {
  res.json({
    success: true,
    data: [],
  });
});

app.post('/api/auth/login', (_req, res) => {
  // Placeholder response to prove CORS works.
  // Replace with real JWT auth implementation.
  res.json({
    success: false,
    message: 'Not implemented: replace /api/auth/login handler',
  });
});

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
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});
