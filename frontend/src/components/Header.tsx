// frontend/src/components/Header.tsx

"use client";
import { useContext, useState } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// On importe les composants pour les pop-ups
import Modal from './common/Modal';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';

const Header = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  // États pour le menu utilisateur et les pop-ups
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  const handleLogout = () => {
    if (authContext) {
      authContext.logout();
      setIsMenuOpen(false); // Ferme le menu
      router.push('/');
    }
  };
  
  // Fonction pour fermer tous les modals et rafraîchir la page après une connexion/inscription réussie
  const handleAuthSuccess = () => {
      setLoginModalOpen(false);
      setRegisterModalOpen(false);
      // On utilise un rechargement de page pour s'assurer que tout est à jour
      // C'est simple et fiable.
      window.location.reload();
  }

  return (
    <>
      <header style={styles.header}>
        <div style={styles.navContainer}>
          <Link href="/" style={styles.logo}>
            REKDEM
          </Link>
          
          <div style={styles.navLinks}>
            {authContext?.user ? (
              // --- MENU UTILISATEUR CONNECTÉ ---
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  onBlur={() => setTimeout(() => setIsMenuOpen(false), 150)} // Pour fermer en cliquant ailleurs
                  style={styles.userMenuButton}
                >
                  Bonjour, {authContext.user.first_name || authContext.user.email}
                </button>
                {isMenuOpen && (
                  <div style={styles.dropdownMenu}>
                    <Link href="/dashboard" style={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Tableau de bord</Link>
                    <Link href="/dashboard/profil" style={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Mon Profil</Link>
                    <button onClick={handleLogout} style={styles.dropdownItem}>
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // --- BOUTONS UTILISATEUR DÉCONNECTÉ ---
              <div style={styles.authButtons}>
                  <button onClick={() => setLoginModalOpen(true)} className="btn btn-secondary">
                      Se connecter
                  </button>
                  <button onClick={() => setRegisterModalOpen(true)} className="btn btn-primary">
                      S'inscrire
                  </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- GESTION DES POP-UPS (MODALS) --- */}
      <Modal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)}>
        <LoginForm onLoginSuccess={handleAuthSuccess} />
      </Modal>
      
      <Modal isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)}>
        <RegisterForm />
      </Modal>
    </>
  );
};

// --- Styles pour le composant ---
const styles: { [key: string]: React.CSSProperties } = {
    // ... (les styles existants restent les mêmes)
    header: {
        background: '#fff',
        borderBottom: '1px solid #eee',
        padding: '0 2rem',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        position: 'fixed', // On le fixe en haut
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 1001, // Au-dessus du contenu
    },
    navContainer: {
        width: '100%',
        maxWidth: '1200px', // On peut centrer le contenu
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        fontWeight: 'bold',
        fontSize: '1.5rem',
        color: '#333',
        textDecoration: 'none',
    },
    navLinks: {
        display: 'flex',
        alignItems: 'center',
    },
    authButtons: {
        display: 'flex',
        gap: '1rem',
    },
    userMenuButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        padding: '0.5rem',
    },
    dropdownMenu: {
        position: 'absolute',
        top: '140%',
        right: 0,
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 100,
        minWidth: '200px',
        display: 'flex',
        flexDirection: 'column',
        padding: '0.5rem 0',
    },
    dropdownItem: {
        padding: '0.75rem 1.5rem',
        textDecoration: 'none',
        color: '#333',
        background: 'none',
        border: 'none',
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%',
        fontSize: '1rem',
    }
};

export default Header;