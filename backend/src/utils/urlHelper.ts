import { Request } from 'express';

export const fixImageUrl = (url: string, req: Request): string => {
    if (!url) return url;
    
    // If it's a localhost URL, replace it with the current server URL
    if (url.includes('localhost:5000')) {
        // Prefer environment variable if set (most reliable in production)
        if (process.env.BASE_URL) {
             return url.replace(/http:\/\/localhost:5000/g, process.env.BASE_URL);
        }

        const protocol = req.headers['x-forwarded-proto'] ? String(req.headers['x-forwarded-proto']) : req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}`;
        return url.replace(/http:\/\/localhost:5000/g, baseUrl);
    }
    
    return url;
};
