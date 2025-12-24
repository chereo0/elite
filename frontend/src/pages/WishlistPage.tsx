import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    IconButton,
    Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { getImageUrl } from '../utils/imageHelper';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const WishlistPage = () => {
    const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToCart } = useCart();

    const getCategoryName = (category: { _id: string; name: string } | string) => {
        if (typeof category === 'object') return category.name;
        return 'Category';
    };

    return (
        <Box sx={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                mb: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                background: 'linear-gradient(135deg, #ffffff 0%, #ff4444 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            <FavoriteIcon sx={{ fontSize: 40, color: '#ff4444' }} />
                            My Wishlist
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                        </Typography>
                    </Box>

                    {wishlistItems.length > 0 && (
                        <Button
                            variant="outlined"
                            onClick={clearWishlist}
                            sx={{
                                borderColor: 'rgba(255, 68, 68, 0.3)',
                                color: '#ff4444',
                                '&:hover': {
                                    borderColor: '#ff4444',
                                    background: 'rgba(255, 68, 68, 0.1)',
                                },
                            }}
                        >
                            Clear Wishlist
                        </Button>
                    )}
                </Box>

                {wishlistItems.length === 0 ? (
                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        sx={{
                            textAlign: 'center',
                            py: 10,
                            background: 'rgba(13, 20, 33, 0.6)',
                            borderRadius: 4,
                            border: '1px solid rgba(124, 77, 255, 0.12)',
                        }}
                    >
                        <FavoriteIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.1)', mb: 3 }} />
                        <Typography variant="h5" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)' }}>
                            Your wishlist is empty
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 4 }}>
                            Save items you love by clicking the heart icon
                        </Typography>
                        <Button
                            component={RouterLink}
                            to="/shop"
                            variant="contained"
                            startIcon={<ShoppingBagIcon />}
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
                    <AnimatePresence>
                        <Grid container spacing={3}>
                            {wishlistItems.map((item, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                                    <MotionCard
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        whileHover={{ y: -8 }}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            background: 'rgba(13, 20, 33, 0.6)',
                                            backdropFilter: 'blur(20px)',
                                            border: '1px solid rgba(124, 77, 255, 0.12)',
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                            '&:hover': {
                                                boxShadow: '0 20px 40px rgba(124, 77, 255, 0.2)',
                                                border: '1px solid rgba(124, 77, 255, 0.3)',
                                            },
                                        }}
                                    >
                                        <Box sx={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                                            <CardMedia
                                                component="img"
                                                image={getImageUrl(item.image)}
                                                alt={item.name}
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                            <IconButton
                                                onClick={() => removeFromWishlist(item._id)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    background: 'rgba(255, 68, 68, 0.9)',
                                                    color: 'white',
                                                    '&:hover': {
                                                        background: '#ff4444',
                                                    },
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>

                                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: '#7c4dff',
                                                    fontWeight: 600,
                                                    letterSpacing: '0.1em',
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                {getCategoryName(item.category)}
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 700,
                                                    mt: 0.5,
                                                    mb: 0.5,
                                                    fontSize: '0.95rem',
                                                    minHeight: '2.4em',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {item.name}
                                            </Typography>
                                            {item.brand && (
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                    by {item.brand}
                                                </Typography>
                                            )}
                                            <Typography
                                                sx={{
                                                    fontSize: '1.2rem',
                                                    fontWeight: 800,
                                                    color: '#00e5ff',
                                                    mt: 'auto',
                                                    pt: 1,
                                                }}
                                            >
                                                ${item.price}
                                            </Typography>
                                        </CardContent>

                                        <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                                            <Button
                                                component={RouterLink}
                                                to={`/product/${item._id}`}
                                                variant="outlined"
                                                sx={{
                                                    flex: 1,
                                                    py: 1,
                                                    borderRadius: 2,
                                                    fontWeight: 600,
                                                    fontSize: '0.8rem',
                                                    borderColor: 'rgba(124, 77, 255, 0.3)',
                                                    color: '#7c4dff',
                                                    '&:hover': {
                                                        borderColor: '#7c4dff',
                                                        background: 'rgba(124, 77, 255, 0.1)',
                                                    },
                                                }}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={<ShoppingCartIcon sx={{ fontSize: 16 }} />}
                                                onClick={() => {
                                                    // Pick random size and color if available
                                                    const randomSize = item.sizes && item.sizes.length > 0
                                                        ? item.sizes[Math.floor(Math.random() * item.sizes.length)]
                                                        : undefined;
                                                    const randomColor = item.colors && item.colors.length > 0
                                                        ? item.colors[Math.floor(Math.random() * item.colors.length)]
                                                        : undefined;

                                                    addToCart({
                                                        _id: `${item._id}-${randomSize || 'default'}-${randomColor || 'default'}`,
                                                        product: item._id,
                                                        name: item.name,
                                                        price: item.price,
                                                        image: getImageUrl(item.image),
                                                        stock: 99,
                                                        size: randomSize,
                                                        color: randomColor,
                                                    });
                                                }}
                                                sx={{
                                                    flex: 1,
                                                    py: 1,
                                                    borderRadius: 2,
                                                    fontWeight: 600,
                                                    fontSize: '0.8rem',
                                                    background: 'linear-gradient(135deg, #1a237e 0%, #7c4dff 100%)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #534bae 0%, #b47cff 100%)',
                                                    },
                                                }}
                                            >
                                                Add
                                            </Button>
                                        </CardActions>
                                    </MotionCard>
                                </Grid>
                            ))}
                        </Grid>
                    </AnimatePresence>
                )}

                {/* Continue Shopping */}
                {wishlistItems.length > 0 && (
                    <Box sx={{ textAlign: 'center', mt: 6 }}>
                        <Button
                            component={RouterLink}
                            to="/shop"
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
                            Continue Shopping
                        </Button>
                    </Box>
                )}
            </Container>

            <Footer />
        </Box>
    );
};

export default WishlistPage;
