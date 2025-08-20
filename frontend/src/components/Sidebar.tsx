// src/components/Sidebar.js
import React from 'react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo">REKDEM</div>
      <div className="auth-buttons">
        <a href="#" className="btn btn-outline">Se connecter</a>
        <a href="#" className="btn btn-filled">S'inscrire</a>
      </div>
    </aside>
  );
};

export default Sidebar;