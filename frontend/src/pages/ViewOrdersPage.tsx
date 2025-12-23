import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    IconButton,
    Avatar,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    useTheme,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    Pagination,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { API_URL } from '../config/api';

const MotionBox = motion(Box);

// Glassmorphism styles
const glassCardStyles = {
    background: 'rgba(10, 15, 30, 0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(30, 144, 255, 0.15)',
    borderRadius: 3,
};

// Input styles
const inputStyles = {
    '& .MuiOutlinedInput-root': {
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 2,
        '& fieldset': {
            borderColor: 'rgba(30, 144, 255, 0.2)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(30, 144, 255, 0.4)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#1e90ff',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.6)',
    },
    '& .MuiOutlinedInput-input': {
        color: 'white',
    },
    '& .MuiSelect-icon': {
        color: 'rgba(255, 255, 255, 0.6)',
    },
};

// Star component for background
const Star = ({ delay, size, top, left }: { delay: number; size: number; top: string; left: string }) => (
    <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 2 + Math.random() * 2, delay, repeat: Infinity, ease: "easeInOut" }}
        sx={{
            position: 'fixed',
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: 'white',
            top,
            left,
            boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, 0.5)`,
            pointerEvents: 'none',
        }}
    />
);

// Generate stars
const generateStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        delay: Math.random() * 3,
        size: Math.random() * 2 + 1,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
    }));
};

// Sidebar menu items
const sidebarItems = [
    { icon: <DashboardIcon />, label: 'Dashboard', path: '/admin' },
    { icon: <AddBoxIcon />, label: 'Add Product', path: '/admin/add-product' },
    { icon: <CategoryIcon />, label: 'Add Category', path: '/admin/add-category' },
    { icon: <InventoryIcon />, label: 'View Products', path: '/admin/products' },
    { icon: <ShoppingBagIcon />, label: 'View Orders', path: '/admin/orders', active: true },
    { icon: <PeopleIcon />, label: 'View Users', path: '/admin/users' },
];

interface OrderItem {
    product: { _id: string; name: string; image: string } | string;
    name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
}

interface Order {
    _id: string;
    user: { _id: string; name: string; email: string } | string;
    items: OrderItem[];
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: string;
    totalPrice: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
}

// Status chip styles
const getStatusChip = (status: string) => {
    const statusConfig: { [key: string]: { color: string; bgcolor: string } } = {
        'delivered': { color: '#00c853', bgcolor: 'rgba(0, 200, 83, 0.15)' },
        'shipped': { color: '#1e90ff', bgcolor: 'rgba(30, 144, 255, 0.15)' },
        'pending': { color: '#ffc107', bgcolor: 'rgba(255, 193, 7, 0.15)' },
        'paid': { color: '#00e5ff', bgcolor: 'rgba(0, 229, 255, 0.15)' },
        'cancelled': { color: '#ff4444', bgcolor: 'rgba(255, 68, 68, 0.15)' },
    };

    const config = statusConfig[status] || statusConfig['pending'];

    return (
        <Chip
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            size="small"
            sx={{
                bgcolor: config.bgcolor,
                color: config.color,
                fontWeight: 600,
                fontSize: '0.7rem',
            }}
        />
    );
};

const ViewOrdersPage = () => {
    const [stars] = useState(() => generateStars(60));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    // Dialog states
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [error, setError] = useState('');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const sidebarWidth = 240;

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/orders?page=${page}&limit=10`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (data.success) {
                setOrders(data.data);
                setTotalPages(data.pages || 1);
            }
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder || !newStatus) return;

        setUpdateLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/orders/${selectedOrder._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await response.json();

            if (data.success) {
                setOrders(prev => prev.map(o =>
                    o._id === selectedOrder._id ? { ...o, status: newStatus as Order['status'] } : o
                ));
                setStatusDialogOpen(false);
                setSelectedOrder(null);
            } else {
                setError(data.message || 'Failed to update status');
            }
        } catch (err) {
            setError('Failed to update order status');
            console.error('Update error:', err);
        } finally {
            setUpdateLoading(false);
        }
    };

    // Filter orders
    const filteredOrders = orders.filter((order) => {
        const userName = typeof order.user === 'object' ? order.user.name : '';
        const userEmail = typeof order.user === 'object' ? order.user.email : '';
        const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            userEmail.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || order.status === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Stats
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;

    // Sidebar content
    const sidebarContent = (
        <Box
            sx={{
                width: sidebarWidth,
                height: '100vh',
                background: 'rgba(10, 15, 30, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(30, 144, 255, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                p: 2,
            }}
        >
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, p: 1 }}>
                <Box
                    component="img"
                    src={logo}
                    alt="Elite Motion"
                    sx={{ height: 40, borderRadius: 1 }}
                />
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: '0.1em', lineHeight: 1 }}>
                        ELITE MOTION
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        Admin Panel
                    </Typography>
                </Box>
                {isMobile && (
                    <IconButton onClick={() => setSidebarOpen(false)} sx={{ ml: 'auto', color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                )}
            </Box>

            {/* Menu Items */}
            <List sx={{ flex: 1 }}>
                {sidebarItems.map((item) => (
                    <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            sx={{
                                borderRadius: 2,
                                background: item.active ? 'rgba(30, 144, 255, 0.15)' : 'transparent',
                                '&:hover': {
                                    background: 'rgba(30, 144, 255, 0.1)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: item.active ? '#1e90ff' : 'rgba(255,255,255,0.6)', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                sx={{
                                    '& .MuiListItemText-primary': {
                                        fontSize: '0.9rem',
                                        fontWeight: item.active ? 600 : 400,
                                        color: item.active ? '#1e90ff' : 'rgba(255,255,255,0.8)',
                                    },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {/* Logout */}
            <Button
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                    color: 'rgba(255,255,255,0.6)',
                    justifyContent: 'flex-start',
                    '&:hover': {
                        color: '#ff4444',
                        background: 'rgba(255, 68, 68, 0.1)',
                    },
                }}
            >
                Logout
            </Button>
        </Box>
    );

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
                display: 'flex',
            }}
        >
            {/* Animated Stars */}
            {stars.map((star) => (
                <Star key={star.id} {...star} />
            ))}

            {/* Desktop Sidebar */}
            {!isMobile && (
                <Box sx={{ position: 'fixed', left: 0, top: 0, zIndex: 100 }}>
                    {sidebarContent}
                </Box>
            )}

            {/* Mobile Sidebar */}
            <Drawer
                anchor="left"
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        background: 'transparent',
                    },
                }}
            >
                {sidebarContent}
            </Drawer>

            {/* Main Content */}
            <Box
                sx={{
                    flex: 1,
                    ml: { xs: 0, md: `${sidebarWidth}px` },
                    p: { xs: 2, md: 4 },
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Mobile Header */}
                {isMobile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: 'white', mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            View Orders
                        </Typography>
                    </Box>
                )}

                {/* Page Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Order Management
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        View and manage all customer orders
                    </Typography>
                </Box>

                {/* Stats */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {[
                        { label: 'Total Orders', value: totalOrders, color: '#1e90ff' },
                        { label: 'Delivered', value: deliveredOrders, color: '#00c853' },
                        { label: 'Shipped', value: shippedOrders, color: '#00e5ff' },
                        { label: 'Pending', value: pendingOrders, color: '#ffc107' },
                    ].map((stat) => (
                        <Grid item xs={6} md={3} key={stat.label}>
                            <MotionBox
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                sx={{
                                    ...glassCardStyles,
                                    p: 3,
                                    textAlign: 'center',
                                }}
                            >
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 800,
                                        color: stat.color,
                                        mb: 0.5,
                                    }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                    {stat.label}
                                </Typography>
                            </MotionBox>
                        </Grid>
                    ))}
                </Grid>

                {/* Filters */}
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    sx={{ ...glassCardStyles, p: 3, mb: 3 }}
                >
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Search orders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={inputStyles}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth sx={inputStyles}>
                                <Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="All">All Status</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="paid">Paid</MenuItem>
                                    <MenuItem value="shipped">Shipped</MenuItem>
                                    <MenuItem value="delivered">Delivered</MenuItem>
                                    <MenuItem value="cancelled">Cancelled</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={fetchOrders}
                                sx={{
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #1e3a5f 0%, #1e90ff 100%)',
                                }}
                            >
                                Refresh
                            </Button>
                        </Grid>
                    </Grid>
                </MotionBox>

                {/* Orders Table */}
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    sx={{ ...glassCardStyles, overflow: 'hidden' }}
                >
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
                            <CircularProgress sx={{ color: '#1e90ff' }} />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ background: 'rgba(30, 144, 255, 0.1)' }}>
                                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Order ID</TableCell>
                                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Customer</TableCell>
                                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Items</TableCell>
                                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Total</TableCell>
                                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Status</TableCell>
                                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Date</TableCell>
                                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredOrders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6, color: 'rgba(255,255,255,0.5)' }}>
                                                No orders found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <TableRow
                                                key={order._id}
                                                sx={{
                                                    '&:hover': { background: 'rgba(30, 144, 255, 0.05)' },
                                                }}
                                            >
                                                <TableCell sx={{ color: 'white', fontWeight: 600, fontFamily: 'monospace' }}>
                                                    #{order._id.slice(-8).toUpperCase()}
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography sx={{ fontWeight: 600, color: 'white' }}>
                                                            {typeof order.user === 'object' ? order.user.name : 'Unknown'}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                            {typeof order.user === 'object' ? order.user.email : ''}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                                    {order.items.length} items
                                                </TableCell>
                                                <TableCell sx={{ color: '#00e5ff', fontWeight: 700 }}>
                                                    ${order.totalPrice.toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusChip(order.status)}
                                                </TableCell>
                                                <TableCell sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                                    {formatDate(order.createdAt)}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setViewDialogOpen(true);
                                                        }}
                                                        sx={{ color: '#1e90ff' }}
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                    <Button
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setNewStatus(order.status);
                                                            setStatusDialogOpen(true);
                                                        }}
                                                        sx={{
                                                            ml: 1,
                                                            color: '#ffc107',
                                                            borderColor: 'rgba(255, 193, 7, 0.3)',
                                                            '&:hover': {
                                                                borderColor: '#ffc107',
                                                                background: 'rgba(255, 193, 7, 0.1)',
                                                            },
                                                        }}
                                                        variant="outlined"
                                                    >
                                                        Update Status
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_, value) => setPage(value)}
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: 'white',
                                        '&.Mui-selected': {
                                            background: '#1e90ff',
                                        },
                                    },
                                }}
                            />
                        </Box>
                    )}
                </MotionBox>
            </Box>

            {/* View Order Dialog */}
            <Dialog
                open={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'rgba(13, 20, 33, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(30, 144, 255, 0.2)',
                        borderRadius: 3,
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid rgba(30, 144, 255, 0.1)' }}>
                    Order Details
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {selectedOrder && (
                        <Box>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Order ID</Typography>
                                    <Typography sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                                        #{selectedOrder._id.slice(-8).toUpperCase()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Status</Typography>
                                    <Box>{getStatusChip(selectedOrder.status)}</Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Customer</Typography>
                                    <Typography sx={{ fontWeight: 600 }}>
                                        {typeof selectedOrder.user === 'object' ? selectedOrder.user.name : 'Unknown'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                        {typeof selectedOrder.user === 'object' ? selectedOrder.user.email : ''}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Shipping Address</Typography>
                                    <Typography sx={{ fontWeight: 500 }}>
                                        {selectedOrder.shippingAddress.address}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                        {selectedOrder.shippingAddress.country}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Typography sx={{ fontWeight: 700, mt: 3, mb: 2 }}>Order Items</Typography>
                            {selectedOrder.items.map((item, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        p: 2,
                                        mb: 1,
                                        background: 'rgba(30, 144, 255, 0.05)',
                                        borderRadius: 2,
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={typeof item.product === 'object' ? item.product.image : ''}
                                        alt={item.name}
                                        sx={{ width: 50, height: 50, borderRadius: 1, objectFit: 'cover' }}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                            {item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography sx={{ fontWeight: 600, color: '#00e5ff' }}>
                                            ${item.price}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                            Qty: {item.quantity}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 2, borderTop: '1px solid rgba(30, 144, 255, 0.1)' }}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                    Payment: {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : selectedOrder.paymentMethod}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#00e5ff' }}>
                                    Total: ${selectedOrder.totalPrice.toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Update Status Dialog */}
            <Dialog
                open={statusDialogOpen}
                onClose={() => !updateLoading && setStatusDialogOpen(false)}
                PaperProps={{
                    sx: {
                        background: 'rgba(13, 20, 33, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(30, 144, 255, 0.2)',
                        borderRadius: 3,
                        minWidth: 400,
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Update Order Status</DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                    )}
                    <FormControl fullWidth sx={{ mt: 2, ...inputStyles }}>
                        <Select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="paid">Paid</MenuItem>
                            <MenuItem value="shipped">Shipped</MenuItem>
                            <MenuItem value="delivered">Delivered</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setStatusDialogOpen(false)} disabled={updateLoading}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleUpdateStatus}
                        disabled={updateLoading}
                        sx={{
                            background: 'linear-gradient(135deg, #1e3a5f 0%, #1e90ff 100%)',
                        }}
                    >
                        {updateLoading ? <CircularProgress size={24} color="inherit" /> : 'Update'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ViewOrdersPage;
