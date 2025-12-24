import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Button,
    Divider,
    Pagination,
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_URL } from '../config/api';
import { getImageUrl } from '../utils/imageHelper';


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

const MotionCard = motion(Card);

const statusConfig: Record<string, { color: 'warning' | 'info' | 'primary' | 'success' | 'error'; icon: React.ReactNode; label: string }> = {
    pending: { color: 'warning', icon: <PendingIcon />, label: 'Pending' },
    paid: { color: 'info', icon: <CheckCircleIcon />, label: 'Paid' },
    shipped: { color: 'primary', icon: <LocalShippingIcon />, label: 'Shipped' },
    delivered: { color: 'success', icon: <CheckCircleIcon />, label: 'Delivered' },
    cancelled: { color: 'error', icon: <CancelIcon />, label: 'Cancelled' },
};

const MyOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/orders?page=${page}&limit=5`, {
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Box sx={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
                {/* Header */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', md: 'center' }, 
                    mb: 4, 
                    gap: 3 
                }}>
                    <Box>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                mb: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                fontSize: { xs: '2rem', md: '3rem' },
                                background: 'linear-gradient(135deg, #ffffff 0%, #7c4dff 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            <ShoppingBagIcon sx={{ fontSize: { xs: 32, md: 40 }, color: '#7c4dff' }} />
                            My Orders
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            Track and manage your orders
                        </Typography>
                    </Box>

                    <Button
                        component={RouterLink}
                        to="/profile"
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            borderColor: 'rgba(124, 77, 255, 0.3)',
                            color: '#7c4dff',
                            '&:hover': {
                                borderColor: '#7c4dff',
                                background: 'rgba(124, 77, 255, 0.1)',
                            },
                        }}
                    >
                        Back to Profile
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress sx={{ color: '#7c4dff' }} />
                    </Box>
                ) : orders.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 10,
                            background: 'rgba(13, 20, 33, 0.6)',
                            borderRadius: 4,
                            border: '1px solid rgba(124, 77, 255, 0.12)',
                        }}
                    >
                        <ShoppingBagIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.1)', mb: 3 }} />
                        <Typography variant="h5" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)' }}>
                            No orders yet
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 4 }}>
                            Start shopping to see your orders here
                        </Typography>
                        <Button
                            component={RouterLink}
                            to="/shop"
                            variant="contained"
                            sx={{
                                py: 1.5,
                                px: 4,
                                background: 'linear-gradient(135deg, #1a237e 0%, #7c4dff 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #534bae 0%, #b47cff 100%)',
                                },
                            }}
                        >
                            Go to Shop
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {orders.map((order, index) => (
                                <MotionCard
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    sx={{
                                        background: 'rgba(13, 20, 33, 0.6)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(124, 77, 255, 0.12)',
                                        borderRadius: 3,
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        {/* Order Header */}
                                        <Box sx={{ 
                                            display: 'flex', 
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            justifyContent: 'space-between', 
                                            alignItems: { xs: 'flex-start', sm: 'flex-start' }, 
                                            mb: 2, 
                                            gap: 2 
                                        }}>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                    ORDER ID
                                                </Typography>
                                                <Typography sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                                                    #{order._id.slice(-8).toUpperCase()}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                    PLACED ON
                                                </Typography>
                                                <Typography sx={{ fontWeight: 600 }}>
                                                    {formatDate(order.createdAt)}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />

                                        {/* Order Items */}
                                        <Box sx={{ 
                                            display: 'flex', 
                                            flexDirection: { xs: 'column', md: 'row' },
                                            gap: 2, 
                                            overflowX: { xs: 'visible', md: 'auto' }, 
                                            pb: 1 
                                        }}>
                                            {order.items.map((item, idx) => (
                                                <Box
                                                    key={idx}
                                                    sx={{
                                                        display: 'flex',
                                                        gap: 2,
                                                        minWidth: { xs: '100%', md: 250 },
                                                        background: 'rgba(0,0,0,0.2)',
                                                        borderRadius: 2,
                                                        p: 1.5,
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <Box
                                                        component="img"
                                                        src={typeof item.product === 'object' ? getImageUrl(item.product.image) : ''}
                                                        alt={item.name}
                                                        sx={{
                                                            width: 60,
                                                            height: 60,
                                                            borderRadius: 1,
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                    <Box>
                                                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                                            {item.name}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                            Qty: {item.quantity} × ${item.price}
                                                        </Typography>
                                                        {(item.size || item.color) && (
                                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                                                                {item.size && `Size: ${item.size}`} {item.color && `Color: ${item.color}`}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>

                                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />

                                        {/* Order Footer */}
                                        <Box sx={{ 
                                            display: 'flex', 
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            justifyContent: 'space-between', 
                                            alignItems: { xs: 'flex-start', sm: 'center' }, 
                                            gap: 2 
                                        }}>
                                            <Chip
                                                icon={statusConfig[order.status]?.icon as React.ReactElement}
                                                label={statusConfig[order.status]?.label || order.status}
                                                color={statusConfig[order.status]?.color || 'default'}
                                                sx={{ fontWeight: 600 }}
                                            />
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
                                                </Typography>
                                                <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#00e5ff' }}>
                                                    ${order.totalPrice.toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </MotionCard>
                            ))}
                        </Box>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={(_, value) => setPage(value)}
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            color: 'white',
                                            '&.Mui-selected': {
                                                background: '#7c4dff',
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        )}
                    </>
                )}
            </Container>

            <Footer />
        </Box>
    );
};

export default MyOrdersPage;
