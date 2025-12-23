import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend Express Request to include user
export interface AuthRequest extends Request {
    user?: IUser;
}

interface JwtPayload {
    id: string;
}

/**
 * Protect routes - require authentication
 */
export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    let token: string | undefined;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided',
        });
        return;
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        // Get user from token
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Not authorized, user not found',
            });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Not authorized, invalid token',
        });
    }
};

export default protect;
