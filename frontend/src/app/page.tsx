// Fichier: frontend/src/app/page.tsx

import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Forwarders from "@/components/Forwarders";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="main-content">
      <Hero />
      <Features />
      <Forwarders />
      <Pricing />
      <Footer />
    </main>
  );
}