// frontend/src/app/dashboard/nouvelle-commande/page.tsx

"use client";

import { useState, useEffect, useMemo, FormEvent, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { getPublicRoutes, createCommande } from '@/services/api'; // On importe createCommande
import { AuthContext } from '@/context/AuthContext'; // On importe le contexte
import Link from 'next/link';

// --- Interfaces pour les données ---
interface Depot {
    id: string;
    name: string;
}
interface TransitaireInfo {
    id: string;
    company_name: string;
}
interface PublicRoute {
    id: string;
    originDepot: Depot;
    destinationDepot: Depot;
    mode: string;
    price_per_kg: number;
    user: TransitaireInfo;
}

const NewOrderPage = () => {
    const [allRoutes, setAllRoutes] = useState<PublicRoute[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // États pour le formulaire
    const [selectedTransitaireId, setSelectedTransitaireId] = useState('');
    const [selectedRouteId, setSelectedRouteId] = useState('');
    const [externalTracking, setExternalTracking] = useState('');
    const [productDescription, setProductDescription] = useState('');

    const authContext = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                setLoading(true);
                const routesData = await getPublicRoutes();
                setAllRoutes(routesData);
            } catch (err) {
                setError("Impossible de charger les routes disponibles.");
            } finally {
                setLoading(false);
            }
        };
        fetchRoutes();
    }, []);

    const transitaires = useMemo(() => {
        const transitaireMap = new Map<string, TransitaireInfo>();
        allRoutes.forEach(route => {
            if (!transitaireMap.has(route.user.id)) {
                transitaireMap.set(route.user.id, route.user);
            }
        });
        return Array.from(transitaireMap.values());
    }, [allRoutes]);

    const availableRoutesForSelectedTransitaire = allRoutes.filter(
        route => route.user.id === selectedTransitaireId
    );

    // --- FONCTION DE SOUMISSION MISE À JOUR ---
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!authContext?.token) {
            setError("Vous devez être connecté pour créer une commande.");
            return;
        }

        try {
            await createCommande({
                routeId: selectedRouteId,
                external_tracking_number: externalTracking,
                product_description: productDescription,
            }, authContext.token);

            setSuccess("Votre colis a été enregistré avec succès ! Vous allez être redirigé...");

            // Redirection vers le tableau de bord après 2 secondes
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);

        } catch (err) {
            setError("Une erreur est survenue lors de l'enregistrement du colis.");
            console.error(err);
        }
    }

    if (loading) return <p>Chargement des expéditions disponibles...</p>;
    if (error) return <p style={{color: 'red'}}>{error}</p>;

    return (
        <main className="main-content" style={{ padding: '2rem' }}>
            <Link href="/dashboard">&larr; Retour au tableau de bord</Link>
            <h1>Soumettre un nouveau colis</h1>
            <p>Suivez les étapes pour enregistrer un colis que vous avez acheté en ligne.</p>

            <form onSubmit={handleSubmit} style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <fieldset style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
                    <legend style={{ padding: '0 10px' }}>Étape 1 : Choisissez votre expédition</legend>
                    
                    <div className="form-group">
                        <label className="form-label" htmlFor="transitaire-select">Transitaire</label>
                        <select 
                            id="transitaire-select" 
                            value={selectedTransitaireId}
                            onChange={(e) => {
                                setSelectedTransitaireId(e.target.value);
                                setSelectedRouteId('');
                            }}
                            required 
                            className="form-select"
                        >
                            <option value="">-- Sélectionnez un transitaire --</option>
                            {transitaires.map(t => (
                                <option key={t.id} value={t.id}>{t.company_name}</option>
                            ))}
                        </select>
                    </div>

                    {selectedTransitaireId && (
                        <div className="form-group">
                            <label className="form-label" htmlFor="route-select">Route</label>
                            <select 
                                id="route-select"
                                value={selectedRouteId}
                                onChange={(e) => setSelectedRouteId(e.target.value)}
                                required
                                className="form-select"
                            >
                                <option value="">-- Sélectionnez une route --</option>
                                {availableRoutesForSelectedTransitaire.map(r => (
                                    <option key={r.id} value={r.id}>
                                        {r.originDepot.name} → {r.destinationDepot.name} ({r.mode}, {r.price_per_kg}€/kg)
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </fieldset>

                {selectedRouteId && (
                    <fieldset style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
                        <legend style={{ padding: '0 10px' }}>Étape 2 : Entrez les informations de votre colis</legend>
                        
                        <div className="form-group">
                            <label className="form-label" htmlFor="externalTracking">Numéro de suivi du vendeur (ex: Amazon)</label>
                            <input 
                                type="text"
                                id="externalTracking"
                                value={externalTracking}
                                onChange={(e) => setExternalTracking(e.target.value)}
                                required
                                className="form-input"
                                placeholder="ASDF123456789"
                            />
                        </div>

                         <div className="form-group">
                            <label className="form-label" htmlFor="productDescription">Description simple du contenu</label>
                            <input 
                                type="text"
                                id="productDescription"
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                                required
                                className="form-input"
                                placeholder="Ex: Vêtements, livres, pièces auto..."
                            />
                        </div>
                    </fieldset>
                )}

                {success && <p style={{ color: 'green' }}>{success}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ alignSelf: 'flex-start' }}
                    disabled={!selectedRouteId || !externalTracking || !productDescription}
                >
                    Enregistrer mon colis
                </button>
            </form>
        </main>
    );
};

export default NewOrderPage;