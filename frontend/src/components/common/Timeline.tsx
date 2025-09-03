// frontend/src/components/common/Timeline.tsx

import React from 'react';

// Interface pour une seule entrée de l'historique
interface TrackingEvent {
  id: string;
  status: string;
  created_at: string;
}

// Interface pour les props que le composant reçoit
interface TimelineProps {
  history: TrackingEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return <p>Aucun historique de suivi disponible.</p>;
  }

  return (
    <ul className="timeline">
      {history.map((event, index) => (
        // On ajoute la classe "latest" au premier élément de la liste (le plus récent)
        <li key={event.id} className={`timeline-item ${index === 0 ? 'latest' : ''}`}>
          <div className="timeline-content">
            <div className="timeline-status">{event.status}</div>
            <div className="timeline-date">
              {new Date(event.created_at).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Timeline;