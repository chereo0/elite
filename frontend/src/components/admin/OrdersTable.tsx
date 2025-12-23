import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

const MotionBox = motion(Box);

interface Order {
    id: string;
    customer: string;
    total: string;
    date: string;
}

interface OrdersTableProps {
    orders: Order[];
    title?: string;
    delay?: number;
}

const glassCardStyles = {
    background: 'rgba(10, 15, 30, 0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(30, 144, 255, 0.15)',
    borderRadius: 3,
};

const OrdersTable = ({ orders, title = 'Latest Orders', delay = 0 }: OrdersTableProps) => {
    return (
        <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay }}
            sx={{ ...glassCardStyles, p: 3 }}
        >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, letterSpacing: '0.1em', color: 'white' }}>
                {title}
            </Typography>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(30, 144, 255, 0.2)' }}>
                                Order ID
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(30, 144, 255, 0.2)' }}>
                                Customer
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(30, 144, 255, 0.2)' }}>
                                Total
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(30, 144, 255, 0.2)' }}>
                                Order Date
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} sx={{ '&:hover': { background: 'rgba(30, 144, 255, 0.05)' } }}>
                                <TableCell sx={{ color: '#1e90ff', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                                    {order.id}
                                </TableCell>
                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    {order.customer}
                                </TableCell>
                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    {order.total}
                                </TableCell>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    {order.date}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button
                component={RouterLink}
                to="/admin/orders"
                fullWidth
                variant="outlined"
                sx={{
                    mt: 2,
                    borderColor: 'rgba(30, 144, 255, 0.3)',
                    color: 'rgba(255,255,255,0.7)',
                    '&:hover': {
                        borderColor: '#1e90ff',
                        background: 'rgba(30, 144, 255, 0.1)',
                    },
                }}
            >
                View All Orders
            </Button>
        </MotionBox>
    );
};

export default OrdersTable;
