import { useState, useEffect } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
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
    Chip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Collapse,
    CircularProgress,
    Pagination,
    InputAdornment,
    useMediaQuery,
    useTheme,
    Slider,
    Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { API_URL } from '../config/api';
import { getImageUrl } from '../utils/imageHelper';

interface Subcategory {
    _id: string;
    name: string;
}

interface Category {
    _id: string;
    name: string;
    subcategories?: Subcategory[];
}

interface Product {
    _id: string;
    name: string;
    description: string;
    brand?: string;
    price: number;
    image: string;
    category: { _id: string; name: string } | string;
    stock: number;
    sizes?: string[];
    colors?: string[];
    createdAt: string;
    hasBase64Image?: boolean;
}

const MotionCard = motion(Card);

const Shop = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [searchParams] = useSearchParams();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();

    // Products state
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filter state
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);

    // UI state
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    // Read category from URL on mount
    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [page, selectedCategory, selectedBrand, searchQuery]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/categories`);
            const data = await response.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = `${API_URL}/products?page=${page}&limit=12`;
            if (selectedCategory) url += `&category=${selectedCategory}`;
            if (selectedBrand) url += `&brand=${encodeURIComponent(selectedBrand)}`;
            if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setProducts(data.data);
                setTotalPages(data.pages || 1);
                if (data.brands) setBrands(data.brands);
            }
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategory(categoryId);
        setPage(1);
        if (isMobile) setFilterDrawerOpen(false);
    };

    const handleSubcategoryClick = (subcategoryId: string) => {
        setSelectedCategory(subcategoryId);
        setPage(1);
        if (isMobile) setFilterDrawerOpen(false);
    };

    const handleBrandChange = (brand: string) => {
        setSelectedBrand(brand);
        setPage(1);
        if (isMobile) setFilterDrawerOpen(false);
    };

    const toggleCategoryExpand = (categoryId: string) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedBrand('');
        setSearchQuery('');
        setPriceRange([0, 1000]);
        setPage(1);
    };

    const getCategoryName = (category: { _id: string; name: string } | string) => {
        if (typeof category === 'object') return category.name;
        return 'Category';
    };

    const activeFiltersCount = [selectedCategory, selectedBrand, searchQuery].filter(Boolean).length;

    // Filter sidebar content
    const filterContent = (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TuneIcon /> Filters
                </Typography>
                {activeFiltersCount > 0 && (
                    <Button size="small" onClick={clearFilters} sx={{ color: '#7c4dff' }}>
                        Clear All
                    </Button>
                )}
            </Box>

            {/* Search */}
            <TextField
                fullWidth
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: 2,
                        '& fieldset': { borderColor: 'rgba(124, 77, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(124, 77, 255, 0.4)' },
                        '&.Mui-focused fieldset': { borderColor: '#7c4dff' },
                    },
                    '& .MuiOutlinedInput-input': { color: 'white' },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                        </InputAdornment>
                    ),
                }}
            />

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

            {/* Categories */}
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em' }}>
                CATEGORIES
            </Typography>
            <List sx={{ mb: 3 }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => handleCategoryClick('')}
                        selected={!selectedCategory}
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            '&.Mui-selected': {
                                background: 'rgba(124, 77, 255, 0.15)',
                                '&:hover': { background: 'rgba(124, 77, 255, 0.2)' },
                            },
                            '&:hover': { background: 'rgba(255,255,255,0.05)' },
                        }}
                    >
                        <ListItemText primary="All Categories" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                    </ListItemButton>
                </ListItem>
                {categories.map((category) => (
                    <Box key={category._id}>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    if (category.subcategories && category.subcategories.length > 0) {
                                        toggleCategoryExpand(category._id);
                                    } else {
                                        handleCategoryClick(category._id);
                                    }
                                }}
                                selected={selectedCategory === category._id}
                                sx={{
                                    borderRadius: 2,
                                    mb: 0.5,
                                    '&.Mui-selected': {
                                        background: 'rgba(124, 77, 255, 0.15)',
                                        '&:hover': { background: 'rgba(124, 77, 255, 0.2)' },
                                    },
                                    '&:hover': { background: 'rgba(255,255,255,0.05)' },
                                }}
                            >
                                <ListItemText primary={category.name} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                                {category.subcategories && category.subcategories.length > 0 && (
                                    expandedCategories.has(category._id) ? <ExpandLess /> : <ExpandMore />
                                )}
                            </ListItemButton>
                        </ListItem>
                        {category.subcategories && category.subcategories.length > 0 && (
                            <Collapse in={expandedCategories.has(category._id)}>
                                <List component="div" disablePadding>
                                    {category.subcategories.map((sub) => (
                                        <ListItemButton
                                            key={sub._id}
                                            onClick={() => handleSubcategoryClick(sub._id)}
                                            selected={selectedCategory === sub._id}
                                            sx={{
                                                pl: 4,
                                                borderRadius: 2,
                                                mb: 0.5,
                                                '&.Mui-selected': {
                                                    background: 'rgba(124, 77, 255, 0.15)',
                                                    '&:hover': { background: 'rgba(124, 77, 255, 0.2)' },
                                                },
                                                '&:hover': { background: 'rgba(255,255,255,0.05)' },
                                            }}
                                        >
                                            <ListItemText
                                                primary={sub.name}
                                                primaryTypographyProps={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}
                                            />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        )}
                    </Box>
                ))}
            </List>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

            {/* Brands */}
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em' }}>
                BRANDS
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
                <Select
                    value={selectedBrand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    displayEmpty
                    sx={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: 2,
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(124, 77, 255, 0.2)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(124, 77, 255, 0.4)' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7c4dff' },
                        '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.5)' },
                    }}
                >
                    <MenuItem value="">All Brands</MenuItem>
                    {brands.map((brand) => (
                        <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

            {/* Price Range */}
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em' }}>
                PRICE RANGE
            </Typography>
            <Box sx={{ px: 1 }}>
                <Slider
                    value={priceRange}
                    onChange={(_, newValue) => setPriceRange(newValue as number[])}
                    valueLabelDisplay="auto"
                    min={0}
                    max={1000}
                    sx={{
                        color: '#7c4dff',
                        '& .MuiSlider-thumb': {
                            '&:hover, &.Mui-focusVisible': {
                                boxShadow: '0 0 0 8px rgba(124, 77, 255, 0.16)',
                            },
                        },
                    }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        ${priceRange[0]}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        ${priceRange[1]}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
                {/* Page Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            mb: 1,
                            background: 'linear-gradient(135deg, #ffffff 0%, #7c4dff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Shop
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        Discover our collection of premium streetwear
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {/* Desktop Filter Sidebar */}
                    {!isMobile && (
                        <Grid item md={3}>
                            <Box
                                sx={{
                                    position: 'sticky',
                                    top: 100,
                                    background: 'rgba(13, 20, 33, 0.6)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(124, 77, 255, 0.12)',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                }}
                            >
                                {filterContent}
                            </Box>
                        </Grid>
                    )}

                    {/* Products Grid */}
                    <Grid item xs={12} md={9}>
                        {/* Mobile Filter Button & Active Filters */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                            {isMobile && (
                                <Button
                                    variant="outlined"
                                    startIcon={<FilterListIcon />}
                                    onClick={() => setFilterDrawerOpen(true)}
                                    sx={{
                                        borderColor: 'rgba(124, 77, 255, 0.3)',
                                        color: '#7c4dff',
                                        '&:hover': { borderColor: '#7c4dff', background: 'rgba(124, 77, 255, 0.1)' },
                                    }}
                                >
                                    Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                                </Button>
                            )}

                            {/* Active filter chips */}
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {selectedCategory && (
                                    <Chip
                                        label={categories.flatMap(c => [c, ...(c.subcategories || [])]).find(c => c._id === selectedCategory)?.name || 'Category'}
                                        onDelete={() => setSelectedCategory('')}
                                        sx={{ background: 'rgba(124, 77, 255, 0.2)', color: '#7c4dff' }}
                                    />
                                )}
                                {selectedBrand && (
                                    <Chip
                                        label={selectedBrand}
                                        onDelete={() => setSelectedBrand('')}
                                        sx={{ background: 'rgba(124, 77, 255, 0.2)', color: '#7c4dff' }}
                                    />
                                )}
                                {searchQuery && (
                                    <Chip
                                        label={`"${searchQuery}"`}
                                        onDelete={() => setSearchQuery('')}
                                        sx={{ background: 'rgba(124, 77, 255, 0.2)', color: '#7c4dff' }}
                                    />
                                )}
                            </Box>

                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', ml: 'auto' }}>
                                {products.length} products
                            </Typography>
                        </Box>

                        {/* Products */}
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                                <CircularProgress sx={{ color: '#7c4dff' }} />
                            </Box>
                        ) : products.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', mb: 2 }}>
                                    No products found
                                </Typography>
                                <Button onClick={clearFilters} variant="outlined" sx={{ borderColor: '#7c4dff', color: '#7c4dff' }}>
                                    Clear Filters
                                </Button>
                            </Box>
                        ) : (
                            <>
                                <Grid container spacing={3}>
                                    {products.map((product) => (
                                        <Grid item xs={12} sm={6} lg={4} key={product._id}>
                                            <MotionCard
                                                whileHover={{ y: -8, scale: 1.02 }}
                                                transition={{ duration: 0.3 }}
                                                sx={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    background: 'rgba(13, 20, 33, 0.6)',
                                                    backdropFilter: 'blur(20px)',
                                                    border: '1px solid rgba(124, 77, 255, 0.12)',
                                                    borderRadius: 3,
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        boxShadow: '0 20px 40px rgba(124, 77, 255, 0.2)',
                                                        border: '1px solid rgba(124, 77, 255, 0.3)',
                                                    },
                                                }}
                                            >
                                                <Box sx={{ position: 'relative', height: 280, overflow: 'hidden' }}>
                                                    <CardMedia
                                                        component="img"
                                                        image={getImageUrl(product.image, product.hasBase64Image)}
                                                        alt={product.name}
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            transition: 'transform 0.3s ease',
                                                        }}
                                                    />
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (isInWishlist(product._id)) {
                                                                removeFromWishlist(product._id);
                                                            } else {
                                                                addToWishlist({
                                                                    _id: product._id,
                                                                    name: product.name,
                                                                    price: product.price,
                                                                    image: getImageUrl(product.image, product.hasBase64Image),
                                                                    brand: product.brand,
                                                                    category: product.category,
                                                                });
                                                            }
                                                        }}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 12,
                                                            right: 12,
                                                            background: 'rgba(0,0,0,0.5)',
                                                            backdropFilter: 'blur(10px)',
                                                            color: 'white',
                                                            '&:hover': { background: 'rgba(255, 68, 68, 0.5)' },
                                                        }}
                                                    >
                                                        {isInWishlist(product._id) ? (
                                                            <FavoriteIcon sx={{ color: '#ff4444' }} />
                                                        ) : (
                                                            <FavoriteBorderIcon />
                                                        )}
                                                    </IconButton>
                                                </Box>

                                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 2.5 }}>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: '#7c4dff',
                                                            fontWeight: 600,
                                                            letterSpacing: '0.1em',
                                                            textTransform: 'uppercase',
                                                        }}
                                                    >
                                                        {getCategoryName(product.category)}
                                                    </Typography>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 700,
                                                            mt: 0.5,
                                                            mb: 0.5,
                                                            fontSize: '1rem',
                                                            minHeight: '2.4em',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        {product.name}
                                                    </Typography>
                                                    <Box sx={{ minHeight: '1.4em', mb: 1 }}>
                                                        {product.brand && (
                                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                                by {product.brand}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '1.3rem',
                                                            fontWeight: 800,
                                                            color: '#00e5ff',
                                                            mt: 'auto',
                                                        }}
                                                    >
                                                        ${product.price}
                                                    </Typography>
                                                </CardContent>

                                                <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                                                    <Button
                                                        component={RouterLink}
                                                        to={`/product/${product._id}`}
                                                        variant="outlined"
                                                        sx={{
                                                            flex: 1,
                                                            py: 1.2,
                                                            borderRadius: 2,
                                                            fontWeight: 700,
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
                                                        startIcon={<ShoppingCartIcon />}
                                                        onClick={() => {
                                                            // Pick random size and color if available
                                                            const randomSize = product.sizes && product.sizes.length > 0
                                                                ? product.sizes[Math.floor(Math.random() * product.sizes.length)]
                                                                : undefined;
                                                            const randomColor = product.colors && product.colors.length > 0
                                                                ? product.colors[Math.floor(Math.random() * product.colors.length)]
                                                                : undefined;

                                                            addToCart({
                                                                _id: `${product._id}-${randomSize || 'default'}-${randomColor || 'default'}`,
                                                                product: product._id,
                                                                name: product.name,
                                                                price: product.price,
                                                                image: product.image,
                                                                stock: product.stock,
                                                                size: randomSize,
                                                                color: randomColor,
                                                            });
                                                        }}
                                                        sx={{
                                                            flex: 1,
                                                            py: 1.2,
                                                            borderRadius: 2,
                                                            fontWeight: 700,
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

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                                        <Pagination
                                            count={totalPages}
                                            page={page}
                                            onChange={(_, value) => setPage(value)}
                                            sx={{
                                                '& .MuiPaginationItem-root': {
                                                    color: 'white',
                                                    borderColor: 'rgba(124, 77, 255, 0.3)',
                                                    '&.Mui-selected': {
                                                        background: '#7c4dff',
                                                        '&:hover': { background: '#9575cd' },
                                                    },
                                                    '&:hover': { background: 'rgba(124, 77, 255, 0.2)' },
                                                },
                                            }}
                                        />
                                    </Box>
                                )}
                            </>
                        )}
                    </Grid>
                </Grid>
            </Container>

            {/* Mobile Filter Drawer */}
            <Drawer
                anchor="left"
                open={filterDrawerOpen}
                onClose={() => setFilterDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: 300,
                        background: 'rgba(10, 10, 15, 0.98)',
                        backdropFilter: 'blur(20px)',
                    },
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                    <IconButton onClick={() => setFilterDrawerOpen(false)} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                {filterContent}
            </Drawer>

            <Footer />
        </Box>
    );
};

export default Shop;
