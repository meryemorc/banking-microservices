import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import {
    Building2, Mail, Lock, User, Phone, CreditCard,
    ArrowRight, ArrowLeft, Eye, EyeOff, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        tcNo: '',
        phone: ''
    });

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateStep1 = () => {
        if (!formData.firstName || !formData.lastName) {
            toast.error('Ad ve soyad gerekli');
            return false;
        }
        if (!formData.tcNo || formData.tcNo.length !== 11) {
            toast.error('Geçerli bir TC Kimlik No girin (11 haneli)');
            return false;
        }
        if (!formData.phone || formData.phone.length < 10) {
            toast.error('Geçerli bir telefon numarası girin');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!formData.email || !formData.email.includes('@')) {
            toast.error('Geçerli bir e-posta adresi girin');
            return false;
        }
        if (!formData.username || formData.username.length < 3) {
            toast.error('Kullanıcı adı en az 3 karakter olmalı');
            return false;
        }
        if (!formData.password || formData.password.length < 6) {
            toast.error('Şifre en az 6 karakter olmalı');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Şifreler eşleşmiyor');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep2()) return;

        setLoading(true);

        try {
            const result = await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                username: formData.username,
                password: formData.password,
                tcNo: formData.tcNo,
                phone: formData.phone
            });

            if (result.success) {
                toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
                navigate('/login');
            } else {
                toast.error(result.error || 'Kayıt başarısız');
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
                    <h1>Dijital bankacılığın geleceğine katılın</h1>
                    <p>Hemen ücretsiz hesap oluşturun ve avantajlardan yararlanmaya başlayın.</p>

                    <div className="register-benefits">
                        <div className="benefit"><Check size={20} /><span>Ücretsiz hesap açılışı</span></div>
                        <div className="benefit"><Check size={20} /><span>Anında kart teslimatı</span></div>
                        <div className="benefit"><Check size={20} /><span>Komisyonsuz transferler</span></div>
                        <div className="benefit"><Check size={20} /><span>Yüksek faiz oranları</span></div>
                    </div>
                </div>
            </div>

            <div className="auth-form-container">
                <div className="auth-form-wrapper">
                    <div className="auth-header">
                        <h2>Hesap Oluştur</h2>
                        <p>Adım {step}/2 - {step === 1 ? 'Kişisel Bilgiler' : 'Hesap Bilgileri'}</p>
                    </div>

                    <div className="progress-bar">
                        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                            <div className="step-number">1</div>
                            <span>Kişisel</span>
                        </div>
                        <div className="progress-line">
                            <div className={`line-fill ${step >= 2 ? 'active' : ''}`}></div>
                        </div>
                        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                            <div className="step-number">2</div>
                            <span>Hesap</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {step === 1 && (
                            <>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Ad</label>
                                        <div className="input-wrapper">
                                            <User size={20} className="input-icon" />
                                            <input
                                                type="text"
                                                name="firstName"
                                                className="form-input with-icon"
                                                placeholder="Adınız"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Soyad</label>
                                        <div className="input-wrapper">
                                            <User size={20} className="input-icon" />
                                            <input
                                                type="text"
                                                name="lastName"
                                                className="form-input with-icon"
                                                placeholder="Soyadınız"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">TC Kimlik No</label>
                                    <div className="input-wrapper">
                                        <CreditCard size={20} className="input-icon" />
                                        <input
                                            type="text"
                                            name="tcNo"
                                            className="form-input with-icon"
                                            placeholder="11 haneli TC Kimlik No"
                                            maxLength={11}
                                            value={formData.tcNo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Telefon Numarası</label>
                                    <div className="input-wrapper">
                                        <Phone size={20} className="input-icon" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-input with-icon"
                                            placeholder="05XX XXX XX XX"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <button type="button" className="btn btn-primary btn-block" onClick={handleNext}>
                                    Devam Et <ArrowRight size={20} />
                                </button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">E-posta Adresi</label>
                                    <div className="input-wrapper">
                                        <Mail size={20} className="input-icon" />
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-input with-icon"
                                            placeholder="ornek@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Kullanıcı Adı</label>
                                    <div className="input-wrapper">
                                        <User size={20} className="input-icon" />
                                        <input
                                            type="text"
                                            name="username"
                                            className="form-input with-icon"
                                            placeholder="kullanici_adi"
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Şifre</label>
                                    <div className="input-wrapper">
                                        <Lock size={20} className="input-icon" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            className="form-input with-icon"
                                            placeholder="En az 6 karakter"
                                            value={formData.password}
                                            onChange={handleChange}
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

                                <div className="form-group">
                                    <label className="form-label">Şifre Tekrar</label>
                                    <div className="input-wrapper">
                                        <Lock size={20} className="input-icon" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            className="form-input with-icon"
                                            placeholder="Şifrenizi tekrar girin"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                                        <ArrowLeft size={20} /> Geri
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>

                    <div className="auth-footer">
                        <p>
                            Zaten hesabınız var mı?{' '}
                            <Link to="/login" className="link">Giriş Yap</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;