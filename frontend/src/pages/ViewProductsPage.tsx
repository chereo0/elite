import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Avatar,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    useTheme,
    Alert,
    CircularProgress,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    Pagination,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { API_URL } from '../config/api';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

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
    { icon: <InventoryIcon />, label: 'View Products', path: '/admin/products', active: true },
    { icon: <ShoppingBagIcon />, label: 'View Orders', path: '/admin/orders' },
    { icon: <PeopleIcon />, label: 'View Users', path: '/admin/users' },
];

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
    category: { _id: string; name: string } | string;
    image: string;
    stock: number;
    sizes?: string[];
    colors?: string[];
    createdAt: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

const ViewProductsPage = () => {
    const navigate = useNavigate();
    const [stars] = useState(() => generateStars(60));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // User state
    const [user, setUser] = useState<User | null>(null);

    // Products state
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // Categories for edit dialog
    const [categories, setCategories] = useState<Category[]>([]);

    // Brands for filter
    const [brands, setBrands] = useState<string[]>([]);
    const [selectedBrand, setSelectedBrand] = useState('');

    // Edit dialog state
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Alerts
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const sidebarWidth = 240;

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch {
                setUser(null);
            }
        }
        fetchProducts();
        fetchCategories();
    }, [page, selectedBrand]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = `${API_URL}/products?page=${page}&limit=12`;
            if (selectedBrand) {
                url += `&brand=${encodeURIComponent(selectedBrand)}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setProducts(data.data);
                setTotalPages(data.pages || 1);
                if (data.brands) {
                    setBrands(data.brands);
                }
            }
        } catch (err) {
            console.error('Failed to fetch products:', err);
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

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

    const handleEditClick = (product: Product) => {
        setEditProduct({ ...product });
        setEditDialogOpen(true);
    };

    const handleEditSave = async () => {
        if (!editProduct) return;
        setEditLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/products/${editProduct._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: editProduct.name,
                    description: editProduct.description,
                    brand: editProduct.brand,
                    price: editProduct.price,
                    stock: editProduct.stock,
                    category: typeof editProduct.category === 'object' ? editProduct.category._id : editProduct.category,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update product');
            }

            setSuccess('Product updated successfully!');
            setEditDialogOpen(false);
            fetchProducts();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update product');
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeleteClick = (product: Product) => {
        setDeleteProduct(product);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteProduct) return;
        setDeleteLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/products/${deleteProduct._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete product');
            }

            setSuccess('Product deleted successfully!');
            setDeleteDialogOpen(false);
            fetchProducts();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete product');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth');
    };

    const getInitials = (name: string) => {
        return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getCategoryName = (category: { _id: string; name: string } | string) => {
        if (typeof category === 'object') return category.name;
        return 'Unknown';
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderSidebar = () => (
        <Box
            sx={{
                width: sidebarWidth,
                ...glassCardStyles,
                borderRadius: 0,
                borderTop: 'none',
                borderBottom: 'none',
                borderLeft: 'none',
                minHeight: 'calc(100vh - 70px)',
                py: 3,
            }}
        >
            <List>
                {sidebarItems.map((item) => (
                    <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            sx={{
                                mx: 1,
                                borderRadius: 2,
                                background: item.active ? 'rgba(30, 144, 255, 0.15)' : 'transparent',
                                borderLeft: item.active ? '3px solid #1e90ff' : '3px solid transparent',
                                '&:hover': { background: 'rgba(30, 144, 255, 0.1)' },
                            }}
                        >
                            <ListItemIcon sx={{ color: item.active ? '#1e90ff' : 'rgba(255,255,255,0.6)', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontWeight: item.active ? 600 : 400,
                                        color: item.active ? 'white' : 'rgba(255,255,255,0.7)',
                                        fontSize: '0.9rem',
                                    },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
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
            }}
        >
            {/* Animated Stars */}
            {stars.map((star) => (
                <Star key={star.id} {...star} />
            ))}

            {/* Top Header */}
            <Box
                sx={{
                    ...glassCardStyles,
                    borderRadius: 0,
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    py: 2,
                    px: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {isMobile && (
                        <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: 'white' }}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <RouterLink to="/" style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="Elite Motion" style={{ height: 45 }} />
                    </RouterLink>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: user?.role === 'admin' ? '#ff4444' : '#1e90ff' }}>
                            {user ? getInitials(user.name) : 'A'}
                        </Avatar>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.name || 'Admin'}</Typography>
                            <Typography variant="caption" sx={{ color: '#1e90ff' }}>{user?.role || 'admin'}</Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={handleLogout} sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        <LogoutIcon />
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{ display: 'flex' }}>
                {/* Sidebar - Desktop */}
                {!isMobile && renderSidebar()}

                {/* Sidebar - Mobile Drawer */}
                <Drawer
                    anchor="left"
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    PaperProps={{
                        sx: {
                            width: sidebarWidth,
                            background: 'linear-gradient(180deg, #0a0a0f 0%, #0d1421 100%)',
                        },
                    }}
                >
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <img src={logo} alt="Elite Motion" style={{ height: 40 }} />
                        <IconButton onClick={() => setSidebarOpen(false)} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    {renderSidebar()}
                </Drawer>

                {/* Main Content */}
                <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
                    <Container maxWidth="xl">
                        {/* Page Title */}
                        <MotionBox
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 300,
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <InventoryIcon sx={{ color: '#1e90ff', fontSize: 35 }} />
                                All Products
                            </Typography>

                            {/* Search */}
                            <TextField
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{ ...inputStyles, width: { xs: '100%', sm: 200 } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {/* Brand Filter */}
                            <FormControl sx={{ ...inputStyles, minWidth: 150 }}>
                                <InputLabel>Brand</InputLabel>
                                <Select
                                    value={selectedBrand}
                                    onChange={(e) => setSelectedBrand(e.target.value)}
                                    label="Brand"
                                >
                                    <MenuItem value="">All Brands</MenuItem>
                                    {brands.map((brand) => (
                                        <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </MotionBox>

                        {/* Alerts */}
                        {error && (
                            <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3, background: 'rgba(211, 47, 47, 0.1)', color: '#ff6b6b' }}>
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert severity="success" icon={<CheckCircleIcon />} onClose={() => setSuccess('')} sx={{ mb: 3, background: 'rgba(46, 125, 50, 0.1)', color: '#69f0ae' }}>
                                {success}
                            </Alert>
                        )}

                        {/* Products Grid */}
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                                <CircularProgress sx={{ color: '#1e90ff' }} />
                            </Box>
                        ) : filteredProducts.length === 0 ? (
                            <Box sx={{ ...glassCardStyles, p: 6, textAlign: 'center' }}>
                                <InventoryIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
                                <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                    No products found. Add your first product!
                                </Typography>
                                <Button
                                    component={RouterLink}
                                    to="/admin/add-product"
                                    variant="contained"
                                    sx={{ mt: 2, background: 'linear-gradient(135deg, #1e90ff 0%, #00bcd4 100%)' }}
                                >
                                    Add Product
                                </Button>
                            </Box>
                        ) : (
                            <>
                                <Grid container spacing={3}>
                                    <AnimatePresence>
                                        {filteredProducts.map((product, index) => (
                                            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                                                <MotionCard
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                    sx={{
                                                        ...glassCardStyles,
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        overflow: 'hidden',
                                                        '&:hover': {
                                                            border: '1px solid rgba(30, 144, 255, 0.4)',
                                                        },
                                                    }}
                                                >
                                                    <CardMedia
                                                        component="img"
                                                        height="180"
                                                        image={product.image}
                                                        alt={product.name}
                                                        sx={{ objectFit: 'cover' }}
                                                    />
                                                    <CardContent sx={{ flex: 1 }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1rem' }} noWrap>
                                                            {product.name}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                            <Typography variant="h6" sx={{ color: '#1e90ff', fontWeight: 700 }}>
                                                                ${product.price}
                                                            </Typography>
                                                            <Chip
                                                                label={`Stock: ${product.stock}`}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: product.stock > 10 ? 'rgba(0, 200, 83, 0.15)' : product.stock > 0 ? 'rgba(255, 193, 7, 0.15)' : 'rgba(211, 47, 47, 0.15)',
                                                                    color: product.stock > 10 ? '#00c853' : product.stock > 0 ? '#ffc107' : '#ff4444',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.7rem',
                                                                }}
                                                            />
                                                        </Box>
                                                        <Chip
                                                            label={getCategoryName(product.category)}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: 'rgba(30, 144, 255, 0.15)',
                                                                color: '#1e90ff',
                                                                fontSize: '0.7rem',
                                                            }}
                                                        />
                                                    </CardContent>
                                                    <CardActions sx={{ p: 2, pt: 0 }}>
                                                        <Button
                                                            size="small"
                                                            startIcon={<EditIcon />}
                                                            onClick={() => handleEditClick(product)}
                                                            sx={{ color: '#1e90ff' }}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            startIcon={<DeleteIcon />}
                                                            onClick={() => handleDeleteClick(product)}
                                                            sx={{ color: '#ff4444' }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </CardActions>
                                                </MotionCard>
                                            </Grid>
                                        ))}
                                    </AnimatePresence>
                                </Grid>

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
                                                    borderColor: 'rgba(30, 144, 255, 0.3)',
                                                },
                                                '& .Mui-selected': {
                                                    background: 'rgba(30, 144, 255, 0.3) !important',
                                                },
                                            }}
                                        />
                                    </Box>
                                )}
                            </>
                        )}
                    </Container>
                </Box>
            </Box>

            {/* Edit Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        ...glassCardStyles,
                        background: 'rgba(10, 15, 30, 0.95)',
                    },
                }}
            >
                <DialogTitle sx={{ borderBottom: '1px solid rgba(30, 144, 255, 0.2)' }}>
                    Edit Product
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {editProduct && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Product Name"
                                    value={editProduct.name}
                                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                                    sx={inputStyles}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={3}
                                    value={editProduct.description}
                                    onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                                    sx={inputStyles}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Brand"
                                    value={editProduct.brand || ''}
                                    onChange={(e) => setEditProduct({ ...editProduct, brand: e.target.value })}
                                    sx={inputStyles}
                                    placeholder="e.g., Nike, Adidas, Supreme"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Price"
                                    type="number"
                                    value={editProduct.price}
                                    onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) })}
                                    sx={inputStyles}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><AttachMoneyIcon sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Stock"
                                    type="number"
                                    value={editProduct.stock}
                                    onChange={(e) => setEditProduct({ ...editProduct, stock: parseInt(e.target.value) })}
                                    sx={inputStyles}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth sx={inputStyles}>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={typeof editProduct.category === 'object' ? editProduct.category._id : editProduct.category}
                                        onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                                        label="Category"
                                    >
                                        {categories.flatMap((cat) => [
                                            <MenuItem key={cat._id} value={cat._id} sx={{ fontWeight: 600 }}>
                                                {cat.name}
                                            </MenuItem>,
                                            ...(cat.subcategories?.map((sub) => (
                                                <MenuItem key={sub._id} value={sub._id} sx={{ pl: 4 }}>
                                                    ↳ {sub.name}
                                                </MenuItem>
                                            )) || [])
                                        ])}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(30, 144, 255, 0.2)' }}>
                    <Button onClick={() => setEditDialogOpen(false)} sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEditSave}
                        variant="contained"
                        disabled={editLoading}
                        sx={{ background: 'linear-gradient(135deg, #1e90ff 0%, #00bcd4 100%)' }}
                    >
                        {editLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: {
                        ...glassCardStyles,
                        background: 'rgba(10, 15, 30, 0.95)',
                    },
                }}
            >
                <DialogTitle sx={{ color: '#ff4444' }}>
                    Delete Product
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "<strong>{deleteProduct?.name}</strong>"? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        disabled={deleteLoading}
                        sx={{ background: '#ff4444', '&:hover': { background: '#ff6666' } }}
                    >
                        {deleteLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ViewProductsPage;
