import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../api';
import { LoadingSpinner } from '../components/common';
import { ArrowUpRight, ArrowDownLeft, Filter, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data = await transactionAPI.getUserTransactions();
            setTransactions(data || []);
        } catch (error) {
            toast.error('İşlemler yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = async (newFilter) => {
        setFilter(newFilter);
        setLoading(true);

        try {
            let data;
            if (newFilter === 'ALL') {
                data = await transactionAPI.getUserTransactions();
            } else if (['SUCCESS', 'FAILED', 'PENDING'].includes(newFilter)) {
                data = await transactionAPI.filterByStatus(newFilter);
            } else {
                data = await transactionAPI.filterByType(newFilter);
            }
            setTransactions(data || []);
        } catch (error) {
            toast.error('Filtre uygulanamadı');
        } finally {
            setLoading(false);
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
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            SUCCESS: { label: 'Başarılı', class: 'success' },
            FAILED: { label: 'Başarısız', class: 'danger' },
            PENDING: { label: 'Beklemede', class: 'warning' }
        };
        return statusMap[status] || { label: status, class: 'default' };
    };

    const getTypeLabel = (type) => {
        const typeMap = {
            TRANSFER: 'Transfer',
            DEPOSIT: 'Para Yatırma',
            WITHDRAW: 'Para Çekme'
        };
        return typeMap[type] || type;
    };

    if (loading) {
        return <LoadingSpinner size="large" text="İşlemler yükleniyor..." />;
    }

    return (
        <div className="transactions-page fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">İşlem Geçmişi</h1>
                    <p className="page-subtitle">Tüm hesap hareketleriniz</p>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="filter-group">
                        <Filter size={20} />
                        <select
                            className="form-select filter-select"
                            value={filter}
                            onChange={(e) => handleFilterChange(e.target.value)}
                        >
                            <option value="ALL">Tüm İşlemler</option>
                            <optgroup label="Duruma Göre">
                                <option value="SUCCESS">Başarılı</option>
                                <option value="FAILED">Başarısız</option>
                                <option value="PENDING">Beklemede</option>
                            </optgroup>
                            <optgroup label="Türe Göre">
                                <option value="TRANSFER">Transfer</option>
                                <option value="DEPOSIT">Para Yatırma</option>
                                <option value="WITHDRAW">Para Çekme</option>
                            </optgroup>
                        </select>
                    </div>
                </div>

                {transactions.length === 0 ? (
                    <div className="empty-state">
                        <Activity size={48} />
                        <p>İşlem bulunamadı</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Tür</th>
                                <th>Gönderen</th>
                                <th>Alıcı</th>
                                <th>Tutar</th>
                                <th>Durum</th>
                                <th>Tarih</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td>
                                        <div className="tx-type">
                                            <div className={`tx-icon ${tx.transactionType?.toLowerCase()}`}>
                                                {tx.transactionType === 'DEPOSIT' ? (
                                                    <ArrowDownLeft size={16} />
                                                ) : (
                                                    <ArrowUpRight size={16} />
                                                )}
                                            </div>
                                            <span>{getTypeLabel(tx.transactionType)}</span>
                                        </div>
                                    </td>
                                    <td className="account-cell">{tx.sourceAccountNumber?.slice(-8) || '-'}</td>
                                    <td className="account-cell">{tx.targetAccountNumber?.slice(-8) || '-'}</td>
                                    <td className={`amount-cell ${tx.transactionType === 'DEPOSIT' ? 'positive' : 'negative'}`}>
                                        {tx.transactionType === 'DEPOSIT' ? '+' : '-'}{formatMoney(tx.amount)}
                                    </td>
                                    <td>
                      <span className={`badge badge-${getStatusBadge(tx.transactionStatus).class}`}>
                        {getStatusBadge(tx.transactionStatus).label}
                      </span>
                                    </td>
                                    <td className="date-cell">{formatDate(tx.createdAt)}</td>
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

export default TransactionsPage;