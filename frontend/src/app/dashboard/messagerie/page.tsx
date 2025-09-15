// frontend/src/app/dashboard/messagerie/page.tsx

"use client";
import { useState, useEffect, useContext } from 'react';
import { AuthContext, User } from '@/context/AuthContext';
import { getConversations } from '@/services/api';
import Link from 'next/link';

interface Conversation {
  id: string;
  client: Partial<User>;
  transitaire: Partial<User>;
  commande: {
    id: string;
  };
}

const MessageriePage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const { user } = authContext || {};

  useEffect(() => {
    // On vérifie que le token existe
    if (authContext?.token) {
      // On le stocke dans une constante. Ici, TypeScript est certain que `token` est un 'string'.
      const token = authContext.token; 
      
      const fetchConversations = async () => {
        try {
          setLoading(true);
          // On utilise notre nouvelle constante `token` ici
          const data = await getConversations(token);
          setConversations(data);
        } catch (err) {
          setError("Impossible de charger les conversations.");
        } finally {
          setLoading(false);
        }
      };
      fetchConversations();
    }
  }, [authContext?.token]);

  const getInitials = (otherUser: Partial<User> | undefined) => {
    if (!otherUser) return '?';
    const name = otherUser.company_name || otherUser.first_name;
    return name ? name.charAt(0).toUpperCase() : otherUser.email?.charAt(0).toUpperCase() || '?';
  };

  if (loading) return <p className="p-4 text-center">Chargement de votre boîte de réception...</p>;
  if (error) return <p className="p-4 text-center text-error">{error}</p>;

  return (
    <>
      <h1>Boîte de Réception</h1>
      <div className="dashboard-section">
        <p className="mb-4">
          Retrouvez ici toutes vos conversations avec les {user?.role === 'client' ? 'transitaires' : 'clients'}.
        </p>

        {conversations.length === 0 ? (
          <p className="text-center p-6">Vous n'avez aucune conversation pour le moment.</p>
        ) : (
          <div className="conversation-list">
            {conversations.map(conv => {
              const otherUser = user?.role === 'client' ? conv.transitaire : conv.client;
              const userName = otherUser?.company_name || `${otherUser?.first_name || ''} ${otherUser?.last_name || ''}`.trim() || otherUser?.email;

              return (
                <Link 
                  key={conv.id} 
                  href={`/dashboard/messagerie/${conv.id}`}
                  className="conversation-item"
                >
                  <div className="conversation-avatar">
                    {getInitials(otherUser)}
                  </div>
                  <div className="conversation-details">
                    <div className="conversation-user">{userName}</div>
                    <div className="conversation-subject">
                      Sujet : Commande #{conv.commande.id.substring(0, 8)}...
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MessageriePage;