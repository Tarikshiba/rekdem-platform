// frontend/src/components/dashboard/CommandeList.tsx

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { updateCommandeStatus } from '@/services/api';
import { UserRole } from '@/types/enums';

// --- Interfaces ---
interface Client {
    email: string;
}
interface Depot {
    name: string;
}
interface Route {
    originDepot: Depot;
    destinationDepot: Depot;
}
interface Commande {
    id: string;
    status: string;
    created_at: string;
    client: Client;
    route: Route;
}

interface CommandeListProps {
  commandes: Commande[];
  loading: boolean;
  error: string | null;
  onActionComplete: () => void;
}

const possibleStatuses = ["pending", "processing", "in_transit", "delivered", "canceled"];

// Helper pour associer un statut à une classe CSS
const statusClassMap: { [key: string]: string } = {
  pending: 'status-pending',
  processing: 'status-processing',
  in_transit: 'status-in_transit',
  delivered: 'status-delivered',
  canceled: 'status-canceled',
};

const CommandeList: React.FC<CommandeListProps> = ({ commandes, loading, error, onActionComplete }) => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const handleStatusChange = async (commandeId: string, newStatus: string) => {
    if (!authContext?.token) return alert("Vous n'êtes pas authentifié.");
    try {
        await updateCommandeStatus(commandeId, newStatus, authContext.token);
        alert("Statut de la commande mis à jour avec succès !");
        onActionComplete();
    } catch (err) {
        alert("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleRowClick = (commandeId: string) => {
    router.push(`/dashboard/commandes/${commandeId}`);
  };

  if (loading) return <p className="p-4 text-center">Chargement des commandes...</p>;
  if (error) return <p className="p-4 text-center color-error">{error}</p>; // Utiliser une classe serait mieux
  if (commandes.length === 0) return <p className="p-4 text-center">Aucune commande trouvée pour le moment.</p>;

  return (
    <div className="overflow-x-auto"> {/* Conteneur pour le scroll sur mobile */}
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>ID Commande</th>
            <th>Client</th>
            <th>Trajet</th>
            <th>Statut</th>
            <th>Date</th>
            {authContext?.user?.role === UserRole.TRANSITAIRE && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {commandes.map((commande) => (
            <tr 
              key={commande.id} 
              onClick={() => handleRowClick(commande.id)}
              className="cursor-pointer hover:bg-gray-50" // Classes utilitaires pour le style
            >
              <td>{commande.id.substring(0, 8)}...</td>
              <td>{commande.client.email}</td>
              <td>
                {commande.route.originDepot.name} → {commande.route.destinationDepot.name}
              </td>
              <td>
                <span className={`status-badge ${statusClassMap[commande.status] || 'status-pending'}`}>
                  {commande.status.replace('_', ' ')}
                </span>
              </td>
              <td>{new Date(commande.created_at).toLocaleDateString()}</td>
              {authContext?.user?.role === UserRole.TRANSITAIRE && (
                <td>
                  <select 
                    onClick={(e) => e.stopPropagation()} 
                    value={commande.status}
                    onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(commande.id, e.target.value);
                    }}
                    className="form-select" // Classe de notre design system
                    aria-label={`Changer le statut de la commande ${commande.id.substring(0, 8)}`}
                  >
                    {possibleStatuses.map(status => (
                      <option key={status} value={status}>{status.replace('_', ' ')}</option>
                    ))}
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommandeList;