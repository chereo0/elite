import { API_URL } from '../config/api';

// Placeholder image for products with base64 images that were truncated for performance
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMxYTFhMmUiLz48cGF0aCBkPSJNNzUgNjVIMTI1QzEzMC41MjMgNjUgMTM1IDY5LjQ3NzIgMTM1IDc1VjEyNUMxMzUgMTMwLjUyMyAxMzAuNTIzIDEzNSAxMjUgMTM1SDc1QzY5LjQ3NzIgMTM1IDY1IDEzMC41MjMgNjUgMTI1Vjc1QzY1IDY5LjQ3NzIgNjkuNDc3MiA2NSA3NSA2NVoiIHN0cm9rZT0iIzFlOTBmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iODUiIGN5PSI4NSIgcj0iOCIgZmlsbD0iIzFlOTBmZiIvPjxwYXRoIGQ9Ik02NSAxMTVMMTAwIDk1TDEzNSAxMTUiIHN0cm9rZT0iIzFlOTBmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+';

export const getImageUrl = (url: string | undefined, hasBase64Image?: boolean): string => {
    if (!url) return PLACEHOLDER_IMAGE;

    // If the product has a base64 image but it was truncated for performance
    if (hasBase64Image || (url.startsWith('data:image') && url.length < 100)) {
        return PLACEHOLDER_IMAGE;
    }

    // If it's a full data URI, return it as is
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
