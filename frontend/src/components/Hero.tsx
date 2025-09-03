// Fichier: frontend/src/components/Hero.tsx
import Link from 'next/link'; // On importe le composant Link

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>REKDEM : Simplifiez vos expéditions en Afrique et dans le monde</h1>
        <p>Clients → gratuit. Transitaires → visibilité, outils et clients.</p>
        <div className="hero-cta">
          {/* On remplace le bouton par un lien stylisé comme un bouton */}
          <Link href="/transitaires" className="btn btn-primary">
            Trouver un transitaire
          </Link>
        </div>
      </div>
      <div className="hero-visual">
        {/* Le SVG reste inchangé */}
        <svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
          <path d="M100,250 L400,250 L400,200 L350,150 L300,150 L250,100 L150,100 L100,150 L100,250" fill="rgba(255,75,43,0.1)" stroke="#FF4B2B" strokeWidth="3"/>
          <path d="M150,100 L250,100 L300,150 L350,150 L400,200 L400,150 L350,100 L250,50 L150,50 L100,100 L150,100" fill="rgba(255,140,0,0.1)" stroke="#FF8C00" strokeWidth="3"/>
          <circle cx="130" cy="230" r="20" fill="rgba(255,215,0,0.2)" stroke="#FFD700" strokeWidth="2"/>
          <circle cx="230" cy="230" r="20" fill="rgba(255,215,0,0.2)" stroke="#FFD700" strokeWidth="2"/>
          <circle cx="370" cy="230" r="20" fill="rgba(255,215,0,0.2)" stroke="#FFD700" strokeWidth="2"/>
          <path d="M50,50 L100,100" stroke="#FF4B2B" strokeWidth="2" strokeDasharray="5,5"/>
          <path d="M450,50 L400,100" stroke="#FF8C00" strokeWidth="2" strokeDasharray="5,5"/>
          <path d="M50,200 L100,150" stroke="#FFD700" strokeWidth="2" strokeDasharray="5,5"/>
          <path d="M450,200 L400,150" stroke="#FF4B2B" strokeWidth="2" strokeDasharray="5,5"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;