"use client";
import { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { deleteDepot } from '@/services/api';
import UpdateDepotModal from './UpdateDepotModal';

interface Depot {
  id: string;
  name: string;
  country: string;
  address: string;
}

interface DepotListProps {
  depots: Depot[];
  loading: boolean;
  error: string | null;
  onActionComplete: () => void;
}

const DepotList: React.FC<DepotListProps> = ({ depots, loading, error, onActionComplete }) => {
  const authContext = useContext(AuthContext);
  const [editingDepot, setEditingDepot] = useState<Depot | null>(null);

  const handleDelete = async (id: string) => {
    if (!authContext?.token) return alert("Erreur d'authentification");
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce dépôt ?")) {
      try {
        await deleteDepot(id, authContext.token);
        onActionComplete();
      } catch (error) {
        alert("Erreur lors de la suppression du dépôt.");
      }
    }
  };

  if (loading) return <p>Chargement des dépôts...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="dashboard-section">
      <h3>Vos Dépôts</h3>
      {depots.length === 0 ? (
        <p>Vous n'avez pas encore de dépôt.</p>
      ) : (
        <div>
          {depots.map((depot) => (
            <div key={depot.id} className="card">
              <div className="card-content">
                <strong>{depot.name}</strong> ({depot.country})
                <p style={{ color: '#666', fontSize: '0.9rem' }}>{depot.address}</p>
              </div>
              <div className="card-actions">
                <button onClick={() => setEditingDepot(depot)}>
                  Modifier
                </button>
                <button onClick={() => handleDelete(depot.id)} className="delete-btn">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <UpdateDepotModal 
        depot={editingDepot}
        isOpen={!!editingDepot}
        onClose={() => setEditingDepot(null)}
        onDepotUpdated={() => {
          setEditingDepot(null);
          onActionComplete();
        }}
      />
    </div>
  );
};

export default DepotList;