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
    IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const MotionBox = motion(Box);

interface User {
    id: string;
    email: string;
}

interface UsersTableProps {
    users: User[];
    title?: string;
    delay?: number;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const glassCardStyles = {
    background: 'rgba(10, 15, 30, 0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(30, 144, 255, 0.15)',
    borderRadius: 3,
};

const UsersTable = ({ users, title = 'Latest Users', delay = 0, onEdit, onDelete }: UsersTableProps) => {
    return (
        <MotionBox
            initial={{ opacity: 0, x: 20 }}
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
                                User ID
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(30, 144, 255, 0.2)' }}>
                                Email
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(30, 144, 255, 0.2)' }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={`${user.id}-${index}`} sx={{ '&:hover': { background: 'rgba(30, 144, 255, 0.05)' } }}>
                                <TableCell sx={{ color: '#1e90ff', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    {user.id}
                                </TableCell>
                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    {user.email}
                                </TableCell>
                                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => onEdit?.(user.id)}
                                        sx={{
                                            mr: 0.5,
                                            color: '#1e90ff',
                                            '&:hover': { background: 'rgba(30, 144, 255, 0.1)' },
                                        }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => onDelete?.(user.id)}
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
            <Button
                component={RouterLink}
                to="/admin/users"
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
                View All Users
            </Button>
        </MotionBox>
    );
};

export default UsersTable;
