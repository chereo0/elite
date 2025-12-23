const raw = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api').replace(/\/$/, '');

export const API_URL = raw.endsWith('/api') ? raw : `${raw}/api`;
