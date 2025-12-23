import { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Slider,
    Breadcrumbs,
    Link,
} from '@mui/material';
import { motion } from 'framer-motion';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

// Product data
const products = [
    {
        id: 1,
        name: 'Black EM T-Shirt',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
        category: 'T-Shirts',
    },
    {
        id: 2,
        name: 'Gray EM T-Shirt',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop',
        category: 'T-Shirts',
    },
    {
        id: 3,
        name: 'Black EM Hoodie',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
        category: 'Hoodies',
    },
    {
        id: 4,
        name: 'Black EM Jeans',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
        category: 'Jeans',
    },
    {
        id: 5,
        name: 'Blue Denim Shorts',
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop',
        category: 'Shorts',
    },
    {
        id: 6,
        name: 'Black EM Sneakers',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
        category: 'Shoes',
    },
    {
        id: 7,
        name: 'White EM Running Shoes',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=500&fit=crop',
        category: 'Shoes',
    },
    {
        id: 8,
        name: 'Slim Fit Jeans',
        price: 54.99,
        image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&h=500&fit=crop',
        category: 'Jeans',
    },
    {
        id: 9,
        name: 'Cargo Shorts',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=400&h=500&fit=crop',
        category: 'Shorts',
    },
];

// Glassmorphism card styles
const glassCardStyles = {
    background: 'rgba(10, 15, 30, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(30, 144, 255, 0.15)',
    borderRadius: 3,
};

// Star component for background
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

const ClothesPage = () => {
    const [stars] = useState(() => generateStars(80));
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([25, 75]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handlePriceChange = (_event: Event, newValue: number | number[]) => {
        setPriceRange(newValue as number[]);
    };

    // Filter products
    const filteredProducts = products.filter((product) => {
        const categoryMatch =
            selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
        return categoryMatch && priceMatch;
    });

    const categories = ['T-Shirts', 'Hoodies', 'Jeans', 'Shorts', 'Shoes'];

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
            {/* Animated Stars */}
            {stars.map((star) => (
                <Star key={star.id} {...star} />
            ))}

            <Navbar />

            {/* Page Header */}
            <Container maxWidth="lg" sx={{ pt: 4, pb: 2, position: 'relative', zIndex: 1 }}>
                {/* Breadcrumbs */}
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.4)' }} />}
                    sx={{ mb: 3 }}
                >
                    <Link
                        href="/"
                        underline="hover"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'rgba(255,255,255,0.6)',
                            '&:hover': { color: '#1e90ff' },
                        }}
                    >
                        <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                        Home
                    </Link>
                    <Typography sx={{ color: '#1e90ff', fontWeight: 600 }}>Clothes</Typography>
                </Breadcrumbs>

                {/* Page Title */}
                <MotionBox
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    sx={{ textAlign: 'center', mb: 4 }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '2rem', md: '3rem' },
                            fontWeight: 300,
                            letterSpacing: '0.3em',
                            textTransform: 'uppercase',
                            background: 'linear-gradient(135deg, #ffffff 0%, #1e90ff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Clothes
                    </Typography>
                </MotionBox>
            </Container>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ pb: 8, position: 'relative', zIndex: 1 }}>
                <Grid container spacing={4}>
                    {/* Filter Sidebar */}
                    <Grid item xs={12} md={3}>
                        <MotionBox
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            sx={{
                                ...glassCardStyles,
                                p: 3,
                                position: { md: 'sticky' },
                                top: { md: 100 },
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    mb: 3,
                                    color: '#1e90ff',
                                }}
                            >
                                Filter By
                            </Typography>

                            {/* Category Filter */}
                            <Box sx={{ mb: 4 }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: 'rgba(255,255,255,0.8)',
                                        mb: 2,
                                        fontWeight: 600,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Category
                                </Typography>
                                <FormGroup>
                                    {categories.map((category) => (
                                        <FormControlLabel
                                            key={category}
                                            control={
                                                <Checkbox
                                                    checked={selectedCategories.includes(category)}
                                                    onChange={() => handleCategoryChange(category)}
                                                    sx={{
                                                        color: 'rgba(30, 144, 255, 0.5)',
                                                        '&.Mui-checked': { color: '#1e90ff' },
                                                    }}
                                                />
                                            }
                                            label={category}
                                            sx={{
                                                '& .MuiFormControlLabel-label': {
                                                    color: 'rgba(255,255,255,0.7)',
                                                    fontSize: '0.9rem',
                                                },
                                            }}
                                        />
                                    ))}
                                </FormGroup>
                            </Box>

                            {/* Price Filter */}
                            <Box sx={{ mb: 4 }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: 'rgba(255,255,255,0.8)',
                                        mb: 2,
                                        fontWeight: 600,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Price Range
                                </Typography>
                                <Box sx={{ px: 1 }}>
                                    <Slider
                                        value={priceRange}
                                        onChange={handlePriceChange}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={100}
                                        valueLabelFormat={(value) => `$${value}`}
                                        sx={{
                                            color: '#1e90ff',
                                            '& .MuiSlider-thumb': {
                                                boxShadow: '0 0 10px rgba(30, 144, 255, 0.5)',
                                            },
                                            '& .MuiSlider-track': {
                                                background: 'linear-gradient(90deg, #1e90ff, #00bfff)',
                                            },
                                        }}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                            ${priceRange[0]}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                            ${priceRange[1]}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Apply Filters Button */}
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #1e3a5f 0%, #1e90ff 100%)',
                                    fontWeight: 700,
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    borderRadius: 2,
                                    boxShadow: '0 4px 20px rgba(30, 144, 255, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #2d5a87 0%, #00bfff 100%)',
                                        boxShadow: '0 8px 30px rgba(30, 144, 255, 0.5)',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                Apply Filters
                            </Button>
                        </MotionBox>
                    </Grid>

                    {/* Products Grid */}
                    <Grid item xs={12} md={9}>
                        <Grid container spacing={3}>
                            {filteredProducts.map((product, index) => (
                                <Grid item xs={12} sm={6} lg={4} key={product.id}>
                                    <MotionCard
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.1 * index }}
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        sx={{
                                            ...glassCardStyles,
                                            overflow: 'hidden',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: '0 20px 50px rgba(30, 144, 255, 0.2)',
                                                border: '1px solid rgba(30, 144, 255, 0.4)',
                                                '& .product-image': {
                                                    transform: 'scale(1.1)',
                                                },
                                            },
                                        }}
                                    >
                                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                            <CardMedia
                                                component="img"
                                                height="280"
                                                image={product.image}
                                                alt={product.name}
                                                className="product-image"
                                                sx={{
                                                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                                }}
                                            />
                                        </Box>

                                        <CardContent
                                            sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                textAlign: 'center',
                                                pt: 3,
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    letterSpacing: '0.1em',
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.95rem',
                                                    mb: 1,
                                                }}
                                            >
                                                {product.name}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: '1.3rem',
                                                    fontWeight: 700,
                                                    background: 'linear-gradient(135deg, #1e90ff 0%, #00bfff 100%)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    backgroundClip: 'text',
                                                    mb: 2,
                                                }}
                                            >
                                                ${product.price.toFixed(2)}
                                            </Typography>

                                            <Button
                                                variant="contained"
                                                startIcon={<ShoppingCartIcon />}
                                                sx={{
                                                    mt: 'auto',
                                                    px: 3,
                                                    py: 1,
                                                    borderRadius: 2,
                                                    background: 'linear-gradient(135deg, #1e3a5f 0%, #1e90ff 100%)',
                                                    fontWeight: 600,
                                                    fontSize: '0.8rem',
                                                    letterSpacing: '0.1em',
                                                    textTransform: 'uppercase',
                                                    boxShadow: '0 4px 15px rgba(30, 144, 255, 0.3)',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #2d5a87 0%, #00bfff 100%)',
                                                        boxShadow: '0 6px 25px rgba(30, 144, 255, 0.5)',
                                                        transform: 'translateY(-2px)',
                                                    },
                                                }}
                                            >
                                                Add to Cart
                                            </Button>
                                        </CardContent>
                                    </MotionCard>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Empty state */}
                        {filteredProducts.length === 0 && (
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 8,
                                    ...glassCardStyles,
                                    p: 4,
                                }}
                            >
                                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                    No products match your filters
                                </Typography>
                                <Button
                                    onClick={() => {
                                        setSelectedCategories([]);
                                        setPriceRange([25, 75]);
                                    }}
                                    sx={{ mt: 2, color: '#1e90ff' }}
                                >
                                    Clear Filters
                                </Button>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Container>

            <Footer />
        </Box>
    );
};

export default ClothesPage;
