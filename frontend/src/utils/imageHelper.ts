import { API_URL } from '../config/api';

export const getImageUrl = (url: string | undefined): string => {
    if (!url) return '';

    // If it's a data URI, return it as is
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
