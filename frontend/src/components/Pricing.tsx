"use client";
import React, { useRef } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Pricing = () => {
  const pricingCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  useScrollAnimation(pricingCardsRef);

  const plans = [
    { name: 'Starter', price: '25€', interval: 'par mois', features: ['Profil entreprise visible', '10 demandes de devis/mois', 'Support de base', 'Outils de gestion simples'], popular: false, buttonClass: 'btn-filled', buttonText: 'S\'abonner' },
    { name: 'Business', price: '100€', interval: 'par mois', features: ['Profil entreprise mis en avant', 'Demandes de devis illimitées', 'Support prioritaire', 'Outils de gestion avancés', 'Statistiques détaillées'], popular: true, buttonClass: 'btn-primary', buttonText: 'S\'abonner' },
    { name: 'Enterprise', price: 'Sur mesure', interval: 'contactez-nous', features: ['Solution personnalisée', 'Intégration API', 'Support dédié 24/7', 'Formation de l\'équipe', 'Analyse marché avancée'], popular: false, buttonClass: 'btn-outline', buttonText: 'Nous contacter' }
  ];

  return (
    <section className="pricing">
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
              <div className="pricing-price">{plan.price}</div>
              <div className="pricing-interval">{plan.interval}</div>
            </div>
            <ul className="pricing-features">
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <i className="fas fa-check"></i> {feature}
                </li>
              ))}
            </ul>
            <button className={`btn ${plan.buttonClass}`}>{plan.buttonText}</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;