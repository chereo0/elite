import { Box, Typography, Grid, IconButton, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LogoutIcon from '@mui/icons-material/Logout';

const glassCardStyles = {
    background: 'rgba(10, 15, 30, 0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(30, 144, 255, 0.15)',
};

const AdminFooter = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');

        // Redirect to login page
        navigate('/auth');
    };

    return (
        <Box sx={{ ...glassCardStyles, borderRadius: 0, mt: 4, p: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '0.2em', mb: 2, color: 'white' }}>
                        ELITE MOTION
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2, maxWidth: 300 }}>
                        Your goto destination for high-quality fashion. Stay stylish with our trendy and versatile clothing collections.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {[FacebookIcon, TwitterIcon, InstagramIcon, YouTubeIcon].map((Icon, index) => (
                            <IconButton key={index} sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#1e90ff' } }}>
                                <Icon fontSize="small" />
                            </IconButton>
                        ))}
                    </Box>
                </Grid>
                <Grid item xs={6} md={2}>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 2, letterSpacing: '0.1em' }}>
                        QUICK LINKS
                    </Typography>
                    {['Home', 'Clothes', 'About Us', 'Contact'].map((link) => (
                        <Typography key={link} variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, cursor: 'pointer', '&:hover': { color: '#1e90ff' } }}>
                            {link}
                        </Typography>
                    ))}
                </Grid>
                <Grid item xs={6} md={2}>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 2, letterSpacing: '0.1em' }}>
                        CUSTOMER SERVICE
                    </Typography>
                    {['FAQ', 'Shipping & Returns', 'Privacy Policy', 'Terms & Conditions'].map((link) => (
                        <Typography key={link} variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, cursor: 'pointer', '&:hover': { color: '#1e90ff' } }}>
                            {link}
                        </Typography>
                    ))}
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>info@elitemotion.com</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>+1.800.125.4567</Typography>
                </Grid>
            </Grid>

            <Divider sx={{ my: 3, borderColor: 'rgba(30, 144, 255, 0.2)' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Button
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{
                        color: 'rgba(255,255,255,0.7)',
                        letterSpacing: '0.15em',
                        '&:hover': { color: '#ff4444', background: 'rgba(255, 68, 68, 0.1)' },
                    }}
                >
                    LOG OUT
                </Button>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                    © 2024 ELITE MOTION. All Rights reserved.
                </Typography>
            </Box>
        </Box>
    );
};

export default AdminFooter;
