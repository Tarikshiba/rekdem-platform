// frontend/src/app/transitaires/[id]/page.tsx

import { getTransitairePublicProfile } from '@/services/api';
import Link from 'next/link';
import ProfileView from './ProfileView'; // On importe notre nouveau composant

// La signature de la page ne change pas, elle reste un composant serveur
const TransitaireProfilePage = async ({ params }: { params: { id: string } }) => {
  try {
    const transitaire = await getTransitairePublicProfile(params.id);

    if (!transitaire) {
      throw new Error("Transitaire non trouvé");
    }

    // Si on a les données, on passe la main au composant d'affichage
    return <ProfileView transitaire={transitaire} />;

  } catch (err) {
    // Gestion de l'erreur
    return (
      <div className="main-content p-8 text-center">
        <h1>Profil non trouvé</h1>
        <p>Le transitaire que vous cherchez n'existe pas ou une erreur est survenue.</p>
        <Link href="/transitaires" className="btn btn-secondary">&larr; Retour à la liste</Link>
      </div>
    );
  }
};

export default TransitaireProfilePage;