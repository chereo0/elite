import { useState, useEffect, useRef } from 'react';
import { Box, CardMedia, Skeleton } from '@mui/material';
import { PLACEHOLDER_IMAGE, fetchProductImage, getImageUrl } from '../utils/imageHelper';

interface LazyProductImageProps {
    productId: string;
    productImage?: string | null;
    hasBase64Image?: boolean;
    alt: string;
    height?: number | string;
    sx?: object;
}

const LazyProductImage = ({ 
    productId, 
    productImage, 
    hasBase64Image, 
    alt, 
    height = 280,
    sx = {}
}: LazyProductImageProps) => {
    const [imageUrl, setImageUrl] = useState<string>(PLACEHOLDER_IMAGE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Use Intersection Observer for true lazy loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            },
            { rootMargin: '100px' } // Start loading 100px before visible
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Load image when visible
    useEffect(() => {
        if (!isVisible) return;

        const loadImage = async () => {
            setLoading(true);
            
            // If we already have a valid image URL (not base64), use it directly
            if (productImage && !hasBase64Image && !productImage.startsWith('data:')) {
                const url = getImageUrl(productImage);
                setImageUrl(url);
                setLoading(false);
                return;
            }

            // Otherwise, fetch the image from the API
            try {
                const url = await fetchProductImage(productId);
                setImageUrl(url);
            } catch (err) {
                setError(true);
                setImageUrl(PLACEHOLDER_IMAGE);
            } finally {
                setLoading(false);
            }
        };

        loadImage();
    }, [isVisible, productId, productImage, hasBase64Image]);

    return (
        <Box ref={imgRef} sx={{ position: 'relative', height, overflow: 'hidden', ...sx }}>
            {loading && (
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(30, 144, 255, 0.1)',
                    }}
                />
            )}
            <CardMedia
                component="img"
                image={imageUrl}
                alt={alt}
                onLoad={() => setLoading(false)}
                onError={() => {
                    setError(true);
                    setImageUrl(PLACEHOLDER_IMAGE);
                    setLoading(false);
                }}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                    opacity: loading ? 0 : 1,
                }}
            />
        </Box>
    );
};

export default LazyProductImage;
