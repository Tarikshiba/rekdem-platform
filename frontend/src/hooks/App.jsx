// src/App.js
import React from 'react';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import Features from './components/Features';
import Forwarders from './components/Forwarders';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="container">
      <Sidebar />
      <main className="main-content">
        <Hero />
        <Features />
        <Forwarders />
        <Pricing />
        <Footer />
      </main>
    </div>
  );
}

export default App;