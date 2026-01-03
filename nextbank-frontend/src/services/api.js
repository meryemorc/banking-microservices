// Backend API bağlantısı
const API_BASE_URL = 'http://localhost:8080';

const getToken = () => localStorage.getItem('token');

const api = {
    // ==================== AUTH ====================

    // User login
    loginUser: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },

    // Admin login (aynı endpoint, role kontrolü)
    loginAdmin: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) throw new Error('Login failed');
        const data = await response.json();

        // Admin kontrolü - DÜZELTME YAPILDI
        if (data.role !== 'ADMIN') {
            throw new Error('Unauthorized: Admin access required');
        }

        return data;
    },

    // Register
    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error('Registration failed');
        return response.json();
    },

    // ==================== ACCOUNT ====================

    // Create account
    createAccount: async (data) => {
        const response = await fetch(`${API_BASE_URL}/accounts/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Account creation failed');
        return response.json();
    },

    // Get account by ID
    getAccountById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Failed to fetch account');
        return response.json();
    },

    // Get user's accounts
    getMyAccounts: async () => {
        const response = await fetch(`${API_BASE_URL}/accounts/my-accounts`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Failed to fetch accounts');
        return response.json();
    },

    // ==================== TRANSACTIONS ====================

    // Transfer money
    transfer: async (data) => {
        const response = await fetch(`${API_BASE_URL}/transactions/transfer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Transfer failed');
        return response.json();
    },

    // Get recent transactions
    getRecentTransactions: async () => {
        const response = await fetch(`${API_BASE_URL}/transactions/recent`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Failed to fetch transactions');
        return response.json();
    },

    // Get transaction stats
    getTransactionStats: async () => {
        const response = await fetch(`${API_BASE_URL}/transactions/stats`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Failed to fetch stats');
        return response.json();
    },

    // ==================== CREDIT ====================

    // Apply for credit
    applyCredit: async (data) => {
        const response = await fetch(`${API_BASE_URL}/credits/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Credit application failed');
        return response.json();
    },

    // Get my credits
    getMyCredits: async () => {
        const response = await fetch(`${API_BASE_URL}/credits/my-credits`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Failed to fetch credits');
        return response.json();
    },

    // ==================== ADMIN ====================

    // Get pending credit approvals
    getPendingApprovals: async () => {
        const response = await fetch(`${API_BASE_URL}/credits/pending`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Failed to fetch pending approvals');
        return response.json();
    },

    // Approve credit
    approveCredit: async (id) => {
        const response = await fetch(`${API_BASE_URL}/credits/${id}/approve`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
        });
        if (!response.ok) throw new Error('Credit approval failed');
        return response.json();
    },

    // Reject credit
    rejectCredit: async (id) => {
        const response = await fetch(`${API_BASE_URL}/credits/${id}/reject`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
        });
        if (!response.ok) throw new Error('Credit rejection failed');
        return response.json();
    },
};

export default api;