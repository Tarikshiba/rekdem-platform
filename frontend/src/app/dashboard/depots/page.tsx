// frontend/src/app/dashboard/depots/page.tsx

"use client";
import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { getDepots } from '@/services/api';
import DepotList from '@/components/dashboard/DepotList';
import CreateDepotForm from '@/components/dashboard/CreateDepotForm';

interface Depot {
  id: string;
  name: string;
  country: string;
  address: string;
}

const DepotsPage = () => {
  const authContext = useContext(AuthContext);
  const [depots, setDepots] = useState<Depot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepots = useCallback(async () => {
    if (!authContext?.token) return;
    try {
      setLoading(true);
      const data = await getDepots(authContext.token);
      setDepots(data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les dépôts.');
    } finally {
      setLoading(false);
    }
  }, [authContext?.token]);

  useEffect(() => {
    fetchDepots();
  }, [fetchDepots]);

  return (
    <>
      <h1>Gérer mes Dépôts</h1>
      <div className="dashboard-section">
        <DepotList
          depots={depots}
          loading={loading}
          error={error}
          onActionComplete={fetchDepots}
        />
        <CreateDepotForm onDepotCreated={fetchDepots} />
      </div>
    </>
  );
};

export default DepotsPage;