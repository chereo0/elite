import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    CircularProgress,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

interface Subcategory {
    _id: string;
    name: string;
}

interface Category {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    subcategories?: Subcategory[];
}

const MotionBox = motion(Box);

// Category images mapping - you can customize these
const categoryImages: { [key: string]: string } = {
    'T-Shirts': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    'Hoodies': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    'Jackets': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    'Pants': 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=400&fit=crop',
    'Shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    'Accessories': 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop',
    'default': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop',
};

// Gradient colors for categories
const categoryGradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
];

const OurCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/categories`);
            const data = await response.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryImage = (category: Category) => {
        // Use category image from database if available, otherwise use fallback
        if (category.image) {
            return category.image;
        }
        return categoryImages[category.name] || categoryImages['default'];
    };

    const getGradient = (index: number) => {
        return categoryGradients[index % categoryGradients.length];
    };

    return (
        <Box
            sx={{
                py: { xs: 10, md: 14 },
                background: `
                    linear-gradient(180deg, #0a0a0f 0%, #0f1524 50%, #0a0a0f 100%)
                `,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Animated background elements */}
            <MotionBox
                animate={{
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '-5%',
                    width: 600,
                    height: 600,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
            />
            <MotionBox
                animate={{
                    x: [0, -40, 0],
                    y: [0, 40, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                sx={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '-10%',
                    width: 500,
                    height: 500,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(240, 147, 251, 0.1) 0%, transparent 70%)',
                    filter: 'blur(70px)',
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Section Header */}
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
                            color: '#f093fb',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            letterSpacing: '0.4em',
                            mb: 2,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            padding: '6px 14px',
                            background: 'rgba(240, 147, 251, 0.08)',
                            borderRadius: 2,
                            border: '1px solid rgba(240, 147, 251, 0.15)',
                        }}
                    >
                        <CategoryIcon sx={{ fontSize: 18 }} /> Browse By Style
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '2.2rem', md: '3.2rem' },
                            fontWeight: 800,
                            mb: 2,
                            background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #e0e0e0 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Our Categories
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
                        Explore our diverse range of streetwear categories, each curated with
                        the finest pieces to match your unique style.
                    </Typography>
                </MotionBox>

                {/* Categories Grid */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress sx={{ color: '#f093fb' }} />
                    </Box>
                ) : categories.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            No categories available yet. Check back soon!
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        <AnimatePresence>
                            {categories.map((category, index) => (
                                <Grid item xs={12} sm={6} md={4} key={category._id}>
                                    <MotionBox
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        onHoverStart={() => setHoveredCategory(category._id)}
                                        onHoverEnd={() => setHoveredCategory(null)}
                                        component={RouterLink}
                                        to={`/shop?category=${category._id}`}
                                        sx={{
                                            display: 'block',
                                            textDecoration: 'none',
                                            position: 'relative',
                                            height: 280,
                                            borderRadius: 4,
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                                            },
                                        }}
                                    >
                                        {/* Background Image */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundImage: `url(${getCategoryImage(category)})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                                transform: hoveredCategory === category._id ? 'scale(1.1)' : 'scale(1)',
                                            }}
                                        />

                                        {/* Gradient Overlay */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: `
                                                    linear-gradient(180deg, 
                                                        transparent 0%, 
                                                        rgba(10, 10, 15, 0.3) 40%,
                                                        rgba(10, 10, 15, 0.85) 100%
                                                    )
                                                `,
                                            }}
                                        />

                                        {/* Colored accent bar */}
                                        <MotionBox
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                height: 4,
                                                background: getGradient(index),
                                            }}
                                            animate={{
                                                scaleX: hoveredCategory === category._id ? 1 : 0.3,
                                            }}
                                            transition={{ duration: 0.3 }}
                                            style={{ transformOrigin: 'left' }}
                                        />

                                        {/* Content */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                p: 3,
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                                <Box>
                                                    <Typography
                                                        variant="h5"
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: 'white',
                                                            mb: 0.5,
                                                            fontSize: '1.4rem',
                                                        }}
                                                    >
                                                        {category.name}
                                                    </Typography>
                                                    {category.subcategories && category.subcategories.length > 0 && (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: 'rgba(255, 255, 255, 0.6)',
                                                                fontSize: '0.85rem',
                                                            }}
                                                        >
                                                            {category.subcategories.length} subcategories
                                                        </Typography>
                                                    )}
                                                </Box>

                                                {/* Arrow Icon */}
                                                <MotionBox
                                                    animate={{
                                                        x: hoveredCategory === category._id ? 5 : 0,
                                                        opacity: hoveredCategory === category._id ? 1 : 0.5,
                                                    }}
                                                    transition={{ duration: 0.3 }}
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: 2,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        background: 'rgba(255, 255, 255, 0.1)',
                                                        backdropFilter: 'blur(10px)',
                                                    }}
                                                >
                                                    <ArrowForwardIcon sx={{ color: 'white', fontSize: 20 }} />
                                                </MotionBox>
                                            </Box>

                                            {/* Subcategories preview */}
                                            <AnimatePresence>
                                                {hoveredCategory === category._id && category.subcategories && category.subcategories.length > 0 && (
                                                    <MotionBox
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}
                                                    >
                                                        {category.subcategories.slice(0, 3).map((sub) => (
                                                            <Box
                                                                key={sub._id}
                                                                sx={{
                                                                    px: 1.5,
                                                                    py: 0.5,
                                                                    borderRadius: 1,
                                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                                    fontSize: '0.75rem',
                                                                    color: 'rgba(255, 255, 255, 0.8)',
                                                                }}
                                                            >
                                                                {sub.name}
                                                            </Box>
                                                        ))}
                                                        {category.subcategories.length > 3 && (
                                                            <Box
                                                                sx={{
                                                                    px: 1.5,
                                                                    py: 0.5,
                                                                    borderRadius: 1,
                                                                    background: 'rgba(240, 147, 251, 0.2)',
                                                                    fontSize: '0.75rem',
                                                                    color: '#f093fb',
                                                                }}
                                                            >
                                                                +{category.subcategories.length - 3} more
                                                            </Box>
                                                        )}
                                                    </MotionBox>
                                                )}
                                            </AnimatePresence>
                                        </Box>
                                    </MotionBox>
                                </Grid>
                            ))}
                        </AnimatePresence>
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default OurCategories;
