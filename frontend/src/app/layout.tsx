// Fichier: frontend/src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar"; // Vous avez raison de garder .tsx

export const metadata: Metadata = {
  title: "REKDEM - Plateforme pour Transitaires en Afrique",
  description: "Simplifiez vos expéditions en Afrique et dans le monde.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/*
          CETTE LIGNE EST LA PIÈCE MANQUANTE.
          Elle connecte votre projet à la bibliothèque d'icônes Font Awesome.
        */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body>
        <div className="container">
          <Sidebar />
          {children}
        </div>
      </body>
    </html>
  );
}