// frontend/src/components/transitaires/TransitaireList.tsx

"use client"; // On déclare ce composant comme un Composant Client
import { useState } from 'react';
import Link from 'next/link';

// Interface pour typer les données d'un transitaire
interface Transitaire {
  id: string;
  company_name: string;
  country: string;
  city: string;
  profile_picture_url: string | null;
}

interface TransitaireListProps {
  initialTransitaires: Transitaire[];
}

const TransitaireList: React.FC<TransitaireListProps> = ({ initialTransitaires }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // On filtre la liste des transitaires en fonction du terme de recherche
  const filteredTransitaires = initialTransitaires.filter((transitaire) => 
    transitaire.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transitaire.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transitaire.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* La Barre de Recherche */}
      <div style={{ marginBottom: '2.5rem' }}>
        <input
          type="text"
          placeholder="Rechercher par nom, pays, ville..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px', fontSize: '1rem', borderRadius: '8px', border: '1px solid #ccc' }}
        />
      </div>

      {/* La Grille des Transitaires */}
      {filteredTransitaires.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {filteredTransitaires.map((transitaire) => (
            <div key={transitaire.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{transitaire.company_name}</h3>
              <p style={{ margin: 0, color: '#555' }}>{transitaire.city}, {transitaire.country}</p>
              <Link href={`/transitaires/${transitaire.id}`} style={{ marginTop: '1rem', display: 'inline-block' }}>
                Voir le profil
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucun transitaire ne correspond à votre recherche.</p>
      )}
    </div>
  );
};

export default TransitaireList;