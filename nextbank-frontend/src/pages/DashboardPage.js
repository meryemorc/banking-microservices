import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context';
import { accountAPI, transactionAPI } from '../api';
import { LoadingSpinner } from '../components/common';
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    TrendingUp,
    Plus,
    ArrowRight,
    CreditCard,
    Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardPage = () => {
    const { user } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const [accountsRes, transactionsRes, statsRes] = await Promise.all([
                accountAPI.getMyAccounts().catch(() => []),
                transactionAPI.getRecentTransactions().catch(() => []),
                transactionAPI.getStats().catch(() => null)
            ]);

            setAccounts(accountsRes || []);
            setRecentTransactions(transactionsRes || []);
            setStats(statsRes);
        } catch (error) {
            toast.error('Veriler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const totalBalance = accounts.reduce((sum, acc) => sum + (parseFloat(acc.balance) || 0), 0);

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <LoadingSpinner size="large" text="Yükleniyor..." />;
    }

    return (
        <div className="dashboard fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Hoş geldin, {user?.firstName}! 👋</h1>
                    <p className="page-subtitle">İşte finansal durumunun özeti</p>
                </div>
                <Link to="/accounts/new" className="btn btn-primary">
                    <Plus size={20} />
                    Yeni Hesap Aç
                </Link>
            </div>

            <div className="stats-grid">
                <div className="stat-card primary">
                    <div className="stat-icon">
                        <Wallet size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Toplam Bakiye</span>
                        <span className="stat-value">{formatMoney(totalBalance)}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green">
                        <ArrowDownLeft size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Toplam Gelen</span>
                        <span className="stat-value">{formatMoney(stats?.totalAmount || 0)}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon blue">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Başarılı İşlem</span>
                        <span className="stat-value">{stats?.successCount || 0}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon purple">
                        <Activity size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Toplam İşlem</span>
                        <span className="stat-value">{stats?.totalTransactions || 0}</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Hesaplarım</h3>
                        <Link to="/accounts" className="card-link">
                            Tümünü Gör <ArrowRight size={16} />
                        </Link>
                    </div>

                    {accounts.length === 0 ? (
                        <div className="empty-state">
                            <CreditCard size={48} />
                            <p>Henüz hesabınız yok</p>
                            <Link to="/accounts/new" className="btn btn-primary btn-sm">
                                İlk Hesabını Aç
                            </Link>
                        </div>
                    ) : (
                        <div className="accounts-list">
                            {accounts.slice(0, 3).map((account) => (
                                <div key={account.id} className="account-item">
                                    <div className="account-icon">
                                        {account.accountType === 'SAVING' ? '💰' : '💳'}
                                    </div>
                                    <div className="account-info">
                    <span className="account-type">
                      {account.accountType === 'SAVING' ? 'Birikim Hesabı' : 'Vadesiz Hesap'}
                    </span>
                                        <span className="account-number">
                      {account.accountNumber?.slice(-8)}
                    </span>
                                    </div>
                                    <span className="account-balance">
                    {formatMoney(account.balance)}
                  </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Son İşlemler</h3>
                        <Link to="/transactions" className="card-link">
                            Tümünü Gör <ArrowRight size={16} />
                        </Link>
                    </div>

                    {recentTransactions.length === 0 ? (
                        <div className="empty-state">
                            <Activity size={48} />
                            <p>Henüz işlem yapılmamış</p>
                        </div>
                    ) : (
                        <div className="transactions-list">
                            {recentTransactions.slice(0, 5).map((tx) => (
                                <div key={tx.id} className="transaction-item">
                                    <div className={`tx-icon ${tx.transactionType?.toLowerCase()}`}>
                                        {tx.transactionType === 'DEPOSIT' ? (
                                            <ArrowDownLeft size={18} />
                                        ) : (
                                            <ArrowUpRight size={18} />
                                        )}
                                    </div>
                                    <div className="tx-info">
                    <span className="tx-description">
                      {tx.description || tx.transactionType}
                    </span>
                                        <span className="tx-date">{formatDate(tx.createdAt)}</span>
                                    </div>
                                    <span className={`tx-amount ${tx.transactionType === 'DEPOSIT' ? 'positive' : 'negative'}`}>
                    {tx.transactionType === 'DEPOSIT' ? '+' : '-'}{formatMoney(tx.amount)}
                  </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="quick-actions">
                <h3>Hızlı İşlemler</h3>
                <div className="actions-grid">
                    <Link to="/transfer" className="action-card">
                        <ArrowUpRight size={24} />
                        <span>Para Gönder</span>
                    </Link>
                    <Link to="/accounts/new" className="action-card">
                        <Plus size={24} />
                        <span>Hesap Aç</span>
                    </Link>
                    <Link to="/credits" className="action-card">
                        <CreditCard size={24} />
                        <span>Kredi Başvurusu</span>
                    </Link>
                    <Link to="/transactions" className="action-card">
                        <Activity size={24} />
                        <span>İşlem Geçmişi</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;