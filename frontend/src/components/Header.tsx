// frontend/src/components/Header.tsx

"use client";
import { useContext, useState } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const Header = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    if (authContext) {
      authContext.logout();
      router.push('/'); // Redirige vers l'accueil après la déconnexion
    }
  };

  return (
    <header style={styles.header}>
      {/* On garde la sidebar orange pour l'instant, on ajoute le header en haut */}
      <div style={styles.navContainer}>
        {/* Le logo REKDEM n'est plus dans la sidebar mais ici */}
        <Link href="/" style={styles.logo}>
          REKDEM
        </Link>
        
        <div style={styles.navLinks}>
          {authContext?.user ? (
            // Si l'utilisateur est connecté
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                style={styles.userMenuButton}
              >
                Bonjour, {authContext.user.first_name || authContext.user.email}
              </button>
              {isMenuOpen && (
                <div style={styles.dropdownMenu}>
                  <Link href="/dashboard" style={styles.dropdownItem}>Tableau de bord</Link>
                  <Link href="/dashboard/profil" style={styles.dropdownItem}>Mon Profil</Link>
                  <button onClick={handleLogout} style={styles.dropdownItem}>
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Si l'utilisateur n'est pas connecté (on cache pour l'instant car la sidebar les a déjà)
            null
          )}
        </div>
      </div>
    </header>
  );
};

// --- Styles pour le composant ---
const styles: { [key: string]: React.CSSProperties } = {
    header: {
        background: '#fff',
        borderBottom: '1px solid #eee',
        padding: '0 2rem',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
    },
    navContainer: {
        width: '100%',
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
        gap: '1rem',
    },
    userMenuButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    dropdownMenu: {
        position: 'absolute',
        top: '120%',
        right: 0,
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 100,
        minWidth: '180px',
        display: 'flex',
        flexDirection: 'column',
    },
    dropdownItem: {
        padding: '0.75rem 1rem',
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