import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    TextField,
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
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    Pagination,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
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
    { icon: <AddBoxIcon />, label: 'Add Product', path: '/admin/add-product' },
    { icon: <CategoryIcon />, label: 'Add Category', path: '/admin/add-category' },
    { icon: <InventoryIcon />, label: 'View Products', path: '/admin/products' },
    { icon: <ShoppingBagIcon />, label: 'View Orders', path: '/admin/orders' },
    { icon: <PeopleIcon />, label: 'View Users', path: '/admin/users', active: true },
];

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    location?: string;
    createdAt: string;
}

// Role chip styles
const getRoleChip = (role: string) => {
    const roleConfig: { [key: string]: { color: string; bgcolor: string } } = {
        'admin': { color: '#ff4444', bgcolor: 'rgba(255, 68, 68, 0.15)' },
        'user': { color: '#1e90ff', bgcolor: 'rgba(30, 144, 255, 0.15)' },
    };

    const config = roleConfig[role] || roleConfig['user'];
    const displayRole = role === 'admin' ? 'Admin' : 'Customer';

    return (
        <Chip
            label={displayRole}
            size="small"
            sx={{
                bgcolor: config.bgcolor,
                color: config.color,
                fontWeight: 600,
                fontSize: '0.7rem',
            }}
        />
    );
};

const ViewUsersPage = () => {
    const navigate = useNavigate();
    const [stars] = useState(() => generateStars(60));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('View Users');
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Edit dialog
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    // Current admin user
    const [currentUser, setCurrentUser] = useState<{ name: string; role: string } | null>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const sidebarWidth = 240;

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setCurrentUser(JSON.parse(userStr));
            } catch {
                setCurrentUser(null);
            }
        }
        fetchUsers();
    }, [page]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/users?page=${page}&limit=10`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setUsers(data.data);
                setTotalUsers(data.total);
                setTotalPages(data.pages || 1);
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    // Filter users
    const filteredUsers = users.filter((user) => {
        const matchesSearch = user._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role === roleFilter.toLowerCase();
        return matchesSearch && matchesRole;
    });

    const handleDeleteClick = (user: User) => {
        setDeleteUser(user);
        setDeleteDialogOpen(true);
    };

    const handleEditClick = (user: User) => {
        setEditUser({ ...user });
        setEditDialogOpen(true);
    };

    const handleEditSave = async () => {
        if (!editUser) return;
        setEditLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/users/${editUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: editUser.name,
                    email: editUser.email,
                    role: editUser.role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update user');
            }

            setSuccess('User updated successfully!');
            setEditDialogOpen(false);
            fetchUsers();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update user');
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteUser) return;
        setDeleteLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/users/${deleteUser._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete user');
            }

            setSuccess('User deleted successfully!');
            setDeleteDialogOpen(false);
            fetchUsers();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete user');
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

    // Stats
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const customerUsers = users.filter(u => u.role === 'user').length;

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
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#ff4444' }}>
                            {currentUser ? getInitials(currentUser.name) : 'A'}
                        </Avatar>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{currentUser?.name || 'Admin'}</Typography>
                            <Typography variant="caption" sx={{ color: '#1e90ff' }}>{currentUser?.role || 'admin'}</Typography>
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
                                            '&:hover': {
                                                background: 'rgba(30, 144, 255, 0.1)',
                                            },
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
                            <PeopleIcon sx={{ fontSize: { xs: 30, md: 40 }, color: '#1e90ff' }} />
                            VIEW USERS
                        </Typography>
                    </MotionBox>

                    {/* Alerts */}
                    {error && (
                        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3, background: 'rgba(211, 47, 47, 0.1)', color: '#ff6b6b' }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 3, background: 'rgba(46, 125, 50, 0.1)', color: '#69f0ae' }}>
                            {success}
                        </Alert>
                    )}

                    {/* Stats Cards */}
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {[
                            { label: 'Total Users', value: totalUsers, color: '#1e90ff', icon: <PersonIcon /> },
                            { label: 'Admins', value: adminUsers, color: '#ff4444', icon: <AdminPanelSettingsIcon /> },
                            { label: 'Customers', value: customerUsers, color: '#00c853', icon: <VerifiedUserIcon /> },
                        ].map((stat, index) => (
                            <Grid item xs={6} md={4} key={stat.label}>
                                <MotionBox
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 * index }}
                                    sx={{
                                        ...glassCardStyles,
                                        p: 2,
                                        textAlign: 'center',
                                    }}
                                >
                                    <Box sx={{ color: stat.color, mb: 1 }}>{stat.icon}</Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color, mb: 0.5 }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        {stat.label}
                                    </Typography>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Search and Filter */}
                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        sx={{ ...glassCardStyles, p: 3, mb: 3 }}
                    >
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={5}>
                                <TextField
                                    fullWidth
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    sx={inputStyles}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <FormControl fullWidth sx={inputStyles}>
                                    <Select
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        sx={{ color: 'white' }}
                                    >
                                        <MenuItem value="All">All Roles</MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
                                        <MenuItem value="user">Customer</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', textAlign: { md: 'right' } }}>
                                    Showing {filteredUsers.length} of {totalUsers} users
                                </Typography>
                            </Grid>
                        </Grid>
                    </MotionBox>

                    {/* Users Table */}
                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        sx={{ ...glassCardStyles, p: 3 }}
                    >
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress sx={{ color: '#1e90ff' }} />
                            </Box>
                        ) : (
                            <>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(30, 144, 255, 0.2)', fontWeight: 600 }}>
                                                    User
                                                </TableCell>
                                                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(30, 144, 255, 0.2)', fontWeight: 600, display: { xs: 'none', md: 'table-cell' } }}>
                                                    Role
                                                </TableCell>
                                                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(30, 144, 255, 0.2)', fontWeight: 600, display: { xs: 'none', sm: 'table-cell' } }}>
                                                    Joined
                                                </TableCell>
                                                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(30, 144, 255, 0.2)', fontWeight: 600 }}>
                                                    Actions
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredUsers.map((user) => (
                                                <TableRow
                                                    key={user._id}
                                                    sx={{
                                                        '&:hover': { background: 'rgba(30, 144, 255, 0.05)' },
                                                        transition: 'background 0.2s ease',
                                                    }}
                                                >
                                                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                            <Avatar sx={{ width: 36, height: 36, bgcolor: user.role === 'admin' ? '#ff4444' : '#1e90ff', fontSize: '0.9rem' }}>
                                                                {getInitials(user.name)}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.name}</Typography>
                                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{user.email}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', display: { xs: 'none', md: 'table-cell' } }}>
                                                        {getRoleChip(user.role)}
                                                    </TableCell>
                                                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: { xs: 'none', sm: 'table-cell' } }}>
                                                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </TableCell>
                                                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleEditClick(user)}
                                                            sx={{
                                                                color: '#1e90ff',
                                                                mr: 0.5,
                                                                '&:hover': { background: 'rgba(30, 144, 255, 0.1)' },
                                                            }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteClick(user)}
                                                            sx={{
                                                                color: '#ff4444',
                                                                '&:hover': { background: 'rgba(255, 68, 68, 0.1)' },
                                                            }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                        <Pagination
                                            count={totalPages}
                                            page={page}
                                            onChange={(_, value) => setPage(value)}
                                            sx={{
                                                '& .MuiPaginationItem-root': {
                                                    color: 'rgba(255,255,255,0.7)',
                                                    borderColor: 'rgba(30, 144, 255, 0.3)',
                                                    '&.Mui-selected': {
                                                        background: 'rgba(30, 144, 255, 0.2)',
                                                        color: '#1e90ff',
                                                        borderColor: '#1e90ff',
                                                    },
                                                    '&:hover': {
                                                        background: 'rgba(30, 144, 255, 0.1)',
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>
                                )}
                            </>
                        )}
                    </MotionBox>
                </Box>
            </Box>

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
                    Delete User
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "<strong>{deleteUser?.name}</strong>"? This action cannot be undone.
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

            {/* Edit User Dialog */}
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
                    Edit User
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {editUser && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    value={editUser.name}
                                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                    sx={inputStyles}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={editUser.email}
                                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                    sx={inputStyles}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth sx={inputStyles}>
                                    <Select
                                        value={editUser.role}
                                        onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                                        sx={{ color: 'white' }}
                                    >
                                        <MenuItem value="user">Customer</MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
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
        </Box>
    );
};

export default ViewUsersPage;
