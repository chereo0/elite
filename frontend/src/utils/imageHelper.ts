import { API_URL } from '../config/api';

// Placeholder image for products while loading
export const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMxYTFhMmUiLz48cGF0aCBkPSJNNzUgNjVIMTI1QzEzMC41MjMgNjUgMTM1IDY5LjQ3NzIgMTM1IDc1VjEyNUMxMzUgMTMwLjUyMyAxMzAuNTIzIDEzNSAxMjUgMTM1SDc1QzY5LjQ3NzIgMTM1IDY1IDEzMC41MjMgNjUgMTI1Vjc1QzY1IDY5LjQ3NzIgNjkuNDc3MiA2NSA3NSA2NVoiIHN0cm9rZT0iIzFlOTBmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iODUiIGN5PSI4NSIgcj0iOCIgZmlsbD0iIzFlOTBmZiIvPjxwYXRoIGQ9Ik02NSAxMTVMMTAwIDk1TDEzNSAxMTUiIHN0cm9rZT0iIzFlOTBmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+';

// Image cache to avoid refetching
const imageCache: Map<string, string> = new Map();

export const getImageUrl = (url: string | undefined): string => {
    if (!url) return PLACEHOLDER_IMAGE;

    // If it's a full data URI (base64), return it as is
    if (url.startsWith('data:')) {
        return url;
    }
    
    // If the URL is already a full URL (http/https), check if it's localhost
    if (url.startsWith('http')) {
        if (url.includes('localhost:5000')) {
            // Replace localhost:5000 with the actual backend URL
            const backendUrl = API_URL.replace('/api', '');
            return url.replace('http://localhost:5000', backendUrl);
        }
        return url;
    }
    
    // If it's a relative path, prepend the backend URL
    const backendUrl = API_URL.replace('/api', '');
    return `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Fetch product image lazily
export const fetchProductImage = async (productId: string): Promise<string> => {
    // Check cache first
    if (imageCache.has(productId)) {
        return imageCache.get(productId)!;
    }

    try {
        const response = await fetch(`${API_URL}/products/${productId}/image`);
        const data = await response.json();
        
        if (data.success && data.data.image) {
            const imageUrl = getImageUrl(data.data.image);
            imageCache.set(productId, imageUrl);
            return imageUrl;
        }
    } catch (error) {
        console.error('Failed to fetch product image:', error);
    }
    
    return PLACEHOLDER_IMAGE;
};
