// frontend/src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer"; // <-- Importer le Footer ici

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
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body>
        <AuthProvider>
          <ChatProvider>
            <div className="app-container">
              <Header />
              <main className="main-content">
                {children}
              </main>
              <Footer /> {/* <-- Ajouter le Footer ici */}
            </div>
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}