import axios from 'axios';

// In development: Vite proxy forwards /api → http://localhost:5000/api
// In production: VITE_API_URL env var should be your Render backend URL
// e.g. https://gro-store-backend.onrender.com

const BASE_URL = import.meta.env.VITE_API_URL || '';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
});

// Attach token to every request if available
axiosInstance.interceptors.request.use(
    (config) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user?.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        } catch (_) {}
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
