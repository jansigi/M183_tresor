import axios from 'axios';
import authService from '../services/authService';

// Add a request interceptor
axios.interceptors.request.use(
    config => {
        const authHeader = authService.getAuthHeader();
        if (authHeader.Authorization) {
            config.headers.Authorization = authHeader.Authorization;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // If we get a 401 Unauthorized response, logout the user
            authService.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
); 