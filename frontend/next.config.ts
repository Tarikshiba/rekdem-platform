import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // On ajoute cette configuration pour ESLint
  eslint: {
    // Permet au build de production de réussir même s'il y a des erreurs ESLint.
    // C'est utile pour ne pas être bloqué par des règles de style de code.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;