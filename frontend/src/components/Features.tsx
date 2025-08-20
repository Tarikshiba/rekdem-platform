"use client";
import React, { useRef } from 'react'; // On n'a plus besoin de useEffect ici
import useScrollAnimation from '../hooks/useScrollAnimation';

const Features = () => {
  const featureCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  // Le chef d'équipe appelle le photographe avec son équipe
  useScrollAnimation(featureCardsRef);

  const features = [
    { icon: 'fas fa-map-marker-alt', title: 'Trouver un transitaire près de vous', description: 'Accédez à notre réseau de transitaires qualifiés partout en Afrique et dans le monde.' },
    { icon: 'fas fa-chart-line', title: 'Comparer les tarifs et destinations', description: 'Obtenez les meilleurs prix et comparez les offres pour vos routes d\'expédition.' },
    { icon: 'fas fa-box', title: 'Suivi simple et rapide', description: 'Suivez vos expéditions en temps réel avec notre système de traçage avancé.' },
    { icon: 'fas fa-user-tie', title: 'Espace pro pour les transitaires', description: 'Gérez votre activité, vos clients et vos expéditions depuis une interface unique.' }
  ];

  return (
    <section className="features">
      <h2 className="section-title">Nos fonctionnalités</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="feature-card"
            ref={el => { if(featureCardsRef.current) featureCardsRef.current[index] = el; }}
          >
            <div className="feature-icon">
              <i className={feature.icon}></i>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;