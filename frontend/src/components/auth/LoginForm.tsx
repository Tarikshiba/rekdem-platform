"use client";
import { useState, useContext } from 'react';
import { loginUser } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const LoginForm = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const authContext = useContext(AuthContext);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Notre API renvoie maintenant { user, access_token }
      const data = await loginUser({ email, password });
      
      if (authContext && data.user && data.access_token) {
        // LIGNE CORRIGÉE : On passe les deux arguments
        authContext.login(data.user, data.access_token);
        
        setSuccess('Connexion réussie !');
        onLoginSuccess(); // Ferme le modal
      } else {
        throw new Error("Réponse de l'API invalide");
      }
    } catch (err) {
      setError("Erreur : Email ou mot de passe incorrect.");
    }
  };

  // Le JSX reste identique
  return (
    <form onSubmit={handleSubmit}>
      <h2>Connexion</h2>
      <div style={{ margin: '1rem 0' }}>
        <label htmlFor="login-email">Email</label>
        <input
          type="email"
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </div>
      <div style={{ margin: '1rem 0' }}>
        <label htmlFor="login-password">Mot de passe</label>
        <input
          type="password"
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </div>

      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" className="btn btn-primary">
        Se connecter
      </button>
    </form>
  );
};

export default LoginForm;