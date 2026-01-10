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
    InputAdornment,
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
    Chip,
    Checkbox,
    ListItemText as MuiListItemText,
    OutlinedInput,
    Autocomplete,
    Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SearchIcon from '@mui/icons-material/Search';
import PaletteIcon from '@mui/icons-material/Palette';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { API_URL } from '../config/api';

const MotionBox = motion(Box);

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
    { icon: <AddBoxIcon />, label: 'Add Product', path: '/admin/add-product', active: true },
    { icon: <CategoryIcon />, label: 'Add Category', path: '/admin/add-category' },
    { icon: <ShoppingBagIcon />, label: 'View Orders', path: '/admin/orders' },
    { icon: <PeopleIcon />, label: 'View Users', path: '/admin/users' },
];

const availableClothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const availableShoeSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];

// Single colors
const singleColors = [
    'Black', 'White', 'Navy', 'Gray', 'Red', 'Blue', 'Green', 'Brown', 'Beige',
    'Pink', 'Purple', 'Orange', 'Yellow', 'Teal', 'Maroon', 'Olive', 'Coral',
    'Turquoise', 'Gold', 'Silver', 'Cream', 'Burgundy', 'Khaki', 'Charcoal'
];

// Mixed/Combined colors
const mixedColors = [
    'Black & White', 'White & Black', 'Black & Red', 'Black & Blue', 'Black & Gold',
    'White & Blue', 'White & Red', 'White & Green', 'White & Pink', 'White & Navy',
    'Navy & White', 'Navy & Red', 'Navy & Gold', 'Navy & Gray',
    'Red & White', 'Red & Black', 'Red & Blue', 'Red & Gold',
    'Blue & White', 'Blue & Black', 'Blue & Red', 'Blue & Yellow',
    'Green & White', 'Green & Black', 'Green & Gold', 'Green & Yellow',
    'Gray & White', 'Gray & Black', 'Gray & Blue', 'Gray & Red',
    'Pink & White', 'Pink & Black', 'Pink & Gray',
    'Brown & Beige', 'Brown & White', 'Brown & Gold',
    'Purple & White', 'Purple & Black', 'Purple & Gold',
    'Orange & Black', 'Orange & White', 'Orange & Blue',
    'Yellow & Black', 'Yellow & White', 'Yellow & Blue',
    'Teal & White', 'Teal & Black', 'Teal & Gold',
    'Gold & Black', 'Gold & White', 'Silver & Black', 'Silver & White'
];

// All available colors (single + mixed)
const availableColors = [...singleColors, ...mixedColors];

// Color hex values for preview
const colorHexMap: { [key: string]: string | string[] } = {
    'Black': '#000000', 'White': '#FFFFFF', 'Navy': '#001F3F', 'Gray': '#808080',
    'Red': '#FF0000', 'Blue': '#0000FF', 'Green': '#008000', 'Brown': '#8B4513',
    'Beige': '#F5F5DC', 'Pink': '#FFC0CB', 'Purple': '#800080', 'Orange': '#FFA500',
    'Yellow': '#FFFF00', 'Teal': '#008080', 'Maroon': '#800000', 'Olive': '#808000',
    'Coral': '#FF7F50', 'Turquoise': '#40E0D0', 'Gold': '#FFD700', 'Silver': '#C0C0C0',
    'Cream': '#FFFDD0', 'Burgundy': '#800020', 'Khaki': '#C3B091', 'Charcoal': '#36454F'
};

// Get color preview for display
const getColorPreview = (colorName: string): string[] => {
    if (colorName.includes(' & ')) {
        const parts = colorName.split(' & ');
        return parts.map(p => colorHexMap[p] as string || '#CCCCCC');
    }
    return [colorHexMap[colorName] as string || '#CCCCCC'];
};

interface Subcategory {
    _id: string;
    name: string;
    description?: string;
    parent: string;
}

interface Category {
    _id: string;
    name: string;
    description?: string;
    subcategories?: Subcategory[];
}

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

const AddProductPage = () => {
    const navigate = useNavigate();
    const [stars] = useState(() => generateStars(60));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // User state
    const [user, setUser] = useState<User | null>(null);

    // Categories from API
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        image: '',
    });
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [sizeType, setSizeType] = useState<'clothing' | 'shoes'>('clothing');
    const [selectedColors, setSelectedColors] = useState<string[]>([]);

    // Form submission state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const sidebarWidth = 240;

    // Load user and categories on mount
    useEffect(() => {
        // Get user from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch {
                setUser(null);
            }
        }

        // Fetch categories
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

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleAdditionalImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setAdditionalImageFiles(prev => [...prev, ...newFiles]);
            // Create preview URLs
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setAdditionalImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const handleRemoveAdditionalImage = (index: number) => {
        setAdditionalImageFiles(prev => prev.filter((_, i) => i !== index));
        setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSizeTypeChange = (newSizeType: 'clothing' | 'shoes') => {
        setSizeType(newSizeType);
        setSelectedSizes([]); // Reset sizes when type changes
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        setUploadProgress(0);

        // Validation
        if (!formData.name || !formData.category || !formData.price || !formData.stock || !formData.description) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        if (!imageFile) {
            setError('Please upload a product image');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            
            // Step 1: Upload main image
            setUploadProgress(10);
            const mainImageFormData = new FormData();
            mainImageFormData.append('image', imageFile);
            
            const mainImageResponse = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: mainImageFormData,
            });
            
            if (!mainImageResponse.ok) {
                throw new Error('Failed to upload main image');
            }
            
            const mainImageData = await mainImageResponse.json();
            const mainImageUrl = mainImageData.data.url;
            setUploadProgress(40);
            
            // Step 2: Upload additional images
            const additionalImageUrls: string[] = [];
            if (additionalImageFiles.length > 0) {
                for (let i = 0; i < additionalImageFiles.length; i++) {
                    const additionalFormData = new FormData();
                    additionalFormData.append('image', additionalImageFiles[i]);
                    
                    const additionalResponse = await fetch(`${API_URL}/upload`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        body: additionalFormData,
                    });
                    
                    if (additionalResponse.ok) {
                        const additionalData = await additionalResponse.json();
                        additionalImageUrls.push(additionalData.data.url);
                    }
                    setUploadProgress(40 + ((i + 1) / additionalImageFiles.length) * 30);
                }
            } else {
                setUploadProgress(70);
            }
            
            // Step 3: Create product with image URLs
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    brand: formData.brand,
                    price: parseFloat(formData.price),
                    category: formData.category,
                    image: mainImageUrl,
                    images: additionalImageUrls,
                    stock: parseInt(formData.stock),
                    sizes: selectedSizes,
                    sizeType: sizeType,
                    colors: selectedColors,
                }),
            });

            setUploadProgress(90);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create product');
            }

            setUploadProgress(100);
            setSuccess('Product created successfully!');

            // Reset form
            setFormData({
                name: '',
                brand: '',
                category: '',
                price: '',
                stock: '',
                description: '',
                image: '',
            });
            setSelectedSizes([]);
            setSizeType('clothing');
            setSelectedColors([]);
            setImagePreview(null);
            setImageFile(null);
            setAdditionalImageFiles([]);
            setAdditionalImagePreviews([]);

            // Redirect after delay
            setTimeout(() => {
                navigate('/admin');
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create product');
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth');
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

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
                                '&:hover': {
                                    background: 'rgba(30, 144, 255, 0.1)',
                                },
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
                {/* Logo */}
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

                {/* User Profile */}
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
                    <Container maxWidth="lg">
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
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <AddBoxIcon sx={{ color: '#1e90ff', fontSize: 35 }} />
                                Add New Product
                            </Typography>
                        </MotionBox>

                        {/* Alerts */}
                        {error && (
                            <Alert severity="error" sx={{ mb: 3, background: 'rgba(211, 47, 47, 0.1)', color: '#ff6b6b' }}>
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert
                                severity="success"
                                icon={<CheckCircleIcon />}
                                sx={{ mb: 3, background: 'rgba(46, 125, 50, 0.1)', color: '#69f0ae' }}
                            >
                                {success}
                            </Alert>
                        )}

                        {/* Form */}
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ ...glassCardStyles, p: { xs: 3, md: 4 } }}
                        >
                            <Grid container spacing={3}>
                                {/* Image Upload */}
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                                        Product Image *
                                    </Typography>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            aspectRatio: '1',
                                            border: '2px dashed rgba(30, 144, 255, 0.3)',
                                            borderRadius: 3,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            background: imagePreview ? 'transparent' : 'rgba(30, 144, 255, 0.05)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                borderColor: '#1e90ff',
                                                background: 'rgba(30, 144, 255, 0.1)',
                                            },
                                        }}
                                        component="label"
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleImageUpload}
                                        />
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        ) : (
                                            <>
                                                <AddPhotoAlternateIcon sx={{ fontSize: 50, color: 'rgba(30, 144, 255, 0.5)', mb: 1 }} />
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                    Click to upload image
                                                </Typography>
                                            </>
                                        )}
                                    </Box>

                                    {/* Additional Images Upload */}
                                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 3, mb: 2 }}>
                                        Additional Images (for product gallery)
                                    </Typography>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            minHeight: 80,
                                            border: '2px dashed rgba(30, 144, 255, 0.3)',
                                            borderRadius: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            p: 2,
                                            background: 'rgba(30, 144, 255, 0.05)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                borderColor: '#1e90ff',
                                                background: 'rgba(30, 144, 255, 0.1)',
                                            },
                                        }}
                                        component="label"
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            hidden
                                            onChange={handleAdditionalImagesUpload}
                                        />
                                        <AddPhotoAlternateIcon sx={{ fontSize: 30, color: 'rgba(30, 144, 255, 0.5)', mb: 0.5 }} />
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                            Click to add more images
                                        </Typography>
                                    </Box>

                                    {/* Additional Images Preview */}
                                    {additionalImagePreviews.length > 0 && (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                            {additionalImagePreviews.map((img, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        position: 'relative',
                                                        width: 70,
                                                        height: 70,
                                                        borderRadius: 1,
                                                        overflow: 'hidden',
                                                        border: '1px solid rgba(30, 144, 255, 0.3)',
                                                    }}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`Additional ${index + 1}`}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemoveAdditionalImage(index)}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 2,
                                                            right: 2,
                                                            background: 'rgba(0,0,0,0.6)',
                                                            padding: '2px',
                                                            '&:hover': { background: 'rgba(255,0,0,0.6)' },
                                                        }}
                                                    >
                                                        <DeleteIcon sx={{ fontSize: 14, color: 'white' }} />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </Grid>

                                {/* Form Fields */}
                                <Grid item xs={12} md={8}>
                                    <Grid container spacing={2}>
                                        {/* Product Name */}
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Product Name *"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                sx={inputStyles}
                                            />
                                        </Grid>

                                        {/* Brand */}
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Brand"
                                                placeholder="e.g. Nike, Adidas"
                                                value={formData.brand}
                                                onChange={(e) => handleInputChange('brand', e.target.value)}
                                                sx={inputStyles}
                                            />
                                        </Grid>

                                        {/* Category */}
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth sx={inputStyles}>
                                                <InputLabel>Category *</InputLabel>
                                                <Select
                                                    value={formData.category}
                                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                                    label="Category *"
                                                    disabled={categoriesLoading}
                                                >
                                                    {categoriesLoading ? (
                                                        <MenuItem disabled>Loading categories...</MenuItem>
                                                    ) : categories.length === 0 ? (
                                                        <MenuItem disabled>No categories found. Add categories first.</MenuItem>
                                                    ) : (
                                                        categories.flatMap((cat) => [
                                                            <MenuItem
                                                                key={cat._id}
                                                                value={cat._id}
                                                                sx={{ fontWeight: 600 }}
                                                            >
                                                                {cat.name}
                                                            </MenuItem>,
                                                            ...(cat.subcategories?.map((sub) => (
                                                                <MenuItem
                                                                    key={sub._id}
                                                                    value={sub._id}
                                                                    sx={{ pl: 4, color: 'rgba(255,255,255,0.7)' }}
                                                                >
                                                                    ↳ {sub.name}
                                                                </MenuItem>
                                                            )) || [])
                                                        ])
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Price */}
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Price *"
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => handleInputChange('price', e.target.value)}
                                                sx={inputStyles}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AttachMoneyIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        {/* Stock */}
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Stock Quantity *"
                                                type="number"
                                                value={formData.stock}
                                                onChange={(e) => handleInputChange('stock', e.target.value)}
                                                sx={inputStyles}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <InventoryIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        {/* Size Type Toggle */}
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                                Size Type
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    variant={sizeType === 'clothing' ? 'contained' : 'outlined'}
                                                    onClick={() => handleSizeTypeChange('clothing')}
                                                    sx={{
                                                        flex: 1,
                                                        borderColor: 'rgba(30, 144, 255, 0.3)',
                                                        color: sizeType === 'clothing' ? 'white' : 'rgba(255,255,255,0.7)',
                                                        background: sizeType === 'clothing' ? 'rgba(30, 144, 255, 0.3)' : 'transparent',
                                                        '&:hover': {
                                                            borderColor: '#1e90ff',
                                                            background: 'rgba(30, 144, 255, 0.2)',
                                                        },
                                                    }}
                                                >
                                                    Clothes/Jeans
                                                </Button>
                                                <Button
                                                    variant={sizeType === 'shoes' ? 'contained' : 'outlined'}
                                                    onClick={() => handleSizeTypeChange('shoes')}
                                                    sx={{
                                                        flex: 1,
                                                        borderColor: 'rgba(30, 144, 255, 0.3)',
                                                        color: sizeType === 'shoes' ? 'white' : 'rgba(255,255,255,0.7)',
                                                        background: sizeType === 'shoes' ? 'rgba(30, 144, 255, 0.3)' : 'transparent',
                                                        '&:hover': {
                                                            borderColor: '#1e90ff',
                                                            background: 'rgba(30, 144, 255, 0.2)',
                                                        },
                                                    }}
                                                >
                                                    Shoes
                                                </Button>
                                            </Box>
                                        </Grid>

                                        {/* Sizes */}
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth sx={inputStyles}>
                                                <InputLabel>{sizeType === 'shoes' ? 'Shoe Sizes' : 'Clothing Sizes'}</InputLabel>
                                                <Select
                                                    multiple
                                                    value={selectedSizes}
                                                    onChange={(e) => setSelectedSizes(e.target.value as string[])}
                                                    input={<OutlinedInput label={sizeType === 'shoes' ? 'Shoe Sizes' : 'Clothing Sizes'} />}
                                                    renderValue={(selected) => (
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                            {selected.map((value) => (
                                                                <Chip key={value} label={value} size="small" sx={{ bgcolor: 'rgba(30, 144, 255, 0.2)', color: 'white' }} />
                                                            ))}
                                                        </Box>
                                                    )}
                                                >
                                                    {(sizeType === 'shoes' ? availableShoeSizes : availableClothingSizes).map((size) => (
                                                        <MenuItem key={size} value={size}>
                                                            <Checkbox checked={selectedSizes.includes(size)} sx={{ color: 'rgba(30, 144, 255, 0.5)' }} />
                                                            <MuiListItemText primary={size} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Colors with Search */}
                                        <Grid item xs={12}>
                                            <Autocomplete
                                                multiple
                                                options={availableColors}
                                                value={selectedColors}
                                                onChange={(_, newValue) => setSelectedColors(newValue)}
                                                groupBy={(option) => option.includes(' & ') ? 'Mixed Colors' : 'Single Colors'}
                                                filterOptions={(options, { inputValue }) => {
                                                    const filterValue = inputValue.toLowerCase();
                                                    return options.filter(option =>
                                                        option.toLowerCase().includes(filterValue)
                                                    );
                                                }}
                                                PaperComponent={(props) => (
                                                    <Paper
                                                        {...props}
                                                        sx={{
                                                            background: 'rgba(10, 15, 30, 0.95)',
                                                            backdropFilter: 'blur(20px)',
                                                            border: '1px solid rgba(30, 144, 255, 0.3)',
                                                            '& .MuiAutocomplete-groupLabel': {
                                                                background: 'rgba(30, 144, 255, 0.15)',
                                                                color: '#1e90ff',
                                                                fontWeight: 600,
                                                            },
                                                            '& .MuiAutocomplete-option': {
                                                                color: 'white',
                                                                '&:hover': {
                                                                    background: 'rgba(30, 144, 255, 0.1)',
                                                                },
                                                                '&[aria-selected="true"]': {
                                                                    background: 'rgba(30, 144, 255, 0.2)',
                                                                },
                                                            },
                                                        }}
                                                    />
                                                )}
                                                renderOption={(props, option, { selected }) => {
                                                    const colors = getColorPreview(option);
                                                    return (
                                                        <li {...props}>
                                                            <Checkbox
                                                                checked={selected}
                                                                sx={{ color: 'rgba(30, 144, 255, 0.5)', mr: 1 }}
                                                            />
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                {colors.length === 1 ? (
                                                                    <Box
                                                                        sx={{
                                                                            width: 20,
                                                                            height: 20,
                                                                            borderRadius: '50%',
                                                                            bgcolor: colors[0],
                                                                            border: '2px solid rgba(255,255,255,0.3)',
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <Box
                                                                        sx={{
                                                                            width: 20,
                                                                            height: 20,
                                                                            borderRadius: '50%',
                                                                            background: `linear-gradient(135deg, ${colors[0]} 50%, ${colors[1]} 50%)`,
                                                                            border: '2px solid rgba(255,255,255,0.3)',
                                                                        }}
                                                                    />
                                                                )}
                                                                <Typography sx={{ color: 'white' }}>{option}</Typography>
                                                            </Box>
                                                        </li>
                                                    );
                                                }}
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => {
                                                        const colors = getColorPreview(option);
                                                        return (
                                                            <Chip
                                                                {...getTagProps({ index })}
                                                                key={option}
                                                                label={
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                        {colors.length === 1 ? (
                                                                            <Box
                                                                                sx={{
                                                                                    width: 12,
                                                                                    height: 12,
                                                                                    borderRadius: '50%',
                                                                                    bgcolor: colors[0],
                                                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <Box
                                                                                sx={{
                                                                                    width: 12,
                                                                                    height: 12,
                                                                                    borderRadius: '50%',
                                                                                    background: `linear-gradient(135deg, ${colors[0]} 50%, ${colors[1]} 50%)`,
                                                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                                                }}
                                                                            />
                                                                        )}
                                                                        {option}
                                                                    </Box>
                                                                }
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: 'rgba(30, 144, 255, 0.2)',
                                                                    color: 'white',
                                                                    '& .MuiChip-deleteIcon': {
                                                                        color: 'rgba(255,255,255,0.5)',
                                                                        '&:hover': { color: 'white' },
                                                                    },
                                                                }}
                                                            />
                                                        );
                                                    })
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Colors"
                                                        placeholder="Search colors..."
                                                        sx={inputStyles}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: (
                                                                <>
                                                                    <InputAdornment position="start">
                                                                        <PaletteIcon sx={{ color: 'rgba(255,255,255,0.5)', ml: 1 }} />
                                                                    </InputAdornment>
                                                                    {params.InputProps.startAdornment}
                                                                </>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5, display: 'block' }}>
                                                Type to search • Select single colors or mixed combinations
                                            </Typography>
                                        </Grid>

                                        {/* Description */}
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Description *"
                                                multiline
                                                rows={4}
                                                value={formData.description}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Submit Button */}
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={loading}
                                        startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <CloudUploadIcon />}
                                        sx={{
                                            py: 1.5,
                                            px: 4,
                                            background: 'linear-gradient(135deg, #1e90ff 0%, #00bcd4 100%)',
                                            fontWeight: 600,
                                            letterSpacing: '0.1em',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #40a9ff 0%, #26c6da 100%)',
                                            },
                                            '&:disabled': {
                                                background: 'rgba(30, 144, 255, 0.3)',
                                            },
                                        }}
                                    >
                                        {loading ? 'Creating Product...' : 'Create Product'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </MotionBox>
                    </Container>
                </Box>
            </Box>
        </Box>
    );
};

export default AddProductPage;
