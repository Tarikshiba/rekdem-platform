"use client";
import { useState, useContext } from 'react';
import Modal from './common/Modal';
import RegisterForm from './auth/RegisterForm';
import LoginForm from './auth/LoginForm';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const authContext = useContext(AuthContext);

  const handleLogout = () => {
    if (authContext) {
      authContext.logout();
    }
  }

  // Cette fonction sera passée au LoginForm
  const handleLoginSuccess = () => {
    setTimeout(() => {
      setLoginModalOpen(false);
    }, 2000); // Ferme le modal 2 secondes après le message de succès
  };

  return (
    <>
      <aside className="sidebar">
        <div className="logo">REKDEM</div>

        {authContext && authContext.user ? (
          <div className="auth-buttons">
            <p style={{ color: 'white', textAlign: 'center', marginBottom: '1rem' }}>
              Bienvenue, <br /> {authContext.user.email}
            </p>
            <button onClick={handleLogout} className="btn btn-outline">
              Se déconnecter
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button 
              onClick={() => setLoginModalOpen(true)} 
              className="btn btn-outline"
            >
              Se connecter
            </button>
            <button 
              onClick={() => setRegisterModalOpen(true)} 
              className="btn btn-filled"
            >
              S'inscrire
            </button>
          </div>
        )}
      </aside>

      <Modal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setRegisterModalOpen(false)}
      >
        <RegisterForm />
      </Modal>

      <Modal 
        isOpen={isLoginModalOpen} 
        onClose={() => setLoginModalOpen(false)}
      >
        {/* LA CORRECTION EST ICI : on passe la fonction en prop */}
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </Modal>
    </>
  );
};

export default Sidebar;