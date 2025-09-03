// frontend/src/components/dashboard/CommandeList.tsx

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation'; // On importe le hook de navigation
import { AuthContext } from '@/context/AuthContext';
import { updateCommandeStatus } from '@/services/api';

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

const CommandeList: React.FC<CommandeListProps> = ({ commandes, loading, error, onActionComplete }) => {
  const authContext = useContext(AuthContext);
  const router = useRouter(); // On initialise le router

  const handleStatusChange = async (commandeId: string, newStatus: string) => {
    // ... (logique inchangée)
    if (!authContext?.token) {
        alert("Vous n'êtes pas authentifié.");
        return;
    }
    try {
        await updateCommandeStatus(commandeId, newStatus, authContext.token);
        alert("Statut de la commande mis à jour avec succès !");
        onActionComplete();
    } catch (err) {
        alert("Erreur lors de la mise à jour du statut.");
        console.error(err);
    }
  };

  // NOUVELLE FONCTION : Gère le clic sur une ligne
  const handleRowClick = (commandeId: string) => {
    router.push(`/dashboard/commandes/${commandeId}`);
  };

  if (loading) return <p>Chargement des commandes...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (commandes.length === 0) return <p>Aucune commande trouvée pour le moment.</p>;

  return (
    <table className="dashboard-table">
      <thead>
        <tr>
          <th>ID Commande</th>
          <th>Client</th>
          <th>Trajet</th>
          <th>Statut</th>
          <th>Date</th>
          {/* On affiche la colonne Actions seulement pour le transitaire */}
          {authContext?.user?.role === 'transitaire' && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {commandes.map((commande) => (
          <tr 
            key={commande.id} 
            onClick={() => handleRowClick(commande.id)}
            style={{ cursor: 'pointer' }}
            className="clickable-row" // Ajoute une classe pour le style (optionnel)
          >
            <td>{commande.id.substring(0, 8)}...</td>
            <td>{commande.client.email}</td>
            <td>
              {commande.route.originDepot.name} → {commande.route.destinationDepot.name}
            </td>
            <td>{commande.status}</td>
            <td>{new Date(commande.created_at).toLocaleDateString()}</td>
            {/* On affiche la cellule Actions seulement pour le transitaire */}
            {authContext?.user?.role === 'transitaire' && (
              <td>
                <select 
                  // On empêche le clic sur la ligne de se propager quand on clique sur le select
                  onClick={(e) => e.stopPropagation()} 
                  value={commande.status}
                  onChange={(e) => {
                      e.stopPropagation(); // On empêche aussi ici
                      handleStatusChange(commande.id, e.target.value);
                  }}
                  style={{ padding: '5px' }}
                  aria-label={`Changer le statut de la commande ${commande.id.substring(0, 8)}`}
                >
                  {possibleStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CommandeList;