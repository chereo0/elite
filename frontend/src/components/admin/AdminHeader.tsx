import { Box, Avatar, IconButton, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../../assets/logo.jpg';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface AdminHeaderProps {
    isMobile: boolean;
    onMenuClick: () => void;
}

const glassCardStyles = {
    background: 'rgba(10, 15, 30, 0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(30, 144, 255, 0.15)',
};

const AdminHeader = ({ isMobile, onMenuClick }: AdminHeaderProps) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Get user from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch {
                setUser(null);
            }
        }
    }, []);

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');

        // Redirect to login page
        navigate('/auth');
    };

    // Get initials from name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Box
            sx={{
                ...glassCardStyles,
                borderRadius: 0,
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                py: 2,
                px: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}
        >
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {isMobile && (
                    <IconButton onClick={onMenuClick} sx={{ color: 'white' }}>
                        <MenuIcon />
                    </IconButton>
                )}
                <RouterLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <img src={logo} alt="Elite Motion" style={{ height: 45 }} />
                </RouterLink>
            </Box>

            {/* User Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: user?.role === 'admin' ? '#ff4444' : '#1e90ff',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                        }}
                    >
                        {user ? getInitials(user.name) : 'U'}
                    </Avatar>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                            {user?.name || 'User'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                            {user?.email || ''}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: user?.role === 'admin' ? '#ff6b6b' : '#1e90ff',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                letterSpacing: '0.1em',
                                fontSize: '0.65rem',
                            }}
                        >
                            {user?.role || 'Guest'}
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    onClick={handleLogout}
                    sx={{
                        color: 'rgba(255,255,255,0.6)',
                        '&:hover': {
                            color: '#ff4444',
                            background: 'rgba(255, 68, 68, 0.1)',
                        },
                    }}
                    title="Logout"
                >
                    <LogoutIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default AdminHeader;
