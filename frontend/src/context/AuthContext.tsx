"use client";
import React, { createContext, useState, useEffect, ReactNode } from 'react';

// --- INTERFACE MISE À JOUR ---
export interface User {
  id: string;
  email: string;
  role: 'client' | 'transitaire' | 'admin';
  first_name: string;
  last_name: string;
  phone?: string;
  country?: string;
  city?: string;
  company_name?: string;
  profile_bio?: string;
  profile_picture_url?: string;
  cover_picture_url?: string;
  whatsapp_number?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  telegram_url?: string;
}

// On définit ce que notre contexte va contenir
interface AuthContextType {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        localStorage.clear();
        setUser(null);
        setToken(null);
    }
  }, []);

  const login = (userData: User, newToken: string) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
    setToken(null);
  };

  return (
    // LIGNE CORRIGÉE
    <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};