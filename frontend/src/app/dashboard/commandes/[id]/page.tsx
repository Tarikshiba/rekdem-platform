// frontend/src/app/dashboard/commandes/[id]/page.tsx

"use client";
import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { getCommandeById } from '@/services/api';
import Link from 'next/link';
import Timeline from '@/components/common/Timeline'; // ON IMPORTE NOTRE NOUVEAU COMPOSANT

// --- Interfaces ---
interface Depot {
  name: string;
}
interface Route {
  originDepot: Depot;
  destinationDepot: Depot;
}
interface Tracking {
    id: string;
    status: string;
    created_at: string;
}
interface Commande {
    id: string;
    created_at: string;
    route: Route;
    trackingHistory: Tracking[];
}

const CommandeDetailPage = () => {
  const authContext = useContext(AuthContext);
  const token = authContext?.token;
  
  const params = useParams();
  const id = params.id as string;

  const [commande, setCommande] = useState<Commande | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommande = useCallback(async () => {
    if (token && id) {
      try {
        setLoading(true);
        const data = await getCommandeById(id, token);
        setCommande(data);
        setError(null);
      } catch (err) {
        setError("Impossible de charger les détails de la commande.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }, [id, token]);

  useEffect(() => {
    if (token) {
      fetchCommande();
    }
  }, [fetchCommande, token]);

  if (loading) {
    return <main className="main-content" style={{ padding: '2rem' }}>Chargement de la commande...</main>;
  }

  if (error) {
    return <main className="main-content" style={{ padding: '2rem', color: 'red' }}>{error}</main>;
  }

  if (!commande) {
    return <main className="main-content" style={{ padding: '2rem' }}>Commande non trouvée.</main>;
  }

  return (
    <main className="main-content" style={{ padding: '2rem' }}>
      <Link href="/dashboard" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>&larr; Retour au tableau de bord</Link>
      <h1>Détails de la Commande</h1>
      <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <p><strong>ID:</strong> {commande.id}</p>
        <p><strong>Trajet:</strong> {commande.route.originDepot.name} → {commande.route.destinationDepot.name}</p>
        <p><strong>Date de création:</strong> {new Date(commande.created_at).toLocaleString('fr-FR')}</p>
      </div>
      
      <h2>Historique du suivi</h2>
      
      {/* ON REMPLACE LE <PRE> PAR NOTRE COMPOSANT TIMELINE */}
      <Timeline history={commande.trackingHistory} />

    </main>
  );
};

export default CommandeDetailPage;