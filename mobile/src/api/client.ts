import axios from 'axios';

// API client configuration
export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.43.237:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        // TODO: Add authentication token from store
        // const token = useAuthStore.getState().token;
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized - logout user
            console.log('Unauthorized - please login');
        }
        return Promise.reject(error);
    }
);
