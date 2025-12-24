import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Avatar,
    Divider,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from '@mui/icons-material/Lock';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_URL } from '../config/api';

const MotionBox = motion(Box);

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    location?: string;
}

// Animated star component
const Star = ({ delay, size, top, left }: { delay: number; size: number; top: string; left: string }) => (
    <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 2 + Math.random() * 2, delay, repeat: Infinity, ease: "easeInOut" }}
        sx={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: 'white',
            top,
            left,
            boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, 0.5)`,
        }}
    />
);

const generateStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        delay: Math.random() * 3,
        size: Math.random() * 2 + 1,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
    }));
};

const glassCardStyles = {
    background: 'rgba(10, 15, 30, 0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(100, 150, 255, 0.15)',
    borderRadius: 3,
    p: { xs: 2.5, md: 4 },
};

const inputStyles = {
    '& .MuiOutlinedInput-root': {
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 2,
        '& fieldset': {
            borderColor: 'rgba(100, 150, 255, 0.2)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(100, 150, 255, 0.4)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#4a90d9',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.6)',
    },
    '& .MuiOutlinedInput-input': {
        color: 'white',
    },
};

const ProfilePage = () => {
    const navigate = useNavigate();
    const [stars] = useState(() => generateStars(80));
    const [user, setUser] = useState<User | null>(null);

    // Profile form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileError, setProfileError] = useState('');

    // Password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/auth');
            return;
        }
        try {
            const userData = JSON.parse(userStr);
            setUser(userData);
            setName(userData.name || '');
            setEmail(userData.email || '');
            setLocation(userData.location || '');
        } catch {
            navigate('/auth');
        }
    }, [navigate]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileError('');
        setProfileSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name, location }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }

            // Update localStorage
            const updatedUser = { ...user, name, location };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser as User);
            setProfileSuccess('Profile updated successfully!');
        } catch (error) {
            setProfileError(error instanceof Error ? error.message : 'Failed to update profile');
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordError('');
        setPasswordSuccess('');

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            setPasswordLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            setPasswordLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/users/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to change password');
            }

            setPasswordSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setPasswordError(error instanceof Error ? error.message : 'Failed to change password');
        } finally {
            setPasswordLoading(false);
        }
    };

    if (!user) return null;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `
                    radial-gradient(ellipse at 30% 20%, rgba(20, 40, 80, 0.5) 0%, transparent 50%),
                    radial-gradient(ellipse at 70% 80%, rgba(30, 50, 100, 0.4) 0%, transparent 50%),
                    linear-gradient(180deg, #050810 0%, #0a1020 50%, #050810 100%)
                `,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Stars */}
            {stars.map((star) => (
                <Star key={star.id} {...star} />
            ))}

            <Navbar />

            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, position: 'relative', zIndex: 1 }}>
                {/* Page Title & Actions */}
                <MotionBox
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: { xs: 4, md: 6 },
                        gap: 3
                    }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            fontSize: { xs: '1.8rem', md: '2.5rem' },
                            fontWeight: 300,
                            letterSpacing: '0.15em',
                            color: 'rgba(255, 255, 255, 0.9)',
                            textTransform: 'uppercase',
                        }}
                    >
                        My Profile
                    </Typography>

                    <Button
                        component={RouterLink}
                        to="/my-orders"
                        variant="outlined"
                        startIcon={<ShoppingBagIcon />}
                        sx={{
                            borderColor: 'rgba(124, 77, 255, 0.5)',
                            color: '#b388ff',
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            '&:hover': {
                                borderColor: '#7c4dff',
                                background: 'rgba(124, 77, 255, 0.1)',
                                color: '#d1c4e9',
                            },
                        }}
                    >
                        My Orders
                    </Button>
                </MotionBox>

                <Grid container spacing={4} justifyContent="center">
                    {/* Profile Card */}
                    <Grid item xs={12} md={6}>
                        <MotionBox
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            component="form"
                            onSubmit={handleProfileUpdate}
                            sx={glassCardStyles}
                        >
                            {/* Avatar */}
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Avatar
                                    sx={{
                                        width: { xs: 80, md: 100 },
                                        height: { xs: 80, md: 100 },
                                        mx: 'auto',
                                        mb: 2,
                                        bgcolor: user.role === 'admin' ? '#ff4444' : '#7c4dff',
                                        fontSize: { xs: '2rem', md: '2.5rem' },
                                        fontWeight: 600,
                                    }}
                                >
                                    {getInitials(user.name)}
                                </Avatar>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: user.role === 'admin' ? '#ff6b6b' : '#7c4dff',
                                        textTransform: 'uppercase',
                                        fontWeight: 600,
                                        letterSpacing: '0.1em',
                                    }}
                                >
                                    {user.role}
                                </Typography>
                            </Box>

                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 3,
                                    fontWeight: 400,
                                    letterSpacing: '0.1em',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <PersonIcon sx={{ color: '#7c4dff' }} />
                                Profile Information
                            </Typography>

                            {profileError && (
                                <Alert severity="error" sx={{ mb: 2, background: 'rgba(211, 47, 47, 0.1)', color: '#ff6b6b' }}>
                                    {profileError}
                                </Alert>
                            )}

                            {profileSuccess && (
                                <Alert severity="success" sx={{ mb: 2, background: 'rgba(46, 125, 50, 0.1)', color: '#69f0ae' }}>
                                    {profileSuccess}
                                </Alert>
                            )}

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    sx={inputStyles}
                                />

                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    value={email}
                                    disabled
                                    sx={{
                                        ...inputStyles,
                                        '& .MuiOutlinedInput-input.Mui-disabled': {
                                            color: 'rgba(255,255,255,0.5)',
                                            WebkitTextFillColor: 'rgba(255,255,255,0.5)',
                                        },
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Location"
                                    placeholder="Enter your city or address"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    sx={inputStyles}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocationOnIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={profileLoading}
                                    startIcon={profileLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <SaveIcon />}
                                    sx={{
                                        py: 1.5,
                                        mt: 1,
                                        background: 'linear-gradient(135deg, #7c4dff 0%, #00e5ff 100%)',
                                        fontWeight: 600,
                                        letterSpacing: '0.1em',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #9c7bff 0%, #40efff 100%)',
                                        },
                                    }}
                                >
                                    {profileLoading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Box>
                        </MotionBox>
                    </Grid>

                    {/* Password Card */}
                    <Grid item xs={12} md={6}>
                        <MotionBox
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            component="form"
                            onSubmit={handlePasswordChange}
                            sx={glassCardStyles}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 3,
                                    fontWeight: 400,
                                    letterSpacing: '0.1em',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <LockIcon sx={{ color: '#7c4dff' }} />
                                Change Password
                            </Typography>

                            {passwordError && (
                                <Alert severity="error" sx={{ mb: 2, background: 'rgba(211, 47, 47, 0.1)', color: '#ff6b6b' }}>
                                    {passwordError}
                                </Alert>
                            )}

                            {passwordSuccess && (
                                <Alert severity="success" sx={{ mb: 2, background: 'rgba(46, 125, 50, 0.1)', color: '#69f0ae' }}>
                                    {passwordSuccess}
                                </Alert>
                            )}

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                <TextField
                                    fullWidth
                                    label="Current Password"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    sx={inputStyles}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    sx={{ color: 'rgba(255,255,255,0.5)' }}
                                                >
                                                    {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Divider sx={{ borderColor: 'rgba(100, 150, 255, 0.2)' }} />

                                <TextField
                                    fullWidth
                                    label="New Password"
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    sx={inputStyles}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    sx={{ color: 'rgba(255,255,255,0.5)' }}
                                                >
                                                    {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Confirm New Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    sx={inputStyles}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    sx={{ color: 'rgba(255,255,255,0.5)' }}
                                                >
                                                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={passwordLoading}
                                    startIcon={passwordLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <LockIcon />}
                                    sx={{
                                        py: 1.5,
                                        mt: 1,
                                        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
                                        fontWeight: 600,
                                        letterSpacing: '0.1em',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #2d5a87 0%, #3d7ab7 100%)',
                                        },
                                    }}
                                >
                                    {passwordLoading ? 'Changing...' : 'Change Password'}
                                </Button>
                            </Box>
                        </MotionBox>
                    </Grid>
                </Grid>
            </Container>

            <Footer />
        </Box>
    );
};

export default ProfilePage;
