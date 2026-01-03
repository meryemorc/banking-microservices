import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [showBalance, setShowBalance] = useState(true);
    const [selectedCard, setSelectedCard] = useState(0);
    const [animatedBalance, setAnimatedBalance] = useState(0);
    const [notifications, setNotifications] = useState(3);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Backend'den gelecek veriler için state'ler
    const [user, setUser] = useState({
        name: '',
        avatar: '',
        lastLogin: '',
    });

    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState(null);

    // Sayfa yüklendiğinde verileri çek
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Kullanıcı bilgilerini localStorage'dan al
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                setUser({
                    name: storedUser.firstName && storedUser.lastName
                        ? `${storedUser.firstName} ${storedUser.lastName}`
                        : storedUser.username || 'Kullanıcı',
                    avatar: storedUser.firstName
                        ? `${storedUser.firstName.charAt(0)}${storedUser.lastName?.charAt(0) || ''}`.toUpperCase()
                        : (storedUser.username || 'U').charAt(0).toUpperCase(),
                    lastLogin: new Date().toLocaleDateString('tr-TR', {
                        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    }),
                });

                // Hesapları çek
                const accountsData = await api.getMyAccounts();
                setAccounts(accountsData || []);

                // Son işlemleri çek
                const transactionsData = await api.getRecentTransactions();
                setTransactions(transactionsData || []);

                // İstatistikleri çek
                const statsData = await api.getTransactionStats();
                setStats(statsData);

            } catch (err) {
                console.error('Veri çekme hatası:', err);
                setError('Veriler yüklenirken bir hata oluştu.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Toplam bakiye hesapla
    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

    // Animasyonlu bakiye
    useEffect(() => {
        if (totalBalance > 0) {
            const duration = 1500;
            const steps = 60;
            const increment = totalBalance / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= totalBalance) {
                    setAnimatedBalance(totalBalance);
                    clearInterval(timer);
                } else {
                    setAnimatedBalance(current);
                }
            }, duration / steps);

            return () => clearInterval(timer);
        }
    }, [totalBalance]);

    const formatCurrency = (amount, currency = '₺') => {
        return currency + Math.abs(amount).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Çıkış yap
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Hızlı işlemler - sayfa yönlendirmeleri
    const quickActions = [
        { icon: '💸', label: 'Para Transferi', color: '#4f46e5', path: '/transfer' },
        { icon: '📄', label: 'İşlemlerim', color: '#059669', path: '/transactions' },
        { icon: '💳', label: 'Kredilerim', color: '#d97706', path: '/my-credits' },
        { icon: '📝', label: 'Kredi Başvuru', color: '#dc2626', path: '/credit-apply' },
        { icon: '📊', label: 'İstatistikler', color: '#7c3aed', path: '/transactions' },
        { icon: '⚙️', label: 'Ayarlar', color: '#6b7280', path: '/settings' },
    ];

    const handleQuickAction = (path) => {
        navigate(path);
    };

    // Kartlar (örnek veri - backend'den gelebilir)
    const cards = [
        { type: 'Kredi Kartı', name: 'NextBank Gold', number: '**** **** **** 4589', limit: 50000, used: 12450, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { type: 'Banka Kartı', name: 'NextBank Debit', number: '**** **** **** 7823', balance: totalBalance, color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    ];

    // Loading durumu
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f8f9fb',
                fontFamily: "'Poppins', sans-serif",
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #c01919',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px',
                    }}></div>
                    <p style={{ color: '#666' }}>Yükleniyor...</p>
                </div>
                <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <aside style={styles.sidebar}>
                <div style={styles.sidebarLogo} onClick={() => navigate('/')}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c01919" strokeWidth="2">
                        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
                    </svg>
                    <span style={styles.sidebarLogoText}>NextBank</span>
                </div>

                <nav style={styles.nav}>
                    {[
                        { id: 'overview', icon: '🏠', label: 'Ana Sayfa', path: '/dashboard' },
                        { id: 'accounts', icon: '💳', label: 'Hesaplarım', path: '/dashboard' },
                        { id: 'transfers', icon: '💸', label: 'Transferler', path: '/transfer' },
                        { id: 'transactions', icon: '📄', label: 'İşlemlerim', path: '/transactions' },
                        { id: 'credits', icon: '💰', label: 'Kredilerim', path: '/my-credits' },
                        { id: 'credit-apply', icon: '📝', label: 'Kredi Başvuru', path: '/credit-apply' },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                navigate(item.path);
                            }}
                            style={{
                                ...styles.navItem,
                                ...(activeTab === item.id ? styles.navItemActive : {})
                            }}
                        >
                            <span style={styles.navIcon}>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div style={styles.sidebarFooter}>
                    <button style={styles.logoutBtn} onClick={handleLogout}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                        </svg>
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={styles.main}>
                {/* Header */}
                <header style={styles.header}>
                    <div style={styles.headerLeft}>
                        <h1 style={styles.greeting}>Hoş geldin, <span style={styles.userName}>{user.name.split(' ')[0]}</span> 👋</h1>
                        <p style={styles.lastLogin}>Son giriş: {user.lastLogin}</p>
                    </div>
                    <div style={styles.headerRight}>
                        <button style={styles.headerBtn}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                            </svg>
                        </button>
                        <button style={styles.headerBtn}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
                            </svg>
                            {notifications > 0 && <span style={styles.notifBadge}>{notifications}</span>}
                        </button>
                        <div style={styles.avatar}>{user.avatar}</div>
                    </div>
                </header>

                {/* Hata mesajı */}
                {error && (
                    <div style={{
                        backgroundColor: '#ffeaea',
                        border: '1px solid #ffcccc',
                        borderRadius: '10px',
                        padding: '15px',
                        marginBottom: '20px',
                        color: '#c01919',
                    }}>
                        {error}
                    </div>
                )}

                {/* Content Grid */}
                <div style={styles.content}>
                    {/* Balance Card */}
                    <div style={styles.balanceCard}>
                        <div style={styles.balanceCardInner}>
                            <div style={styles.balanceHeader}>
                                <div>
                                    <p style={styles.balanceLabel}>Toplam Bakiye</p>
                                    <h2 style={styles.balanceAmount}>
                                        {showBalance ? formatCurrency(animatedBalance) : '••••••••'}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setShowBalance(!showBalance)}
                                    style={styles.eyeBtn}
                                >
                                    {showBalance ? (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    ) : (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <div style={styles.accountsRow}>
                                {accounts.length > 0 ? accounts.map((acc, i) => (
                                    <div key={i} style={styles.accountMini}>
                                        <span style={styles.accountType}>{acc.accountType || 'Hesap'}</span>
                                        <span style={styles.accountBalance}>
                      {showBalance ? formatCurrency(acc.balance || 0, acc.currency || '₺') : '••••'}
                    </span>
                                    </div>
                                )) : (
                                    <div style={styles.accountMini}>
                                        <span style={styles.accountType}>Henüz hesap yok</span>
                                    </div>
                                )}
                            </div>
                            {accounts.length > 0 && accounts[0].accountNumber && (
                                <div style={styles.ibanRow}>
                                    <span style={styles.ibanLabel}>Hesap No:</span>
                                    <span style={styles.ibanNumber}>{accounts[0].accountNumber}</span>
                                    <button style={styles.copyBtn} onClick={() => navigator.clipboard.writeText(accounts[0].accountNumber)}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div style={styles.balancePattern}></div>
                    </div>

                    {/* Cards Carousel */}
                    <div style={styles.cardsSection}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>Kartlarım</h3>
                            <button style={styles.seeAllBtn}>Tümünü Gör →</button>
                        </div>
                        <div style={styles.cardsCarousel}>
                            {cards.map((card, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedCard(i)}
                                    style={{
                                        ...styles.creditCard,
                                        background: card.color,
                                        transform: selectedCard === i ? 'scale(1.02)' : 'scale(0.98)',
                                        opacity: selectedCard === i ? 1 : 0.7,
                                    }}
                                >
                                    <div style={styles.cardTop}>
                                        <span style={styles.cardType}>{card.type}</span>
                                        <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
                                            <circle cx="15" cy="15" r="12" fill="rgba(255,255,255,0.8)"/>
                                            <circle cx="25" cy="15" r="12" fill="rgba(255,255,255,0.6)"/>
                                        </svg>
                                    </div>
                                    <p style={styles.cardNumber}>{card.number}</p>
                                    <div style={styles.cardBottom}>
                                        <div>
                                            <p style={styles.cardLabel}>{card.type === 'Kredi Kartı' ? 'Kullanılabilir Limit' : 'Bakiye'}</p>
                                            <p style={styles.cardValue}>
                                                {card.type === 'Kredi Kartı'
                                                    ? formatCurrency(card.limit - card.used)
                                                    : formatCurrency(card.balance)}
                                            </p>
                                        </div>
                                        <span style={styles.cardName}>{card.name}</span>
                                    </div>
                                    {card.type === 'Kredi Kartı' && (
                                        <div style={styles.limitBar}>
                                            <div style={{...styles.limitFill, width: `${(card.used / card.limit) * 100}%`}}></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={styles.quickActions}>
                        <h3 style={styles.sectionTitle}>Hızlı İşlemler</h3>
                        <div style={styles.actionsGrid}>
                            {quickActions.map((action, i) => (
                                <button key={i} style={styles.actionBtn} onClick={() => handleQuickAction(action.path)}>
                  <span style={{...styles.actionIcon, backgroundColor: action.color + '20', color: action.color}}>
                    {action.icon}
                  </span>
                                    <span style={styles.actionLabel}>{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Transactions */}
                    <div style={styles.transactions}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>Son İşlemler</h3>
                            <button style={styles.seeAllBtn} onClick={() => navigate('/transactions')}>Tümünü Gör →</button>
                        </div>
                        <div style={styles.transactionsList}>
                            {transactions.length > 0 ? transactions.slice(0, 6).map((tx, index) => (
                                <div key={tx.id || index} style={styles.txItem}>
                                    <div style={styles.txLeft}>
                    <span style={styles.txIcon}>
                      {tx.type === 'TRANSFER' ? '💸' : tx.type === 'DEPOSIT' ? '💰' : '📄'}
                    </span>
                                        <div>
                                            <p style={styles.txTitle}>{tx.description || tx.type}</p>
                                            <p style={styles.txCategory}>
                                                {tx.transactionType || tx.type} • {new Date(tx.createdAt || tx.date).toLocaleDateString('tr-TR')}
                                            </p>
                                        </div>
                                    </div>
                                    <span style={{
                                        ...styles.txAmount,
                                        color: tx.amount >= 0 ? '#059669' : '#dc2626'
                                    }}>
                    {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </span>
                                </div>
                            )) : (
                                <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                                    Henüz işlem bulunmuyor
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div style={styles.chartCard}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>İstatistikler</h3>
                        </div>
                        {stats ? (
                            <div style={{ padding: '20px 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                                    <div>
                                        <p style={{ fontSize: '24px', fontWeight: '700', color: '#059669' }}>
                                            {formatCurrency(stats.totalIncome || 0)}
                                        </p>
                                        <p style={{ fontSize: '13px', color: '#666' }}>Toplam Gelir</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626' }}>
                                            {formatCurrency(stats.totalExpense || 0)}
                                        </p>
                                        <p style={{ fontSize: '13px', color: '#666' }}>Toplam Gider</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '24px', fontWeight: '700', color: '#4f46e5' }}>
                                            {stats.transactionCount || 0}
                                        </p>
                                        <p style={{ fontSize: '13px', color: '#666' }}>İşlem Sayısı</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p style={{ textAlign: 'center', color: '#888', padding: '40px' }}>
                                İstatistik verisi yok
                            </p>
                        )}
                    </div>
                </div>
            </main>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Montserrat:wght@600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          overflow-x: hidden;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #c01919;
          border-radius: 3px;
        }
      `}</style>
        </div>
    );
}
const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8f9fb',
        fontFamily: "'Poppins', sans-serif",
    },

    // Sidebar
    sidebar: {
        width: '260px',
        backgroundColor: '#fff',
        borderRight: '1px solid #eee',
        display: 'flex',
        flexDirection: 'column',
        padding: '25px 15px',
        position: 'fixed',
        height: '100vh',
        zIndex: 100,
    },
    sidebarLogo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '0 10px 25px',
        borderBottom: '1px solid #eee',
        marginBottom: '20px',
    },
    sidebarLogoText: {
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '22px',
        fontWeight: '700',
        fontStyle: 'italic',
        color: '#1a1a1a',
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        flex: 1,
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 15px',
        border: 'none',
        backgroundColor: 'transparent',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        color: '#666',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        fontFamily: "'Poppins', sans-serif",
    },
    navItemActive: {
        backgroundColor: '#c01919',
        color: '#fff',
    },
    navIcon: {
        fontSize: '18px',
    },
    sidebarFooter: {
        borderTop: '1px solid #eee',
        paddingTop: '20px',
    },
    logoutBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 15px',
        border: 'none',
        backgroundColor: '#fee2e2',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        color: '#dc2626',
        width: '100%',
        fontFamily: "'Poppins', sans-serif",
        transition: 'all 0.2s ease',
    },

    // Main
    main: {
        flex: 1,
        marginLeft: '260px',
        padding: '25px 30px',
        minHeight: '100vh',
    },

    // Header
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
    },
    headerLeft: {},
    greeting: {
        fontSize: '26px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '4px',
    },
    userName: {
        color: '#c01919',
    },
    lastLogin: {
        fontSize: '13px',
        color: '#888',
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    headerBtn: {
        position: 'relative',
        width: '45px',
        height: '45px',
        border: 'none',
        backgroundColor: '#fff',
        borderRadius: '12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
        color: '#555',
    },
    notifBadge: {
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '18px',
        height: '18px',
        backgroundColor: '#c01919',
        borderRadius: '50%',
        fontSize: '10px',
        fontWeight: '600',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: '45px',
        height: '45px',
        backgroundColor: '#c01919',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: '600',
        fontSize: '14px',
    },

    // Content Grid
    content: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '25px',
    },

    // Balance Card
    balanceCard: {
        gridColumn: 'span 8',
        background: 'linear-gradient(135deg, #c01919 0%, #8b0000 100%)',
        borderRadius: '24px',
        padding: '30px',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeIn 0.5s ease',
    },
    balanceCardInner: {
        position: 'relative',
        zIndex: 1,
    },
    balancePattern: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.5,
    },
    balanceHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '25px',
    },
    balanceLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: '14px',
        marginBottom: '5px',
    },
    balanceAmount: {
        color: '#fff',
        fontSize: '42px',
        fontWeight: '700',
        fontFamily: "'Montserrat', sans-serif",
    },
    eyeBtn: {
        background: 'rgba(255,255,255,0.15)',
        border: 'none',
        borderRadius: '10px',
        padding: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    accountsRow: {
        display: 'flex',
        gap: '30px',
        marginBottom: '20px',
    },
    accountMini: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    accountType: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '12px',
    },
    accountBalance: {
        color: '#fff',
        fontSize: '18px',
        fontWeight: '600',
    },
    ibanRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: '12px 15px',
        borderRadius: '12px',
    },
    ibanLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '12px',
    },
    ibanNumber: {
        color: '#fff',
        fontSize: '13px',
        fontFamily: 'monospace',
        letterSpacing: '1px',
    },
    copyBtn: {
        marginLeft: 'auto',
        background: 'none',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
        opacity: 0.7,
        transition: 'opacity 0.2s',
    },

    // Cards Section
    cardsSection: {
        gridColumn: 'span 4',
        backgroundColor: '#fff',
        borderRadius: '24px',
        padding: '25px',
        animation: 'fadeIn 0.5s ease 0.1s both',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1a1a1a',
    },
    seeAllBtn: {
        background: 'none',
        border: 'none',
        color: '#c01919',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        fontFamily: "'Poppins', sans-serif",
    },
    cardsCarousel: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    creditCard: {
        padding: '20px',
        borderRadius: '16px',
        color: '#fff',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
    },
    cardTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    cardType: {
        fontSize: '11px',
        fontWeight: '500',
        opacity: 0.9,
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    cardNumber: {
        fontSize: '16px',
        fontFamily: 'monospace',
        letterSpacing: '2px',
        marginBottom: '15px',
    },
    cardBottom: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cardLabel: {
        fontSize: '10px',
        opacity: 0.8,
        marginBottom: '3px',
    },
    cardValue: {
        fontSize: '18px',
        fontWeight: '600',
    },
    cardName: {
        fontSize: '11px',
        fontWeight: '500',
        opacity: 0.9,
    },
    limitBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '4px',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    limitFill: {
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.8)',
        transition: 'width 0.5s ease',
    },

    // Quick Actions
    quickActions: {
        gridColumn: 'span 12',
        backgroundColor: '#fff',
        borderRadius: '24px',
        padding: '25px',
        animation: 'fadeIn 0.5s ease 0.2s both',
    },
    actionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '15px',
        marginTop: '15px',
    },
    actionBtn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        padding: '20px 10px',
        border: 'none',
        backgroundColor: '#f8f9fb',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: "'Poppins', sans-serif",
    },
    actionIcon: {
        width: '50px',
        height: '50px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
    },
    actionLabel: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#333',
    },

    // Transactions
    transactions: {
        gridColumn: 'span 6',
        backgroundColor: '#fff',
        borderRadius: '24px',
        padding: '25px',
        animation: 'fadeIn 0.5s ease 0.3s both',
    },
    transactionsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    txItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        borderRadius: '12px',
        transition: 'background-color 0.2s',
        cursor: 'pointer',
    },
    txLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    txIcon: {
        width: '45px',
        height: '45px',
        backgroundColor: '#f8f9fb',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
    },
    txTitle: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#1a1a1a',
        marginBottom: '3px',
    },
    txCategory: {
        fontSize: '12px',
        color: '#888',
    },
    txAmount: {
        fontSize: '15px',
        fontWeight: '600',
    },

    // Chart
    chartCard: {
        gridColumn: 'span 6',
        backgroundColor: '#fff',
        borderRadius: '24px',
        padding: '25px',
        animation: 'fadeIn 0.5s ease 0.4s both',
    },
    chartSelect: {
        padding: '8px 12px',
        border: '1px solid #eee',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#666',
        backgroundColor: '#fff',
        cursor: 'pointer',
        fontFamily: "'Poppins', sans-serif",
    },
    chart: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: '150px',
        marginTop: '20px',
        padding: '0 10px',
    },
    chartBar: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
    },
    barGroup: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '4px',
    },
    bar: {
        width: '20px',
        borderRadius: '4px 4px 0 0',
        transition: 'height 0.5s ease',
    },
    chartLabel: {
        fontSize: '12px',
        color: '#888',
    },
    chartLegend: {
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        marginTop: '20px',
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        color: '#666',
    },
    legendDot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
    },

    // Spending
    spendingCard: {
        gridColumn: 'span 12',
        backgroundColor: '#fff',
        borderRadius: '24px',
        padding: '25px',
        animation: 'fadeIn 0.5s ease 0.5s both',
    },
    spendingList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '20px',
        marginTop: '20px',
    },
    spendingItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    spendingInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    spendingDot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
    },
    spendingCategory: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#333',
    },
    spendingPercent: {
        marginLeft: 'auto',
        fontSize: '12px',
        color: '#888',
    },
    spendingBarBg: {
        height: '8px',
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    spendingBarFill: {
        height: '100%',
        borderRadius: '4px',
        transition: 'width 0.5s ease',
    },
    spendingAmount: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1a1a1a',
    },
};
