// frontend/src/app/dashboard/messagerie/[id]/page.tsx

"use client";
import { useState, useEffect, useContext, useRef, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthContext, User } from '@/context/AuthContext';
import { ChatContext } from '@/context/ChatContext';
import { getConversationById } from '@/services/api';
import Link from 'next/link';

interface Message {
  id: string;
  text_content?: string;
  file_url?: string;
  message_type: 'text' | 'image';
  sender: Partial<User>;
  created_at: string;
}
interface ConversationData {
  id: string;
  client: Partial<User>;
  transitaire: Partial<User>;
  messages: Message[];
}

const ChatPage = () => {
  const params = useParams();
  const conversationId = params.id as string;
  
  const authContext = useContext(AuthContext);
  const chatContext = useContext(ChatContext);
  
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessageText, setNewMessageText] = useState('');

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatContext?.messages]);

  useEffect(() => {
    if (authContext?.token && conversationId) {
      const token = authContext.token;
      getConversationById(conversationId, token)
        .then(data => {
          setConversation(data);
          chatContext?.setMessages(data.messages || []);
        })
        .catch(() => setError("Impossible de charger la conversation."))
        .finally(() => setLoading(false));

      if (chatContext?.socket) {
        chatContext.socket.emit('joinRoom', conversationId);
      }
    }
  }, [conversationId, authContext?.token, chatContext?.socket, chatContext?.setMessages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !authContext?.user || !conversation) return;

    const messageData = {
      conversationId: conversation.id,
      senderId: authContext.user.id,
      message_type: 'text',
      text_content: newMessageText,
    };

    chatContext?.sendMessage(messageData);
    setNewMessageText('');
  };

  const getInitials = (user: Partial<User> | undefined) => {
    if (!user) return '?';
    const name = user.company_name || user.first_name;
    return name ? name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || '?';
  };
  
  if (loading) return <div className="dashboard-section"><p className="text-center p-4">Chargement de la conversation...</p></div>;
  if (error) return <div className="dashboard-section"><p className="text-center p-4 text-error">{error}</p></div>;
  if (!conversation) return <div className="dashboard-section"><p className="text-center p-4">Conversation non trouvée.</p></div>;
  
  // --- CORRECTION ICI ---
  // On s'assure que le contexte utilisateur est bien chargé avant de continuer.
  if (!authContext || !authContext.user) {
    return <div className="dashboard-section"><p className="text-center p-4">Chargement de l'utilisateur...</p></div>;
  }
  
  const { user } = authContext;

  const otherUser = user.id === conversation.client.id 
    ? conversation.transitaire 
    : conversation.client;

  const otherUserName = otherUser?.company_name || `${otherUser?.first_name || ''} ${otherUser?.last_name || ''}`.trim() || otherUser?.email;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <Link href="/dashboard/messagerie" className="text-sm hover:underline mb-2 block">&larr; Retour à la boîte de réception</Link>
        <h2>
          {otherUserName}
        </h2>
      </div>

      <div className="chat-messages">
        {chatContext?.messages.map(msg => {
          const isSender = msg.sender.id === user.id;
          const userForAvatar = isSender ? user : otherUser;
          
          return (
            <div 
              key={msg.id} 
              className={`message-bubble-container ${isSender ? 'is-sender' : 'is-receiver'}`}
            >
              <div className="message-avatar">
                {getInitials(userForAvatar)}
              </div>
              <div className={`message-bubble ${isSender ? 'is-sender' : 'is-receiver'}`}>
                <p className="message-text">{msg.text_content}</p>
                <span className="message-timestamp">
                  {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-form">
        <form onSubmit={handleSubmit}>
          <input 
            type="text"
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            placeholder="Écrivez votre message..."
            className="form-input"
          />
          <button type="submit" className="btn btn-primary">
            Envoyer <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;