"use client";
import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { getDepots, getRoutes, getCommandes } from '@/services/api'; 
import DepotList from '@/components/dashboard/DepotList';
import CreateDepotForm from '@/components/dashboard/CreateDepotForm';
import RouteList from '@/components/dashboard/RouteList';
import CreateRouteForm from '@/components/dashboard/CreateRouteForm';
import CommandeList from '../../components/dashboard/CommandeList';

// --- Interfaces pour typer nos données ---
interface Depot {
  id: string;
  name: string;
  country: string;
  address: string;
}
interface Route {
  id: string;
  originDepot: Depot;
  destinationDepot: Depot;
  mode: string;
  price_per_kg: number;
  estimated_duration_in_days: number;
}
interface Client {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
}
interface Commande {
    id: string;
    status: string;
    created_at: string;
    client: Client;
    route: Route;
}

const DashboardPage = () => {
  const authContext = useContext(AuthContext);
  // ... (tous les états useState restent inchangés)
  const [depots, setDepots] = useState<Depot[]>([]);
  const [depotsLoading, setDepotsLoading] = useState(true);
  const [depotsError, setDepotsError] = useState<string | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [routesError, setRoutesError] = useState<string | null>(null);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [commandesLoading, setCommandesLoading] = useState(true);
  const [commandesError, setCommandesError] = useState<string | null>(null);

  // ... (toutes les fonctions fetch restent inchangées)
  const fetchDepots = useCallback(async () => {
    const token = authContext?.token;
    if (token) {
      try {
        setDepotsLoading(true);
        const data = await getDepots(token);
        setDepots(data);
        setDepotsError(null);
      } catch (err) {
        setDepotsError('Impossible de charger les dépôts.');
      } finally {
        setDepotsLoading(false);
      }
    }
  }, [authContext?.token]);

  const fetchRoutes = useCallback(async () => {
    const token = authContext?.token;
    if (token) {
      try {
        setRoutesLoading(true);
        const data = await getRoutes(token);
        setRoutes(data);
        setRoutesError(null);
      } catch (err) {
        setRoutesError('Impossible de charger les routes.');
      } finally {
        setRoutesLoading(false);
      }
    }
  }, [authContext?.token]);

  const fetchCommandes = useCallback(async () => {
    const token = authContext?.token;
    if (token) {
      try {
        setCommandesLoading(true);
        const data = await getCommandes(token);
        setCommandes(data);
        setCommandesError(null);
      } catch (err) {
        setCommandesError('Impossible de charger les commandes.');
      } finally {
        setCommandesLoading(false);
      }
    }
  }, [authContext?.token]);

  useEffect(() => {
    // La logique de fetch est maintenant unifiée
    if (authContext?.user) {
        fetchCommandes();
        if (authContext.user.role === 'transitaire') {
            fetchDepots();
            fetchRoutes();
        }
    } else {
      setDepotsLoading(false);
      setRoutesLoading(false);
      setCommandesLoading(false);
    }
  }, [authContext?.user, fetchDepots, fetchRoutes, fetchCommandes]);

  const renderDashboardContent = () => {
    if (!authContext || !authContext.user) {
      return <p>Vous devez être connecté pour accéder à cette page.</p>;
    }

    if (authContext.user.role === 'transitaire') {
      return (
        <div>
          <h2>Bienvenue, Transitaire {authContext.user.email} !</h2>
          <p>C'est ici que vous gérerez vos dépôts, tarifs et expéditions.</p>
          
          <hr style={{ margin: '2rem 0' }} />
          <h3>Mes Commandes Reçues</h3>
          <CommandeList
            commandes={commandes}
            loading={commandesLoading}
            error={commandesError}
            onActionComplete={fetchCommandes}
          />

          <hr style={{ margin: '3rem 0', borderTop: '2px solid #ddd' }} />
          <h3>Mes Dépôts</h3>
          <DepotList 
            depots={depots} 
            loading={depotsLoading} 
            error={depotsError} 
            onActionComplete={fetchDepots}
          />
          <CreateDepotForm onDepotCreated={fetchDepots} />

          <hr style={{ margin: '3rem 0', borderTop: '2px solid #ddd' }} />
          <h3>Mes Routes</h3>
          <RouteList 
            routes={routes} 
            depots={depots}
            loading={routesLoading} 
            error={routesError}
            onActionComplete={fetchRoutes}
          />
          <CreateRouteForm depots={depots} onRouteCreated={fetchRoutes} />
        </div>
      );
    }

    // --- BLOC CLIENT MODIFIÉ ---
    if (authContext.user.role === 'client') {
      return (
        <div>
          <h2>Bienvenue, Client {authContext.user.email} !</h2>
          <p>C'est ici que vous pourrez suivre vos colis et voir vos commandes.</p>

          <hr style={{ margin: '2rem 0' }} />
          <h3>Mes Commandes</h3>
          <CommandeList
            commandes={commandes}
            loading={commandesLoading}
            error={commandesError}
            onActionComplete={fetchCommandes} // On passe la fonction pour la cohérence
          />
        </div>
      );
    }
  };

  return (
    <main className="main-content" style={{ padding: '2rem' }}>
      <h1>Tableau de Bord</h1>
      {renderDashboardContent()}
    </main>
  );
};

export default DashboardPage;