import { Box, Container, Typography, TextField, Button, Grid } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Contact = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: '#0a0a0f',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 8, flexGrow: 1 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '2rem', md: '3rem' },
                            fontWeight: 700,
                            mb: 2,
                            background: 'linear-gradient(135deg, #ffffff 0%, #7c4dff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Contact Us
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Have questions? We'd love to hear from you.
                    </Typography>
                </Box>

                <Grid container spacing={6}>
                    <Grid item xs={12} md={6}>
                        <Box
                            component="form"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Name"
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        '& fieldset': {
                                            borderColor: 'rgba(124, 77, 255, 0.3)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(124, 77, 255, 0.5)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#7c4dff',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'text.secondary',
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        '& fieldset': {
                                            borderColor: 'rgba(124, 77, 255, 0.3)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(124, 77, 255, 0.5)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#7c4dff',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'text.secondary',
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Message"
                                multiline
                                rows={5}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        '& fieldset': {
                                            borderColor: 'rgba(124, 77, 255, 0.3)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(124, 77, 255, 0.5)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#7c4dff',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'text.secondary',
                                    },
                                }}
                            />
                            <Button
                                variant="contained"
                                size="large"
                                endIcon={<SendIcon />}
                                sx={{
                                    alignSelf: 'flex-start',
                                    px: 4,
                                    background: 'linear-gradient(135deg, #7c4dff 0%, #00e5ff 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #b47cff 0%, #40efff 100%)',
                                    },
                                }}
                            >
                                Send Message
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                background: 'rgba(13, 20, 33, 0.8)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(124, 77, 255, 0.2)',
                                borderRadius: '12px',
                                p: 4,
                                height: '100%',
                            }}
                        >
                            <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
                                Get in Touch
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: '12px',
                                            background: 'rgba(124, 77, 255, 0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <LocationOnIcon sx={{ color: '#7c4dff' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Address
                                        </Typography>
                                        <Typography>123 Fashion Street, Style City, SC 12345</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: '12px',
                                            background: 'rgba(124, 77, 255, 0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <PhoneIcon sx={{ color: '#7c4dff' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Phone
                                        </Typography>
                                        <Typography>+1 (555) 123-4567</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: '12px',
                                            background: 'rgba(124, 77, 255, 0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <EmailIcon sx={{ color: '#7c4dff' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Email
                                        </Typography>
                                        <Typography>contact@elitemotion.com</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </Box>
    );
};

export default Contact;
