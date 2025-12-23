import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Drawer,
    IconButton,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PeopleIcon from '@mui/icons-material/People';
import CloseIcon from '@mui/icons-material/Close';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.jpg';

const glassCardStyles = {
    background: 'rgba(10, 15, 30, 0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(30, 144, 255, 0.15)',
};

const sidebarItems = [
    { icon: <DashboardIcon />, label: 'Dashboard', path: '/admin' },
    { icon: <AddBoxIcon />, label: 'Add Product', path: '/admin/add-product' },
    { icon: <CategoryIcon />, label: 'Add Category', path: '/admin/add-category' },
    { icon: <InventoryIcon />, label: 'View Products', path: '/admin/products' },
    { icon: <ShoppingBagIcon />, label: 'View Orders', path: '/admin/orders' },
    { icon: <PeopleIcon />, label: 'View Users', path: '/admin/users' },
];

interface AdminSidebarProps {
    isMobile: boolean;
    isOpen: boolean;
    onClose: () => void;
    width?: number;
}

const SidebarContent = ({ activeItem, onItemClick }: { activeItem: string; onItemClick?: () => void }) => (
    <List>
        {sidebarItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                    component={RouterLink}
                    to={item.path}
                    onClick={onItemClick}
                    sx={{
                        borderRadius: 2,
                        background: activeItem === item.path ? 'rgba(30, 144, 255, 0.15)' : 'transparent',
                        border: activeItem === item.path ? '1px solid rgba(30, 144, 255, 0.3)' : '1px solid transparent',
                        '&:hover': {
                            background: 'rgba(30, 144, 255, 0.1)',
                        },
                    }}
                >
                    <ListItemIcon sx={{ color: activeItem === item.path ? '#1e90ff' : 'rgba(255,255,255,0.6)', minWidth: 40 }}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={item.label}
                        sx={{
                            '& .MuiTypography-root': {
                                color: activeItem === item.path ? '#1e90ff' : 'rgba(255,255,255,0.8)',
                                fontWeight: activeItem === item.path ? 600 : 400,
                                fontSize: '0.9rem',
                            },
                        }}
                    />
                </ListItemButton>
            </ListItem>
        ))}
    </List>
);

const AdminSidebar = ({ isMobile, isOpen, onClose, width = 240 }: AdminSidebarProps) => {
    const location = useLocation();
    const currentPath = location.pathname;

    if (isMobile) {
        return (
            <Drawer
                anchor="left"
                open={isOpen}
                onClose={onClose}
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
                        <IconButton onClick={onClose} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <SidebarContent activeItem={currentPath} onItemClick={onClose} />
                </Box>
            </Drawer>
        );
    }

    return (
        <Box
            sx={{
                width,
                minHeight: 'calc(100vh - 80px)',
                ...glassCardStyles,
                borderRadius: 0,
                borderTop: 'none',
                borderBottom: 'none',
                borderLeft: 'none',
                p: 2,
            }}
        >
            <SidebarContent activeItem={currentPath} />
        </Box>
    );
};

export default AdminSidebar;
