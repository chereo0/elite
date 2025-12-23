import { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    IconButton,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useMediaQuery,
    useTheme,
    Divider,
    Avatar,
    Menu,
    MenuItem,
    Typography,
    Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.jpg';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Contact', path: '/contact' },
];

const MotionBox = motion(Box);

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const { wishlistCount } = useWishlist();
    const { cartCount } = useCart();

    // Check for logged in user
    useEffect(() => {
        const checkUser = () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    setUser(JSON.parse(userStr));
                } catch {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkUser();
        // Listen for storage changes (login/logout in other tabs)
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
        setUser(null);
        handleMenuClose();
        navigate('/');
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

    const drawer = (
        <Box
            sx={{
                textAlign: 'center',
                background: 'linear-gradient(180deg, #0a0a0f 0%, #0d1421 100%)',
                height: '100%',
                py: 3,
                px: 2,
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <img src={logo} alt="Elite Motion" style={{ height: 45 }} />
                <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider sx={{ borderColor: 'rgba(124, 77, 255, 0.3)', mb: 2 }} />

            {/* User info in mobile drawer */}
            {user && (
                <Box sx={{ mb: 2, p: 2, background: 'rgba(124, 77, 255, 0.1)', borderRadius: 2 }}>
                    <Avatar
                        sx={{
                            width: 50,
                            height: 50,
                            mx: 'auto',
                            mb: 1,
                            bgcolor: user.role === 'admin' ? '#ff4444' : '#7c4dff',
                        }}
                    >
                        {getInitials(user.name)}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                        {user.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        {user.email}
                    </Typography>
                </Box>
            )}

            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            onClick={handleDrawerToggle}
                            sx={{
                                textAlign: 'center',
                                py: 1.5,
                                borderRadius: 2,
                                mb: 1,
                                '&:hover': {
                                    background: 'rgba(124, 77, 255, 0.15)',
                                },
                            }}
                        >
                            <ListItemText
                                primary={item.label}
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontWeight: 600,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        fontSize: '0.95rem',
                                    },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ borderColor: 'rgba(124, 77, 255, 0.3)', my: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 2 }}>
                {user ? (
                    <>
                        {user.role === 'admin' && (
                            <Button
                                component={Link}
                                to="/admin"
                                fullWidth
                                variant="outlined"
                                startIcon={<DashboardIcon />}
                                onClick={handleDrawerToggle}
                                sx={{
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'white',
                                    py: 1.2,
                                    '&:hover': {
                                        borderColor: '#7c4dff',
                                        background: 'rgba(124, 77, 255, 0.1)',
                                    },
                                }}
                            >
                                Admin Dashboard
                            </Button>
                        )}
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<LogoutIcon />}
                            onClick={() => {
                                handleDrawerToggle();
                                handleLogout();
                            }}
                            sx={{
                                py: 1.2,
                                background: 'linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%)',
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8a8a 100%)',
                                },
                            }}
                        >
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            component={Link}
                            to="/auth"
                            fullWidth
                            variant="outlined"
                            startIcon={<PersonOutlineIcon />}
                            onClick={handleDrawerToggle}
                            sx={{
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                color: 'white',
                                py: 1.2,
                                '&:hover': {
                                    borderColor: '#7c4dff',
                                    background: 'rgba(124, 77, 255, 0.1)',
                                },
                            }}
                        >
                            Login
                        </Button>
                        <Button
                            component={Link}
                            to="/auth"
                            fullWidth
                            variant="contained"
                            onClick={handleDrawerToggle}
                            sx={{
                                py: 1.2,
                                background: 'linear-gradient(135deg, #7c4dff 0%, #00e5ff 100%)',
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #9c7bff 0%, #40efff 100%)',
                                },
                            }}
                        >
                            Sign Up
                        </Button>
                    </>
                )}
            </Box>
        </Box>
    );

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    background: 'rgba(10, 10, 15, 0.7)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(124, 77, 255, 0.15)',
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', py: 1.5, px: { xs: 2, md: 4 } }}>
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link
                            to="/"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                            }}
                        >
                            <motion.img
                                src={logo}
                                alt="Elite Motion"
                                style={{ height: isMobile ? 40 : 50 }}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            />
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    {!isMobile && (
                        <MotionBox
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            sx={{ display: 'flex', gap: 1 }}
                        >
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 * index }}
                                >
                                    <Button
                                        component={Link}
                                        to={item.path}
                                        sx={{
                                            color: 'white',
                                            fontWeight: 500,
                                            fontSize: '0.9rem',
                                            letterSpacing: '0.08em',
                                            px: 2.5,
                                            py: 1,
                                            borderRadius: 2,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                left: '50%',
                                                width: 0,
                                                height: '2px',
                                                background: 'linear-gradient(90deg, #7c4dff, #00e5ff)',
                                                transition: 'all 0.3s ease',
                                                transform: 'translateX(-50%)',
                                            },
                                            '&:hover': {
                                                background: 'rgba(124, 77, 255, 0.08)',
                                            },
                                            '&:hover::before': {
                                                width: '70%',
                                            },
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                </motion.div>
                            ))}
                        </MotionBox>
                    )}

                    {/* Right side - Auth buttons/Profile & Cart */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1.5 } }}>
                        {!isMobile && (
                            <MotionBox
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                sx={{ display: 'flex', gap: 1.5, mr: 1, alignItems: 'center' }}
                            >
                                {user ? (
                                    <>
                                        {/* Profile Avatar */}
                                        <IconButton
                                            onClick={handleProfileClick}
                                            sx={{
                                                p: 0.5,
                                                '&:hover': {
                                                    background: 'rgba(124, 77, 255, 0.1)',
                                                },
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 38,
                                                    height: 38,
                                                    bgcolor: user.role === 'admin' ? '#ff4444' : '#7c4dff',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 600,
                                                    border: '2px solid rgba(255,255,255,0.2)',
                                                }}
                                            >
                                                {getInitials(user.name)}
                                            </Avatar>
                                        </IconButton>

                                        {/* Profile Menu */}
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleMenuClose}
                                            PaperProps={{
                                                sx: {
                                                    background: 'rgba(15, 15, 25, 0.95)',
                                                    backdropFilter: 'blur(20px)',
                                                    border: '1px solid rgba(124, 77, 255, 0.2)',
                                                    borderRadius: 2,
                                                    mt: 1,
                                                    minWidth: 200,
                                                },
                                            }}
                                        >
                                            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(124, 77, 255, 0.2)' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                                                    {user.name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                                    {user.email}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        display: 'block',
                                                        color: user.role === 'admin' ? '#ff6b6b' : '#7c4dff',
                                                        textTransform: 'uppercase',
                                                        fontWeight: 600,
                                                        fontSize: '0.65rem',
                                                        letterSpacing: '0.1em',
                                                        mt: 0.5,
                                                    }}
                                                >
                                                    {user.role}
                                                </Typography>
                                            </Box>
                                            <MenuItem
                                                component={Link}
                                                to="/profile"
                                                onClick={handleMenuClose}
                                                sx={{
                                                    color: 'white',
                                                    '&:hover': { background: 'rgba(124, 77, 255, 0.15)' },
                                                }}
                                            >
                                                <PersonOutlineIcon sx={{ mr: 1.5, fontSize: 20 }} />
                                                My Profile
                                            </MenuItem>
                                            <MenuItem
                                                component={Link}
                                                to="/my-orders"
                                                onClick={handleMenuClose}
                                                sx={{
                                                    color: 'white',
                                                    '&:hover': { background: 'rgba(124, 77, 255, 0.15)' },
                                                }}
                                            >
                                                <ShoppingBagIcon sx={{ mr: 1.5, fontSize: 20 }} />
                                                My Orders
                                            </MenuItem>
                                            {user.role === 'admin' && (
                                                <MenuItem
                                                    component={Link}
                                                    to="/admin"
                                                    onClick={handleMenuClose}
                                                    sx={{
                                                        color: 'white',
                                                        '&:hover': { background: 'rgba(124, 77, 255, 0.15)' },
                                                    }}
                                                >
                                                    <DashboardIcon sx={{ mr: 1.5, fontSize: 20 }} />
                                                    Admin Dashboard
                                                </MenuItem>
                                            )}
                                            <MenuItem
                                                onClick={handleLogout}
                                                sx={{
                                                    color: '#ff6b6b',
                                                    '&:hover': { background: 'rgba(255, 68, 68, 0.1)' },
                                                }}
                                            >
                                                <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                                                Logout
                                            </MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            component={Link}
                                            to="/auth"
                                            variant="contained"
                                            startIcon={<PersonOutlineIcon />}
                                            sx={{
                                                background: 'linear-gradient(135deg, #7c4dff 0%, #00e5ff 100%)',
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                                px: 3,
                                                borderRadius: 2,
                                                boxShadow: '0 4px 15px rgba(124, 77, 255, 0.3)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #9c7bff 0%, #40efff 100%)',
                                                    boxShadow: '0 6px 20px rgba(124, 77, 255, 0.4)',
                                                    transform: 'translateY(-1px)',
                                                },
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            Login
                                        </Button>
                                    </>
                                )}
                            </MotionBox>
                        )}

                        {/* Wishlist Icon */}
                        <IconButton
                            component={Link}
                            to="/wishlist"
                            sx={{
                                color: 'white',
                                position: 'relative',
                                '&:hover': {
                                    color: '#ff4444',
                                    background: 'rgba(255, 68, 68, 0.1)',
                                },
                            }}
                        >
                            <Badge
                                badgeContent={wishlistCount}
                                sx={{
                                    '& .MuiBadge-badge': {
                                        background: 'linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%)',
                                        color: 'white',
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        minWidth: 16,
                                        height: 16,
                                    },
                                }}
                            >
                                <FavoriteIcon />
                            </Badge>
                        </IconButton>

                        {/* Cart Icon */}
                        <IconButton
                            component={Link}
                            to="/cart"
                            sx={{
                                color: 'white',
                                position: 'relative',
                                '&:hover': {
                                    color: '#7c4dff',
                                    background: 'rgba(124, 77, 255, 0.1)',
                                },
                            }}
                        >
                            <Badge
                                badgeContent={cartCount}
                                sx={{
                                    '& .MuiBadge-badge': {
                                        background: 'linear-gradient(135deg, #ff4081 0%, #ff6e40 100%)',
                                        color: 'white',
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        minWidth: 16,
                                        height: 16,
                                    },
                                }}
                            >
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>

                        {isMobile && (
                            <IconButton
                                color="inherit"
                                edge="end"
                                onClick={handleDrawerToggle}
                                sx={{
                                    ml: 0.5,
                                    '&:hover': {
                                        color: '#7c4dff',
                                        background: 'rgba(124, 77, 255, 0.1)',
                                    },
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 300,
                        background: 'transparent',
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Toolbar spacer */}
            <Toolbar sx={{ mb: 1 }} />
        </>
    );
};

export default Navbar;
