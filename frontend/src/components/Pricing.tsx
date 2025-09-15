// frontend/src/components/Pricing.tsx

"use client";
import React, { useRef, useContext, useState } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { AuthContext } from '@/context/AuthContext';
import { initiatePaymentSession } from '@/services/api';
import { UserRole } from '@/types/enums';

const Pricing = () => {
  const pricingCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  useScrollAnimation(pricingCardsRef);

  const authContext = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<string | null>(null); // Pour savoir quel plan est en cours de chargement

  // Données des plans mises à jour avec un montant numérique en FCFA
  const plans = [
    { name: 'Starter', price: '16.500 FCFA', amount: 16500, interval: 'par mois', features: ['Profil entreprise visible', '10 demandes de devis/mois', 'Support de base', 'Outils de gestion simples'], popular: false, buttonClass: 'btn-secondary', buttonText: 'S\'abonner' },
    { name: 'Business', price: '65.500 FCFA', amount: 65500, interval: 'par mois', features: ['Profil entreprise mis en avant', 'Demandes de devis illimitées', 'Support prioritaire', 'Outils de gestion avancés', 'Statistiques détaillées'], popular: true, buttonClass: 'btn-primary', buttonText: 'S\'abonner' },
    { name: 'Enterprise', price: 'Sur mesure', amount: 0, interval: 'contactez-nous', features: ['Solution personnalisée', 'Intégration API', 'Support dédié 24/7', 'Formation de l\'équipe', 'Analyse marché avancée'], popular: false, buttonClass: 'btn-outline', buttonText: 'Nous contacter' }
  ];

  const handleSubscription = async (plan: typeof plans[0]) => {
    // Gérer le cas du plan "Enterprise" qui est un contact
    if (plan.amount === 0) {
      window.location.href = 'mailto:contact@rekdem.com'; // Ou une page de contact
      return;
    }

    // Vérifier si l'utilisateur est connecté
    if (!authContext?.user || !authContext.token) {
      alert("Veuillez vous connecter ou vous inscrire pour vous abonner.");
      // Idéalement, ici on ouvrirait le pop-up de connexion
      return;
    }
    
    // Vérifier que seul un transitaire peut s'abonner
    if (authContext.user.role !== UserRole.TRANSITAIRE) {
        alert("Seuls les transitaires peuvent s'abonner à un plan.");
        return;
    }

    setIsLoading(plan.name);
    try {
      const paymentData = {
        planName: plan.name,
        amount: plan.amount,
      };
      
      const response = await initiatePaymentSession(paymentData, authContext.token);

      if (response && response.paymentUrl) {
        // Redirection vers la page de paiement CinetPay
        window.location.href = response.paymentUrl;
      } else {
        throw new Error("L'URL de paiement n'a pas été reçue.");
      }

    } catch (error) {
      console.error("Erreur lors de l'initiation du paiement:", error);
      alert("Une erreur est survenue lors de la création de la session de paiement. Veuillez réessayer.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <section className="pricing" id="pricing">
      <h2 className="section-title">Nos offres pour transitaires</h2>
      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div 
            key={index} 
            className={`pricing-card ${plan.popular ? 'popular' : ''}`}
            ref={el => { if(pricingCardsRef.current) pricingCardsRef.current[index] = el; }}
          >
            <div className="pricing-header">
              <h3 className="pricing-name">{plan.name}</h3>
              <p className="pricing-price">{plan.price}</p>
              <p className="pricing-interval">{plan.interval}</p>
            </div>
            <ul className="pricing-features">
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <i className="fas fa-check"></i> {feature}
                </li>
              ))}
            </ul>
            <button 
              className={`btn ${plan.buttonClass}`}
              onClick={() => handleSubscription(plan)}
              disabled={isLoading === plan.name}
            >
              {isLoading === plan.name ? 'Chargement...' : plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;