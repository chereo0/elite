import { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    IconButton,
    Link,
    Divider,
    InputAdornment,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SendIcon from '@mui/icons-material/Send';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { motion } from 'framer-motion';
import logo from '../assets/logo.jpg';

const MotionBox = motion(Box);

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Subscribing:', email);
        setEmail('');
    };

    const socialIcons = [
        { Icon: FacebookIcon, color: '#1877f2' },
        { Icon: TwitterIcon, color: '#1da1f2' },
        { Icon: InstagramIcon, color: '#e4405f' },
        { Icon: YouTubeIcon, color: '#ff0000' },
    ];

    return (
        <Box
            component="footer"
            sx={{
                background: `
          linear-gradient(180deg, #0a0a0f 0%, #050508 100%),
          radial-gradient(ellipse at 50% 0%, rgba(124, 77, 255, 0.1) 0%, transparent 50%)
        `,
                borderTop: '1px solid rgba(124, 77, 255, 0.15)',
                pt: 10,
                pb: 4,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Decorative gradient orb */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-200px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 600,
                    height: 300,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(124, 77, 255, 0.15) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={6}>
                    {/* Brand & Newsletter */}
                    <Grid item xs={12} md={4}>
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <Box sx={{ mb: 3 }}>
                                <motion.img
                                    src={logo}
                                    alt="Elite Motion"
                                    style={{ height: 55 }}
                                    whileHover={{ scale: 1.05 }}
                                />
                            </Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    mb: 4,
                                    maxWidth: 300,
                                    lineHeight: 1.8,
                                }}
                            >
                                Elevate your style with Elite Motion. Premium streetwear for those
                                who move with purpose and dare to stand out from the crowd.
                            </Typography>

                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, fontSize: '1rem' }}>
                                Subscribe to Newsletter
                            </Typography>
                            <Box
                                component="form"
                                onSubmit={handleSubscribe}
                                sx={{ display: 'flex', gap: 1 }}
                            >
                                <TextField
                                    size="small"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    type="submit"
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #7c4dff 0%, #00e5ff 100%)',
                                                        color: 'white',
                                                        mr: -1,
                                                        '&:hover': {
                                                            background: 'linear-gradient(135deg, #9c7bff 0%, #40efff 100%)',
                                                        },
                                                    }}
                                                >
                                                    <SendIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            borderRadius: 2,
                                            '& fieldset': {
                                                borderColor: 'rgba(124, 77, 255, 0.2)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'rgba(124, 77, 255, 0.4)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#7c4dff',
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        </MotionBox>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={6} md={2}>
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 3,
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    background: 'linear-gradient(135deg, #7c4dff 0%, #00e5ff 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Quick Links
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {['Home', 'Shop', 'About Us', 'Contact'].map((item) => (
                                    <Link
                                        key={item}
                                        href="#"
                                        underline="none"
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.6)',
                                            transition: 'all 0.3s ease',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            '&:hover': {
                                                color: '#00e5ff',
                                                pl: 1,
                                            },
                                            '&::before': {
                                                content: '"→"',
                                                marginRight: 1,
                                                opacity: 0,
                                                transition: 'opacity 0.3s ease',
                                            },
                                            '&:hover::before': {
                                                opacity: 1,
                                            },
                                        }}
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </Box>
                        </MotionBox>
                    </Grid>

                    {/* Categories */}
                    <Grid item xs={6} md={2}>
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 3,
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    background: 'linear-gradient(135deg, #7c4dff 0%, #00e5ff 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Categories
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {['T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Accessories'].map(
                                    (item) => (
                                        <Link
                                            key={item}
                                            href="#"
                                            underline="none"
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.6)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    color: '#00e5ff',
                                                    pl: 1,
                                                },
                                            }}
                                        >
                                            {item}
                                        </Link>
                                    )
                                )}
                            </Box>
                        </MotionBox>
                    </Grid>

                    {/* Contact Info */}
                    <Grid item xs={12} md={4}>
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 3,
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    background: 'linear-gradient(135deg, #7c4dff 0%, #00e5ff 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Contact Us
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                {[
                                    { Icon: LocationOnIcon, text: 'Lebanon' },
                                    { Icon: PhoneIcon, text: '+961 81 717 870' },
                                    { Icon: EmailIcon, text: 'contact@elitemotion.com' },
                                ].map(({ Icon, text }, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box
                                            sx={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: 2,
                                                background: 'rgba(124, 77, 255, 0.1)',
                                                border: '1px solid rgba(124, 77, 255, 0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    background: 'rgba(124, 77, 255, 0.2)',
                                                    transform: 'translateY(-2px)',
                                                },
                                            }}
                                        >
                                            <Icon sx={{ color: '#7c4dff', fontSize: 20 }} />
                                        </Box>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            {text}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1.5, mt: 4 }}>
                                {socialIcons.map(({ Icon, color }, index) => (
                                    <motion.div key={index} whileHover={{ scale: 1.1, y: -3 }}>
                                        <IconButton
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.6)',
                                                border: '1px solid rgba(124, 77, 255, 0.2)',
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    color: color,
                                                    borderColor: color,
                                                    background: `${color}15`,
                                                },
                                            }}
                                        >
                                            <Icon fontSize="small" />
                                        </IconButton>
                                    </motion.div>
                                ))}
                            </Box>
                        </MotionBox>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 5, borderColor: 'rgba(124, 77, 255, 0.15)' }} />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                        © 2024 Elite Motion. All rights reserved.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 4 }}>
                        {['Privacy Policy', 'Terms of Service', 'FAQ'].map((item) => (
                            <Link
                                key={item}
                                href="#"
                                underline="none"
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.4)',
                                    fontSize: '0.85rem',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        color: '#7c4dff',
                                    },
                                }}
                            >
                                {item}
                            </Link>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
