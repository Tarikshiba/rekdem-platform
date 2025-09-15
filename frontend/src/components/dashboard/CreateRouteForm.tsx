// frontend/src/components/dashboard/CreateRouteForm.tsx

"use client";
import { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { createRoute } from '@/services/api';

interface Depot {
  id: string;
  name: string;
}

interface CreateRouteFormProps {
  depots: Depot[];
  onRouteCreated: () => void;
}

const CreateRouteForm: React.FC<CreateRouteFormProps> = ({ depots, onRouteCreated }) => {
  const [originDepotId, setOriginDepotId] = useState('');
  const [destinationDepotId, setDestinationDepotId] = useState('');
  const [mode, setMode] = useState('air');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const authContext = useContext(AuthContext);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!authContext?.token || !originDepotId || !destinationDepotId) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    
    if (originDepotId === destinationDepotId) {
      setError("Le dépôt de départ et d'arrivée ne peuvent pas être identiques.");
      return;
    }

    try {
      await createRoute({
        originDepotId,
        destinationDepotId,
        mode: mode as 'air' | 'sea' | 'express',
        price_per_kg: parseFloat(price),
        estimated_duration_in_days: parseInt(duration)
      }, authContext.token);

      setSuccess(`Route créée avec succès !`);
      setOriginDepotId('');
      setDestinationDepotId('');
      setMode('air');
      setPrice('');
      setDuration('');
      onRouteCreated();
    } catch (err) {
      setError("Erreur lors de la création de la route.");
    }
  };

  return (
    <div className="mt-6">
      <h4 className="mb-4">Ajouter une nouvelle route</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="origin-depot">Dépôt de départ</label>
            <select id="origin-depot" value={originDepotId} onChange={(e) => setOriginDepotId(e.target.value)} required className="form-select">
              <option value="" disabled>Sélectionnez un dépôt</option>
              {depots.map(depot => <option key={depot.id} value={depot.id}>{depot.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="destination-depot">Dépôt d'arrivée</label>
            <select id="destination-depot" value={destinationDepotId} onChange={(e) => setDestinationDepotId(e.target.value)} required className="form-select">
              <option value="" disabled>Sélectionnez un dépôt</option>
              {depots.map(depot => <option key={depot.id} value={depot.id}>{depot.name}</option>)}
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="mode">Mode de transport</label>
          <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)} required className="form-select">
              <option value="air">Aérien</option>
              <option value="sea">Maritime</option>
              <option value="express">Express</option>
          </select>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="price">Prix par kg (FCFA)</label>
            <input type="number" step="0.01" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required className="form-input" placeholder="ex: 12.50"/>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="duration">Durée estimée (jours)</label>
            <input type="number" id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} required className="form-input" placeholder="ex: 7"/>
          </div>
        </div>

        {success && <p className="text-success mb-4">{success}</p>}
        {error && <p className="text-error mb-4">{error}</p>}
        
        <button type="submit" className="btn btn-primary">Créer la route</button>
      </form>
    </div>
  );
};

export default CreateRouteForm;