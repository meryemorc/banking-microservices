import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context';
import { Building2, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Lütfen tüm alanları doldurun');
            return;
        }

        setLoading(true);

        try {
            const result = await login(email, password);

            if (result.success) {
                toast.success(`Hoş geldin, ${result.user?.firstName}!`);
                navigate(from, { replace: true });
            } else {
                toast.error(result.error || 'Giriş başarısız');
            }
        } catch (error) {
            toast.error('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-brand">
                <div className="brand-content">
                    <div className="brand-logo">
                        <Building2 size={48} />
                        <span>NextBank</span>
                    </div>
                    <h1>Finansal geleceğinizi şekillendirin</h1>
                    <p>Güvenli, hızlı ve modern bankacılık deneyimi için NextBank'a hoş geldiniz.</p>

                    <div className="brand-features">
                        <div className="feature">
                            <span>🔒</span>
                            <span>256-bit şifreleme</span>
                        </div>
                        <div className="feature">
                            <span>⚡</span>
                            <span>Anlık transferler</span>
                        </div>
                        <div className="feature">
                            <span>📱</span>
                            <span>7/24 erişim</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-form-container">
                <div className="auth-form-wrapper">
                    <div className="auth-header">
                        <h2>Giriş Yap</h2>
                        <p>Hesabınıza erişmek için bilgilerinizi girin</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label">E-posta Adresi</label>
                            <div className="input-wrapper">
                                <Mail size={20} className="input-icon" />
                                <input
                                    type="email"
                                    className="form-input with-icon"
                                    placeholder="ornek@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Şifre</label>
                            <div className="input-wrapper">
                                <Lock size={20} className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input with-icon"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                        >
                            {loading ? 'Giriş yapılıyor...' : (
                                <>
                                    Giriş Yap
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Hesabınız yok mu?{' '}
                            <Link to="/register" className="link">Kayıt Ol</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;