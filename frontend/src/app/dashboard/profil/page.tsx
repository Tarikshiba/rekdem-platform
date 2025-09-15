// frontend/src/app/dashboard/profil/page.tsx

"use client";
import { useState, useContext, useEffect, FormEvent } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { updateUserProfile, UpdateProfileData, uploadProfilePicture } from '@/services/api';
import { UserRole } from '@/types/enums';

const ProfilePage = () => {
  const authContext = useContext(AuthContext);
  const { user, token, setUser } = authContext || {};

  const [formData, setFormData] = useState<UpdateProfileData>({
    company_name: '',
    profile_bio: '',
    phone: '',
    country: '',
    city: '',
    whatsapp_number: '',
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
    tiktok_url: '',
    telegram_url: '',
  });
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        company_name: user.company_name || '',
        profile_bio: user.profile_bio || '',
        phone: user.phone || '',
        country: user.country || '',
        city: user.city || '',
        whatsapp_number: user.whatsapp_number || '',
        facebook_url: user.facebook_url || '',
        instagram_url: user.instagram_url || '',
        youtube_url: user.youtube_url || '',
        tiktok_url: user.tiktok_url || '',
        telegram_url: user.telegram_url || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePictureFile(e.target.files[0]);
    }
  };

  const handlePictureSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profilePictureFile || !user || !token) return setError("Veuillez sélectionner un fichier.");
    
    setError(null);
    setSuccess(null);
    try {
      const updatedUser = await uploadProfilePicture(profilePictureFile, token);
      if (setUser) setUser(updatedUser);
      setSuccess("Photo de profil mise à jour !");
      setProfilePictureFile(null);
    } catch (err) {
      setError("Erreur lors de l'envoi de l'image.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !token) return setError("Vous n'êtes pas authentifié.");

    setError(null);
    setSuccess(null);
    try {
      const updatedUser = await updateUserProfile(user.id, formData, token);
      if(setUser) setUser(updatedUser);
      setSuccess("Profil mis à jour avec succès !");
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil.");
    }
  };

  if (!user) {
    return <p className="p-4 text-center">Chargement du profil...</p>;
  }
  
  const isTransitaire = user.role === UserRole.TRANSITAIRE;

  return (
    <>
      <h1>Mon Profil {isTransitaire ? "Professionnel" : ""}</h1>

      <div className="dashboard-section">
        <h3>Photo de profil</h3>
        <div className="flex items-center gap-6 mt-4">
          <img 
            src={user.profile_picture_url ? `http://localhost:3001/${user.profile_picture_url}` : 'https://via.placeholder.com/100'}
            alt="Photo de profil"
            className="w-24 h-24 rounded-full object-cover"
          />
          <form onSubmit={handlePictureSubmit} className="flex items-center gap-4">
            <input 
                type="file" 
                id="profile-picture-upload"
                accept="image/*" 
                onChange={handleFileChange}
                className="form-input"
                aria-label="Choisir une nouvelle photo de profil"
            />
            <button type="submit" disabled={!profilePictureFile} className="btn btn-secondary">
              Mettre à jour
            </button>
          </form>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="dashboard-section">
          <h3>Informations {isTransitaire ? "de l'entreprise" : "personnelles"}</h3>
          
          {isTransitaire && (
            <div className="form-group mt-4">
              <label htmlFor="company_name" className="form-label">Nom de l'entreprise</label>
              <input type="text" name="company_name" id="company_name" value={formData.company_name} onChange={handleChange} className="form-input"/>
            </div>
          )}
          
          <div className="form-group mt-4">
            <label htmlFor="profile_bio" className="form-label">Description / Bio</label>
            <textarea name="profile_bio" id="profile_bio" value={formData.profile_bio} onChange={handleChange} className="form-textarea" rows={4}/>
          </div>
        </div>

        <div className="dashboard-section">
            <h3>Informations de contact</h3>
            <div className="form-grid mt-4">
                <div className="form-group">
                    <label htmlFor="phone" className="form-label">Téléphone</label>
                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="form-input"/>
                </div>
                <div className="form-group">
                    <label htmlFor="whatsapp_number" className="form-label">Numéro WhatsApp</label>
                    <input type="tel" name="whatsapp_number" id="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} className="form-input"/>
                </div>
                <div className="form-group">
                    <label htmlFor="country" className="form-label">Pays</label>
                    <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} className="form-input"/>
                </div>
                <div className="form-group">
                    <label htmlFor="city" className="form-label">Ville</label>
                    <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} className="form-input"/>
                </div>
            </div>
        </div>

        {isTransitaire && (
          <div className="dashboard-section">
            <h3>Réseaux Sociaux</h3>
            <div className="form-grid mt-4">
              <div className="form-group">
                <label htmlFor="facebook_url" className="form-label">URL Facebook</label>
                <input type="url" name="facebook_url" id="facebook_url" value={formData.facebook_url} onChange={handleChange} className="form-input" placeholder="https://..."/>
              </div>
              <div className="form-group">
                <label htmlFor="instagram_url" className="form-label">URL Instagram</label>
                <input type="url" name="instagram_url" id="instagram_url" value={formData.instagram_url} onChange={handleChange} className="form-input" placeholder="https://..."/>
              </div>
              <div className="form-group">
                <label htmlFor="youtube_url" className="form-label">URL Youtube</label>
                <input type="url" name="youtube_url" id="youtube_url" value={formData.youtube_url} onChange={handleChange} className="form-input" placeholder="https://..."/>
              </div>
              <div className="form-group">
                <label htmlFor="tiktok_url" className="form-label">URL TikTok</label>
                <input type="url" name="tiktok_url" id="tiktok_url" value={formData.tiktok_url} onChange={handleChange} className="form-input" placeholder="https://..."/>
              </div>
              <div className="form-group full-width">
                <label htmlFor="telegram_url" className="form-label">URL Telegram</label>
                <input type="url" name="telegram_url" id="telegram_url" value={formData.telegram_url} onChange={handleChange} className="form-input" placeholder="https://..."/>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6">
            {success && <p className="text-success mb-4">{success}</p>}
            {error && <p className="text-error mb-4">{error}</p>}
            
            <button type="submit" className="btn btn-primary">
                Enregistrer les modifications
            </button>
        </div>
      </form>
    </>
  );
};

export default ProfilePage;