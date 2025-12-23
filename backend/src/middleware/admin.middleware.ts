import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

/**
 * Admin only middleware - require admin role
 */
export const admin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Not authorized as admin',
        });
    }
};

export default admin;
