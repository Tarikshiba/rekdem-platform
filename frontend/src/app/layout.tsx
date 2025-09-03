// Fichier: frontend/src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/context/AuthContext"; // L'import pour le contexte

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
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body>
        {/* On enveloppe toute l'application avec le AuthProvider */}
        <AuthProvider>
          <div className="container">
            <Sidebar />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}