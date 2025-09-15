// frontend/src/services/api.ts

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- GESTION DES ROUTES ---
export const getPublicRoutes = async () => {
  const response = await apiClient.get('/route/public');
  return response.data;
}

export const getRoutes = async (token: string) => {
  const response = await apiClient.get('/route', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

interface RouteData {
  originDepotId: string;
  destinationDepotId: string;
  mode: 'air' | 'sea' | 'express';
  price_per_kg: number;
  estimated_duration_in_days: number;
}

export const createRoute = async (routeData: RouteData, token: string) => {
  const response = await apiClient.post('/route', routeData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateRoute = async (routeId: string, routeData: Partial<RouteData>, token: string) => {
    const response = await apiClient.patch(`/route/${routeId}`, routeData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const deleteRoute = async (routeId: string, token: string) => {
    const response = await apiClient.delete(`/route/${routeId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};


// --- GESTION DES DÉPÔTS ---
interface DepotData {
  name: string;
  country: string;
  address: string;
}

export const getDepots = async (token: string) => {
  const response = await apiClient.get('/depot', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createDepot = async (depotData: DepotData, token: string) => {
  const response = await apiClient.post('/depot', depotData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateDepot = async (depotId: string, depotData: Partial<DepotData>, token: string) => {
  const response = await apiClient.patch(`/depot/${depotId}`, depotData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteDepot = async (depotId: string, token: string) => {
  const response = await apiClient.delete(`/depot/${depotId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


// --- AUTHENTIFICATION ---
interface RegistrationData {
  email: string;
  password: string;
  role: 'client' | 'transitaire';
  first_name: string;
  last_name: string;
  phone?: string;
  country?: string;
  city?: string;
  company_name?: string;
}

export const registerUser = async (userData: RegistrationData) => {
  try {
    const response = await apiClient.post('/user', userData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    throw error;
  }
};

interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async (loginData: LoginData) => {
  try {
    const response = await apiClient.post('/auth/login', loginData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    throw error;
  }
};

// --- GESTION DES COMMANDES ---
export interface CreateCommandeData {
  routeId: string;
  external_tracking_number: string;
  product_description: string;
  purchase_site?: string;
  declared_value?: number;
}

export const createCommande = async (commandeData: CreateCommandeData, token: string) => {
  const response = await apiClient.post('/commande', commandeData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getCommandes = async (token: string) => {
  const response = await apiClient.get('/commande', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateCommandeStatus = async (commandeId: string, status: string, token: string) => {
  const response = await apiClient.patch(`/commande/${commandeId}`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getCommandeById = async (commandeId: string, token: string) => {
  const response = await apiClient.get(`/commande/${commandeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// --- TRANSITAIRES PUBLICS ---
export const getPublicTransitaires = async () => {
  const response = await apiClient.get('/user/transitaires');
  return response.data;
};

export const getTransitairePublicProfile = async (id: string) => {
  const response = await apiClient.get(`/user/${id}`);
  return response.data;
};

// --- GESTION DE PROFIL UTILISATEUR ---
export interface UpdateProfileData {
  company_name?: string;
  profile_bio?: string;
  phone?: string;
  country?: string;
  city?: string;
  profile_picture_url?: string;
  cover_picture_url?: string;
  whatsapp_number?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  telegram_url?: string;
}

export const updateUserProfile = async (userId: string, profileData: UpdateProfileData, token: string) => {
  const response = await apiClient.patch(`/user/${userId}`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const uploadProfilePicture = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append('profilePicture', file);

  const response = await apiClient.post('/user/upload/profile-picture', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// --- MESSAGERIE ---
export const getConversations = async (token: string) => {
  const response = await apiClient.get('/conversation', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getConversationById = async (conversationId: string, token: string) => {
    const response = await apiClient.get(`/conversation/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// --- PAIEMENT ---
interface PaymentInitiationData {
  planName: string;
  amount: number;
}

export const initiatePaymentSession = async (paymentData: PaymentInitiationData, token: string) => {
  const response = await apiClient.post('/payment/initiate', paymentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // Devrait contenir { paymentUrl: '...' }
};