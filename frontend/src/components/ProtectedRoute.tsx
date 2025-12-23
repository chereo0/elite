import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

/**
 * Protected Route - requires user to be logged in
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
        // Redirect to login page with return URL
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

/**
 * Admin Route - requires user to be logged in AND be an admin
 */
export const AdminRoute = ({ children }: ProtectedRouteProps) => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
        // Redirect to login page with return URL
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    try {
        const user = JSON.parse(userStr);

        if (user.role !== 'admin') {
            // User is logged in but not admin - redirect to home
            return <Navigate to="/" replace />;
        }
    } catch {
        // Invalid user data, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
