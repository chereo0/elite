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
    Chip,
    IconButton,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { motion } from 'framer-motion';

interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    isNew?: boolean;
    rating: number;
}

const products: Product[] = [
    {
        id: 1,
        name: 'Elite Black T-Shirt',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
        category: 'T-Shirts',
        isNew: true,
        rating: 4.8,
    },
    {
        id: 2,
        name: 'Motion Hoodie',
        price: 89.99,
        originalPrice: 119.99,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
        category: 'Hoodies',
        rating: 4.9,
    },
    {
        id: 3,
        name: 'Street Jacket',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
        category: 'Jackets',
        isNew: true,
        rating: 4.7,
    },
    {
        id: 4,
        name: 'Urban Joggers',
        price: 69.99,
        image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=500&fit=crop',
        category: 'Pants',
        rating: 4.6,
    },
    {
        id: 5,
        name: 'Premium Zip Hoodie',
        price: 99.99,
        originalPrice: 129.99,
        image: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=400&h=500&fit=crop',
        category: 'Hoodies',
        rating: 4.8,
    },
    {
        id: 6,
        name: 'Graphic Tee',
        price: 44.99,
        image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=500&fit=crop',
        category: 'T-Shirts',
        rating: 4.5,
    },
];

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

const FeaturedProducts = () => {
    return (
        <Box
            sx={{
                py: { xs: 10, md: 14 },
                background: `
          linear-gradient(180deg, #0a0a0f 0%, #0d1421 50%, #0a0a0f 100%),
          radial-gradient(ellipse at 30% 20%, rgba(124, 77, 255, 0.08) 0%, transparent 50%)
        `,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Decorative elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '20%',
                    right: '-10%',
                    width: 500,
                    height: 500,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(124, 77, 255, 0.08) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '-5%',
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0, 229, 255, 0.06) 0%, transparent 70%)',
                    filter: 'blur(50px)',
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <MotionBox
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    sx={{ textAlign: 'center', mb: 8 }}
                >
                    <Typography
                        variant="overline"
                        sx={{
                            color: '#00e5ff',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            letterSpacing: '0.4em',
                            mb: 2,
                            display: 'inline-block',
                            padding: '6px 14px',
                            background: 'rgba(0, 229, 255, 0.08)',
                            borderRadius: 2,
                            border: '1px solid rgba(0, 229, 255, 0.15)',
                        }}
                    >
                        ✦ Our Collection
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '2.2rem', md: '3.2rem' },
                            fontWeight: 800,
                            mb: 2,
                            background: 'linear-gradient(135deg, #ffffff 0%, #b0bec5 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Featured Products
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            maxWidth: 600,
                            mx: 'auto',
                            fontSize: '1.1rem',
                            lineHeight: 1.7,
                        }}
                    >
                        Explore our handpicked selection of premium streetwear designed for
                        those who dare to stand out from the crowd.
                    </Typography>
                </MotionBox>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <Grid container spacing={4}>
                        {products.map((product, index) => (
                            <Grid item xs={12} sm={6} md={4} key={product.id}>
                                <motion.div variants={itemVariants}>
                                    <MotionCard
                                        whileHover={{ y: -12, scale: 1.02 }}
                                        transition={{ duration: 0.3 }}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            background: 'rgba(13, 20, 33, 0.6)',
                                            backdropFilter: 'blur(20px)',
                                            border: '1px solid rgba(124, 77, 255, 0.12)',
                                            borderRadius: 4,
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            '&:hover': {
                                                boxShadow: '0 25px 60px rgba(124, 77, 255, 0.25)',
                                                border: '1px solid rgba(124, 77, 255, 0.3)',
                                                '& .product-overlay': {
                                                    opacity: 1,
                                                },
                                                '& .product-image': {
                                                    transform: 'scale(1.1)',
                                                },
                                            },
                                        }}
                                    >
                                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                            <CardMedia
                                                component="img"
                                                height="350"
                                                image={product.image}
                                                alt={product.name}
                                                className="product-image"
                                                sx={{
                                                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                                }}
                                            />

                                            {/* Overlay with actions */}
                                            <Box
                                                className="product-overlay"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    background: 'linear-gradient(180deg, transparent 0%, rgba(10, 10, 15, 0.9) 100%)',
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s ease',
                                                    display: 'flex',
                                                    alignItems: 'flex-end',
                                                    justifyContent: 'center',
                                                    pb: 3,
                                                    gap: 1.5,
                                                }}
                                            >
                                                <IconButton
                                                    sx={{
                                                        background: 'rgba(255, 255, 255, 0.1)',
                                                        backdropFilter: 'blur(10px)',
                                                        color: 'white',
                                                        '&:hover': {
                                                            background: 'rgba(124, 77, 255, 0.5)',
                                                        },
                                                    }}
                                                >
                                                    <FavoriteBorderIcon />
                                                </IconButton>
                                                <IconButton
                                                    sx={{
                                                        background: 'rgba(255, 255, 255, 0.1)',
                                                        backdropFilter: 'blur(10px)',
                                                        color: 'white',
                                                        '&:hover': {
                                                            background: 'rgba(124, 77, 255, 0.5)',
                                                        },
                                                    }}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Box>

                                            {/* Badges */}
                                            <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 1 }}>
                                                {product.isNew && (
                                                    <Chip
                                                        label="NEW"
                                                        size="small"
                                                        sx={{
                                                            background: 'linear-gradient(135deg, #7c4dff 0%, #00e5ff 100%)',
                                                            color: 'white',
                                                            fontWeight: 700,
                                                            fontSize: '0.7rem',
                                                            letterSpacing: '0.1em',
                                                        }}
                                                    />
                                                )}
                                                {product.originalPrice && (
                                                    <Chip
                                                        label={`-${Math.round((1 - product.price / product.originalPrice) * 100)}%`}
                                                        size="small"
                                                        sx={{
                                                            background: 'linear-gradient(135deg, #ff4081 0%, #ff6e40 100%)',
                                                            color: 'white',
                                                            fontWeight: 700,
                                                            fontSize: '0.7rem',
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        </Box>

                                        <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: '#7c4dff',
                                                    fontWeight: 600,
                                                    letterSpacing: '0.15em',
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.75rem',
                                                }}
                                            >
                                                {product.category}
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 700,
                                                    mt: 0.5,
                                                    mb: 1.5,
                                                    fontSize: '1.1rem',
                                                }}
                                            >
                                                {product.name}
                                            </Typography>

                                            {/* Rating */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Box
                                                        key={i}
                                                        sx={{
                                                            width: 14,
                                                            height: 14,
                                                            borderRadius: 1,
                                                            background: i < Math.floor(product.rating)
                                                                ? 'linear-gradient(135deg, #ffd700 0%, #ffb300 100%)'
                                                                : 'rgba(255, 255, 255, 0.1)',
                                                        }}
                                                    />
                                                ))}
                                                <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
                                                    ({product.rating})
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Typography
                                                    sx={{
                                                        fontSize: '1.4rem',
                                                        fontWeight: 800,
                                                        background: 'linear-gradient(135deg, #00e5ff 0%, #7c4dff 100%)',
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent',
                                                        backgroundClip: 'text',
                                                    }}
                                                >
                                                    ${product.price}
                                                </Typography>
                                                {product.originalPrice && (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            textDecoration: 'line-through',
                                                            color: 'rgba(255, 255, 255, 0.4)',
                                                        }}
                                                    >
                                                        ${product.originalPrice}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </CardContent>

                                        <CardActions sx={{ px: 2.5, pb: 2.5 }}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                startIcon={<ShoppingCartIcon />}
                                                sx={{
                                                    py: 1.3,
                                                    borderRadius: 2.5,
                                                    fontWeight: 700,
                                                    fontSize: '0.85rem',
                                                    background: 'linear-gradient(135deg, #1a237e 0%, #7c4dff 100%)',
                                                    boxShadow: '0 4px 20px rgba(124, 77, 255, 0.3)',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #534bae 0%, #b47cff 100%)',
                                                        boxShadow: '0 6px 25px rgba(124, 77, 255, 0.5)',
                                                        transform: 'translateY(-2px)',
                                                    },
                                                }}
                                            >
                                                Add to Cart
                                            </Button>
                                        </CardActions>
                                    </MotionCard>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>

                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    sx={{ textAlign: 'center', mt: 10 }}
                >
                    <Button
                        variant="outlined"
                        size="large"
                        sx={{
                            px: 8,
                            py: 2,
                            fontSize: '1rem',
                            fontWeight: 700,
                            borderRadius: 3,
                            borderColor: '#7c4dff',
                            borderWidth: 2,
                            color: '#7c4dff',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.1) 0%, rgba(0, 229, 255, 0.1) 100%)',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                            },
                            '&:hover': {
                                borderColor: '#00e5ff',
                                borderWidth: 2,
                                color: '#00e5ff',
                                transform: 'translateY(-2px)',
                                '&::before': {
                                    opacity: 1,
                                },
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        View All Products
                    </Button>
                </MotionBox>
            </Container>
        </Box>
    );
};

export default FeaturedProducts;
