"use client";
import React, { useRef } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Forwarders = () => {
  const forwarderCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  useScrollAnimation(forwarderCardsRef);

  const forwarders = [
    { icon: 'fas fa-ship', name: 'Logistique Afrique Express', country: 'Sénégal, Côte d\'Ivoire', price: 'À partir de 450€' },
    { icon: 'fas fa-plane', name: 'Global Transport Solution', country: 'Panafricain', price: 'À partir de 550€' },
    { icon: 'fas fa-truck', name: 'West Africa Logistics', country: 'Nigeria, Ghana', price: 'À partir de 380€' }
  ];

  return (
    <section className="forwarders">
      <h2 className="section-title">Transitaires populaires</h2>
      <div className="forwarders-grid">
        {forwarders.map((forwarder, index) => (
          <div 
            key={index} 
            className="forwarder-card"
            ref={el => { if(forwarderCardsRef.current) forwarderCardsRef.current[index] = el; }}
          >
            <div className="forwarder-image">
              <i className={forwarder.icon}></i>
            </div>
            <div className="forwarder-info">
              <h3>{forwarder.name}</h3>
              <div className="forwarder-meta">
                <span className="forwarder-country">{forwarder.country}</span>
                <span className="forwarder-price">{forwarder.price}</span>
              </div>
              <button className="btn btn-outline">Voir profil</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Forwarders;