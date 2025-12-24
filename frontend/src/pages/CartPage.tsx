import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Button,
    IconButton,
    Breadcrumbs,
    Link,
    Divider,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    InputAdornment,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { API_URL } from '../config/api';
import { getImageUrl } from '../utils/imageHelper';

const MotionBox = motion(Box);

const glassCardStyles = {
    background: 'rgba(10, 15, 30, 0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(124, 77, 255, 0.15)',
    borderRadius: 3,
};

const CartPage = () => {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal, taxAmount, shippingAmount, grandTotal } = useCart();

    // Checkout state
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [checkoutError, setCheckoutError] = useState('');
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');

    // Shipping form
    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: '',
        phone: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('cod'); // cod = Cash on Delivery

    const handleCheckout = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth');
            return;
        }
        setCheckoutOpen(true);
    };

    const handlePlaceOrder = async () => {
        // Validate form
        if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country || !shippingAddress.phone) {
            setCheckoutError('Please fill in all shipping fields including phone number');
            return;
        }

        setCheckoutLoading(true);
        setCheckoutError('');

        try {
            const token = localStorage.getItem('token');
            const orderItems = cartItems.map(item => ({
                product: item.product,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                size: item.size,
                color: item.color,
            }));

            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: orderItems,
                    shippingAddress,
                    paymentMethod,
                    taxPrice: taxAmount,
                    shippingPrice: shippingAmount,
                    totalPrice: grandTotal,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setOrderId(data.data._id);
                setOrderSuccess(true);
                clearCart();
            } else {
                setCheckoutError(data.message || 'Failed to place order');
            }
        } catch (err) {
            setCheckoutError('Failed to place order. Please try again.');
            console.error('Order error:', err);
        } finally {
            setCheckoutLoading(false);
        }
    };

    const handleCloseSuccess = () => {
        setOrderSuccess(false);
        setCheckoutOpen(false);
        navigate('/my-orders');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: '#0a0a0f',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Navbar />

            <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
                {/* Breadcrumbs */}
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.4)' }} />}
                    sx={{ mb: 4 }}
                >
                    <Link
                        component={RouterLink}
                        to="/"
                        underline="hover"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'rgba(255,255,255,0.6)',
                            '&:hover': { color: '#7c4dff' },
                        }}
                    >
                        <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />
                        Home
                    </Link>
                    <Typography sx={{ color: '#7c4dff', fontWeight: 600 }}>Cart</Typography>
                </Breadcrumbs>

                {/* Page Title */}
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 800,
                        mb: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        background: 'linear-gradient(135deg, #ffffff 0%, #7c4dff 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    <ShoppingCartIcon sx={{ fontSize: 40, color: '#7c4dff' }} />
                    Shopping Cart
                </Typography>

                {cartItems.length === 0 ? (
                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        sx={{
                            textAlign: 'center',
                            py: 10,
                            ...glassCardStyles,
                        }}
                    >
                        <ShoppingCartIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.1)', mb: 3 }} />
                        <Typography variant="h5" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)' }}>
                            Your cart is empty
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 4 }}>
                            Add some items to get started
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
                            Browse Products
                        </Button>
                    </MotionBox>
                ) : (
                    <Grid container spacing={4}>
                        {/* Cart Items */}
                        <Grid item xs={12} lg={8}>
                            <MotionBox
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                sx={{ ...glassCardStyles, p: 3 }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                    Cart Items ({cartItems.length})
                                </Typography>

                                <AnimatePresence>
                                    {cartItems.map((item) => (
                                        <MotionBox
                                            key={`${item.product}-${item.size}-${item.color}`}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20, height: 0 }}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                p: 2,
                                                mb: 2,
                                                background: 'rgba(15, 20, 35, 0.6)',
                                                borderRadius: 2,
                                                border: '1px solid rgba(124, 77, 255, 0.1)',
                                            }}
                                        >
                                            {/* Product Image */}
                                            <Box
                                                component="img"
                                                src={getImageUrl(item.image)}
                                                alt={item.name}
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: 2,
                                                    objectFit: 'cover',
                                                }}
                                            />

                                            {/* Product Info */}
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                                                    {item.size && `Size: ${item.size}`}
                                                    {item.size && item.color && ' | '}
                                                    {item.color && `Color: ${item.color}`}
                                                </Typography>
                                                <Typography sx={{ color: '#00e5ff', fontWeight: 700, mt: 0.5 }}>
                                                    ${item.price}
                                                </Typography>
                                            </Box>

                                            {/* Quantity Controls */}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    background: 'rgba(124, 77, 255, 0.1)',
                                                    borderRadius: 1,
                                                    p: 0.5,
                                                }}
                                            >
                                                <IconButton
                                                    size="small"
                                                    onClick={() => updateQuantity(item.product, item.quantity - 1, item.size, item.color)}
                                                    disabled={item.quantity <= 1}
                                                    sx={{ color: '#7c4dff' }}
                                                >
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>
                                                <Typography sx={{ minWidth: 30, textAlign: 'center', fontWeight: 600 }}>
                                                    {item.quantity}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => updateQuantity(item.product, item.quantity + 1, item.size, item.color)}
                                                    disabled={item.quantity >= item.stock}
                                                    sx={{ color: '#7c4dff' }}
                                                >
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </Box>

                                            {/* Item Total & Remove */}
                                            <Typography sx={{ fontWeight: 700, minWidth: 80, textAlign: 'right' }}>
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </Typography>

                                            <IconButton
                                                onClick={() => removeFromCart(item.product, item.size, item.color)}
                                                sx={{
                                                    color: 'rgba(255,255,255,0.4)',
                                                    '&:hover': { color: '#ff4444' },
                                                }}
                                            >
                                                <DeleteOutlineIcon />
                                            </IconButton>
                                        </MotionBox>
                                    ))}
                                </AnimatePresence>

                                <Button
                                    onClick={clearCart}
                                    variant="outlined"
                                    sx={{
                                        mt: 2,
                                        borderColor: 'rgba(255, 68, 68, 0.3)',
                                        color: '#ff4444',
                                        '&:hover': {
                                            borderColor: '#ff4444',
                                            background: 'rgba(255, 68, 68, 0.1)',
                                        },
                                    }}
                                >
                                    Clear Cart
                                </Button>
                            </MotionBox>
                        </Grid>

                        {/* Order Summary */}
                        <Grid item xs={12} lg={4}>
                            <MotionBox
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                sx={{ ...glassCardStyles, p: 3, position: { lg: 'sticky' }, top: { lg: 100 } }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                    Order Summary
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Subtotal</Typography>
                                        <Typography sx={{ fontWeight: 500 }}>${cartTotal.toFixed(2)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Tax (10%)</Typography>
                                        <Typography sx={{ fontWeight: 500 }}>${taxAmount.toFixed(2)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Shipping</Typography>
                                        <Typography sx={{ fontWeight: 500, color: shippingAmount === 0 ? '#00ff88' : 'inherit' }}>
                                            {shippingAmount === 0 ? 'Free' : `$${shippingAmount.toFixed(2)}`}
                                        </Typography>
                                    </Box>
                                    {shippingAmount > 0 && (
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                            Free shipping on orders over $100
                                        </Typography>
                                    )}
                                </Box>

                                <Divider sx={{ borderColor: 'rgba(124, 77, 255, 0.2)', my: 2 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Total</Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            background: 'linear-gradient(135deg, #00e5ff 0%, #7c4dff 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                        }}
                                    >
                                        ${grandTotal.toFixed(2)}
                                    </Typography>
                                </Box>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleCheckout}
                                    sx={{
                                        py: 1.5,
                                        mb: 2,
                                        background: 'linear-gradient(135deg, #1a237e 0%, #7c4dff 100%)',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        borderRadius: 2,
                                        boxShadow: '0 4px 20px rgba(124, 77, 255, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #534bae 0%, #b47cff 100%)',
                                            boxShadow: '0 8px 30px rgba(124, 77, 255, 0.5)',
                                        },
                                    }}
                                >
                                    Proceed to Checkout
                                </Button>

                                <Button
                                    component={RouterLink}
                                    to="/shop"
                                    fullWidth
                                    variant="text"
                                    sx={{
                                        color: 'rgba(255,255,255,0.6)',
                                        '&:hover': { color: '#7c4dff' },
                                    }}
                                >
                                    Continue Shopping
                                </Button>
                            </MotionBox>
                        </Grid>
                    </Grid>
                )}
            </Container>

            {/* Checkout Dialog */}
            <Dialog
                open={checkoutOpen}
                onClose={() => !checkoutLoading && setCheckoutOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'rgba(13, 20, 33, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(124, 77, 255, 0.2)',
                        borderRadius: 3,
                    },
                }}
            >
                {orderSuccess ? (
                    <>
                        <DialogContent sx={{ textAlign: 'center', py: 6 }}>
                            <CheckCircleIcon sx={{ fontSize: 80, color: '#00ff88', mb: 3 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                                Order Placed!
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                                Your order has been successfully placed.
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                Order ID: <strong>{orderId.slice(-8).toUpperCase()}</strong>
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{ p: 3, pt: 0 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleCloseSuccess}
                                sx={{
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #1a237e 0%, #7c4dff 100%)',
                                }}
                            >
                                View My Orders
                            </Button>
                        </DialogActions>
                    </>
                ) : (
                    <>
                        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid rgba(124, 77, 255, 0.1)' }}>
                            Checkout
                        </DialogTitle>
                        <DialogContent sx={{ pt: 3 }}>
                            {checkoutError && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {checkoutError}
                                </Alert>
                            )}

                            {/* Shipping Address */}
                            <Box sx={{ mb: 4 }}>
                                <Typography sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocalShippingIcon /> Shipping Address
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Address"
                                            value={shippingAddress.address}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    color: 'white',
                                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                                    '&:hover fieldset': { borderColor: '#7c4dff' },
                                                },
                                                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="City"
                                            value={shippingAddress.city}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    color: 'white',
                                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                                    '&:hover fieldset': { borderColor: '#7c4dff' },
                                                },
                                                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Postal Code"
                                            value={shippingAddress.postalCode}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    color: 'white',
                                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                                    '&:hover fieldset': { borderColor: '#7c4dff' },
                                                },
                                                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Country"
                                            value={shippingAddress.country}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    color: 'white',
                                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                                    '&:hover fieldset': { borderColor: '#7c4dff' },
                                                },
                                                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            value={shippingAddress.phone}
                                            onChange={(e) => {
                                                // Only allow numbers
                                                const value = e.target.value.replace(/[^0-9]/g, '');
                                                setShippingAddress({ ...shippingAddress, phone: value });
                                            }}
                                            placeholder="71 234 567"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>+961</Typography>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    color: 'white',
                                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                                    '&:hover fieldset': { borderColor: '#7c4dff' },
                                                },
                                                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Payment Method */}
                            <Box>
                                <Typography sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PaymentIcon /> Payment Method
                                </Typography>
                                <RadioGroup
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <FormControlLabel
                                        value="cod"
                                        control={<Radio sx={{ color: '#7c4dff', '&.Mui-checked': { color: '#7c4dff' } }} />}
                                        label={
                                            <Box>
                                                <Typography sx={{ fontWeight: 600 }}>Cash on Delivery</Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                    Pay when you receive your order
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </RadioGroup>
                            </Box>

                            {/* Order Summary */}
                            <Divider sx={{ my: 3, borderColor: 'rgba(124, 77, 255, 0.2)' }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Order Total:</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#00e5ff' }}>
                                    ${grandTotal.toFixed(2)}
                                </Typography>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 3, gap: 2 }}>
                            <Button
                                onClick={() => setCheckoutOpen(false)}
                                disabled={checkoutLoading}
                                sx={{ color: 'rgba(255,255,255,0.6)' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handlePlaceOrder}
                                disabled={checkoutLoading}
                                sx={{
                                    px: 4,
                                    background: 'linear-gradient(135deg, #1a237e 0%, #7c4dff 100%)',
                                }}
                            >
                                {checkoutLoading ? <CircularProgress size={24} color="inherit" /> : 'Place Order'}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            <Footer />
        </Box>
    );
};

export default CartPage;
