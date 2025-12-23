import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const isEmail = (value) =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Missing JWT_SECRET');
  return jwt.sign({ id }, secret, { expiresIn: process.env.JWT_EXPIRE || '30d' });
};

const authSuccessPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  token: generateToken(user._id.toString()),
});

/**
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (typeof name !== 'string' || name.trim().length === 0 || !isEmail(email) || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
    });

    return res.status(201).json({ success: true, data: authSuccessPayload(user) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!isEmail(email) || typeof password !== 'string' || password.length === 0) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    return res.json({ success: true, data: authSuccessPayload(user) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    return res.json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * POST /api/auth/google
 * Note: frontend sends email/name/googleId; we treat it as trusted for now.
 */
export const googleAuth = async (req, res) => {
  try {
    const { email, name } = req.body ?? {};

    if (!isEmail(email) || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Email and name are required' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-12) + 'Aa1!';
      user = await User.create({
        name: name.trim(),
        email: email.toLowerCase(),
        password: randomPassword,
      });
    }

    return res.json({ success: true, data: authSuccessPayload(user) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * POST /api/auth/facebook
 */
export const facebookAuth = async (req, res) => {
  try {
    const { email, name } = req.body ?? {};
    if (!isEmail(email) || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Email and name are required' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-12) + 'Aa1!';
      user = await User.create({ name: name.trim(), email: email.toLowerCase(), password: randomPassword });
    }

    return res.json({ success: true, data: authSuccessPayload(user) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
