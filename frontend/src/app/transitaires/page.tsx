// frontend/src/app/transitaires/page.tsx

import { getPublicTransitaires } from '@/services/api';
import TransitaireList from '@/components/transitaires/TransitaireList'; // On importe notre nouveau composant

// Interface pour typer les données d'un transitaire
interface Transitaire {
  id: string;
  company_name: string;
  country: string;
  city: string;
  profile_picture_url: string | null;
}

// La page reste un composant serveur
const TransitairesPage = async () => {
  let transitaires: Transitaire[] = [];
  let error = null;

  try {
    transitaires = await getPublicTransitaires();
  } catch (err) {
    console.error("Failed to fetch transitaires:", err);
    error = "Impossible de charger la liste des transitaires pour le moment.";
  }

  return (
    <main className="main-content" style={{ padding: '2rem' }}>
      <h1>Trouver un Transitaire</h1>
      <p>Parcourez notre réseau de professionnels de la logistique en Afrique et dans le monde.</p>
      
      {error && <p style={{ color: 'red', marginTop: '2rem' }}>{error}</p>}
      
      <div style={{ marginTop: '3rem' }}>
        {/* On utilise notre composant client pour afficher la liste et la barre de recherche */}
        <TransitaireList initialTransitaires={transitaires} />
      </div>
    </main>
  );
};

export default TransitairesPage;