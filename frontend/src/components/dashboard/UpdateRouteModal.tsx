"use client";
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { updateRoute } from '@/services/api';
import Modal from '../common/Modal';

interface Depot {
  id: string;
  name: string;
}
// INTERFACE CORRIGÉE
interface Route {
  id: string;
  originDepot: Depot;
  destinationDepot: Depot;
  mode: string;
  price_per_kg: number; // C'était price_per_kg_in_cents
  estimated_duration_in_days: number;
}
interface UpdateRouteModalProps {
  route: Route | null;
  depots: Depot[];
  isOpen: boolean;
  onClose: () => void;
  onRouteUpdated: () => void;
}

const UpdateRouteModal: React.FC<UpdateRouteModalProps> = ({ route, depots, isOpen, onClose, onRouteUpdated }) => {
  const [originDepotId, setOriginDepotId] = useState('');
  const [destinationDepotId, setDestinationDepotId] = useState('');
  const [mode, setMode] = useState('air');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (route) {
      setOriginDepotId(route.originDepot.id);
      setDestinationDepotId(route.destinationDepot.id);
      setMode(route.mode);
      // LIGNE CORRIGÉE : On n'a plus besoin de diviser par 100
      setPrice(route.price_per_kg.toString());
      setDuration(route.estimated_duration_in_days.toString());
    }
  }, [route]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authContext?.token || !route) return;
    try {
      // L'objet envoyé à l'API est corrigé ici
      await updateRoute(route.id, {
        originDepotId,
        destinationDepotId,
        mode: mode as 'air' | 'sea' | 'express',
        price_per_kg: parseFloat(price), // C'était price_per_kg_in_cents avec une multiplication
        estimated_duration_in_days: parseInt(duration)
      }, authContext.token);
      onRouteUpdated();
      onClose();
    } catch (error) {
      alert("Erreur lors de la mise à jour de la route.");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <h2>Modifier la route</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="update-origin-depot">Dépôt de départ</label>
            <select id="update-origin-depot" value={originDepotId} onChange={(e) => setOriginDepotId(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }}>
              {depots.map(depot => <option key={depot.id} value={depot.id}>{depot.name}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="update-destination-depot">Dépôt d'arrivée</label>
            <select id="update-destination-depot" value={destinationDepotId} onChange={(e) => setDestinationDepotId(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }}>
              {depots.map(depot => <option key={depot.id} value={depot.id}>{depot.name}</option>)}
            </select>
          </div>
        </div>
        <div style={{ margin: '1rem 0' }}>
          <label htmlFor="update-mode">Mode de transport</label>
          <select id="update-mode" value={mode} onChange={(e) => setMode(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }}>
              <option value="air">Aérien</option>
              <option value="sea">Maritime</option>
              <option value="express">Express</option>
          </select>
        </div>
        <div style={{ margin: '1rem 0' }}>
          <label htmlFor="update-price">Prix par kg (€)</label>
          <input type="number" step="0.01" id="update-price" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
        </div>
        <div style={{ margin: '1rem 0' }}>
          <label htmlFor="update-duration">Durée estimée (jours)</label>
          <input type="number" id="update-duration" value={duration} onChange={(e) => setDuration(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
        </div>
        <button type="submit" className="btn btn-primary">Enregistrer les modifications</button>
      </form>
    </Modal>
  );
};

export default UpdateRouteModal;