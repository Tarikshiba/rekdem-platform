// frontend/src/app/dashboard/page.tsx

"use client";
import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { getCommandes } from '@/services/api';
import CommandeList from '@/components/dashboard/CommandeList';
import { UserRole } from '@/types/enums';

interface Depot {
  id: string;
  name: string;
}
interface Client {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
}
interface Route {
    id: string;
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

const DashboardHomePage = () => {
  const authContext = useContext(AuthContext);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommandes = useCallback(async () => {
    if (!authContext?.token) return;
    try {
      setLoading(true);
      const data = await getCommandes(authContext.token);
      setCommandes(data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les commandes.');
    } finally {
      setLoading(false);
    }
  }, [authContext?.token]);

  useEffect(() => {
    fetchCommandes();
  }, [fetchCommandes]);

  if (!authContext?.user) {
    return (
      <div className="dashboard-section text-center">
        <p>Chargement...</p>
      </div>
    );
  }

  const { user } = authContext;
  const isTransitaire = user.role === UserRole.TRANSITAIRE;

  return (
    <>
      <h1>Tableau de Bord</h1>
      <div className="dashboard-section">
        <h2>Bonjour, {user.first_name || user.email} !</h2>
        <p>
          {isTransitaire
            ? "Bienvenue sur votre espace. Voici un résumé de vos commandes récentes."
            : "Bienvenue sur votre espace. Suivez vos commandes et communiquez avec votre transitaire."
          }
        </p>
      </div>
      <div className="dashboard-section">
        <h3>{isTransitaire ? "Dernières Commandes Reçues" : "Mes Commandes"}</h3>
        <CommandeList
          commandes={commandes}
          loading={loading}
          error={error}
          onActionComplete={fetchCommandes}
        />
      </div>
    </>
  );
};

export default DashboardHomePage;