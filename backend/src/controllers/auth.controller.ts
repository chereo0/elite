import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({
                success: false,
                message: 'User already exists',
            });
            return;
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id.toString()),
                },
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
            return;
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
            return;
        }

        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id.toString()),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user?._id);

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @desc    Google Auth
 * @route   POST /api/auth/google
 * @access  Public
 */
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name, googleId } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // User exists, log them in
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id.toString()),
                },
            });
        } else {
            // Create new user
            // Generate a random password for Google users
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            
            user = await User.create({
                name,
                email,
                password: randomPassword,
            });

            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id.toString()),
                },
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @desc    Facebook Auth
 * @route   POST /api/auth/facebook
 * @access  Public
 */
export const facebookAuth = async (req: Request, res: Response): Promise<void> => {
    // Placeholder for Facebook Auth
    res.status(501).json({
        success: false,
        message: 'Facebook auth not implemented yet',
    });
};
/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req: any, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @desc    Google OAuth login/register
 * @route   POST /api/auth/google
 * @access  Public
 */
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name, googleId } = req.body;

        if (!email || !name) {
            res.status(400).json({
                success: false,
                message: 'Email and name are required',
            });
            return;
        }

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // User exists, log them in
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id.toString()),
                },
            });
        } else {
            // Create new user with random password (they'll use OAuth)
            const randomPassword = Math.random().toString(36).slice(-12) + 'Aa1!';

            user = await User.create({
                name,
                email,
                password: randomPassword,
            });

            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id.toString()),
                },
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @desc    Facebook OAuth login/register
 * @route   POST /api/auth/facebook
 * @access  Public
 */
export const facebookAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name, facebookId } = req.body;

        if (!email || !name) {
            res.status(400).json({
                success: false,
                message: 'Email and name are required',
            });
            return;
        }

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // User exists, log them in
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id.toString()),
                },
            });
        } else {
            // Create new user with random password (they'll use OAuth)
            const randomPassword = Math.random().toString(36).slice(-12) + 'Aa1!';

            user = await User.create({
                name,
                email,
                password: randomPassword,
            });

            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id.toString()),
                },
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
