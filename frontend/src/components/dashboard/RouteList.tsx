"use client";
import { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { deleteRoute } from '@/services/api';
import UpdateRouteModal from './UpdateRouteModal';

// Interfaces pour les données que le composant utilise
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

  if (loading) return <p>Chargement des routes...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ marginTop: '2rem' }}>
      {/* <h3>Vos Routes</h3> */} {/* Titre déjà présent sur la page principale */}
      {routes.length === 0 ? (
        <p>Vous n'avez pas encore de route.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {routes.map((route) => (
            <li key={route.id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{route.originDepot.name} → {route.destinationDepot.name}</strong>
                  <div>Mode: {route.mode}</div>
                  {/* LIGNE CORRIGÉE */}
                  <div>Prix: {route.price_per_kg.toFixed(2)}€ / kg</div>
                  <div>Durée: {route.estimated_duration_in_days} jours</div>
                </div>
                <div>
                  <button onClick={() => setEditingRoute(route)} style={{ marginRight: '10px' }}>Modifier</button>
                  <button onClick={() => handleDelete(route.id)} style={{ color: 'red' }}>Supprimer</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
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
    </div>
  );
};

export default RouteList;