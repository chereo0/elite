import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Divider,
    Link,
    Grid,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MotionBox = motion(Box);

// API Base URL
const API_URL = 'http://localhost:5000/api';

// Google Client ID (configure via Vite env var)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Animated star component for background
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

// Generate random stars
const generateStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        delay: Math.random() * 3,
        size: Math.random() * 2 + 1,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
    }));
};

// Custom input styling
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
        '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.4)',
        },
    },
};

// Glassmorphism card styling
const glassCardStyles = {
    background: 'rgba(10, 15, 30, 0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(100, 150, 255, 0.15)',
    borderRadius: 3,
    p: { xs: 3, md: 4 },
    transition: 'all 0.3s ease',
    '&:hover': {
        border: '1px solid rgba(100, 150, 255, 0.25)',
        boxShadow: '0 8px 40px rgba(74, 144, 217, 0.15)',
    },
};

// Declare google global
declare global {
    interface Window {
        google?: any;
    }
}

const AuthPage = () => {
    const navigate = useNavigate();
    const [stars] = useState(() => generateStars(100));
    const [showSignInPassword, setShowSignInPassword] = useState(false);
    const [showSignUpPassword, setShowSignUpPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Loading and error states
    const [signInLoading, setSignInLoading] = useState(false);
    const [signUpLoading, setSignUpLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [signInError, setSignInError] = useState('');
    const [signUpError, setSignUpError] = useState('');
    const [signUpSuccess, setSignUpSuccess] = useState('');

    // Form states
    const [signInData, setSignInData] = useState({ email: '', password: '' });
    const [signUpData, setSignUpData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // Load Google Sign-In SDK and initialize
    useEffect(() => {
        const loadGoogleScript = () => {
            if (document.getElementById('google-signin-script')) return;

            const script = document.createElement('script');
            script.id = 'google-signin-script';
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                // Initialize Google Sign-In after script loads
                if (window.google && GOOGLE_CLIENT_ID) {
                    window.google.accounts.id.initialize({
                        client_id: GOOGLE_CLIENT_ID,
                        callback: handleGoogleCallback,
                    });
                }
            };
            document.body.appendChild(script);
        };

        loadGoogleScript();
    }, []);

    // Google callback handler
    const handleGoogleCallback = async (response: any) => {
        try {
            const credential = response.credential;
            // Decode JWT to get user info
            const base64Url = credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));

            const apiResponse = await fetch(`${API_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: payload.email,
                    name: payload.name,
                    googleId: payload.sub,
                }),
            });

            const data = await apiResponse.json();

            if (!apiResponse.ok) {
                throw new Error(data.message || 'Google login failed');
            }

            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify({
                _id: data.data._id,
                name: data.data.name,
                email: data.data.email,
                role: data.data.role,
            }));

            if (data.data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            setSignInError(error instanceof Error ? error.message : 'Google login failed');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setGoogleLoading(true);
        setSignInError('');

        if (!window.google) {
            setSignInError('Google Sign-In is loading. Please try again.');
            setGoogleLoading(false);
            return;
        }

        // Trigger the Google One Tap prompt
        window.google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // One Tap not displayed, fallback to button click
                // Try using OAuth2 popup instead
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: GOOGLE_CLIENT_ID,
                    scope: 'email profile',
                    callback: async (tokenResponse: any) => {
                        if (tokenResponse.access_token) {
                            // Fetch user info from Google
                            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                            });
                            const userInfo = await userInfoResponse.json();

                            // Send to our backend
                            const apiResponse = await fetch(`${API_URL}/auth/google`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    email: userInfo.email,
                                    name: userInfo.name,
                                    googleId: userInfo.sub,
                                }),
                            });

                            const data = await apiResponse.json();

                            if (!apiResponse.ok) {
                                setSignInError(data.message || 'Google login failed');
                                setGoogleLoading(false);
                                return;
                            }

                            localStorage.setItem('token', data.data.token);
                            localStorage.setItem('user', JSON.stringify({
                                _id: data.data._id,
                                name: data.data.name,
                                email: data.data.email,
                                role: data.data.role,
                            }));

                            if (data.data.role === 'admin') {
                                navigate('/admin');
                            } else {
                                navigate('/');
                            }
                        }
                        setGoogleLoading(false);
                    },
                });
                client.requestAccessToken();
            }
        });
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setSignInError('');
        setSignInLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: signInData.email,
                    password: signInData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store token and user data
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify({
                _id: data.data._id,
                name: data.data.name,
                email: data.data.email,
                role: data.data.role,
            }));

            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }

            // Redirect based on role
            if (data.data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            setSignInError(error instanceof Error ? error.message : 'Login failed. Please try again.');
        } finally {
            setSignInLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setSignUpError('');
        setSignUpSuccess('');
        setSignUpLoading(true);

        // Validate passwords match
        if (signUpData.password !== signUpData.confirmPassword) {
            setSignUpError('Passwords do not match');
            setSignUpLoading(false);
            return;
        }

        // Validate password length
        if (signUpData.password.length < 6) {
            setSignUpError('Password must be at least 6 characters');
            setSignUpLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: signUpData.fullName,
                    email: signUpData.email,
                    password: signUpData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Store token and user data
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify({
                _id: data.data._id,
                name: data.data.name,
                email: data.data.email,
                role: data.data.role,
            }));

            setSignUpSuccess('Account created successfully!');

            // Redirect after short delay
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            setSignUpError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
        } finally {
            setSignUpLoading(false);
        }
    };

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
            {/* Animated Stars Background */}
            {stars.map((star) => (
                <Star key={star.id} {...star} />
            ))}

            <Navbar />

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, position: 'relative', zIndex: 1 }}>
                {/* Title */}
                <MotionBox
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}
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
                        Sign In <Box component="span" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>/</Box> Sign Up
                    </Typography>
                </MotionBox>

                {/* Auth Cards */}
                <Grid container spacing={4} justifyContent="center">
                    {/* Sign In Card */}
                    <Grid item xs={12} md={6} lg={5}>
                        <MotionBox
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            component="form"
                            onSubmit={handleSignIn}
                            sx={glassCardStyles}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    textAlign: 'center',
                                    mb: 4,
                                    fontWeight: 400,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                }}
                            >
                                Sign In
                            </Typography>

                            {signInError && (
                                <Alert severity="error" sx={{ mb: 2, background: 'rgba(211, 47, 47, 0.1)', color: '#ff6b6b' }}>
                                    {signInError}
                                </Alert>
                            )}

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, display: 'block' }}>
                                        Email Address
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter your email"
                                        value={signInData.email}
                                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                                        sx={inputStyles}
                                        size="small"
                                        required
                                        type="email"
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, display: 'block' }}>
                                        Password
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type={showSignInPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={signInData.password}
                                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                                        sx={inputStyles}
                                        size="small"
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                                                        sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                                                    >
                                                        {showSignInPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                sx={{
                                                    color: 'rgba(100, 150, 255, 0.5)',
                                                    '&.Mui-checked': { color: '#4a90d9' },
                                                }}
                                                size="small"
                                            />
                                        }
                                        label={
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                Remember me
                                            </Typography>
                                        }
                                    />
                                    <Link
                                        href="#"
                                        underline="hover"
                                        sx={{ color: '#4a90d9', fontSize: '0.75rem' }}
                                    >
                                        Forgot Password?
                                    </Link>
                                </Box>

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={signInLoading}
                                    sx={{
                                        py: 1.5,
                                        mt: 1,
                                        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
                                        fontWeight: 600,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        borderRadius: 1,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #2d5a87 0%, #3d7ab7 100%)',
                                        },
                                        '&:disabled': {
                                            background: 'rgba(100, 150, 255, 0.2)',
                                        },
                                    }}
                                >
                                    {signInLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
                                </Button>

                                <Divider sx={{ my: 2, '&::before, &::after': { borderColor: 'rgba(255, 255, 255, 0.1)' } }}>
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.75rem' }}>OR</Typography>
                                </Divider>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={googleLoading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : <GoogleIcon />}
                                    onClick={handleGoogleLogin}
                                    disabled={googleLoading}
                                    sx={{
                                        py: 1.2,
                                        borderColor: 'rgba(100, 150, 255, 0.2)',
                                        color: 'white',
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: 'rgba(100, 150, 255, 0.4)',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                        },
                                    }}
                                >
                                    Continue with Google
                                </Button>
                            </Box>
                        </MotionBox>
                    </Grid>

                    {/* Sign Up Card */}
                    <Grid item xs={12} md={6} lg={5}>
                        <MotionBox
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            component="form"
                            onSubmit={handleSignUp}
                            sx={glassCardStyles}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    textAlign: 'center',
                                    mb: 4,
                                    fontWeight: 400,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, #4a90d9 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Sign Up
                            </Typography>

                            {signUpError && (
                                <Alert severity="error" sx={{ mb: 2, background: 'rgba(211, 47, 47, 0.1)', color: '#ff6b6b' }}>
                                    {signUpError}
                                </Alert>
                            )}

                            {signUpSuccess && (
                                <Alert severity="success" sx={{ mb: 2, background: 'rgba(46, 125, 50, 0.1)', color: '#69f0ae' }}>
                                    {signUpSuccess}
                                </Alert>
                            )}

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, display: 'block' }}>
                                        Full Name
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter your full name"
                                        value={signUpData.fullName}
                                        onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                                        sx={inputStyles}
                                        size="small"
                                        required
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, display: 'block' }}>
                                        Email Address
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter your email"
                                        value={signUpData.email}
                                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                                        sx={inputStyles}
                                        size="small"
                                        required
                                        type="email"
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, display: 'block' }}>
                                        Password
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type={showSignUpPassword ? 'text' : 'password'}
                                        placeholder="Create a password"
                                        value={signUpData.password}
                                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                                        sx={inputStyles}
                                        size="small"
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                                                        sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                                                    >
                                                        {showSignUpPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, display: 'block' }}>
                                        Confirm Password
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        value={signUpData.confirmPassword}
                                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                                        sx={inputStyles}
                                        size="small"
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                                                    >
                                                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={signUpLoading}
                                    sx={{
                                        py: 1.5,
                                        mt: 1,
                                        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
                                        fontWeight: 600,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        borderRadius: 1,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #2d5a87 0%, #3d7ab7 100%)',
                                        },
                                        '&:disabled': {
                                            background: 'rgba(100, 150, 255, 0.2)',
                                        },
                                    }}
                                >
                                    {signUpLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign Up'}
                                </Button>

                                <Divider sx={{ my: 1.5, '&::before, &::after': { borderColor: 'rgba(255, 255, 255, 0.1)' } }}>
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.75rem' }}>OR</Typography>
                                </Divider>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<GoogleIcon />}
                                    onClick={handleGoogleLogin}
                                    disabled={googleLoading}
                                    sx={{
                                        py: 1.2,
                                        borderColor: 'rgba(100, 150, 255, 0.2)',
                                        color: 'white',
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: 'rgba(100, 150, 255, 0.4)',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                        },
                                    }}
                                >
                                    Continue with Google
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

export default AuthPage;
