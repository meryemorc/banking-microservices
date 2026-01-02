import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        tcNo: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptKVKK, setAcceptKVKK] = useState(false);
    const [registerHover, setRegisterHover] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNextStep = () => {
        setCurrentStep(2);
    };

    const handlePrevStep = () => {
        setCurrentStep(1);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // Şifre kontrolü
        if (formData.password !== formData.confirmPassword) {
            setError('Şifreler eşleşmiyor!');
            return;
        }

        // Şifre kuralları kontrolü
        if (formData.password.length < 8 || !/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
            setError('Şifre gereksinimleri karşılanmıyor!');
            return;
        }

        setIsLoading(true);

        try {
            // API'ye register isteği gönder
            await api.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                tcNo: formData.tcNo,
                phone: formData.phone,
                email: formData.email,
                password: formData.password,
            });

            // Başarılı kayıt - Login sayfasına yönlendir
            navigate('/login');

        } catch (err) {
            setError('Kayıt işlemi başarısız. Lütfen bilgilerinizi kontrol edin.');
        } finally {
            setIsLoading(false);
        }
    };

    const InputField = ({ name, label, type = 'text', placeholder, icon, showToggle, isVisible, onToggle, maxLength }) => (
        <div style={styles.inputGroup}>
            <label style={styles.label}>{label}</label>
            <div style={{
                ...styles.inputWrapper,
                ...(focusedInput === name ? styles.inputWrapperFocus : {})
            }}>
                <div style={styles.inputIcon}>{icon}</div>
                <input
                    type={showToggle ? (isVisible ? 'text' : 'password') : type}
                    name={name}
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput(name)}
                    onBlur={() => setFocusedInput(null)}
                    style={styles.input}
                    maxLength={maxLength}
                    required
                />
                {showToggle && (
                    <button type="button" onClick={onToggle} style={styles.eyeButton}>
                        {isVisible ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                <line x1="1" y1="1" x2="23" y2="23"/>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            {/* Arka plan deseni */}
            <div style={styles.pattern}></div>

            {/* Ana içerik */}
            <div style={styles.content}>
                {/* Logo - Tıklanınca ana sayfaya git */}
                <div style={styles.logoContainer} onClick={() => navigate('/')}>
                    <div style={styles.logoIcon}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c01919" strokeWidth="2">
                            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
                        </svg>
                    </div>
                    <h1 style={styles.logo}>NextBank</h1>
                </div>

                {/* Register Kartı */}
                <div style={styles.registerCard}>
                    <h2 style={styles.cardTitle}>Hesap Oluşturun</h2>
                    <p style={styles.cardSubtitle}>NextBank ailesine katılın</p>

                    {/* Hata Mesajı */}
                    {error && (
                        <div style={styles.errorBox}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c01919" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="15" y1="9" x2="9" y2="15"/>
                                <line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Progress Bar */}
                    <div style={styles.progressContainer}>
                        <div style={styles.progressBar}>
                            <div style={{
                                ...styles.progressFill,
                                width: currentStep === 1 ? '50%' : '100%'
                            }}></div>
                        </div>
                        <div style={styles.progressSteps}>
                            <span style={{...styles.stepText, color: '#c01919'}}>Kişisel Bilgiler</span>
                            <span style={{...styles.stepText, color: currentStep === 2 ? '#c01919' : '#aaa'}}>Güvenlik</span>
                        </div>
                    </div>

                    <form onSubmit={handleRegister} style={styles.form}>
                        {currentStep === 1 ? (
                            <>
                                {/* Ad Soyad Row */}
                                <div style={styles.row}>
                                    <InputField
                                        name="firstName"
                                        label="Ad"
                                        placeholder="Adınız"
                                        icon={
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                                <circle cx="12" cy="7" r="4"/>
                                            </svg>
                                        }
                                    />
                                    <InputField
                                        name="lastName"
                                        label="Soyad"
                                        placeholder="Soyadınız"
                                        icon={
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                                <circle cx="12" cy="7" r="4"/>
                                            </svg>
                                        }
                                    />
                                </div>

                                {/* TC Kimlik No */}
                                <InputField
                                    name="tcNo"
                                    label="T.C. Kimlik Numarası"
                                    placeholder="12345678901"
                                    maxLength={11}
                                    icon={
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                                            <rect x="3" y="4" width="18" height="16" rx="2"/>
                                            <line x1="7" y1="8" x2="17" y2="8"/>
                                            <line x1="7" y1="12" x2="13" y2="12"/>
                                            <line x1="7" y1="16" x2="10" y2="16"/>
                                        </svg>
                                    }
                                />

                                {/* Telefon */}
                                <InputField
                                    name="phone"
                                    label="Telefon Numarası"
                                    type="tel"
                                    placeholder="0 (5XX) XXX XX XX"
                                    icon={
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                        </svg>
                                    }
                                />

                                {/* E-posta */}
                                <InputField
                                    name="email"
                                    label="E-posta Adresi"
                                    type="email"
                                    placeholder="ornek@email.com"
                                    icon={
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                            <polyline points="22,6 12,13 2,6"/>
                                        </svg>
                                    }
                                />

                                {/* Devam Butonu */}
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    style={{
                                        ...styles.registerButton,
                                        ...(registerHover ? styles.registerButtonHover : {})
                                    }}
                                    onMouseEnter={() => setRegisterHover(true)}
                                    onMouseLeave={() => setRegisterHover(false)}
                                >
                                    Devam Et
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 18l6-6-6-6"/>
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Şifre */}
                                <InputField
                                    name="password"
                                    label="Şifre"
                                    placeholder="••••••••"
                                    showToggle
                                    isVisible={showPassword}
                                    onToggle={() => setShowPassword(!showPassword)}
                                    icon={
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                        </svg>
                                    }
                                />

                                {/* Şifre Kuralları */}
                                <div style={styles.passwordRules}>
                                    <p style={styles.ruleTitle}>Şifreniz şunları içermelidir:</p>
                                    <div style={styles.ruleItem}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={formData.password.length >= 8 ? '#22c55e' : '#aaa'} strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                        <span style={{color: formData.password.length >= 8 ? '#22c55e' : '#666'}}>En az 8 karakter</span>
                                    </div>
                                    <div style={styles.ruleItem}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={/[A-Z]/.test(formData.password) ? '#22c55e' : '#aaa'} strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                        <span style={{color: /[A-Z]/.test(formData.password) ? '#22c55e' : '#666'}}>Bir büyük harf</span>
                                    </div>
                                    <div style={styles.ruleItem}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={/[0-9]/.test(formData.password) ? '#22c55e' : '#aaa'} strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                        <span style={{color: /[0-9]/.test(formData.password) ? '#22c55e' : '#666'}}>Bir rakam</span>
                                    </div>
                                </div>

                                {/* Şifre Tekrar */}
                                <InputField
                                    name="confirmPassword"
                                    label="Şifre Tekrar"
                                    placeholder="••••••••"
                                    showToggle
                                    isVisible={showConfirmPassword}
                                    onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                                    icon={
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                        </svg>
                                    }
                                />

                                {/* Şifre Eşleşme Göstergesi */}
                                {formData.confirmPassword && (
                                    <div style={styles.matchIndicator}>
                                        {formData.password === formData.confirmPassword ? (
                                            <>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                                    <polyline points="22 4 12 14.01 9 11.01"/>
                                                </svg>
                                                <span style={{color: '#22c55e'}}>Şifreler eşleşiyor</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10"/>
                                                    <line x1="15" y1="9" x2="9" y2="15"/>
                                                    <line x1="9" y1="9" x2="15" y2="15"/>
                                                </svg>
                                                <span style={{color: '#ef4444'}}>Şifreler eşleşmiyor</span>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Sözleşmeler */}
                                <div style={styles.termsContainer}>
                                    <label style={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={acceptTerms}
                                            onChange={(e) => setAcceptTerms(e.target.checked)}
                                            style={styles.checkbox}
                                        />
                                        <span style={{
                                            ...styles.checkboxCustom,
                                            backgroundColor: acceptTerms ? '#c01919' : '#fff',
                                            borderColor: acceptTerms ? '#c01919' : '#ccc',
                                        }}>
                      {acceptTerms && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12"/>
                          </svg>
                      )}
                    </span>
                                        <span style={styles.termsText}>
                      <span style={styles.termsLink}>Kullanıcı Sözleşmesi</span>'ni okudum ve kabul ediyorum.
                    </span>
                                    </label>

                                    <label style={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={acceptKVKK}
                                            onChange={(e) => setAcceptKVKK(e.target.checked)}
                                            style={styles.checkbox}
                                        />
                                        <span style={{
                                            ...styles.checkboxCustom,
                                            backgroundColor: acceptKVKK ? '#c01919' : '#fff',
                                            borderColor: acceptKVKK ? '#c01919' : '#ccc',
                                        }}>
                      {acceptKVKK && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12"/>
                          </svg>
                      )}
                    </span>
                                        <span style={styles.termsText}>
                      <span style={styles.termsLink}>KVKK Aydınlatma Metni</span>'ni okudum ve onaylıyorum.
                    </span>
                                    </label>
                                </div>

                                {/* Butonlar */}
                                <div style={styles.buttonRow}>
                                    <button
                                        type="button"
                                        onClick={handlePrevStep}
                                        style={styles.backButton}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M15 18l-6-6 6-6"/>
                                        </svg>
                                        Geri
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !acceptTerms || !acceptKVKK}
                                        style={{
                                            ...styles.registerButton,
                                            ...styles.submitButton,
                                            ...(registerHover && !isLoading && acceptTerms && acceptKVKK ? styles.registerButtonHover : {}),
                                            ...(!acceptTerms || !acceptKVKK ? styles.buttonDisabled : {})
                                        }}
                                        onMouseEnter={() => setRegisterHover(true)}
                                        onMouseLeave={() => setRegisterHover(false)}
                                    >
                                        {isLoading ? (
                                            <div style={styles.spinner}></div>
                                        ) : (
                                            <>
                                                Hesap Oluştur
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                                    <circle cx="8.5" cy="7" r="4"/>
                                                    <line x1="20" y1="8" x2="20" y2="14"/>
                                                    <line x1="23" y1="11" x2="17" y2="11"/>
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>

                    {/* Giriş Yap Linki */}
                    <p style={styles.loginText}>
                        Zaten hesabınız var mı?{' '}
                        <span style={{...styles.loginLink, cursor: 'pointer'}} onClick={() => navigate('/login')}>
              Giriş Yapın
            </span>
                    </p>
                </div>

                {/* Güvenlik Badge'leri */}
                <div style={styles.securityBadges}>
                    <div style={styles.badge}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        <span>256-bit SSL</span>
                    </div>
                    <div style={styles.badge}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        <span>Güvenli Bağlantı</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={styles.footer}>
                <p style={styles.footerText}>© 2025 NextBank. Tüm hakları saklıdır.</p>
            </footer>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input::placeholder {
          color: #aaa;
        }
        
        input:focus {
          outline: none;
        }
      `}</style>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#c01919',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Poppins', sans-serif",
    },
    pattern: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%),
      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
    `,
        pointerEvents: 'none',
    },
    content: {
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'fadeInUp 0.8s ease-out',
        width: '100%',
        maxWidth: '500px',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        border: '3px solid #000',
        borderRadius: '12px',
        padding: '12px 30px',
        marginBottom: '25px',
        backgroundColor: 'rgba(255,255,255,0.95)',
        boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
        animation: 'float 3s ease-in-out infinite',
    },
    logoIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '28px',
        fontWeight: '700',
        fontStyle: 'italic',
        color: '#1a1a1a',
        margin: 0,
        letterSpacing: '-1px',
    },
    registerCard: {
        backgroundColor: 'rgba(255,255,255,0.97)',
        borderRadius: '24px',
        padding: '35px 30px',
        width: '100%',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        marginBottom: '20px',
    },
    cardTitle: {
        fontFamily: "'Poppins', sans-serif",
        fontSize: '22px',
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: '6px',
        textAlign: 'center',
    },
    cardSubtitle: {
        fontFamily: "'Poppins', sans-serif",
        fontSize: '14px',
        color: '#666',
        marginBottom: '20px',
        textAlign: 'center',
    },
    progressContainer: {
        marginBottom: '25px',
    },
    progressBar: {
        height: '4px',
        backgroundColor: '#e0e0e0',
        borderRadius: '2px',
        overflow: 'hidden',
        marginBottom: '10px',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#c01919',
        transition: 'width 0.3s ease',
    },
    progressSteps: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    stepText: {
        fontSize: '12px',
        fontWeight: '500',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
    },
    row: {
        display: 'flex',
        gap: '15px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flex: 1,
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#333',
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '10px',
        padding: '0 12px',
        border: '2px solid transparent',
        transition: 'all 0.3s ease',
    },
    inputWrapperFocus: {
        border: '2px solid #c01919',
        backgroundColor: '#fff',
        boxShadow: '0 0 0 4px rgba(192, 25, 25, 0.1)',
    },
    inputIcon: {
        marginRight: '10px',
        flexShrink: 0,
        display: 'flex',
    },
    input: {
        flex: 1,
        border: 'none',
        backgroundColor: 'transparent',
        padding: '14px 0',
        fontSize: '14px',
        fontFamily: "'Poppins', sans-serif",
        color: '#1a1a1a',
    },
    eyeButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    passwordRules: {
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        padding: '12px 15px',
        marginTop: '-10px',
    },
    ruleTitle: {
        fontSize: '12px',
        color: '#666',
        marginBottom: '8px',
        fontWeight: '500',
    },
    ruleItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        marginBottom: '4px',
    },
    matchIndicator: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '13px',
        fontWeight: '500',
        marginTop: '-10px',
    },
    termsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '5px',
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        cursor: 'pointer',
    },
    checkbox: {
        display: 'none',
    },
    checkboxCustom: {
        width: '20px',
        height: '20px',
        minWidth: '20px',
        borderRadius: '5px',
        border: '2px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        marginTop: '2px',
    },
    termsText: {
        fontSize: '13px',
        color: '#555',
        lineHeight: '1.4',
    },
    termsLink: {
        color: '#c01919',
        textDecoration: 'none',
        fontWeight: '500',
    },
    buttonRow: {
        display: 'flex',
        gap: '12px',
        marginTop: '5px',
    },
    backButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        backgroundColor: '#f5f5f5',
        color: '#333',
        border: 'none',
        borderRadius: '10px',
        padding: '14px 20px',
        fontSize: '14px',
        fontWeight: '600',
        fontFamily: "'Poppins', sans-serif",
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    registerButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        backgroundColor: '#c01919',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        padding: '16px',
        fontSize: '15px',
        fontWeight: '600',
        fontFamily: "'Poppins', sans-serif",
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 8px 25px rgba(192, 25, 25, 0.35)',
        width: '100%',
    },
    submitButton: {
        flex: 1,
    },
    registerButtonHover: {
        backgroundColor: '#a01515',
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 30px rgba(192, 25, 25, 0.45)',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
        cursor: 'not-allowed',
        boxShadow: 'none',
    },
    spinner: {
        width: '22px',
        height: '22px',
        border: '3px solid rgba(255,255,255,0.3)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    loginText: {
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '14px',
        color: '#666',
    },
    loginLink: {
        color: '#c01919',
        textDecoration: 'none',
        fontWeight: '600',
    },
    securityBadges: {
        display: 'flex',
        gap: '15px',
        marginBottom: '15px',
    },
    badge: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'rgba(255,255,255,0.9)',
        fontSize: '11px',
        fontWeight: '500',
        padding: '8px 12px',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '20px',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '15px',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    footerText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '11px',
    },
    errorBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#ffeaea',
        border: '1px solid #ffcccc',
        borderRadius: '10px',
        padding: '12px 15px',
        marginBottom: '15px',
        color: '#c01919',
        fontSize: '14px',
    },
};