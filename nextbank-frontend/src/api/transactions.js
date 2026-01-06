import apiClient from './client';

export const transactionAPI = {
    // Kullanıcının tüm işlemleri
    getUserTransactions: async () => {
        const response = await apiClient.get('/transactions/user');
        return response.data;
    },

    // Son 10 işlem
    getRecentTransactions: async () => {
        const response = await apiClient.get('/transactions/recent');
        return response.data;
    },

    // Sayfalanmış işlemler
    getPaginatedTransactions: async (page = 0, size = 10) => {
        const response = await apiClient.get('/transactions/paginated', {
            params: { page, size }
        });
        return response.data;
    },

    // Tarih aralığına göre filtrele
    filterByDateRange: async (startDate, endDate) => {
        const response = await apiClient.get('/transactions/filter', {
            params: { startDate, endDate }
        });
        return response.data;
    },

    // Duruma göre filtrele (SUCCESS, FAILED, PENDING)
    filterByStatus: async (status) => {
        const response = await apiClient.get(`/transactions/status/${status}`);
        return response.data;
    },

    // Türe göre filtrele (TRANSFER, DEPOSIT, WITHDRAW)
    filterByType: async (type) => {
        const response = await apiClient.get(`/transactions/type/${type}`);
        return response.data;
    },

    // İstatistikler
    getStats: async () => {
        const response = await apiClient.get('/transactions/stats');
        return response.data;
    }
};

export default transactionAPI;