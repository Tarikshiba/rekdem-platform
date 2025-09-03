"use client";
import { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { createDepot } from '@/services/api';

const CreateDepotForm = ({ onDepotCreated }: { onDepotCreated: () => void }) => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const authContext = useContext(AuthContext);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!authContext || !authContext.token) {
      setError("Vous devez être connecté pour créer un dépôt.");
      return;
    }

    try {
      await createDepot({ name, country, address }, authContext.token);
      setSuccess(`Dépôt "${name}" créé avec succès !`);
      setName('');
      setCountry('');
      setAddress('');
      onDepotCreated();
    } catch (err) {
      setError("Erreur lors de la création du dépôt.");
    }
  };

  return (
    <div className="dashboard-section">
      <h3>Ajouter un nouveau dépôt</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="depot-name">Nom du dépôt (ex: Entrepôt Abidjan)</label>
          <input
            type="text"
            id="depot-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="depot-country">Pays</label>
          <input
            type="text"
            id="depot-country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="depot-address">Adresse</label>
          <input
            type="text"
            id="depot-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="form-input"
          />
        </div>
        
        {success && <p style={{ color: 'green', marginBottom: '1rem' }}>{success}</p>}
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <button type="submit" className="btn btn-primary">
          Créer le dépôt
        </button>
      </form>
    </div>
  );
};

export default CreateDepotForm;