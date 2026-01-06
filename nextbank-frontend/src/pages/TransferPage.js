import React, { useState, useEffect } from 'react';
import { accountAPI } from '../api';
import { LoadingSpinner } from '../components/common';
import { ArrowRight, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const TransferPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const [formData, setFormData] = useState({
        sourceAccountNumber: '',
        targetAccountNumber: '',
        amount: ''
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const data = await accountAPI.getMyAccounts();
            setAccounts(data || []);
            if (data && data.length > 0) {
                setFormData(prev => ({ ...prev, sourceAccountNumber: data[0].accountNumber }));
            }
        } catch (error) {
            toast.error('Hesaplar yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.sourceAccountNumber) {
            toast.error('Gönderen hesap seçin');
            return;
        }
        if (!formData.targetAccountNumber) {
            toast.error('Alıcı hesap numarası girin');
            return;
        }
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            toast.error('Geçerli bir tutar girin');
            return;
        }
        if (formData.sourceAccountNumber === formData.targetAccountNumber) {
            toast.error('Gönderen ve alıcı hesap aynı olamaz');
            return;
        }

        setSending(true);
        try {
            await accountAPI.transfer({
                sourceAccountNumber: formData.sourceAccountNumber,
                targetAccountNumber: formData.targetAccountNumber,
                amount: parseFloat(formData.amount)
            });
            toast.success('Transfer başarıyla gerçekleşti!');
            setFormData(prev => ({ ...prev, targetAccountNumber: '', amount: '' }));
            fetchAccounts();
        } catch (error) {
            toast.error(error.message || 'Transfer başarısız');
        } finally {
            setSending(false);
        }
    };

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(amount || 0);
    };

    const selectedAccount = accounts.find(a => a.accountNumber === formData.sourceAccountNumber);

    if (loading) {
        return <LoadingSpinner size="large" text="Yükleniyor..." />;
    }

    return (
        <div className="transfer-page fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Para Transferi</h1>
                    <p className="page-subtitle">Hesaplar arası para gönderin</p>
                </div>
            </div>

            {accounts.length === 0 ? (
                <div className="card empty-state-card">
                    <Send size={64} />
                    <h3>Hesabınız yok</h3>
                    <p>Transfer yapabilmek için önce bir hesap açmalısınız</p>
                </div>
            ) : (
                <div className="transfer-container">
                    <div className="card transfer-card">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Gönderen Hesap</label>
                                <select
                                    className="form-select"
                                    value={formData.sourceAccountNumber}
                                    onChange={(e) => setFormData({ ...formData, sourceAccountNumber: e.target.value })}
                                >
                                    {accounts.map((account) => (
                                        <option key={account.id} value={account.accountNumber}>
                                            {account.accountType === 'SAVING' ? 'Birikim' : 'Vadesiz'} - {account.accountNumber.slice(-8)} ({formatMoney(account.balance)})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedAccount && (
                                <div className="selected-account-info">
                                    <span>Mevcut Bakiye:</span>
                                    <strong>{formatMoney(selectedAccount.balance)}</strong>
                                </div>
                            )}

                            <div className="transfer-arrow">
                                <ArrowRight size={24} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Alıcı Hesap Numarası</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Alıcının hesap numarasını girin"
                                    value={formData.targetAccountNumber}
                                    onChange={(e) => setFormData({ ...formData, targetAccountNumber: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tutar (₺)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="0.00"
                                    min="0.01"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
                                {sending ? 'Gönderiliyor...' : (
                                    <>
                                        <Send size={20} />
                                        Gönder
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransferPage;