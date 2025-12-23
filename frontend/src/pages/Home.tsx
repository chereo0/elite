import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import NewArrivals from '../components/NewArrivals';
import OurCategories from '../components/OurCategories';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: '#0a0a0f',
            }}
        >
            <Navbar />
            <Hero />
            <NewArrivals />
            <OurCategories />
            <Footer />
        </Box>
    );
};

export default Home;
