import { useState, useEffect } from 'react';
import { Box, Typography, Grid, useMediaQuery, useTheme, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

import {
    AdminHeader,
    AdminSidebar,
    AdminFooter,
    StatCard,
    OrdersTable,
    UsersTable,
    StarfieldBackground,
} from '../components/admin';
import { API_URL } from '../config/api';

const MotionBox = motion(Box);

interface DashboardStats {
    counts: {
        products: number;
        categories: number;
        orders: number;
        users: number;
    };
    latestUsers: Array<{
        _id: string;
        email: string;
        name: string;
        createdAt: string;
    }>;
    latestOrders: Array<{
        _id: string;
        totalAmount: number;
        createdAt: string;
        user?: { name: string; email: string };
    }>;
}

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userName, setUserName] = useState('Admin');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        // Get user name from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setUserName(user.name || 'Admin');
            } catch {
                setUserName('Admin');
            }
        }

        // Fetch dashboard stats
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = (id: string) => {
        console.log('Edit user:', id);
    };

    const handleDeleteUser = (id: string) => {
        console.log('Delete user:', id);
    };

    // Format orders for table
    const formattedOrders = stats?.latestOrders?.map((order) => ({
        id: `#${order._id.slice(-6).toUpperCase()}`,
        customer: order.user?.name || 'Guest',
        total: `$${order.totalAmount?.toFixed(2) || '0.00'}`,
        date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    })) || [];

    // Format users for table
    const formattedUsers = stats?.latestUsers?.map((user) => ({
        id: `#${user._id.slice(-6).toUpperCase()}`,
        email: user.email,
    })) || [];

    // Stats config with real data
    const statsConfig = [
        {
            icon: <CheckroomIcon sx={{ fontSize: 30 }} />,
            label: 'Total Products',
            value: stats?.counts?.products || 0,
            gradient: 'linear-gradient(135deg, #1e3a5f 0%, #1e90ff 100%)',
        },
        {
            icon: <CategoryOutlinedIcon sx={{ fontSize: 30 }} />,
            label: 'Total Categories',
            value: stats?.counts?.categories || 0,
            gradient: 'linear-gradient(135deg, #4a1e5f 0%, #9c27b0 100%)',
        },
        {
            icon: <ShoppingCartOutlinedIcon sx={{ fontSize: 30 }} />,
            label: 'Total Orders',
            value: stats?.counts?.orders || 0,
            gradient: 'linear-gradient(135deg, #1e5f3a 0%, #00c853 100%)',
        },
        {
            icon: <PeopleAltOutlinedIcon sx={{ fontSize: 30 }} />,
            label: 'Total Users',
            value: stats?.counts?.users || 0,
            gradient: 'linear-gradient(135deg, #5f4a1e 0%, #ffc107 100%)',
        },
    ];

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
            <StarfieldBackground starCount={80} />

            {/* Header */}
            <AdminHeader
                isMobile={isMobile}
                onMenuClick={() => setSidebarOpen(true)}
            />

            <Box sx={{ display: 'flex' }}>
                {/* Sidebar */}
                <AdminSidebar
                    isMobile={isMobile}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main Content */}
                <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
                    {/* Welcome Message */}
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
                                fontSize: { xs: '1.2rem', md: '1.6rem' },
                                color: 'white',
                            }}
                        >
                            WELCOME TO THE ADMIN DASHBOARD, <span style={{ color: '#1e90ff' }}>{userName.toUpperCase()}</span>.
                        </Typography>
                    </MotionBox>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress sx={{ color: '#1e90ff' }} />
                        </Box>
                    ) : (
                        <>
                            {/* Statistics Cards */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                {statsConfig.map((stat, index) => (
                                    <Grid item xs={12} sm={6} lg={3} key={stat.label}>
                                        <StatCard
                                            icon={stat.icon}
                                            label={stat.label}
                                            value={stat.value}
                                            gradient={stat.gradient}
                                            delay={0.1 * index}
                                        />
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Tables Section */}
                            <Grid container spacing={3}>
                                <Grid item xs={12} lg={6}>
                                    <OrdersTable orders={formattedOrders} delay={0.4} />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <UsersTable
                                        users={formattedUsers}
                                        delay={0.5}
                                        onEdit={handleEditUser}
                                        onDelete={handleDeleteUser}
                                    />
                                </Grid>
                            </Grid>
                        </>
                    )}

                    {/* Footer */}
                    <AdminFooter />
                </Box>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
