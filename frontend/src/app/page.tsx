// Fichier: frontend/src/app/page.tsx

import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Forwarders from "@/components/Forwarders";
import Pricing from "@/components/Pricing";

export default function HomePage() {
  return (
    // Le <main> est conservé, mais le Footer est retiré.
    // La class 'main-content' ici est redondante car déjà présente dans le layout, nous la retirons pour plus de propreté.
    <>
      <Hero />
      <Features />
      <Forwarders />
      <Pricing />
    </>
  );
}