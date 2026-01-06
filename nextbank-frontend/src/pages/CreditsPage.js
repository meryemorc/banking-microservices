import React, { useState, useEffect } from 'react';
import { useAuth } from '../context';
import { creditAPI, CREDIT_PURPOSES, CREDIT_STATUSES } from '../api';
import { LoadingSpinner } from '../components/common';
import { CreditCard, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CreditsPage = () => {
    const { user } = useAuth();
    const [credits, setCredits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [applying, setApplying] = useState(false);

    const [formData, setFormData] = useState({
        requestedAmount: '',
        installments: '12',
        purpose: 'DIGER'
    });

    useEffect(() => {
        fetchCredits();
    }, []);

    const fetchCredits = async () => {
        try {
            setLoading(true);
            const data = await creditAPI.getUserCredits(user?.id);
            setCredits(data || []);
        } catch (error) {
            toast.error('Krediler yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();

        const amount = parseFloat(formData.requestedAmount);
        if (!amount || amount < 1000 || amount > 500000) {
            toast.error('Kredi tutarı 1.000 - 500.000 TL arasında olmalı');
            return;
        }

        setApplying(true);
        try {
            await creditAPI.apply({
                requestedAmount: amount,
                installments: parseInt(formData.installments),
                purpose: formData.purpose
            });
            toast.success('Kredi başvurunuz alındı!');
            setShowModal(false);
            setFormData({ requestedAmount: '', installments: '12', purpose: 'DIGER' });
            fetchCredits();
        } catch (error) {
            toast.error(error.message || 'Başvuru başarısız');
        } finally {
            setApplying(false);
        }
    };

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            PENDING: 'warning',
            APPROVED: 'success',
            REJECTED: 'danger',
            ACTIVE: 'info',
            PAID: 'success'
        };
        return statusMap[status] || 'default';
    };

    if (loading) {
        return <LoadingSpinner size="large" text="Krediler yükleniyor..." />;
    }

    return (
        <div className="credits-page fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Kredilerim</h1>
                    <p className="page-subtitle">Kredi başvurularınızı yönetin</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={20} />
                    Kredi Başvurusu
                </button>
            </div>

            {credits.length === 0 ? (
                <div className="card empty-state-card">
                    <CreditCard size={64} />
                    <h3>Kredi başvurunuz yok</h3>
                    <p>Hemen kredi başvurusu yapın</p>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <Plus size={20} />
                        Başvuru Yap
                    </button>
                </div>
            ) : (
                <div className="credits-grid">
                    {credits.map((credit) => (
                        <div key={credit.id} className="credit-card">
                            <div className="credit-card-header">
                                <span className="credit-purpose">{CREDIT_PURPOSES[credit.purpose] || credit.purpose}</span>
                                <span className={`badge badge-${getStatusBadge(credit.status)}`}>
                  {CREDIT_STATUSES[credit.status] || credit.status}
                </span>
                            </div>

                            <div className="credit-card-body">
                                <div className="credit-amount">
                                    <span className="label">Talep Edilen</span>
                                    <span className="value">{formatMoney(credit.requestedAmount)}</span>
                                </div>

                                {credit.approvedAmount && (
                                    <div className="credit-amount approved">
                                        <span className="label">Onaylanan</span>
                                        <span className="value">{formatMoney(credit.approvedAmount)}</span>
                                    </div>
                                )}

                                <div className="credit-details">
                                    <div className="detail-item">
                                        <span className="label">Taksit</span>
                                        <span className="value">{credit.installments} Ay</span>
                                    </div>
                                    {credit.monthlyPayment && (
                                        <div className="detail-item">
                                            <span className="label">Aylık Ödeme</span>
                                            <span className="value">{formatMoney(credit.monthlyPayment)}</span>
                                        </div>
                                    )}
                                    {credit.interestRate && (
                                        <div className="detail-item">
                                            <span className="label">Faiz Oranı</span>
                                            <span className="value">%{credit.interestRate}</span>
                                        </div>
                                    )}
                                    {credit.creditScore && (
                                        <div className="detail-item">
                                            <span className="label">Kredi Skoru</span>
                                            <span className="value">{credit.creditScore}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="credit-card-footer">
                                <span>Başvuru: {formatDate(credit.createdAt)}</span>
                                {credit.approvedAt && <span>Onay: {formatDate(credit.approvedAt)}</span>}
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
                            <h3>Kredi Başvurusu</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleApply}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Kredi Tutarı (₺)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Min: 1.000 - Max: 500.000"
                                        min="1000"
                                        max="500000"
                                        value={formData.requestedAmount}
                                        onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Taksit Sayısı</label>
                                    <select
                                        className="form-select"
                                        value={formData.installments}
                                        onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                                    >
                                        <option value="3">3 Ay</option>
                                        <option value="6">6 Ay</option>
                                        <option value="12">12 Ay</option>
                                        <option value="24">24 Ay</option>
                                        <option value="36">36 Ay</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Kredi Amacı</label>
                                    <select
                                        className="form-select"
                                        value={formData.purpose}
                                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                    >
                                        {Object.entries(CREDIT_PURPOSES).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    İptal
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={applying}>
                                    {applying ? 'Gönderiliyor...' : 'Başvur'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreditsPage;