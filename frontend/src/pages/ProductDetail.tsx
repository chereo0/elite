import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Button,
    IconButton,
    Chip,
    CircularProgress,
    Breadcrumbs,
    Link,
    Divider,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import CachedIcon from '@mui/icons-material/Cached';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { API_URL } from '../config/api';
import { getImageUrl } from '../utils/imageHelper';

interface Product {
    _id: string;
    name: string;
    description: string;
    brand?: string;
    price: number;
    image: string;
    images?: string[];
    category: { _id: string; name: string } | string;
    stock: number;
    sizes?: string[];
    sizeType?: 'clothing' | 'shoes';
    colors?: string[];
    createdAt: string;
}

const MotionBox = motion(Box);

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();

    // Selection state
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/products/${id}`);
            const data = await response.json();

            if (data.success) {
                setProduct(data.data);
                // Set default selections
                if (data.data.sizes?.length > 0) {
                    setSelectedSize(data.data.sizes[0]);
                }
                if (data.data.colors?.length > 0) {
                    setSelectedColor(data.data.colors[0]);
                }
            } else {
                setError('Product not found');
            }
        } catch (err) {
            setError('Failed to load product');
            console.error('Failed to fetch product:', err);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryName = (category: { _id: string; name: string } | string) => {
        if (typeof category === 'object') return category.name;
        return 'Category';
    };

    const handleQuantityChange = (delta: number) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        addToCart({
            _id: `${product._id}-${selectedSize}-${selectedColor}`,
            product: product._id,
            name: product.name,
            price: product.price,
            image: getImageUrl(product.image),
            quantity,
            size: selectedSize || undefined,
            color: selectedColor || undefined,
            stock: product.stock,
        });
    };

    const allImages = product ? [getImageUrl(product.image), ...(product.images || []).map(img => getImageUrl(img))] : [];

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress sx={{ color: '#7c4dff' }} />
                </Box>
                <Footer />
            </Box>
        );
    }

    if (error || !product) {
        return (
            <Box sx={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ mb: 2, color: 'white' }}>
                            {error || 'Product not found'}
                        </Typography>
                        <Button
                            component={RouterLink}
                            to="/shop"
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            sx={{ borderColor: '#7c4dff', color: '#7c4dff' }}
                        >
                            Back to Shop
                        </Button>
                    </Box>
                </Container>
                <Footer />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
                {/* Breadcrumbs */}
                <Breadcrumbs
                    sx={{ mb: 4, color: 'rgba(255,255,255,0.5)' }}
                    separator={<Typography sx={{ color: 'rgba(255,255,255,0.3)' }}>/</Typography>}
                >
                    <Link
                        component={RouterLink}
                        to="/"
                        sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', '&:hover': { color: '#7c4dff' } }}
                    >
                        <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} /> Home
                    </Link>
                    <Link
                        component={RouterLink}
                        to="/shop"
                        sx={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', '&:hover': { color: '#7c4dff' } }}
                    >
                        Shop
                    </Link>
                    <Typography sx={{ color: '#7c4dff' }}>{product.name}</Typography>
                </Breadcrumbs>

                <Grid container spacing={6}>
                    {/* Product Images */}
                    <Grid item xs={12} md={6}>
                        <MotionBox
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Main Image */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    background: 'rgba(13, 20, 33, 0.6)',
                                    border: '1px solid rgba(124, 77, 255, 0.12)',
                                    mb: 2,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={allImages[selectedImage]}
                                    alt={product.name}
                                    sx={{
                                        width: '100%',
                                        height: { xs: 400, md: 500 },
                                        objectFit: 'cover',
                                    }}
                                />
                                <IconButton
                                    onClick={() => {
                                        if (product && isInWishlist(product._id)) {
                                            removeFromWishlist(product._id);
                                        } else if (product) {
                                            addToWishlist({
                                                _id: product._id,
                                                name: product.name,
                                                price: product.price,
                                                image: getImageUrl(product.image),
                                                brand: product.brand,
                                                category: product.category,
                                            });
                                        }
                                    }}
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 16,
                                        background: 'rgba(0,0,0,0.5)',
                                        '&:hover': { background: 'rgba(255, 68, 68, 0.5)' },
                                    }}
                                >
                                    {product && isInWishlist(product._id) ? (
                                        <FavoriteIcon sx={{ color: '#ff4444' }} />
                                    ) : (
                                        <FavoriteBorderIcon sx={{ color: 'white' }} />
                                    )}
                                </IconButton>
                            </Box>

                            {/* Thumbnail Images */}
                            {allImages.length > 1 && (
                                <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1 }}>
                                    {allImages.map((img, index) => (
                                        <Box
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                flexShrink: 0,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                border: selectedImage === index
                                                    ? '2px solid #7c4dff'
                                                    : '2px solid transparent',
                                                opacity: selectedImage === index ? 1 : 0.6,
                                                transition: 'all 0.3s ease',
                                                '&:hover': { opacity: 1 },
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={img}
                                                alt={`${product.name} ${index + 1}`}
                                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </MotionBox>
                    </Grid>

                    {/* Product Info */}
                    <Grid item xs={12} md={6}>
                        <MotionBox
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {/* Category & Brand */}
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <Chip
                                    label={getCategoryName(product.category)}
                                    size="small"
                                    sx={{
                                        background: 'rgba(124, 77, 255, 0.15)',
                                        color: '#7c4dff',
                                        fontWeight: 600,
                                    }}
                                />
                                {product.brand && (
                                    <Chip
                                        label={product.brand}
                                        size="small"
                                        sx={{
                                            background: 'rgba(0, 229, 255, 0.15)',
                                            color: '#00e5ff',
                                            fontWeight: 600,
                                        }}
                                    />
                                )}
                            </Box>

                            {/* Name */}
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    mb: 2,
                                    fontSize: { xs: '1.8rem', md: '2.5rem' },
                                }}
                            >
                                {product.name}
                            </Typography>

                            {/* Price */}
                            <Typography
                                sx={{
                                    fontSize: '2rem',
                                    fontWeight: 800,
                                    mb: 3,
                                    background: 'linear-gradient(135deg, #00e5ff 0%, #7c4dff 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                ${product.price}
                            </Typography>

                            {/* Description */}
                            <Typography
                                sx={{
                                    color: 'rgba(255,255,255,0.7)',
                                    mb: 4,
                                    lineHeight: 1.8,
                                }}
                            >
                                {product.description}
                            </Typography>

                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 4 }} />

                            {/* Size Selection */}
                            {product.sizes && product.sizes.length > 0 && (
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, letterSpacing: '0.1em' }}>
                                        {product.sizeType === 'shoes' ? 'SHOE SIZE' : 'SIZE'}
                                    </Typography>
                                    <ToggleButtonGroup
                                        value={selectedSize}
                                        exclusive
                                        onChange={(_, value) => value && setSelectedSize(value)}
                                        sx={{ flexWrap: 'wrap', gap: 1 }}
                                    >
                                        {product.sizes.map((size) => (
                                            <ToggleButton
                                                key={size}
                                                value={size}
                                                sx={{
                                                    px: 3,
                                                    py: 1,
                                                    border: '1px solid rgba(124, 77, 255, 0.3)',
                                                    color: 'white',
                                                    '&.Mui-selected': {
                                                        background: '#7c4dff',
                                                        color: 'white',
                                                        '&:hover': { background: '#9575cd' },
                                                    },
                                                    '&:hover': {
                                                        background: 'rgba(124, 77, 255, 0.2)',
                                                    },
                                                }}
                                            >
                                                {size}
                                            </ToggleButton>
                                        ))}
                                    </ToggleButtonGroup>
                                </Box>
                            )}

                            {/* Color Selection */}
                            {product.colors && product.colors.length > 0 && (
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, letterSpacing: '0.1em' }}>
                                        COLOR
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                        {product.colors.map((color) => (
                                            <Box
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    background: color.toLowerCase(),
                                                    cursor: 'pointer',
                                                    border: selectedColor === color
                                                        ? '3px solid #7c4dff'
                                                        : '3px solid transparent',
                                                    boxShadow: selectedColor === color
                                                        ? '0 0 0 2px rgba(124, 77, 255, 0.5)'
                                                        : 'none',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        transform: 'scale(1.1)',
                                                    },
                                                }}
                                                title={color}
                                            />
                                        ))}
                                    </Box>
                                    {selectedColor && (
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1, display: 'block' }}>
                                            Selected: {selectedColor}
                                        </Typography>
                                    )}
                                </Box>
                            )}

                            {/* Quantity */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, letterSpacing: '0.1em' }}>
                                    QUANTITY
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            border: '1px solid rgba(124, 77, 255, 0.3)',
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <IconButton
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={quantity <= 1}
                                            sx={{ color: 'white', borderRadius: 0 }}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                        <Typography
                                            sx={{
                                                px: 3,
                                                py: 1,
                                                minWidth: 50,
                                                textAlign: 'center',
                                                fontWeight: 700,
                                            }}
                                        >
                                            {quantity}
                                        </Typography>
                                        <IconButton
                                            onClick={() => handleQuantityChange(1)}
                                            disabled={quantity >= product.stock}
                                            sx={{ color: 'white', borderRadius: 0 }}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                        {product.stock} in stock
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Add to Cart Button */}
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                startIcon={<ShoppingCartIcon />}
                                onClick={handleAddToCart}
                                disabled={
                                    ((product.sizes?.length ?? 0) > 0 && !selectedSize) ||
                                    ((product.colors?.length ?? 0) > 0 && !selectedColor) ||
                                    product.stock === 0
                                }
                                sx={{
                                    py: 2,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #1a237e 0%, #7c4dff 100%)',
                                    boxShadow: '0 4px 20px rgba(124, 77, 255, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #534bae 0%, #b47cff 100%)',
                                        boxShadow: '0 6px 30px rgba(124, 77, 255, 0.5)',
                                    },
                                    '&:disabled': {
                                        background: 'rgba(255,255,255,0.1)',
                                        color: 'rgba(255,255,255,0.3)',
                                    },
                                }}
                            >
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </Button>

                            {/* Features */}
                            <Box sx={{ mt: 4, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,0.6)' }}>
                                    <LocalShippingIcon sx={{ fontSize: 20 }} />
                                    <Typography variant="body2">Free Shipping</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,0.6)' }}>
                                    <VerifiedIcon sx={{ fontSize: 20 }} />
                                    <Typography variant="body2">Authentic Product</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,0.6)' }}>
                                    <CachedIcon sx={{ fontSize: 20 }} />
                                    <Typography variant="body2">Easy Returns</Typography>
                                </Box>
                            </Box>
                        </MotionBox>
                    </Grid>
                </Grid>
            </Container>

            <Footer />
        </Box>
    );
};

export default ProductDetail;
