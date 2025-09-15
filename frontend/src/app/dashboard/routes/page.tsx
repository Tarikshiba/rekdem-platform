// frontend/src/app/dashboard/routes/page.tsx

"use client";
import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { getRoutes, getDepots } from '@/services/api';
import RouteList from '@/components/dashboard/RouteList';
import CreateRouteForm from '@/components/dashboard/CreateRouteForm';

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

const RoutesPage = () => {
  const authContext = useContext(AuthContext);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [depots, setDepots] = useState<Depot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutesAndDepots = useCallback(async () => {
    if (!authContext?.token) return;
    try {
      setLoading(true);
      // On lance les deux requêtes en parallèle pour plus d'efficacité
      const [routesData, depotsData] = await Promise.all([
        getRoutes(authContext.token),
        getDepots(authContext.token)
      ]);
      setRoutes(routesData);
      setDepots(depotsData);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les données.');
    } finally {
      setLoading(false);
    }
  }, [authContext?.token]);

  useEffect(() => {
    fetchRoutesAndDepots();
  }, [fetchRoutesAndDepots]);

  return (
    <>
      <h1>Gérer mes Routes</h1>
      <div className="dashboard-section">
        <RouteList
          routes={routes}
          depots={depots}
          loading={loading}
          error={error}
          onActionComplete={fetchRoutesAndDepots}
        />
        <CreateRouteForm depots={depots} onRouteCreated={fetchRoutesAndDepots} />
      </div>
    </>
  );
};

export default RoutesPage;