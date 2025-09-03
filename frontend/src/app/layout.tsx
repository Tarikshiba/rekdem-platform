// frontend/src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";
import Header from "@/components/Header";

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
        <AuthProvider>
          <ChatProvider>
            <div className="app-container">
              <Header />
              {/* Le main-layout et le main-content sont toujours utiles pour la structure globale */}
              <div className="main-layout">
                {children}
              </div>
            </div>
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}