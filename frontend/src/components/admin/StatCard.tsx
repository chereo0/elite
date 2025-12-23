import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const MotionBox = motion(Box);

interface StatCardProps {
    icon: ReactNode;
    label: string;
    sublabel?: string;
    value: number;
    gradient: string;
    delay?: number;
}

const glassCardStyles = {
    background: 'rgba(10, 15, 30, 0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(30, 144, 255, 0.15)',
    borderRadius: 3,
};

const StatCard = ({ icon, label, sublabel, value, gradient, delay = 0 }: StatCardProps) => {
    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -5, scale: 1.02 }}
            sx={{
                ...glassCardStyles,
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: '0 10px 40px rgba(30, 144, 255, 0.2)',
                    border: '1px solid rgba(30, 144, 255, 0.3)',
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                    sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        background: gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: `0 4px 20px ${gradient.includes('1e90ff') ? 'rgba(30, 144, 255, 0.3)' : 'rgba(0,0,0,0.3)'}`,
                    }}
                >
                    {icon}
                </Box>
                <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                        {label}
                    </Typography>
                    {sublabel && (
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                            {sublabel}
                        </Typography>
                    )}
                </Box>
            </Box>
            <Typography
                variant="h3"
                sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                    color: 'white',
                }}
            >
                {value.toLocaleString()}
            </Typography>
        </MotionBox>
    );
};

export default StatCard;
