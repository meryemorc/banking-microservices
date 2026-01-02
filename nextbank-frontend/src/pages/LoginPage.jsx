import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loginHover, setLoginHover] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.loginUser({ email, password });
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response));

            // Beni hatırla seçiliyse email'i kaydet
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // Dashboard'a yönlendir
            navigate('/dashboard');

        } catch (err) {
            setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    // Sayfa yüklendiğinde hatırlanan email'i getir
    React.useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    return (
        <div style={styles.container}>
            {/* Arka plan deseni */}
            <div style={styles.pattern}></div>

            {/* Ana içerik */}
            <div style={styles.content}>
                {/* Logo - Tıklanınca ana sayfaya git */}
                <div style={styles.logoContainer} onClick={() => navigate('/')}>
                    <div style={styles.logoIcon}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c01919" strokeWidth="2">
                            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
                        </svg>
                    </div>
                    <h1 style={styles.logo}>NextBank</h1>
                </div>

                {/* Login Kartı */}
                <div style={styles.loginCard}>
                    <h2 style={styles.cardTitle}>Hesabınıza Giriş Yapın</h2>
                    <p style={styles.cardSubtitle}>Güvenli bankacılık deneyimine hoş geldiniz</p>

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

                    <form onSubmit={handleLogin} style={styles.form}>
                        {/* E-posta Input */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>E-posta Adresi</label>
                            <div style={{
                                ...styles.inputWrapper,
                                ...(focusedInput === 'email' ? styles.inputWrapperFocus : {})
                            }}>
                                <svg style={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                                <input
                                    type="email"
                                    placeholder="ornek@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedInput('email')}
                                    onBlur={() => setFocusedInput(null)}
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        {/* Şifre Input */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Şifre</label>
                            <div style={{
                                ...styles.inputWrapper,
                                ...(focusedInput === 'password' ? styles.inputWrapperFocus : {})
                            }}>
                                <svg style={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput(null)}
                                    style={styles.input}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={styles.eyeButton}
                                >
                                    {showPassword ? (
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
                            </div>
                        </div>

                        {/* Beni Hatırla & Şifremi Unuttum */}
                        <div style={styles.optionsRow}>
                            <label style={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    style={styles.checkbox}
                                />
                                <span style={{
                                    ...styles.checkboxCustom,
                                    backgroundColor: rememberMe ? '#c01919' : '#fff',
                                    borderColor: rememberMe ? '#c01919' : '#ccc',
                                }}>
                  {rememberMe && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                      </svg>
                  )}
                </span>
                                <span style={styles.checkboxText}>Beni Hatırla</span>
                            </label>
                            <a href="#" style={styles.forgotLink}>Şifremi Unuttum</a>
                        </div>

                        {/* Giriş Butonu */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                ...styles.loginButton,
                                ...(loginHover && !isLoading ? styles.loginButtonHover : {}),
                                ...(isLoading ? styles.loginButtonLoading : {})
                            }}
                            onMouseEnter={() => setLoginHover(true)}
                            onMouseLeave={() => setLoginHover(false)}
                        >
                            {isLoading ? (
                                <div style={styles.spinner}></div>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
                                    </svg>
                                    GİRİŞ YAP
                                </>
                            )}
                        </button>
                    </form>

                    {/* Ayırıcı */}
                    <div style={styles.divider}>
                        <span style={styles.dividerLine}></span>
                        <span style={styles.dividerText}>veya</span>
                        <span style={styles.dividerLine}></span>
                    </div>

                    {/* Alternatif Giriş */}
                    <div style={styles.altLogin}>
                        <button style={styles.altButton} type="button">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            Telefon ile Giriş
                        </button>
                        <button style={styles.altButton} type="button">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                <circle cx="12" cy="16" r="1"/>
                            </svg>
                            Mobil Onay ile Giriş
                        </button>
                    </div>

                    {/* Kayıt Ol Linki */}
                    <p style={styles.registerText}>
                        Hesabınız yok mu?{' '}
                        <span
                            style={styles.registerLink}
                            onClick={() => navigate('/register')}
                        >
              Hemen Kayıt Olun
            </span>
                    </p>
                </div>

                {/* Güvenlik Badge'leri */}
                <div style={styles.securityBadges}>
                    <div style={styles.badge}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        <span>256-bit SSL</span>
                    </div>
                    <div style={styles.badge}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2">
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
                <div style={styles.footerLinks}>
                    <a href="#" style={styles.footerLink}>Yardım</a>
                    <span style={styles.footerDivider}>|</span>
                    <a href="#" style={styles.footerLink}>Gizlilik</a>
                    <span style={styles.footerDivider}>|</span>
                    <a href="#" style={styles.footerLink}>İletişim</a>
                </div>
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
        maxWidth: '420px',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        border: '3px solid #000',
        borderRadius: '14px',
        padding: '14px 35px',
        marginBottom: '30px',
        backgroundColor: 'rgba(255,255,255,0.95)',
        boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
        animation: 'float 3s ease-in-out infinite',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
    },
    logoIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '32px',
        fontWeight: '700',
        fontStyle: 'italic',
        color: '#1a1a1a',
        margin: 0,
        letterSpacing: '-1px',
    },
    loginCard: {
        backgroundColor: 'rgba(255,255,255,0.97)',
        borderRadius: '24px',
        padding: '40px 35px',
        width: '100%',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        marginBottom: '25px',
    },
    cardTitle: {
        fontFamily: "'Poppins', sans-serif",
        fontSize: '24px',
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: '8px',
        textAlign: 'center',
    },
    cardSubtitle: {
        fontFamily: "'Poppins', sans-serif",
        fontSize: '14px',
        color: '#666',
        marginBottom: '30px',
        textAlign: 'center',
    },
    errorBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#ffeaea',
        border: '1px solid #ffcccc',
        borderRadius: '10px',
        padding: '12px 15px',
        marginBottom: '20px',
        color: '#c01919',
        fontSize: '14px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#333',
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '12px',
        padding: '0 15px',
        border: '2px solid transparent',
        transition: 'all 0.3s ease',
    },
    inputWrapperFocus: {
        border: '2px solid #c01919',
        backgroundColor: '#fff',
        boxShadow: '0 0 0 4px rgba(192, 25, 25, 0.1)',
    },
    inputIcon: {
        marginRight: '12px',
        flexShrink: 0,
    },
    input: {
        flex: 1,
        border: 'none',
        backgroundColor: 'transparent',
        padding: '16px 0',
        fontSize: '15px',
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
    optionsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '5px',
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
    },
    checkbox: {
        display: 'none',
    },
    checkboxCustom: {
        width: '20px',
        height: '20px',
        borderRadius: '6px',
        border: '2px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
    },
    checkboxText: {
        fontSize: '14px',
        color: '#555',
    },
    forgotLink: {
        fontSize: '14px',
        color: '#c01919',
        textDecoration: 'none',
        fontWeight: '500',
        transition: 'color 0.2s ease',
    },
    loginButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        backgroundColor: '#c01919',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        padding: '18px',
        fontSize: '16px',
        fontWeight: '600',
        fontFamily: "'Poppins', sans-serif",
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginTop: '10px',
        boxShadow: '0 8px 25px rgba(192, 25, 25, 0.35)',
    },
    loginButtonHover: {
        backgroundColor: '#a01515',
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 30px rgba(192, 25, 25, 0.45)',
    },
    loginButtonLoading: {
        backgroundColor: '#d44',
        cursor: 'not-allowed',
    },
    spinner: {
        width: '24px',
        height: '24px',
        border: '3px solid rgba(255,255,255,0.3)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        margin: '25px 0',
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        backgroundColor: '#ddd',
    },
    dividerText: {
        padding: '0 15px',
        color: '#888',
        fontSize: '13px',
    },
    altLogin: {
        display: 'flex',
        gap: '12px',
    },
    altButton: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        backgroundColor: '#f5f5f5',
        color: '#333',
        border: 'none',
        borderRadius: '10px',
        padding: '14px 10px',
        fontSize: '13px',
        fontWeight: '500',
        fontFamily: "'Poppins', sans-serif",
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    registerText: {
        textAlign: 'center',
        marginTop: '25px',
        fontSize: '14px',
        color: '#666',
    },
    registerLink: {
        color: '#c01919',
        textDecoration: 'none',
        fontWeight: '600',
        cursor: 'pointer',
    },
    securityBadges: {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
    },
    badge: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'rgba(255,255,255,0.9)',
        fontSize: '12px',
        fontWeight: '500',
        padding: '8px 14px',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '20px',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '20px',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    footerText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '12px',
        marginBottom: '8px',
    },
    footerLinks: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
    },
    footerLink: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '11px',
        textDecoration: 'none',
    },
    footerDivider: {
        color: 'rgba(255,255,255,0.4)',
    },
};
