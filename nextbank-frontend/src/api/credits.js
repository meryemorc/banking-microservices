import apiClient from './client';

export const creditAPI = {
    // Kredi başvurusu yap
    apply: async (applicationData) => {
        const response = await apiClient.post('/credits/apply', applicationData);
        return response.data;
    },

    // Kullanıcının kredileri
    getUserCredits: async (userId) => {
        const response = await apiClient.get(`/credits/user/${userId}`);
        return response.data;
    },

    // Kredi detayı
    getCreditById: async (creditId) => {
        const response = await apiClient.get(`/credits/${creditId}`);
        return response.data;
    },

    // Aktif krediler
    getActiveCredits: async (userId) => {
        const response = await apiClient.get(`/credits/user/${userId}/active`);
        return response.data;
    },

    // ===== ADMIN ENDPOINTS =====

    // Bekleyen krediler (Admin)
    getPendingCredits: async () => {
        const response = await apiClient.get('/credits/admin/pending');
        return response.data;
    },

    // Tüm krediler (Admin)
    getAllCredits: async () => {
        const response = await apiClient.get('/credits/admin/all');
        return response.data;
    },

    // Kredi onayla (Admin)
    approveCredit: async (creditId) => {
        const response = await apiClient.put(`/credits/admin/${creditId}/approve`);
        return response.data;
    },

    // Kredi reddet (Admin)
    rejectCredit: async (creditId) => {
        const response = await apiClient.put(`/credits/admin/${creditId}/reject`);
        return response.data;
    }
};

// Türkçe etiketler
export const CREDIT_PURPOSES = {
    EV_TADILATI: 'Ev Tadilatı',
    ARAC: 'Araç',
    EGITIM: 'Eğitim',
    SAGLIK: 'Sağlık',
    DIGER: 'Diğer'
};

export const CREDIT_STATUSES = {
    PENDING: 'Beklemede',
    APPROVED: 'Onaylandı',
    REJECTED: 'Reddedildi',
    ACTIVE: 'Aktif',
    PAID: 'Ödendi'
};

export default creditAPI;