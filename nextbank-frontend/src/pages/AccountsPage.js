import React, { useState, useEffect } from 'react';
import { accountAPI } from '../api';
import { LoadingSpinner } from '../components/common';
import { Wallet, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AccountsPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newAccount, setNewAccount] = useState({
        accountType: 'CHECKING',
        initialBalance: ''
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const data = await accountAPI.getMyAccounts();
            setAccounts(data || []);
        } catch (error) {
            toast.error('Hesaplar yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();

        if (!newAccount.initialBalance || parseFloat(newAccount.initialBalance) < 0) {
            toast.error('Geçerli bir başlangıç bakiyesi girin');
            return;
        }

        setCreating(true);
        try {
            await accountAPI.createAccount({
                accountType: newAccount.accountType,
                initialBalance: parseFloat(newAccount.initialBalance)
            });
            toast.success('Hesap başarıyla oluşturuldu!');
            setShowModal(false);
            setNewAccount({ accountType: 'CHECKING', initialBalance: '' });
            fetchAccounts();
        } catch (error) {
            toast.error(error.message || 'Hesap oluşturulamadı');
        } finally {
            setCreating(false);
        }
    };

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return <LoadingSpinner size="large" text="Hesaplar yükleniyor..." />;
    }

    return (
        <div className="accounts-page fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Hesaplarım</h1>
                    <p className="page-subtitle">Tüm banka hesaplarınızı yönetin</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={20} />
                    Yeni Hesap Aç
                </button>
            </div>

            {accounts.length === 0 ? (
                <div className="card empty-state-card">
                    <Wallet size={64} />
                    <h3>Henüz hesabınız yok</h3>
                    <p>İlk banka hesabınızı açarak başlayın</p>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <Plus size={20} />
                        İlk Hesabını Aç
                    </button>
                </div>
            ) : (
                <div className="accounts-grid">
                    {accounts.map((account) => (
                        <div key={account.id} className={`account-card ${account.accountType?.toLowerCase()}`}>
                            <div className="account-card-header">
                                <div className="account-type-badge">
                                    {account.accountType === 'SAVING' ? '💰 Birikim' : '💳 Vadesiz'}
                                </div>
                                <span className={`status-badge ${account.isActive !== false ? 'active' : 'inactive'}`}>
                  {account.isActive !== false ? 'Aktif' : 'Pasif'}
                </span>
                            </div>

                            <div className="account-card-body">
                                <div className="account-number-display">
                                    <span className="label">Hesap No</span>
                                    <span className="value">{account.accountNumber}</span>
                                </div>
                                <div className="account-balance-display">
                                    <span className="label">Bakiye</span>
                                    <span className="value">{formatMoney(account.balance)}</span>
                                </div>
                            </div>

                            <div className="account-card-footer">
                <span className="created-date">
                  Açılış: {formatDate(account.createdAt)}
                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Yeni Hesap Aç</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateAccount}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Hesap Türü</label>
                                    <select
                                        className="form-select"
                                        value={newAccount.accountType}
                                        onChange={(e) => setNewAccount({ ...newAccount, accountType: e.target.value })}
                                    >
                                        <option value="CHECKING">Vadesiz Hesap</option>
                                        <option value="SAVING">Birikim Hesabı</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Başlangıç Bakiyesi (₺)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        value={newAccount.initialBalance}
                                        onChange={(e) => setNewAccount({ ...newAccount, initialBalance: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    İptal
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={creating}>
                                    {creating ? 'Oluşturuluyor...' : 'Hesap Aç'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountsPage;