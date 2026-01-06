import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Uygulama başladığında localStorage'dan yükle
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && authAPI.isTokenValid()) {
            setToken(storedToken);
            setIsAdmin(authAPI.isAdmin());

            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error('User parse hatası:', e);
                }
            }
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }

        setLoading(false);
    }, []);

    // Login
    const login = useCallback(async (email, password) => {
        try {
            const response = await authAPI.login(email, password);
            const { token: newToken, user: userData } = response;

            setToken(newToken);
            setUser(userData);
            setIsAdmin(userData?.role === 'ADMIN');

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));

            return { success: true, user: userData };
        } catch (error) {
            return { success: false, error: error.message || 'Giriş başarısız' };
        }
    }, []);

    // Register
    const register = useCallback(async (userData) => {
        try {
            const response = await authAPI.register(userData);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message || 'Kayıt başarısız' };
        }
    }, []);

    // Logout
    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    const isAuthenticated = !!token && authAPI.isTokenValid();

    const value = {
        user,
        token,
        isAdmin,
        loading,
        isAuthenticated,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;