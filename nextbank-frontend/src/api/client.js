import axios from 'axios';

// API Gateway URL
const API_BASE_URL = 'http://localhost:8080';

// Axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor - Her istekte token ekle
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor - Hata yönetimi
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (!error.response) {
            console.error('🔴 Network/CORS Error:', error.message);
            return Promise.reject({
                message: 'Sunucuya bağlanılamıyor. Backend çalışıyor mu?',
                type: 'NETWORK_ERROR'
            });
        }

        // 401 - Token geçersiz
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        const errorMessage = error.response?.data?.message
            || error.response?.data
            || error.message
            || 'Bir hata oluştu';

        return Promise.reject({
            message: errorMessage,
            status: error.response?.status,
        });
    }
);

export default apiClient;