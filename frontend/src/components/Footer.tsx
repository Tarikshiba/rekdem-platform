// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-about">
          <div className="footer-logo">REKDEM</div>
          <p>Plateforme leader pour connecter les transitaires et leurs clients en Afrique et dans le monde.</p>
        </div>
        <div className="footer-links">
          <h4>Navigation</h4>
          <ul>
            <li><a href="#">Accueil</a></li>
            <li><a href="#">Fonctionnalités</a></li>
            <li><a href="#">Transitaires</a></li>
            <li><a href="#">Tarifs</a></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Légal</h4>
          <ul>
            <li><a href="#">Conditions d'utilisation</a></li>
            <li><a href="#">Politique de confidentialité</a></li>
            <li><a href="#">Mentions légales</a></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Contact</h4>
          <ul>
            <li><a href="#">support@rekdem.com</a></li>
            <li><a href="#">+33 1 23 45 67 89</a></li>
            <li><a href="#">Nous trouver</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2023 REKDEM. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;