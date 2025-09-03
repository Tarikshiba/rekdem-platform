"use client";
import { useState } from 'react';
import { registerUser } from '../../services/api';

const RegisterForm = () => {
  const [role, setRole] = useState<'client' | 'transitaire' | ''>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!role) {
        setError("Veuillez sélectionner un type de compte.");
        return;
    }

    try {
      // On utilise 'any' temporairement car l'interface RegistrationData sera mise à jour dans api.ts
      const userData: any = { 
        email, 
        password, 
        first_name: firstName, 
        last_name: lastName, 
        role,
        country,
        city,
        phone,
      };
      
      // LOGIQUE CORRIGÉE : On ajoute company_name si le rôle est transitaire
      if (role === 'transitaire') {
          userData.company_name = companyName;
      }

      const data = await registerUser(userData);

      setSuccess(`Utilisateur ${data.email} créé avec succès !`);
      // Vider les champs
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setCompanyName('');
      setCountry('');
      setCity('');
      setPhone('');
      
    } catch (err) {
      setError("Erreur lors de l'inscription. L'email existe peut-être déjà.");
    }
  };

  if (!role) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>Rejoindre REKDEM</h2>
        <p>Inscrivez-vous en tant que :</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
          <button onClick={() => setRole('client')} className="btn btn-secondary" style={{ flex: 1 }}>
            Client
          </button>
          <button onClick={() => setRole('transitaire')} className="btn btn-primary" style={{ flex: 1 }}>
            Transitaire
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="button" onClick={() => setRole('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', marginBottom: '1rem' }}>
        &larr; Changer le type de compte
      </button>

      <h2>Inscription - {role === 'client' ? 'Client' : 'Transitaire'}</h2>
      
      {role === 'transitaire' && (
        <div style={{ margin: '1rem 0' }}>
          <label htmlFor="companyName">Nom de l'entreprise</label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1, margin: '1rem 0' }}>
            <label htmlFor="firstName">Prénom</label>
            <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
        </div>
        <div style={{ flex: 1, margin: '1rem 0' }}>
            <label htmlFor="lastName">Nom</label>
            <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1, margin: '1rem 0' }}>
          <label htmlFor="country">Pays</label>
          <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
        </div>
        <div style={{ flex: 1, margin: '1rem 0' }}>
          <label htmlFor="city">Ville</label>
          <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
        </div>
      </div>
      <div style={{ margin: '1rem 0' }}>
        <label htmlFor="phone">Numéro de téléphone</label>
        <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
      </div>


      <div style={{ margin: '1rem 0' }}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
      </div>
      <div style={{ margin: '1rem 0' }}>
        <label htmlFor="password">Mot de passe</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
      </div>

      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" className="btn btn-primary">
        Créer mon compte
      </button>
    </form>
  );
};

export default RegisterForm;