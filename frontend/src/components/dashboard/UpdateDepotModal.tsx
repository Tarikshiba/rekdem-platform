"use client";
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { updateDepot } from '@/services/api';
import Modal from '../common/Modal';

interface Depot {
  id: string;
  name: string;
  country: string;
  address: string;
}

interface UpdateDepotModalProps {
  depot: Depot | null; // Le dépôt à modifier
  isOpen: boolean;
  onClose: () => void;
  onDepotUpdated: () => void; // Pour rafraîchir la liste
}

const UpdateDepotModal: React.FC<UpdateDepotModalProps> = ({ depot, isOpen, onClose, onDepotUpdated }) => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const authContext = useContext(AuthContext);

  // Pré-remplir le formulaire quand un dépôt est sélectionné
  useEffect(() => {
    if (depot) {
      setName(depot.name);
      setCountry(depot.country);
      setAddress(depot.address);
    }
  }, [depot]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authContext?.token || !depot) return;

    try {
      await updateDepot(depot.id, { name, country, address }, authContext.token);
      onDepotUpdated(); // Prévenir le parent de rafraîchir
      onClose(); // Fermer le modal
    } catch (error) {
      alert("Erreur lors de la mise à jour du dépôt.");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <h2>Modifier le dépôt</h2>
        {/* Le formulaire est identique à celui de la création */}
        <div style={{ margin: '1rem 0' }}>
          <label htmlFor="update-depot-name">Nom du dépôt</label>
          <input type="text" id="update-depot-name" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
        </div>
        <div style={{ margin: '1rem 0' }}>
          <label htmlFor="update-depot-country">Pays</label>
          <input type="text" id="update-depot-country" value={country} onChange={(e) => setCountry(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
        </div>
        <div style={{ margin: '1rem 0' }}>
          <label htmlFor="update-depot-address">Adresse</label>
          <input type="text" id="update-depot-address" value={address} onChange={(e) => setAddress(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }}/>
        </div>
        <button type="submit" className="btn btn-primary">Enregistrer les modifications</button>
      </form>
    </Modal>
  );
};

export default UpdateDepotModal;