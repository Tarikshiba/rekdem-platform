// frontend/src/app/transitaires/[id]/page.tsx

import { getTransitairePublicProfile } from '@/services/api';
import Link from 'next/link';

// Interfaces pour typer les données que nous allons recevoir
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
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  telegram_url: string | null;
  depots: Depot[];
  routes: Route[];
}

const TransitaireProfilePage = async ({ params }: { params: { id: string } }) => {
  let transitaire: TransitaireProfile | null = null;
  let error = null;

  try {
    transitaire = await getTransitairePublicProfile(params.id);
  } catch (err) {
    console.error(err);
    error = "Impossible de charger le profil de ce transitaire.";
  }

  if (error || !transitaire) {
    return (
      <main className="main-content" style={{ padding: '2rem' }}>
        <h1>Profil non trouvé</h1>
        <p>{error || "Le transitaire que vous cherchez n'existe pas."}</p>
        <Link href="/transitaires">&larr; Retour à la liste</Link>
      </main>
    );
  }

  return (
    <main className="main-content" style={{ background: '#fff' }}>
      <section style={{ 
          background: 'linear-gradient(45deg, #FF8C00, #FF4B2B)', 
          color: 'white', 
          padding: '3rem 2rem', 
          textAlign: 'center',
          position: 'relative'
      }}>
        {transitaire.profile_picture_url && (
          <img 
            src={`http://localhost:3001/${transitaire.profile_picture_url.replace(/\\/g, '/')}`}
            alt={`Profil de ${transitaire.company_name}`}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              marginBottom: '1rem'
            }}
          />
        )}
        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{transitaire.company_name}</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>{transitaire.city}, {transitaire.country}</p>
      </section>

      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <Link href="/transitaires" style={{ marginBottom: '2rem', display: 'inline-block' }}>&larr; Retour à la liste</Link>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
          
          <div>
            {transitaire.profile_bio && (
                <section>
                    <h2>À propos de nous</h2>
                    <p style={{ lineHeight: 1.6, color: '#333' }}>{transitaire.profile_bio}</p>
                </section>
            )}

            <hr style={{ margin: '2rem 0' }}/>
            
            <section>
              <h2>Nos Dépôts</h2>
              {transitaire.depots.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                  {transitaire.depots.map(depot => (
                    <div key={depot.id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
                      <strong>{depot.name}</strong>
                      <p style={{ margin: '0.5rem 0 0', color: '#666' }}>{depot.address}, {depot.country}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Ce transitaire n'a pas encore ajouté de dépôt.</p>
              )}
            </section>

            <hr style={{ margin: '2rem 0' }}/>

            <section>
              <h2>Nos Routes et Tarifs</h2>
              {transitaire.routes.length > 0 ? (
                <table className="dashboard-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Mode</th>
                      <th>Prix par Kg</th>
                      <th>Durée estimée</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transitaire.routes.map(route => (
                      <tr key={route.id}>
                        <td>{route.mode}</td>
                        <td>{route.price_per_kg.toFixed(2)} €</td>
                        <td>{route.estimated_duration_in_days} jours</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Ce transitaire n'a pas encore ajouté de route.</p>
              )}
            </section>
          </div>

          <aside>
            <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
              <h3>Contact & Réseaux</h3>
              {transitaire.whatsapp_number && (
                <p><strong>WhatsApp:</strong> {transitaire.whatsapp_number}</p>
              )}
              {/* Les liens sociaux viendront ici */}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default TransitaireProfilePage;