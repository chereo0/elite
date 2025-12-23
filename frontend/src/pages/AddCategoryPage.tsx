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
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Collapse,
    CardMedia,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import ImageIcon from '@mui/icons-material/Image';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const MotionBox = motion(Box);

const API_URL = 'http://localhost:5000/api';

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
    { icon: <CategoryIcon />, label: 'Add Category', path: '/admin/add-category', active: true },
    { icon: <ShoppingBagIcon />, label: 'View Orders', path: '/admin/orders' },
    { icon: <PeopleIcon />, label: 'View Users', path: '/admin/users' },
];

interface Subcategory {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    parent: string;
}

interface Category {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    subcategories?: Subcategory[];
}

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

const AddCategoryPage = () => {
    const navigate = useNavigate();
    const [stars] = useState(() => generateStars(60));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('Add Category');
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // User state
    const [user, setUser] = useState<User | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        parent: '',
    });

    // Form submission state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
    const [imageUploading, setImageUploading] = useState(false);

    // Edit dialog state
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editCategory, setEditCategory] = useState<{ _id: string; name: string; description: string; image: string; isSubcategory: boolean } | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editImageUploading, setEditImageUploading] = useState(false);

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteCategory, setDeleteCategory] = useState<{ _id: string; name: string; isSubcategory: boolean } | null>(null);

    const sidebarWidth = 240;

    // Load user and categories on mount
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch {
                setUser(null);
            }
        }
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
            setCategoriesLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            return;
        }

        setImageUploading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);

            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataUpload,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to upload image');
            }

            setFormData((prev) => ({ ...prev, image: data.data.url }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload image');
        } finally {
            setImageUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!formData.name) {
            setError('Category name is required');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    image: formData.image,
                    parent: formData.parent || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create category');
            }

            setSuccess(formData.parent ? 'Subcategory created successfully!' : 'Category created successfully!');
            setFormData({ name: '', description: '', image: '', parent: '' });

            // Refresh categories
            fetchCategories();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: string, name: string, isSubcategory: boolean = false) => {
        setDeleteCategory({ _id: id, name, isSubcategory });
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteCategory) return;
        setDeleteLoading(deleteCategory._id);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/categories/${deleteCategory._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete category');
            }

            setSuccess(`${deleteCategory.isSubcategory ? 'Subcategory' : 'Category'} deleted successfully!`);
            setDeleteDialogOpen(false);
            setDeleteCategory(null);
            fetchCategories();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete category');
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleEditClick = (category: Category | Subcategory, isSubcategory: boolean = false) => {
        setEditCategory({
            _id: category._id,
            name: category.name,
            description: category.description || '',
            image: category.image || '',
            isSubcategory,
        });
        setEditDialogOpen(true);
    };

    const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editCategory) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please upload a valid image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            return;
        }

        setEditImageUploading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);

            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataUpload,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to upload image');
            }

            setEditCategory({ ...editCategory, image: data.data.url });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload image');
        } finally {
            setEditImageUploading(false);
        }
    };

    const handleEditSave = async () => {
        if (!editCategory) return;
        setEditLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/categories/${editCategory._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: editCategory.name,
                    description: editCategory.description,
                    image: editCategory.image,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update category');
            }

            setSuccess(`${editCategory.isSubcategory ? 'Subcategory' : 'Category'} updated successfully!`);
            setEditDialogOpen(false);
            setEditCategory(null);
            fetchCategories();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update category');
        } finally {
            setEditLoading(false);
        }
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth');
    };

    const getInitials = (name: string) => {
        return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getTotalCount = () => {
        let count = categories.length;
        categories.forEach(cat => {
            if (cat.subcategories) {
                count += cat.subcategories.length;
            }
        });
        return count;
    };

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
                {!isMobile && (
                    <Box
                        sx={{
                            width: sidebarWidth,
                            minHeight: 'calc(100vh - 80px)',
                            ...glassCardStyles,
                            borderRadius: 0,
                            borderTop: 'none',
                            borderBottom: 'none',
                            borderLeft: 'none',
                            p: 2,
                        }}
                    >
                        <List>
                            {sidebarItems.map((item) => (
                                <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                                    <ListItemButton
                                        component={RouterLink}
                                        to={item.path}
                                        onClick={() => setActiveItem(item.label)}
                                        sx={{
                                            borderRadius: 2,
                                            background: activeItem === item.label ? 'rgba(30, 144, 255, 0.15)' : 'transparent',
                                            border: activeItem === item.label ? '1px solid rgba(30, 144, 255, 0.3)' : '1px solid transparent',
                                            '&:hover': { background: 'rgba(30, 144, 255, 0.1)' },
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: activeItem === item.label ? '#1e90ff' : 'rgba(255,255,255,0.6)', minWidth: 40 }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.label}
                                            sx={{
                                                '& .MuiTypography-root': {
                                                    color: activeItem === item.label ? '#1e90ff' : 'rgba(255,255,255,0.8)',
                                                    fontWeight: activeItem === item.label ? 600 : 400,
                                                    fontSize: '0.9rem',
                                                },
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                {/* Mobile Sidebar Drawer */}
                <Drawer
                    anchor="left"
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: 280,
                            background: 'rgba(10, 15, 30, 0.95)',
                            backdropFilter: 'blur(20px)',
                        },
                    }}
                >
                    <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <img src={logo} alt="Elite Motion" style={{ height: 40 }} />
                            <IconButton onClick={() => setSidebarOpen(false)} sx={{ color: 'white' }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <List>
                            {sidebarItems.map((item) => (
                                <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                                    <ListItemButton
                                        component={RouterLink}
                                        to={item.path}
                                        onClick={() => { setActiveItem(item.label); setSidebarOpen(false); }}
                                        sx={{
                                            borderRadius: 2,
                                            background: activeItem === item.label ? 'rgba(30, 144, 255, 0.15)' : 'transparent',
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: activeItem === item.label ? '#1e90ff' : 'rgba(255,255,255,0.6)' }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.label}
                                            sx={{ '& .MuiTypography-root': { color: activeItem === item.label ? '#1e90ff' : 'white' } }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>

                {/* Main Content */}
                <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, minHeight: 'calc(100vh - 80px)' }}>
                    {/* Page Title */}
                    <MotionBox
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        sx={{ mb: 4 }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 300,
                                fontStyle: 'italic',
                                letterSpacing: '0.1em',
                                fontSize: { xs: '1.5rem', md: '2rem' },
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <CategoryIcon sx={{ fontSize: { xs: 30, md: 40 }, color: '#1e90ff' }} />
                            MANAGE CATEGORIES
                        </Typography>
                    </MotionBox>

                    {/* Alerts */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3, background: 'rgba(211, 47, 47, 0.1)', color: '#ff6b6b' }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3, background: 'rgba(46, 125, 50, 0.1)', color: '#69f0ae' }}>
                            {success}
                        </Alert>
                    )}

                    <Grid container spacing={4}>
                        {/* Add Category Form */}
                        <Grid item xs={12} lg={5}>
                            <MotionBox
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                component="form"
                                onSubmit={handleSubmit}
                                sx={{ ...glassCardStyles, p: { xs: 3, md: 4 } }}
                            >
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, letterSpacing: '0.1em' }}>
                                    {formData.parent ? 'Add Subcategory' : 'Add Category'}
                                </Typography>

                                {/* Parent Category (optional) */}
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, display: 'block' }}>
                                    Parent Category (leave empty for main category)
                                </Typography>
                                <FormControl fullWidth sx={{ ...inputStyles, mb: 2.5 }}>
                                    <InputLabel>Parent Category</InputLabel>
                                    <Select
                                        value={formData.parent}
                                        onChange={(e) => handleInputChange('parent', e.target.value)}
                                        label="Parent Category"
                                    >
                                        <MenuItem value="">
                                            <em>None (Main Category)</em>
                                        </MenuItem>
                                        {categories.map((cat) => (
                                            <MenuItem key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Category Name */}
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, display: 'block' }}>
                                    {formData.parent ? 'Subcategory Name *' : 'Category Name *'}
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder={formData.parent ? 'Enter subcategory name' : 'Enter category name'}
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    sx={{ ...inputStyles, mb: 2.5 }}
                                    required
                                />

                                {/* Description */}
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, display: 'block' }}>
                                    Description
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder="Enter description..."
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    sx={{ ...inputStyles, mb: 2.5 }}
                                />

                                {/* Image Upload */}
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, display: 'block' }}>
                                    Category Image
                                </Typography>

                                {/* Upload Button */}
                                <Box sx={{ mb: 2 }}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="category-image-upload"
                                        type="file"
                                        onChange={handleImageUpload}
                                        disabled={imageUploading}
                                    />
                                    <label htmlFor="category-image-upload">
                                        <Button
                                            variant="outlined"
                                            component="span"
                                            fullWidth
                                            disabled={imageUploading}
                                            startIcon={imageUploading ? <CircularProgress size={20} sx={{ color: '#1e90ff' }} /> : <CloudUploadIcon />}
                                            sx={{
                                                py: 1.5,
                                                borderColor: 'rgba(30, 144, 255, 0.3)',
                                                color: '#1e90ff',
                                                '&:hover': {
                                                    borderColor: '#1e90ff',
                                                    background: 'rgba(30, 144, 255, 0.1)',
                                                },
                                            }}
                                        >
                                            {imageUploading ? 'Uploading...' : 'Upload Image'}
                                        </Button>
                                    </label>
                                </Box>

                                {/* OR Divider */}
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                                    <Typography variant="caption" sx={{ px: 2, color: 'rgba(255,255,255,0.4)' }}>OR</Typography>
                                    <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                                </Box>

                                {/* Image URL Input */}
                                <TextField
                                    fullWidth
                                    placeholder="Paste image URL here..."
                                    value={formData.image}
                                    onChange={(e) => handleInputChange('image', e.target.value)}
                                    sx={{ ...inputStyles, mb: 2 }}
                                    InputProps={{
                                        startAdornment: <ImageIcon sx={{ color: 'rgba(255,255,255,0.4)', mr: 1 }} />,
                                    }}
                                />

                                {/* Image Preview */}
                                {formData.image && (
                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                                Preview
                                            </Typography>
                                            <Button
                                                size="small"
                                                onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                                                sx={{ color: '#ff4444', fontSize: '0.7rem' }}
                                            >
                                                Remove
                                            </Button>
                                        </Box>
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: 150,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                border: '1px solid rgba(30, 144, 255, 0.2)',
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                image={formData.image}
                                                alt="Category preview"
                                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e: any) => {
                                                    e.target.src = 'https://via.placeholder.com/300x150?text=Invalid+Image';
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                )}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <AddCircleOutlineIcon />}
                                    sx={{
                                        py: 1.5,
                                        background: 'linear-gradient(135deg, #1e3a5f 0%, #1e90ff 100%)',
                                        fontWeight: 700,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        borderRadius: 2,
                                        boxShadow: '0 4px 20px rgba(30, 144, 255, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #2d5a87 0%, #00bfff 100%)',
                                            boxShadow: '0 8px 30px rgba(30, 144, 255, 0.5)',
                                        },
                                        '&:disabled': { background: 'rgba(30, 144, 255, 0.3)' },
                                    }}
                                >
                                    {loading ? 'Adding...' : formData.parent ? 'Add Subcategory' : 'Add Category'}
                                </Button>
                            </MotionBox>
                        </Grid>

                        {/* Existing Categories Table */}
                        <Grid item xs={12} lg={7}>
                            <MotionBox
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                sx={{ ...glassCardStyles, p: { xs: 3, md: 4 } }}
                            >
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, letterSpacing: '0.1em' }}>
                                    Categories & Subcategories ({getTotalCount()})
                                </Typography>

                                {categoriesLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                        <CircularProgress sx={{ color: '#1e90ff' }} />
                                    </Box>
                                ) : categories.length === 0 ? (
                                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', py: 4 }}>
                                        No categories yet. Add your first category!
                                    </Typography>
                                ) : (
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(30, 144, 255, 0.2)', width: 40 }} />
                                                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(30, 144, 255, 0.2)' }}>
                                                        Name
                                                    </TableCell>
                                                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(30, 144, 255, 0.2)' }}>
                                                        Subcategories
                                                    </TableCell>
                                                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(30, 144, 255, 0.2)' }}>
                                                        Actions
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <AnimatePresence>
                                                    {categories.map((category) => (
                                                        <>
                                                            <TableRow
                                                                key={category._id}
                                                                component={motion.tr}
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                sx={{ '&:hover': { background: 'rgba(30, 144, 255, 0.05)' } }}
                                                            >
                                                                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                                    {category.subcategories && category.subcategories.length > 0 && (
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => toggleCategoryExpand(category._id)}
                                                                            sx={{ color: '#1e90ff', p: 0 }}
                                                                        >
                                                                            {expandedCategories.has(category._id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                                        </IconButton>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600 }}>
                                                                    {category.name}
                                                                </TableCell>
                                                                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                                    <Chip
                                                                        label={category.subcategories?.length || 0}
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: 'rgba(30, 144, 255, 0.15)',
                                                                            color: '#1e90ff',
                                                                            fontWeight: 600,
                                                                            fontSize: '0.7rem',
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                                    <IconButton size="small" onClick={() => handleEditClick(category)} sx={{ color: '#1e90ff', mr: 0.5 }}>
                                                                        <EditIcon fontSize="small" />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleDeleteClick(category._id, category.name)}
                                                                        disabled={deleteLoading === category._id || (category.subcategories && category.subcategories.length > 0)}
                                                                        sx={{ color: '#ff4444' }}
                                                                    >
                                                                        {deleteLoading === category._id ? (
                                                                            <CircularProgress size={16} sx={{ color: '#ff4444' }} />
                                                                        ) : (
                                                                            <DeleteIcon fontSize="small" />
                                                                        )}
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                            {/* Subcategories */}
                                                            {category.subcategories && category.subcategories.length > 0 && (
                                                                <TableRow>
                                                                    <TableCell colSpan={4} sx={{ p: 0, borderBottom: 'none' }}>
                                                                        <Collapse in={expandedCategories.has(category._id)}>
                                                                            <Box sx={{ pl: 4, py: 1, background: 'rgba(30, 144, 255, 0.03)' }}>
                                                                                {category.subcategories.map((sub) => (
                                                                                    <Box
                                                                                        key={sub._id}
                                                                                        sx={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'space-between',
                                                                                            py: 1,
                                                                                            px: 2,
                                                                                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                                                                                        }}
                                                                                    >
                                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                            <SubdirectoryArrowRightIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }} />
                                                                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                                                                                {sub.name}
                                                                                            </Typography>
                                                                                        </Box>
                                                                                        <Box>
                                                                                            <IconButton size="small" onClick={() => handleEditClick(sub, true)} sx={{ color: '#1e90ff', mr: 0.5 }}>
                                                                                                <EditIcon fontSize="small" />
                                                                                            </IconButton>
                                                                                            <IconButton
                                                                                                size="small"
                                                                                                onClick={() => handleDeleteClick(sub._id, sub.name, true)}
                                                                                                disabled={deleteLoading === sub._id}
                                                                                                sx={{ color: '#ff4444' }}
                                                                                            >
                                                                                                {deleteLoading === sub._id ? (
                                                                                                    <CircularProgress size={16} sx={{ color: '#ff4444' }} />
                                                                                                ) : (
                                                                                                    <DeleteIcon fontSize="small" />
                                                                                                )}
                                                                                            </IconButton>
                                                                                        </Box>
                                                                                    </Box>
                                                                                ))}
                                                                            </Box>
                                                                        </Collapse>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </>
                                                    ))}
                                                </AnimatePresence>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </MotionBox>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            {/* Edit Category Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={() => { setEditDialogOpen(false); setEditCategory(null); }}
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
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Edit {editCategory?.isSubcategory ? 'Subcategory' : 'Category'}
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {editCategory && (
                        <Box>
                            {/* Name */}
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, display: 'block' }}>
                                Name *
                            </Typography>
                            <TextField
                                fullWidth
                                value={editCategory.name}
                                onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                                sx={{ ...inputStyles, mb: 2.5 }}
                            />

                            {/* Description */}
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, display: 'block' }}>
                                Description
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                value={editCategory.description}
                                onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                                sx={{ ...inputStyles, mb: 2.5 }}
                            />

                            {/* Image Upload */}
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, display: 'block' }}>
                                Category Image
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="edit-category-image-upload"
                                    type="file"
                                    onChange={handleEditImageUpload}
                                    disabled={editImageUploading}
                                />
                                <label htmlFor="edit-category-image-upload">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        fullWidth
                                        disabled={editImageUploading}
                                        startIcon={editImageUploading ? <CircularProgress size={20} sx={{ color: '#1e90ff' }} /> : <CloudUploadIcon />}
                                        sx={{
                                            py: 1.5,
                                            borderColor: 'rgba(30, 144, 255, 0.3)',
                                            color: '#1e90ff',
                                            '&:hover': {
                                                borderColor: '#1e90ff',
                                                background: 'rgba(30, 144, 255, 0.1)',
                                            },
                                        }}
                                    >
                                        {editImageUploading ? 'Uploading...' : 'Upload New Image'}
                                    </Button>
                                </label>
                            </Box>

                            {/* OR Divider */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                                <Typography variant="caption" sx={{ px: 2, color: 'rgba(255,255,255,0.4)' }}>OR</Typography>
                                <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                            </Box>

                            {/* Image URL Input */}
                            <TextField
                                fullWidth
                                placeholder="Paste image URL here..."
                                value={editCategory.image}
                                onChange={(e) => setEditCategory({ ...editCategory, image: e.target.value })}
                                sx={{ ...inputStyles, mb: 2 }}
                                InputProps={{
                                    startAdornment: <ImageIcon sx={{ color: 'rgba(255,255,255,0.4)', mr: 1 }} />,
                                }}
                            />

                            {/* Image Preview */}
                            {editCategory.image && (
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                            Preview
                                        </Typography>
                                        <Button
                                            size="small"
                                            onClick={() => setEditCategory({ ...editCategory, image: '' })}
                                            sx={{ color: '#ff4444', fontSize: '0.7rem' }}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 150,
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            border: '1px solid rgba(30, 144, 255, 0.2)',
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={editCategory.image}
                                            alt="Category preview"
                                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e: any) => {
                                                e.target.src = 'https://via.placeholder.com/300x150?text=Invalid+Image';
                                            }}
                                        />
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(30, 144, 255, 0.2)' }}>
                    <Button
                        onClick={() => { setEditDialogOpen(false); setEditCategory(null); }}
                        sx={{ color: 'rgba(255,255,255,0.6)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleEditSave}
                        disabled={editLoading || !editCategory?.name}
                        startIcon={editLoading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : null}
                        sx={{
                            background: 'linear-gradient(135deg, #1e3a5f 0%, #1e90ff 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #2d5a87 0%, #00bfff 100%)',
                            },
                        }}
                    >
                        {editLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => { setDeleteDialogOpen(false); setDeleteCategory(null); }}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        ...glassCardStyles,
                        background: 'rgba(10, 15, 30, 0.95)',
                    },
                }}
            >
                <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 68, 68, 0.2)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#ff4444' }}>
                        Confirm Delete
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Are you sure you want to delete the {deleteCategory?.isSubcategory ? 'subcategory' : 'category'}{' '}
                        <strong style={{ color: '#ff4444' }}>"{deleteCategory?.name}"</strong>?
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 2 }}>
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 68, 68, 0.2)' }}>
                    <Button
                        onClick={() => { setDeleteDialogOpen(false); setDeleteCategory(null); }}
                        sx={{ color: 'rgba(255,255,255,0.6)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleDeleteConfirm}
                        disabled={deleteLoading !== null}
                        startIcon={deleteLoading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : <DeleteIcon />}
                        sx={{
                            background: 'linear-gradient(135deg, #8B0000 0%, #ff4444 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #A52A2A 0%, #ff6666 100%)',
                            },
                        }}
                    >
                        {deleteLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AddCategoryPage;
