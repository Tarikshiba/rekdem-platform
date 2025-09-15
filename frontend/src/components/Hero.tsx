// Fichier: frontend/src/components/Hero.tsx
import Link from 'next/link';

const Hero = () => {
  return (
    // La classe 'hero' est conservée, elle définit le conteneur principal de la section
    <section className="hero">
      <div className="hero-content">
        {/* Ajout de la classe 'hero-title' pour le style et l'animation du titre */}
        <h1 className="hero-title">
          La logistique africaine, simplifiée et digitalisée
        </h1>
        {/* Ajout de la classe 'hero-subtitle' pour le style et l'animation du sous-titre */}
        <p className="hero-subtitle">
          Mettez en relation clients et transitaires sur une plateforme fiable et intuitive. Suivi en temps réel, messagerie intégrée, et gestion simplifiée.
        </p>
        {/* La classe 'hero-cta' gère l'animation du bouton */}
        <div className="hero-cta">
          <Link href="/transitaires" className="btn btn-primary">
            Trouver un transitaire
          </Link>
        </div>
      </div>
      <div className="hero-visual">
        {/* Remplacement du SVG par une illustration plus professionnelle et thématique */}
        <svg width="100%" height="100%" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: 'var(--color-primary-400)', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor: 'var(--color-primary-600)', stopOpacity:1}} />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: 'var(--color-gray-300)', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor: 'var(--color-gray-500)', stopOpacity:1}} />
            </linearGradient>
          </defs>
          {/* Background shapes */}
          <path d="M 800 0 V 600 H 0 L 300 0 Z" fill="var(--color-primary-50)" />
          <path d="M 0 600 L 0 400 L 250 600 Z" fill="var(--color-primary-100)" />
          
          {/* Globe */}
          <circle cx="200" cy="250" r="150" fill="rgba(255, 255, 255, 0.7)" stroke="var(--color-primary-200)" strokeWidth="2"/>
          <path d="M 120 180 Q 200 220 280 180" stroke="var(--color-primary-300)" strokeWidth="3" fill="none" />
          <path d="M 100 250 Q 200 280 300 250" stroke="var(--color-primary-300)" strokeWidth="3" fill="none" />
          <path d="M 120 320 Q 200 340 280 320" stroke="var(--color-primary-300)" strokeWidth="3" fill="none" />
          <path d="M 170 150 Q 180 250 170 350" stroke="var(--color-primary-300)" strokeWidth="3" fill="none" />
          <path d="M 230 150 Q 220 250 230 350" stroke="var(--color-primary-300)" strokeWidth="3" fill="none" />

          {/* Truck */}
          <g transform="translate(450, 350) scale(1.2)">
            <rect x="0" y="20" width="150" height="80" rx="10" fill="url(#grad1)" stroke="var(--color-primary-700)" strokeWidth="2" />
            <rect x="140" y="0" width="60" height="70" rx="10" fill="var(--color-gray-100)" stroke="var(--color-gray-400)" strokeWidth="2" />
            <path d="M 195 5 L 195 40 L 145 40 Z" fill="rgba(255,255,255,0.8)" />
            <circle cx="40" cy="105" r="20" fill="url(#grad2)" stroke="var(--color-gray-800)" strokeWidth="2" />
            <circle cx="160" cy="105" r="20" fill="url(#grad2)" stroke="var(--color-gray-800)" strokeWidth="2" />
          </g>
          
          {/* Dashed lines representing movement */}
          <path d="M 350 250 L 500 200" stroke="var(--color-primary-400)" strokeWidth="3" fill="none" strokeDasharray="10 5" />
          <path d="M 50 150 L 250 50" stroke="var(--color-primary-400)" strokeWidth="2" fill="none" strokeDasharray="5 5" opacity="0.5"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;