import apiClient from './client';

export const accountAPI = {
    // Kullanıcının tüm hesaplarını getir
    getMyAccounts: async () => {
        const response = await apiClient.get('/accounts/my-accounts');
        return response.data;
    },

    // Hesap detayı (ID ile)
    getAccountById: async (accountId) => {
        const response = await apiClient.get(`/accounts/${accountId}`);
        return response.data;
    },

    // Hesap detayı (hesap numarası ile)
    getAccountByNumber: async (accountNumber) => {
        const response = await apiClient.get(`/accounts/accountNumber/${accountNumber}`);
        return response.data;
    },

    // Yeni hesap oluştur
    createAccount: async (accountData) => {
        const response = await apiClient.post('/accounts/create', accountData);
        return response.data;
    },

    // Para transferi
    transfer: async (transferData) => {
        const response = await apiClient.post('/accounts/transfer', transferData);
        return response.data;
    },

    // Hesap güncelle
    updateAccount: async (updateData) => {
        const response = await apiClient.post('/accounts/update', updateData);
        return response.data;
    },

    // Hesap deaktif et
    deactivateAccount: async (accountNumber) => {
        const response = await apiClient.post('/accounts/deactivate', { accountNumber });
        return response.data;
    }
};

export default accountAPI;