// frontend/src/components/dashboard/RouteList.tsx

"use client";
import { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { deleteRoute } from '@/services/api';
import UpdateRouteModal from './UpdateRouteModal';

interface Depot {
  id: string;
  name: string;
}
interface Route {
  id: string;
  originDepot: Depot;
  destinationDepot: Depot;
  mode: string;
  price_per_kg: number;
  estimated_duration_in_days: number;
}
interface RouteListProps {
  routes: Route[];
  depots: Depot[];
  loading: boolean;
  error: string | null;
  onActionComplete: () => void;
}

const RouteList: React.FC<RouteListProps> = ({ routes, depots, loading, error, onActionComplete }) => {
  const authContext = useContext(AuthContext);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  const handleDelete = async (id: string) => {
    if (!authContext?.token) return alert("Erreur d'authentification");
    
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette route ?")) {
      try {
        await deleteRoute(id, authContext.token);
        alert("Route supprimée avec succès !");
        onActionComplete();
      } catch (error) {
        alert("Erreur lors de la suppression de la route.");
      }
    }
  };

  if (loading) return <p className="p-4 text-center">Chargement des routes...</p>;
  if (error) return <p className="p-4 text-center text-error">{error}</p>;

  return (
    <>
      {routes.length === 0 ? (
        <p className="p-4 text-center">Vous n'avez pas encore de route.</p>
      ) : (
        <div className="space-y-4"> {/* Helper class pour espacer les cartes */}
          {routes.map((route) => (
            <div key={route.id} className="card">
              <div className="card-content">
                <div className="flex justify-between items-center mb-2">
                  <strong className="text-lg">{route.originDepot.name} → {route.destinationDepot.name}</strong>
                  <span className="font-bold text-primary-600">{route.price_per_kg.toFixed(2)}FCFA / kg</span>
                </div>
                <div className="text-sm text-gray-500">
                  <span>Mode: {route.mode}</span> | <span>Durée: {route.estimated_duration_in_days} jours</span>
                </div>
              </div>
              <div className="card-actions">
                <button onClick={() => setEditingRoute(route)}>Modifier</button>
                <button onClick={() => handleDelete(route.id)} className="delete-btn">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <UpdateRouteModal 
        route={editingRoute}
        depots={depots}
        isOpen={!!editingRoute}
        onClose={() => setEditingRoute(null)}
        onRouteUpdated={() => {
          setEditingRoute(null);
          onActionComplete();
        }}
      />
    </>
  );
};

export default RouteList;