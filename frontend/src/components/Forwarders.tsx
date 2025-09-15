// frontend/src/components/Forwarders.tsx

"use client";
import React, { useRef } from 'react';
import Link from 'next/link'; // Importer le composant Link
import useScrollAnimation from '../hooks/useScrollAnimation';

const Forwarders = () => {
  const forwarderCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  useScrollAnimation(forwarderCardsRef);

  // Ces données seront à terme chargées depuis votre API
  const forwarders = [
    { id: 1, icon: 'fas fa-ship', name: 'Logistique Afrique Express', country: 'Sénégal, Côte d\'Ivoire', price: 'À partir de 450€' },
    { id: 2, icon: 'fas fa-plane', name: 'Global Transport Solution', country: 'Panafricain', price: 'À partir de 550€' },
    { id: 3, icon: 'fas fa-truck', name: 'West Africa Logistics', country: 'Nigeria, Ghana', price: 'À partir de 380€' }
  ];

  return (
    <section className="forwarders">
      <h2 className="section-title">Transitaires populaires</h2>
      <div className="forwarders-grid">
        {forwarders.map((forwarder, index) => (
          <div 
            key={forwarder.id} 
            className="forwarder-card"
            ref={el => { if(forwarderCardsRef.current) forwarderCardsRef.current[index] = el; }}
          >
            <div className="forwarder-image">
              <i className={forwarder.icon}></i>
            </div>
            <div className="forwarder-info">
              <h3>{forwarder.name}</h3>
              <div className="forwarder-meta">
                {/* La classe 'forwarder-country' a été retirée car non définie dans le CSS */}
                <span>{forwarder.country}</span>
                <span className="forwarder-price">{forwarder.price}</span>
              </div>
              {/* Le <button> est remplacé par un <Link> pour une meilleure sémantique */}
              <Link href={`/transitaires/${forwarder.id}`} className="btn btn-outline">
                Voir le profil
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Forwarders;