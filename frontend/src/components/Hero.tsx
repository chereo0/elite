import { Box, Typography, Button, Container } from '@mui/material';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

// Animated floating orb component
const FloatingOrb = ({
    size,
    color,
    top,
    left,
    delay = 0,
    duration = 6
}: {
    size: number;
    color: string;
    top: string;
    left: string;
    delay?: number;
    duration?: number;
}) => (
    <MotionBox
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
            y: [0, -30, 0],
            x: [0, 15, 0],
        }}
        transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
        }}
        sx={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            top,
            left,
            filter: 'blur(40px)',
            pointerEvents: 'none',
        }}
    />
);

// Animated star component
const Star = ({ delay, size, top, left }: { delay: number; size: number; top: string; left: string }) => (
    <MotionBox
        initial={{ opacity: 0 }}
        animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.3, 1],
        }}
        transition={{
            duration: 2 + Math.random() * 2,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
        }}
        sx={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: 'white',
            top,
            left,
            boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, 0.5)`,
        }}
    />
);

// Generate random stars
const generateStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        delay: Math.random() * 3,
        size: Math.random() * 3 + 1,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
    }));
};

const Hero = () => {
    const [stars] = useState(() => generateStars(80));
    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);

    useEffect(() => {
        const animation = animate(count, 10000, {
            duration: 3,
            ease: "easeOut",
        });
        return animation.stop;
    }, []);

    return (
        <Box
            sx={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                background: `
          radial-gradient(ellipse at 20% 50%, rgba(26, 35, 126, 0.4) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(124, 77, 255, 0.25) 0%, transparent 40%),
          radial-gradient(ellipse at 60% 80%, rgba(0, 229, 255, 0.15) 0%, transparent 40%),
          linear-gradient(180deg, #0a0a0f 0%, #0d1421 50%, #0a0a0f 100%)
        `,
            }}
        >
            {/* Animated Stars */}
            {stars.map((star) => (
                <Star key={star.id} {...star} />
            ))}

            {/* Floating Orbs */}
            <FloatingOrb size={400} color="rgba(124, 77, 255, 0.4)" top="10%" left="70%" delay={0} duration={8} />
            <FloatingOrb size={300} color="rgba(0, 229, 255, 0.3)" top="60%" left="5%" delay={2} duration={10} />
            <FloatingOrb size={250} color="rgba(26, 35, 126, 0.5)" top="30%" left="80%" delay={1} duration={7} />
            <FloatingOrb size={200} color="rgba(124, 77, 255, 0.3)" top="70%" left="60%" delay={3} duration={9} />

            {/* 3D-like rotating shape */}
            <MotionBox
                animate={{
                    rotateY: [0, 360],
                    rotateX: [0, 15, 0, -15, 0],
                }}
                transition={{
                    rotateY: { duration: 20, repeat: Infinity, ease: "linear" },
                    rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                }}
                sx={{
                    position: 'absolute',
                    right: '10%',
                    top: '25%',
                    width: 300,
                    height: 300,
                    perspective: 1000,
                    transformStyle: 'preserve-3d',
                    display: { xs: 'none', lg: 'block' },
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.2) 0%, rgba(0, 229, 255, 0.1) 100%)',
                        borderRadius: 4,
                        border: '1px solid rgba(124, 77, 255, 0.3)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 0 60px rgba(124, 77, 255, 0.3)',
                    }}
                />
            </MotionBox>

            {/* Another floating 3D element */}
            <MotionBox
                animate={{
                    rotateZ: [0, 360],
                    y: [0, -20, 0],
                }}
                transition={{
                    rotateZ: { duration: 15, repeat: Infinity, ease: "linear" },
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                }}
                sx={{
                    position: 'absolute',
                    right: '25%',
                    top: '15%',
                    width: 100,
                    height: 100,
                    display: { xs: 'none', md: 'block' },
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.3) 0%, rgba(124, 77, 255, 0.2) 100%)',
                        borderRadius: 2,
                        border: '1px solid rgba(0, 229, 255, 0.4)',
                        boxShadow: '0 0 40px rgba(0, 229, 255, 0.3)',
                    }}
                />
            </MotionBox>

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                <Box sx={{ maxWidth: 750 }}>
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <Typography
                            variant="overline"
                            sx={{
                                color: '#00e5ff',
                                fontSize: { xs: '0.85rem', md: '1rem' },
                                fontWeight: 700,
                                letterSpacing: '0.4em',
                                mb: 2,
                                display: 'inline-block',
                                padding: '8px 16px',
                                background: 'rgba(0, 229, 255, 0.1)',
                                borderRadius: 2,
                                border: '1px solid rgba(0, 229, 255, 0.2)',
                            }}
                        >
                            ✦ Premium Streetwear Collection
                        </Typography>
                    </MotionBox>

                    <MotionTypography
                        variant="h1"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        sx={{
                            fontSize: { xs: '2.8rem', sm: '4rem', md: '5rem', lg: '5.5rem' },
                            fontWeight: 800,
                            lineHeight: 1.05,
                            mb: 3,
                            background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 40%, #7c4dff 80%, #00e5ff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        MOVE WITH
                        <br />
                        <Box component="span" sx={{
                            background: 'linear-gradient(135deg, #7c4dff 0%, #00e5ff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            ELITE STYLE
                        </Box>
                    </MotionTypography>

                    <MotionTypography
                        variant="h6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            mb: 5,
                            maxWidth: 550,
                            lineHeight: 1.8,
                            fontSize: { xs: '1rem', md: '1.15rem' },
                            fontWeight: 400,
                        }}
                    >
                        Elevate your wardrobe with our exclusive collection of premium streetwear.
                        Designed for those who move with purpose and dare to stand out from the crowd.
                    </MotionTypography>

                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                variant="contained"
                                size="large"
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    px: 5,
                                    py: 1.8,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #7c4dff 0%, #00e5ff 100%)',
                                    boxShadow: '0 8px 40px rgba(124, 77, 255, 0.5)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: '-100%',
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                        transition: 'left 0.5s ease',
                                    },
                                    '&:hover': {
                                        boxShadow: '0 12px 50px rgba(124, 77, 255, 0.6)',
                                        '&::before': {
                                            left: '100%',
                                        },
                                    },
                                }}
                            >
                                Shop Now
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{
                                    px: 5,
                                    py: 1.8,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    borderRadius: 3,
                                    borderColor: 'rgba(255, 255, 255, 0.25)',
                                    borderWidth: 2,
                                    color: 'white',
                                    backdropFilter: 'blur(10px)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: '#7c4dff',
                                        borderWidth: 2,
                                        background: 'rgba(124, 77, 255, 0.15)',
                                    },
                                }}
                            >
                                Explore Collection
                            </Button>
                        </motion.div>
                    </MotionBox>

                    {/* Stats */}
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        sx={{
                            display: 'flex',
                            gap: { xs: 4, md: 8 },
                            mt: 8,
                            pt: 4,
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        {[
                            { value: '10K+', label: 'Happy Customers' },
                            { value: '500+', label: 'Products' },
                            { value: '50+', label: 'Countries' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: { xs: '1.8rem', md: '2.2rem' },
                                        fontWeight: 800,
                                        background: 'linear-gradient(135deg, #ffffff 0%, #7c4dff 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 500 }}
                                >
                                    {stat.label}
                                </Typography>
                            </motion.div>
                        ))}
                    </MotionBox>
                </Box>
            </Container>

            {/* Bottom gradient fade */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 250,
                    background: 'linear-gradient(to top, #0a0a0f 0%, transparent 100%)',
                    pointerEvents: 'none',
                    zIndex: 3,
                }}
            />

            {/* Scroll indicator */}
            <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                sx={{
                    position: 'absolute',
                    bottom: 40,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em' }}>
                    SCROLL
                </Typography>
                <Box
                    sx={{
                        width: 24,
                        height: 40,
                        borderRadius: 12,
                        border: '2px solid rgba(255,255,255,0.2)',
                        display: 'flex',
                        justifyContent: 'center',
                        pt: 1,
                    }}
                >
                    <MotionBox
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        sx={{
                            width: 4,
                            height: 8,
                            borderRadius: 2,
                            background: 'linear-gradient(180deg, #7c4dff, #00e5ff)',
                        }}
                    />
                </Box>
            </MotionBox>
        </Box>
    );
};

export default Hero;
