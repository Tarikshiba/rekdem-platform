// frontend/src/context/ChatContext.tsx

"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { AuthContext, User } from './AuthContext';

// Interface pour un message (côté frontend)
interface Message {
  id: string;
  text_content?: string;
  file_url?: string;
  message_type: 'text' | 'image';
  sender: Partial<User>; // On n'a besoin que de quelques infos du sender
  created_at: string;
}

// Ce que notre contexte va fournir
interface ChatContextType {
  socket: Socket | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sendMessage: (messageData: any) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const authContext = useContext(AuthContext);

  // Gère la connexion et la déconnexion du socket
  useEffect(() => {
    // Si l'utilisateur est connecté, on établit la connexion
    if (authContext?.token) {
      // On se connecte à notre backend NestJS
      const newSocket = io('http://localhost:3001');
      setSocket(newSocket);

      // On écoute l'événement 'connect'
      newSocket.on('connect', () => {
        console.log('Connected to WebSocket server with ID:', newSocket.id);
      });

      // On se déconnecte quand le composant est "démonté" ou l'utilisateur déconnecté
      return () => {
        console.log('Disconnecting from WebSocket server...');
        newSocket.disconnect();
      };
    }
  }, [authContext?.token]);

  // Gère l'écoute des nouveaux messages
  useEffect(() => {
    if (socket) {
      // On se met à l'écoute de l'événement 'newMessage' venant du serveur
      socket.on('newMessage', (newMessage: Message) => {
        // On ajoute le nouveau message à notre liste de messages
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      // On nettoie l'écouteur quand le composant est démonté
      return () => {
        socket.off('newMessage');
      };
    }
  }, [socket]);

  // Fonction pour envoyer un message via le socket
  const sendMessage = (messageData: any) => {
    if (socket) {
      socket.emit('sendMessage', messageData);
    }
  };

  return (
    <ChatContext.Provider value={{ socket, messages, setMessages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};