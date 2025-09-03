// frontend/src/app/dashboard/profil/page.tsx

"use client";
import { useState, useContext, useEffect, FormEvent } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { updateUserProfile, UpdateProfileData, uploadProfilePicture } from '@/services/api';
import Link from 'next/link';

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      setError("Vous n'êtes pas authentifié.");
      return;
    }
    setError(null);
    setSuccess(null);
    
    try {
      const updatedUser = await updateUserProfile(user.id, formData, token);
      if(setUser) {
          setUser(updatedUser);
      }
      setSuccess("Profil mis à jour avec succès !");
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil.");
      console.error(err);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePictureFile(e.target.files[0]);
    }
  };

  const handlePictureSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profilePictureFile || !user || !token) {
      setError("Veuillez sélectionner un fichier.");
      return;
    }
    setError(null);
    setSuccess(null);

    try {
      const updatedUser = await uploadProfilePicture(profilePictureFile, token);
      if (setUser) {
        setUser(updatedUser);
      }
      setSuccess("Photo de profil mise à jour !");
      setProfilePictureFile(null);
    } catch (err) {
      setError("Erreur lors de l'envoi de l'image.");
      console.error(err);
    }
  };

  if (!user) {
    return <p>Chargement...</p>;
  }

  return (
    <main className="main-content" style={{ padding: '2rem' }}>
      <Link href="/dashboard">&larr; Retour au tableau de bord</Link>
      <h1>Modifier mon Profil</h1>

      <section style={{ marginTop: '2rem', background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
        <h3>Photo de profil</h3>
        {user.profile_picture_url && (
          <img 
            src={`http://localhost:3001/${user.profile_picture_url.replace(/\\/g, '/')}`}
            alt="Photo de profil actuelle"
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }}
          />
        )}
        <form onSubmit={handlePictureSubmit}>
            <label htmlFor="profile-picture-upload">
                Choisir une nouvelle photo :
            </label>
            <input 
                type="file" 
                id="profile-picture-upload"
                accept="image/*" 
                onChange={handleFileChange} 
                style={{ marginLeft: '10px' }}
            />
          <button type="submit" disabled={!profilePictureFile} className="btn btn-secondary" style={{ marginLeft: '1rem' }}>
            Mettre à jour la photo
          </button>
        </form>
      </section>

      <hr style={{ margin: '2rem 0' }}/>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div>
          <label htmlFor="company_name">Nom de l'entreprise</label>
          <input type="text" name="company_name" id="company_name" value={formData.company_name} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
        </div>
        <div>
          <label htmlFor="profile_bio">Description / Bio</label>
          <textarea name="profile_bio" id="profile_bio" value={formData.profile_bio} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '4px', minHeight: '100px' }}/>
        </div>

        <h3>Informations de contact</h3>
        <div>
          <label htmlFor="phone">Téléphone</label>
          <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
        </div>
         <div>
          <label htmlFor="whatsapp_number">Numéro WhatsApp</label>
          <input type="tel" name="whatsapp_number" id="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
        </div>
        <div>
          <label htmlFor="country">Pays</label>
          <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
        </div>
        <div>
          <label htmlFor="city">Ville</label>
          <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
        </div>

        <h3>Réseaux Sociaux</h3>
        <div>
          <label htmlFor="facebook_url">URL Facebook</label>
          <input type="url" name="facebook_url" id="facebook_url" value={formData.facebook_url} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
        </div>
         <div>
          <label htmlFor="instagram_url">URL Instagram</label>
          <input type="url" name="instagram_url" id="instagram_url" value={formData.instagram_url} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
        </div>
         <div>
          <label htmlFor="youtube_url">URL Youtube</label>
          <input type="url" name="youtube_url" id="youtube_url" value={formData.youtube_url} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
        </div>
         <div>
          <label htmlFor="tiktok_url">URL TikTok</label>
          <input type="url" name="tiktok_url" id="tiktok_url" value={formData.tiktok_url} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
        </div>
         <div>
          <label htmlFor="telegram_url">URL Telegram</label>
          <input type="url" name="telegram_url" id="telegram_url" value={formData.telegram_url} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
        </div>

        {success && <p style={{ color: 'green' }}>{success}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', alignSelf: 'flex-start' }}>
          Enregistrer les modifications
        </button>
      </form>
    </main>
  );
};

export default ProfilePage;