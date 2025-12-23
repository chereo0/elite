import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';

const MotionBox = motion(Box);

interface StarProps {
    delay: number;
    size: number;
    top: string;
    left: string;
}

const Star = ({ delay, size, top, left }: StarProps) => (
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

const generateStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        delay: Math.random() * 3,
        size: Math.random() * 2 + 1,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
    }));
};

interface StarfieldBackgroundProps {
    starCount?: number;
}

const StarfieldBackground = ({ starCount = 60 }: StarfieldBackgroundProps) => {
    const [stars] = useState(() => generateStars(starCount));

    return (
        <>
            {stars.map((star) => (
                <Star key={star.id} {...star} />
            ))}
        </>
    );
};

export default StarfieldBackground;
