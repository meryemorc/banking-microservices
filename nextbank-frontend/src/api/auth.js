import apiClient from './client';

export const authAPI = {
    // Kullanıcı girişi
    login: async (email, password) => {
        const response = await apiClient.post('/users/login', { email, password });
        return response.data;
    },

    // Kullanıcı kaydı
    register: async (userData) => {
        const response = await apiClient.post('/users/register', userData);
        return response.data;
    },

    // Token'dan kullanıcı bilgisi çözümle
    parseToken: (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            return payload;
        } catch (error) {
            return null;
        }
    },

    // Token geçerli mi?
    isTokenValid: () => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const payload = authAPI.parseToken(token);
            if (!payload || !payload.exp) return false;
            const now = Date.now() / 1000;
            return payload.exp > now;
        } catch {
            return false;
        }
    },

    // Admin mi?
    isAdmin: () => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const payload = authAPI.parseToken(token);
            return payload?.role === 'ADMIN';
        } catch {
            return false;
        }
    }
};

export default authAPI;