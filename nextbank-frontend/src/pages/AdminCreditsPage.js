import React, { useState, useEffect } from 'react';
import { creditAPI, CREDIT_PURPOSES, CREDIT_STATUSES } from '../api';
import { LoadingSpinner } from '../components/common';
import { Shield, Check, X, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCreditsPage = () => {
    const [credits, setCredits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('PENDING');
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        fetchCredits();
    }, [filter]);

    const fetchCredits = async () => {
        try {
            setLoading(true);
            let data;
            if (filter === 'ALL') {
                data = await creditAPI.getAllCredits();
            } else if (filter === 'PENDING') {
                data = await creditAPI.getPendingCredits();
            } else {
                data = await creditAPI.getCreditsByStatus(filter);
            }
            setCredits(data || []);
        } catch (error) {
            toast.error('Krediler yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (creditId) => {
        setProcessing(creditId);
        try {
            await creditAPI.approveCredit(creditId);
            toast.success('Kredi onaylandı!');
            fetchCredits();
        } catch (error) {
            toast.error(error.message || 'Onaylama başarısız');
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (creditId) => {
        setProcessing(creditId);
        try {
            await creditAPI.rejectCredit(creditId);
            toast.success('Kredi reddedildi');
            fetchCredits();
        } catch (error) {
            toast.error(error.message || 'Reddetme başarısız');
        } finally {
            setProcessing(null);
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
            month: 'short',
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
        <div className="admin-credits-page fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <Shield size={28} />
                        Kredi Yönetimi
                    </h1>
                    <p className="page-subtitle">Kredi başvurularını inceleyin ve yönetin</p>
                </div>
                <button className="btn btn-secondary" onClick={fetchCredits}>
                    <RefreshCw size={20} />
                    Yenile
                </button>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="filter-tabs">
                        {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((f) => (
                            <button
                                key={f}
                                className={`filter-tab ${filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f)}
                            >
                                {f === 'ALL' ? 'Tümü' : CREDIT_STATUSES[f] || f}
                            </button>
                        ))}
                    </div>
                </div>

                {credits.length === 0 ? (
                    <div className="empty-state">
                        <Shield size={48} />
                        <p>Bu kategoride kredi başvurusu yok</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Kullanıcı ID</th>
                                <th>Tutar</th>
                                <th>Taksit</th>
                                <th>Amaç</th>
                                <th>Skor</th>
                                <th>Durum</th>
                                <th>Tarih</th>
                                <th>İşlem</th>
                            </tr>
                            </thead>
                            <tbody>
                            {credits.map((credit) => (
                                <tr key={credit.id}>
                                    <td>#{credit.id}</td>
                                    <td>{credit.userId}</td>
                                    <td>{formatMoney(credit.requestedAmount)}</td>
                                    <td>{credit.installments} Ay</td>
                                    <td>{CREDIT_PURPOSES[credit.purpose] || credit.purpose}</td>
                                    <td>{credit.creditScore || '-'}</td>
                                    <td>
                      <span className={`badge badge-${getStatusBadge(credit.status)}`}>
                        {CREDIT_STATUSES[credit.status] || credit.status}
                      </span>
                                    </td>
                                    <td>{formatDate(credit.createdAt)}</td>
                                    <td>
                                        {credit.status === 'PENDING' && (
                                            <div className="action-buttons">
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => handleApprove(credit.id)}
                                                    disabled={processing === credit.id}
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleReject(credit.id)}
                                                    disabled={processing === credit.id}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCreditsPage;