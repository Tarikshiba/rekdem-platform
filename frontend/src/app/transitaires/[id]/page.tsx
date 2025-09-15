// frontend/src/app/transitaires/[id]/page.tsx

import { getTransitairePublicProfile } from '@/services/api';
import Link from 'next/link';

// Interfaces pour les données (pas de changement ici)
interface Depot {
  id: string;
  name: string;
  country: string;
  address: string;
}
interface Route {
  id: string;
  mode: string;
  price_per_kg: number;
  estimated_duration_in_days: number;
}
interface TransitaireProfile {
  id: string;
  company_name: string;
  country: string;
  city: string;
  profile_bio: string | null;
  profile_picture_url: string | null;
  cover_picture_url: string | null;
  whatsapp_number: string | null;
  // ... autres champs
  depots: Depot[];
  routes: Route[];
}

// --- CORRECTION DU TYPAGE ICI ---
// On définit proprement le type des props que la page reçoit
interface PageProps {
  params: {
    id: string;
  };
}

const TransitaireProfilePage = async ({ params }: PageProps) => {
  let transitaire: TransitaireProfile | null = null;
  let error = null;

  try {
    transitaire = await getTransitairePublicProfile(params.id);
  } catch (err) {
    error = "Impossible de charger le profil de ce transitaire.";
  }

  if (error || !transitaire) {
    return (
      <div className="main-content p-8 text-center">
        <h1>Profil non trouvé</h1>
        <p className="mb-4">{error || "Le transitaire que vous cherchez n'existe pas."}</p>
        <Link href="/transitaires" className="btn btn-secondary">&larr; Retour à la liste</Link>
      </div>
    );
  }

  return (
    <div className="main-content">
      <section className="profile-hero">
        <img 
          src={transitaire.profile_picture_url ? `http://localhost:3001/${transitaire.profile_picture_url.replace(/\\/g, '/')}` : 'https://via.placeholder.com/120'}
          alt={`Profil de ${transitaire.company_name}`}
          className="profile-avatar"
        />
        <h1>{transitaire.company_name}</h1>
        <p>{transitaire.city}, {transitaire.country}</p>
      </section>

      <div className="profile-container">
        <main>
          {transitaire.profile_bio && (
              <section className="profile-section">
                  <h2>À propos de nous</h2>
                  <p className="text-gray-600">{transitaire.profile_bio}</p>
              </section>
          )}

          <section className="profile-section">
            <h2>Nos Dépôts</h2>
            {transitaire.depots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transitaire.depots.map(depot => (
                  <div key={depot.id} className="depot-card">
                    <strong>{depot.name}</strong>
                    <p>{depot.address}, {depot.country}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Ce transitaire n'a pas encore ajouté de dépôt.</p>
            )}
          </section>

          <section className="profile-section">
            <h2>Nos Routes et Tarifs</h2>
            {transitaire.routes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="dashboard-table w-full">
                  <thead>
                    <tr>
                      <th>Mode</th>
                      <th>Prix par Kg (FCFA)</th>
                      <th>Durée estimée</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transitaire.routes.map(route => (
                      <tr key={route.id}>
                        <td>{route.mode}</td>
                        <td>{route.price_per_kg.toFixed(2)}</td>
                        <td>{route.estimated_duration_in_days} jours</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>Ce transitaire n'a pas encore ajouté de route.</p>
            )}
          </section>
        </main>

        <aside className="profile-sidebar">
          <div className="card">
            <h3>Contact & Réseaux</h3>
            {transitaire.whatsapp_number && (
              <p><strong>WhatsApp:</strong> {transitaire.whatsapp_number}</p>
            )}
            {/* Les liens sociaux viendront ici */}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TransitaireProfilePage;