import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';
import {
    LayoutDashboard,
    Wallet,
    ArrowLeftRight,
    CreditCard,
    Settings,
    LogOut,
    Shield,
    Building2
} from 'lucide-react';

const Sidebar = () => {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/accounts', icon: Wallet, label: 'Hesaplarım' },
        { path: '/transfer', icon: ArrowLeftRight, label: 'Para Transferi' },
        { path: '/transactions', icon: ArrowLeftRight, label: 'İşlem Geçmişi' },
        { path: '/credits', icon: CreditCard, label: 'Krediler' },
    ];

    const adminItems = [
        { path: '/admin/credits', icon: Shield, label: 'Kredi Yönetimi' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <Building2 size={32} />
                <span>NextBank</span>
            </div>

            <div className="sidebar-user">
                <div className="user-avatar">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="user-info">
                    <span className="user-name">{user?.firstName} {user?.lastName}</span>
                    <span className="user-role">{isAdmin ? 'Admin' : 'Kullanıcı'}</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <span className="nav-title">Ana Menü</span>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                {isAdmin && (
                    <div className="nav-section">
                        <span className="nav-title">Admin</span>
                        {adminItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </div>
                )}
            </nav>

            <div className="sidebar-footer">
                <NavLink to="/settings" className="nav-item">
                    <Settings size={20} />
                    <span>Ayarlar</span>
                </NavLink>
                <button className="nav-item logout-btn" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Çıkış Yap</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;