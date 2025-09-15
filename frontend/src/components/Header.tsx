// frontend/src/components/Header.tsx

"use client";
import { useContext, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

import Modal from './common/Modal';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';

const Header = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  const handleLogout = () => {
    if (authContext) {
      authContext.logout();
      setUserMenuOpen(false);
      router.push('/');
    }
  };

  const handleAuthSuccess = () => {
    setLoginModalOpen(false);
    setRegisterModalOpen(false);
    window.location.reload();
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return '?';
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link href="/" className="logo">
            <i className="fas fa-truck-fast logo-icon"></i> REKDEM
          </Link>

          <button 
            className="mobile-menu-button" 
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"} // Correction d'accessibilité
          >
            <i className={isMobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>

          <nav className={`nav ${isMobileMenuOpen ? 'open' : ''}`}>
            <Link href="/transitaires" className="nav-link">Transitaires</Link>
            <Link href="/#pricing" className="nav-link">Tarifs</Link>
          </nav>

          <div className="auth-section">
            {authContext?.user ? (
              <div className="user-menu" ref={menuRef}>
                <button 
                  onClick={() => setUserMenuOpen(!isUserMenuOpen)} 
                  className="user-button"
                >
                  <div className="user-avatar">
                    {getInitials(authContext.user.first_name, authContext.user.email)}
                  </div>
                  <span className="user-name">
                    {authContext.user.first_name || 'Profil'}
                  </span>
                  {/* Style en ligne retiré pour respecter nos règles */}
                  <i className="fas fa-chevron-down"></i>
                </button>
                
                {isUserMenuOpen && (
                  <div className="dropdown-menu animate-fadeIn">
                    <Link href="/dashboard" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <i className="fas fa-th-large"></i> Tableau de bord
                    </Link>
                    <Link href="/dashboard/profil" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <i className="fas fa-user"></i> Mon Profil
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item">
                      <i className="fas fa-sign-out-alt"></i> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                  <button onClick={() => setLoginModalOpen(true)} className="btn btn-secondary">
                      Connexion
                  </button>
                  <button onClick={() => setRegisterModalOpen(true)} className="btn btn-primary">
                      Inscription
                  </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <Modal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)}>
        <LoginForm onLoginSuccess={handleAuthSuccess} />
      </Modal>
      
      <Modal isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)}>
        {/* Correction de l'erreur TypeScript en retirant la prop non reconnue */}
        <RegisterForm />
      </Modal>
    </>
  );
};

export default Header;