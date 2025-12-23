import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

const isEmail = (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!isEmail(email) || typeof password !== 'string' || password.length < 1) {
      return res.status(400).json({
        token: null,
        user: null,
        error: 'Email and password are required',
      });
    }

    // Minimal auth: compare against env credentials (works on Render free tier)
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return res.status(500).json({
        token: null,
        user: null,
        error: 'Server is not configured (missing ADMIN_EMAIL/ADMIN_PASSWORD)',
      });
    }

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({
        token: null,
        user: null,
        error: 'Invalid credentials',
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        token: null,
        user: null,
        error: 'Server is not configured (missing JWT_SECRET)',
      });
    }

    const user = {
      id: 'admin',
      email,
      role: 'admin',
    };

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    return res.status(200).json({
      token,
      user,
    });
  } catch (err) {
    // Never crash the server
    return res.status(500).json({
      token: null,
      user: null,
      error: 'Server error',
    });
  }
});

export default router;
