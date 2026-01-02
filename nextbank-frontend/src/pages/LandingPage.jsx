import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ← React Router ekle

export default function NextBankLanding() {
    const navigate = useNavigate(); // ← Navigate hook
    const [loginHover, setLoginHover] = useState(false);
    const [registerHover, setRegisterHover] = useState(false);
    const [loginRipple, setLoginRipple] = useState(false);
    const [registerRipple, setRegisterRipple] = useState(false);

    const handleLogin = () => {
        setLoginRipple(true);
        setTimeout(() => {
            setLoginRipple(false);
            navigate('/login'); // ← Login sayfasına yönlendir
        }, 600);
    };

    const handleRegister = () => {
        setRegisterRipple(true);
        setTimeout(() => {
            setRegisterRipple(false);
            navigate('/register'); // ← Register sayfasına yönlendir
        }, 600);
    };

    return (
        <div style={styles.container}>
            {/* Arka plan deseni */}
            <div style={styles.pattern}></div>

            {/* Ana içerik */}
            <div style={styles.content}>
                {/* Logo */}
                <div style={styles.logoContainer}>
                    <div style={styles.logoIcon}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c01919" strokeWidth="2">
                            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
                        </svg>
                    </div>
                    <h1 style={styles.logo}>NextBank</h1>
                </div>

                {/* Hoşgeldin Mesajı */}
                <p style={styles.welcome}>NextBank'a Hoşgeldiniz</p>
                <p style={styles.subtitle}>Güvenli ve hızlı bankacılık deneyimi</p>

                {/* Butonlar */}
                <div style={styles.buttonContainer}>
                    <button
                        style={{
                            ...styles.button,
                            ...(loginHover ? styles.buttonHover : {}),
                        }}
                        onClick={handleLogin}
                        onMouseEnter={() => setLoginHover(true)}
                        onMouseLeave={() => setLoginHover(false)}
                    >
                        {loginRipple && <span style={styles.ripple}></span>}
                        <svg style={styles.buttonIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
                        </svg>
                        GİRİŞ YAP
                    </button>
                    <button
                        style={{
                            ...styles.button,
                            ...styles.buttonSecondary,
                            ...(registerHover ? styles.buttonSecondaryHover : {}),
                        }}
                        onClick={handleRegister}
                        onMouseEnter={() => setRegisterHover(true)}
                        onMouseLeave={() => setRegisterHover(false)}
                    >
                        {registerRipple && <span style={styles.ripple}></span>}
                        <svg style={styles.buttonIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        HESAP OLUŞTUR
                    </button>
                </div>

                {/* Güvenlik Badge'leri */}
                <div style={styles.securityBadges}>
                    <div style={styles.badge}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        <span>256-bit SSL</span>
                    </div>
                    <div style={styles.badge}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        <span>Güvenli Şifreleme</span>
                    </div>
                    <div style={styles.badge}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span>BDDK Lisanslı</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={styles.footer}>
                <div style={styles.socialIcons}>
                    <a href="#" style={styles.socialLink}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                    </a>
                    <a href="#" style={styles.socialLink}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                    </a>
                    <a href="#" style={styles.socialLink}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                    </a>
                </div>
                <p style={styles.footerText}>© 2025 NextBank. Tüm hakları saklıdır.</p>
                <div style={styles.footerLinks}>
                    <a href="#" style={styles.footerLink}>Gizlilik Politikası</a>
                    <span style={styles.footerDivider}>|</span>
                    <a href="#" style={styles.footerLink}>Kullanım Koşulları</a>
                    <span style={styles.footerDivider}>|</span>
                    <a href="#" style={styles.footerLink}>İletişim</a>
                </div>
            </footer>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');
        
        @keyframes rippleEffect {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
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
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        border: '3px solid #000',
        borderRadius: '16px',
        padding: '18px 45px',
        marginBottom: '35px',
        backgroundColor: 'rgba(255,255,255,0.95)',
        boxShadow: '0 15px 40px rgba(0,0,0,0.3), 0 5px 15px rgba(0,0,0,0.2)',
        animation: 'float 3s ease-in-out infinite',
    },
    logoIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '42px',
        fontWeight: '700',
        fontStyle: 'italic',
        color: '#1a1a1a',
        margin: 0,
        letterSpacing: '-1px',
    },
    welcome: {
        fontFamily: "'Poppins', sans-serif",
        fontSize: '32px',
        color: '#fff',
        marginBottom: '10px',
        fontWeight: '600',
        textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
    },
    subtitle: {
        fontFamily: "'Poppins', sans-serif",
        fontSize: '16px',
        color: 'rgba(255,255,255,0.85)',
        marginBottom: '45px',
        fontWeight: '400',
    },
    buttonContainer: {
        display: 'flex',
        gap: '25px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '50px',
    },
    button: {
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#fff',
        color: '#1a1a1a',
        border: 'none',
        borderRadius: '50px',
        padding: '18px 40px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "'Poppins', sans-serif",
        letterSpacing: '1px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
    },
    buttonHover: {
        backgroundColor: '#1a1a1a',
        color: '#fff',
        transform: 'translateY(-3px)',
        boxShadow: '0 12px 35px rgba(0,0,0,0.35)',
    },
    buttonSecondary: {
        backgroundColor: 'transparent',
        color: '#fff',
        border: '2px solid #fff',
    },
    buttonSecondaryHover: {
        backgroundColor: '#fff',
        color: '#c01919',
        transform: 'translateY(-3px)',
        boxShadow: '0 12px 35px rgba(0,0,0,0.35)',
    },
    buttonIcon: {
        strokeWidth: 2,
    },
    ripple: {
        position: 'absolute',
        borderRadius: '50%',
        backgroundColor: 'rgba(192, 25, 25, 0.4)',
        width: '100px',
        height: '100px',
        marginTop: '-50px',
        marginLeft: '-50px',
        animation: 'rippleEffect 0.6s linear',
        top: '50%',
        left: '50%',
    },
    securityBadges: {
        display: 'flex',
        gap: '30px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '40px',
    },
    badge: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'rgba(255,255,255,0.9)',
        fontSize: '13px',
        fontWeight: '500',
        padding: '10px 18px',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '30px',
        backdropFilter: 'blur(10px)',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '25px',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)',
    },
    socialIcons: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '15px',
    },
    socialLink: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    },
    footerText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '13px',
        marginBottom: '10px',
    },
    footerLinks: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        flexWrap: 'wrap',
    },
    footerLink: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '12px',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
    },
    footerDivider: {
        color: 'rgba(255,255,255,0.4)',
    }
};