// frontend/src/components/dashboard/CreateDepotForm.tsx

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
    // The redundant dashboard-section div has been removed.
    <div className="mt-6"> {/* Margin top to space it from the list */}
      <h4 className="mb-4">Ajouter un nouveau dépôt</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="depot-name">Nom du dépôt</label>
            <input
              type="text"
              id="depot-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
              placeholder="ex: Entrepôt Abidjan"
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
              placeholder="ex: Côte d'Ivoire"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="depot-address">Adresse complète</label>
          <input
            type="text"
            id="depot-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="form-input"
          />
        </div>
        
        {success && <p className="text-success mb-4">{success}</p>}
        {error && <p className="text-error mb-4">{error}</p>}

        <button type="submit" className="btn btn-primary">
          Créer le dépôt
        </button>
      </form>
    </div>
  );
};

export default CreateDepotForm;