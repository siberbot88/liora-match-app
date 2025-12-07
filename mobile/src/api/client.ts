import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// API client configuration
// Using localhost with ADB reverse: adb reverse tcp:3000 tcp:3000
export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 30000, // Increased from 10s to 30s
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request logging for debugging
api.interceptors.request.use(
    (config) => {
        console.log('🔵 API Request:', config.method?.toUpperCase(), config.url);
        console.log('🔵 Base URL:', config.baseURL);
        console.log('🔵 Full URL:', `${config.baseURL}${config.url}`);

        // Get token from Zustand store
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.log('🔴 Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        console.log('🟢 API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.log('🔴 API Error:', error.message);
        console.log('🔴 Error Config:', error.config?.url);
        console.log('🔴 Error Code:', error.code);
        console.log('🔴 Error Response:', error.response?.status, error.response?.data);

        if (error.response?.status === 401) {
            // Handle unauthorized - logout user
            console.log('Unauthorized - logging out');
            useAuthStore.getState().logout();
        }
    }
);

// Named export for API modules
export const apiClient = api;

export default api;
